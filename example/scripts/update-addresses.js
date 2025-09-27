const fs = require('fs');
const path = require('path');

/**
 * Update contract addresses in the frontend configuration
 * Based on hello-fhevm-tutorial address management
 */

const addressesPath = path.join(__dirname, '..', 'addresses.json');
const frontendConfigPath = path.join(__dirname, '..', '..', 'frontend', 'src', 'config', 'contracts.js');

function loadAddresses() {
  if (!fs.existsSync(addressesPath)) {
    console.log('📝 No addresses.json found, creating new file...');
    return {};
  }
  
  try {
    const data = fs.readFileSync(addressesPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error reading addresses.json:', error.message);
    return {};
  }
}

function updateFrontendConfig(addresses) {
  const configContent = `// Auto-generated contract addresses
// Updated: ${new Date().toISOString()}

export const CONTRACT_ADDRESSES = {
  PrivateVoting: "${addresses.PrivateVoting || '0x...'}",
  // Add more contracts as needed
};

export const NETWORK_CONFIG = {
  name: "${addresses.PrivateVoting_Network || 'unknown'}",
  deployedAt: "${addresses.PrivateVoting_DeployedAt || 'unknown'}"
};

export default CONTRACT_ADDRESSES;
`;

  try {
    // Ensure directory exists
    const configDir = path.dirname(frontendConfigPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    fs.writeFileSync(frontendConfigPath, configContent);
    console.log('✅ Updated frontend contract configuration');
  } catch (error) {
    console.error('❌ Error updating frontend config:', error.message);
  }
}

function displayAddresses(addresses) {
  console.log('\n📋 Current Contract Addresses:');
  console.log('================================');
  
  Object.entries(addresses).forEach(([key, value]) => {
    if (key.includes('_')) return; // Skip metadata
    
    const network = addresses[`${key}_Network`] || 'unknown';
    const deployedAt = addresses[`${key}_DeployedAt`] || 'unknown';
    
    console.log(`\n${key}:`);
    console.log(`  Address: ${value}`);
    console.log(`  Network: ${network}`);
    console.log(`  Deployed: ${deployedAt}`);
  });
}

function main() {
  console.log('🔧 Contract Address Manager');
  console.log('==========================');
  
  const addresses = loadAddresses();
  
  if (Object.keys(addresses).length === 0) {
    console.log('📝 No contracts deployed yet.');
    console.log('Run deployment scripts to add contract addresses.');
    return;
  }
  
  displayAddresses(addresses);
  updateFrontendConfig(addresses);
  
  console.log('\n✅ Address management completed!');
}

main();
