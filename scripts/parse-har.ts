#!/usr/bin/env npx ts-node

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Only include requests to first-party REISift hosts
const ALLOWED_HOSTS = new Set([
  'apiv2.reisift.io',
  'map.reisift.io',
  'notifications.reisift.io',
  'app.reisift.io',
]);

// Fields/query params that should always be redacted from output
const SENSITIVE_KEYS = new Set([
  'email',
  'firstname',
  'first_name',
  'lastname',
  'last_name',
  'userid',
  'customuserid',
  'user_id',
  'account',
  'password',
  'access',
  'refresh',
  'token',
  'authorization',
  'cookie',
  'set-cookie',
]);

interface HarEntry {
  request: {
    method: string;
    url: string;
    headers: Array<{ name: string; value: string }>;
    postData?: {
      mimeType: string;
      text?: string;
    };
  };
  response: {
    status: number;
    statusText: string;
    headers: Array<{ name: string; value: string }>;
    content: {
      mimeType: string;
      text?: string;
    };
  };
}

interface HarFile {
  log: {
    entries: HarEntry[];
  };
}

interface ExtractedEndpoint {
  method: string;
  url: string;
  path: string;
  queryParams: Record<string, string>;
  requestHeaders: Record<string, string>;
  requestBody?: unknown;
  responseStatus: number;
  responseBody?: unknown;
  contentType: string;
}

function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEYS.has(key.toLowerCase());
}

function redactObject(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return obj;
  if (Array.isArray(obj)) return obj.map(redactObject);
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[key] = isSensitiveKey(key) ? '[REDACTED]' : redactObject(value);
    }
    return result;
  }
  return obj;
}

function redactRecord(record: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(record)) {
    result[key] = isSensitiveKey(key) ? '[REDACTED]' : value;
  }
  return result;
}

function isAllowedHost(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);
    return ALLOWED_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

function parseHarFile(harPath: string): ExtractedEndpoint[] {
  const harContent = readFileSync(harPath, 'utf-8');
  const har: HarFile = JSON.parse(harContent);

  const endpoints: ExtractedEndpoint[] = [];
  const seenEndpoints = new Set<string>();

  for (const entry of har.log.entries) {
    const { request, response } = entry;

    if (!isAllowedHost(request.url)) {
      continue;
    }

    if (
      request.url.includes('.js') ||
      request.url.includes('.css') ||
      request.url.includes('.png') ||
      request.url.includes('.svg') ||
      request.url.includes('.woff') ||
      request.url.includes('fonts.')
    ) {
      continue;
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const queryParams: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      queryParams[key] = isSensitiveKey(key) ? '[REDACTED]' : value;
    });

    const endpointKey = `${request.method}:${path}`;
    if (seenEndpoints.has(endpointKey)) {
      continue;
    }
    seenEndpoints.add(endpointKey);

    const requestHeaders: Record<string, string> = {};
    for (const header of request.headers) {
      const lowerName = header.name.toLowerCase();
      if (
        lowerName === 'authorization' ||
        lowerName === 'content-type' ||
        lowerName === 'api-key' ||
        lowerName === 'x-api-key' ||
        lowerName.startsWith('x-')
      ) {
        requestHeaders[header.name] = isSensitiveKey(lowerName)
          ? '[REDACTED]'
          : header.value;
      }
    }

    let requestBody: unknown;
    if (request.postData?.text) {
      try {
        requestBody = redactObject(JSON.parse(request.postData.text));
      } catch {
        requestBody = request.postData.text;
      }
    }

    let responseBody: unknown;
    if (response.content?.text) {
      try {
        responseBody = redactObject(JSON.parse(response.content.text));
      } catch {
        responseBody = response.content.text?.substring(0, 500);
      }
    }

    endpoints.push({
      method: request.method,
      url: `${url.protocol}//${url.hostname}${path}`,
      path,
      queryParams,
      requestHeaders,
      requestBody,
      responseStatus: response.status,
      responseBody,
      contentType: response.content?.mimeType || '',
    });
  }

  return endpoints;
}

