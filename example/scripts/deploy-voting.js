const { ethers } = require("hardhat");

async function main() {
  console.log("🗳️ Deploying PrivateVoting contract...");
  
  // Get the contract factory
  const PrivateVoting = await ethers.getContractFactory("PrivateVoting");
  
  // Deploy the contract
  const privateVoting = await PrivateVoting.deploy();
  
  // Wait for deployment to complete
  await privateVoting.waitForDeployment();
  
  const contractAddress = await privateVoting.getAddress();
  
  console.log("✅ PrivateVoting deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🔗 Network:", network.name);
  console.log("⛽ Gas Used:", (await privateVoting.deploymentTransaction())?.gasLimit?.toString());
  
  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  const owner = await privateVoting.owner();
  const sessionCounter = await privateVoting.sessionCounter();
  
  console.log("👤 Contract Owner:", owner);
  console.log("📊 Session Counter:", sessionCounter.toString());
  
  // Update addresses file
  try {
    const fs = require('fs');
    const path = require('path');
    
    const addressesPath = path.join(__dirname, '..', 'addresses.json');
    let addresses = {};
    
    if (fs.existsSync(addressesPath)) {
      addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
    }
    
    addresses.PrivateVoting = contractAddress;
    addresses.PrivateVoting_Network = network.name;
    addresses.PrivateVoting_DeployedAt = new Date().toISOString();
    
    fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
    console.log("📝 Updated addresses.json");
  } catch (error) {
    console.log("⚠️ Could not update addresses.json:", error.message);
  }
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("📝 Next steps:");
  console.log("1. Copy the contract address above");
  console.log("2. Update your frontend configuration");
  console.log("3. Test the voting functionality");
  console.log("4. Run 'npm run verify:all' to verify on Etherscan");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
