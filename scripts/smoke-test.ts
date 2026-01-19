#!/usr/bin/env tsx

import { ReisiftClient } from '../src/infrastructure/services/reisift-client.js';

async function main() {
  console.log('REISift SDK Smoke Test');
  console.log('======================\n');

  const apiKey = process.env['REISIFT_API_KEY'];
  const email = process.env['REISIFT_EMAIL'];
  const password = process.env['REISIFT_PASSWORD'];

  // Determine auth mode
  let authMode: string;
  let client: ReisiftClient;

  if (apiKey) {
    authMode = 'API key';
    client = new ReisiftClient({ apiKey });
  } else if (email && password) {
    authMode = 'email/password';
    client = new ReisiftClient({ email, password });
  } else {
    console.error('Missing credentials.');
    console.log('\nUsage (choose one):');
    console.log('  REISIFT_API_KEY=your_key npm run smoke-test');
    console.log('  REISIFT_EMAIL=you@example.com REISIFT_PASSWORD=xxx npm run smoke-test');
    process.exit(1);
  }

  console.log(`Auth mode: ${authMode}\n`);

  try {
    console.log('1. Testing authentication...');
    await client.authenticate();
    console.log('   ✓ Authentication successful\n');

    console.log('2. Testing getCurrentUser()...');
    const user = await client.getCurrentUser();
    console.log(`   ✓ Current user: ${user.email ?? user.uuid}\n`);

    console.log('3. Testing getDashboard()...');
    const dashboard = await client.getDashboard();
    const dashboardKeys = Object.keys(dashboard);
    console.log(`   ✓ Dashboard returned ${dashboardKeys.length} keys: ${dashboardKeys.slice(0, 5).join(', ')}${dashboardKeys.length > 5 ? '...' : ''}\n`);

    console.log('4. Testing getDashboardGeneral()...');
    const general = await client.getDashboardGeneral();
    const generalKeys = Object.keys(general);
    console.log(`   ✓ Dashboard general returned ${generalKeys.length} keys: ${generalKeys.slice(0, 5).join(', ')}${generalKeys.length > 5 ? '...' : ''}\n`);

    console.log('5. Testing searchProperties()...');
    const properties = await client.searchProperties({ limit: 5 });
    console.log(`   ✓ Found ${properties.count} total properties`);
    console.log(`   ✓ Retrieved ${properties.results.length} properties in this page\n`);

    if (properties.results.length > 0) {
      const firstProperty = properties.results[0];
      const propertyUuid = firstProperty.uuid;

      console.log(`6. Testing getPropertyById("${propertyUuid}")...`);
      const property = await client.getPropertyById(propertyUuid);
      console.log(`   ✓ Property retrieved: ${property.address?.full_address ?? property.uuid}\n`);

      console.log(`7. Testing getPropertyImages("${propertyUuid}")...`);
      const images = await client.getPropertyImages(propertyUuid);
      console.log(`   ✓ Found ${images.count} images\n`);

      console.log(`8. Testing getPropertyOffers("${propertyUuid}")...`);
      const offers = await client.getPropertyOffers(propertyUuid);
      console.log(`   ✓ Found ${offers.count} offers\n`);
    } else {
      console.log('6-8. Skipped (no properties found to test with)\n');
    }

    console.log('======================');
    console.log('All smoke tests passed! ✓');
  } catch (error) {
    console.error('\n✗ Smoke test failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