function generateMarkdownReport(endpoints: ExtractedEndpoint[]): string {
  let md = '# REISift API Endpoints - Extracted from HAR\n\n';
  md += `> Generated: ${new Date().toISOString()}\n\n`;
  md += `> Total unique endpoints: ${endpoints.length}\n\n`;

  const grouped: Record<string, ExtractedEndpoint[]> = {};
  for (const ep of endpoints) {
    const category = ep.path.split('/').slice(0, 3).join('/') || '/';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(ep);
  }

  for (const [category, eps] of Object.entries(grouped)) {
    md += `## ${category}\n\n`;
    
    for (const ep of eps) {
      md += `### \`${ep.method} ${ep.path}\`\n\n`;
      md += `- **Status:** ${ep.responseStatus}\n`;
      md += `- **Content-Type:** ${ep.contentType}\n`;

      if (Object.keys(ep.queryParams).length > 0) {
        md += `- **Query Params:**\n`;
        md += '```json\n';
        md += JSON.stringify(ep.queryParams, null, 2);
        md += '\n```\n';
      }

      if (Object.keys(ep.requestHeaders).length > 0) {
        md += `- **Headers:**\n`;
        md += '```json\n';
        md += JSON.stringify(ep.requestHeaders, null, 2);
        md += '\n```\n';
      }

      if (ep.requestBody) {
        md += `- **Request Body:**\n`;
        md += '```json\n';
        md += JSON.stringify(ep.requestBody, null, 2);
        md += '\n```\n';
      }

      if (ep.responseBody) {
        md += `- **Response Sample:**\n`;
        md += '```json\n';
        const responseStr = JSON.stringify(ep.responseBody, null, 2);
        md += responseStr.length > 2000 
          ? responseStr.substring(0, 2000) + '\n... (truncated)'
          : responseStr;
        md += '\n```\n';
      }

      md += '\n---\n\n';
    }
  }

  return md;
}

const HAR_FILES_DIR = join(__dirname, '../har-files');
const OUTPUT_DIR = join(__dirname, '../docs/api-mapping/_generated');

function findHarFiles(): string[] {
  try {
    const files = readdirSync(HAR_FILES_DIR);
    return files
      .filter(f => f.endsWith('.har'))
      .map(f => join(HAR_FILES_DIR, f));
  } catch {
    return [];
  }
}

const args = process.argv.slice(2);
let harPaths: string[] = [];

if (args.length === 0) {
  harPaths = findHarFiles();
  if (harPaths.length === 0) {
    console.log(`
REISift HAR Parser
==================

Usage: npm run parse-har [path-to-har-file]

If no file is specified, parses all .har files in har-files/

How to export HAR from Chrome:
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Enable "Preserve log"
4. Navigate through REISift
5. Right-click on any request → "Save all as HAR with content"
6. Save to: har-files/reisift.har
7. Run: npm run parse-har

No HAR files found in har-files/ directory.
Drop your .har files there and run this script again.
`);
    process.exit(0);
  }
  console.log(`Found ${harPaths.length} HAR file(s) in har-files/`);
} else {
  harPaths = [args[0]];
}

let allEndpoints: ExtractedEndpoint[] = [];

for (const harPath of harPaths) {
  console.log(`Parsing: ${harPath}`);
  const endpoints = parseHarFile(harPath);
  console.log(`  → ${endpoints.length} unique endpoints`);
  allEndpoints = [...allEndpoints, ...endpoints];
}

const uniqueEndpoints = allEndpoints.filter((ep, idx, arr) => 
  arr.findIndex(e => e.method === ep.method && e.path === ep.path) === idx
);

console.log(`\nTotal unique endpoints: ${uniqueEndpoints.length}`);

mkdirSync(OUTPUT_DIR, { recursive: true });

const report = generateMarkdownReport(uniqueEndpoints);
const outputPath = join(OUTPUT_DIR, 'extracted-endpoints.md');
writeFileSync(outputPath, report);
console.log(`Report saved to: ${outputPath}`);

const jsonPath = join(OUTPUT_DIR, 'endpoints.json');
writeFileSync(jsonPath, JSON.stringify(uniqueEndpoints, null, 2));
console.log(`JSON data saved to: ${jsonPath}`);
