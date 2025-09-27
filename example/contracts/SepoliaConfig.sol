// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SepoliaConfig
 * @dev Sepolia-specific FHEVM configuration
 * Based on fhevm-counter-sepolia implementation
 */
contract SepoliaConfig {
    struct FHEVMConfigStruct {
        address ACLAddress;
        address KMSVerifierAddress;
        address DecryptionOracleAddress;
    }
    
    FHEVMConfigStruct public fhevmConfig;
    
    constructor() {
        // Sepolia FHEVM addresses
        fhevmConfig = FHEVMConfigStruct({
            ACLAddress: 0x0000000000000000000000000000000000000000, // Sepolia ACL
            KMSVerifierAddress: 0x0000000000000000000000000000000000000000, // Sepolia KMS
            DecryptionOracleAddress: 0x0000000000000000000000000000000000000000 // Sepolia Oracle
        });
    }
}
