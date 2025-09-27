# 🔐 FHEVM Privacy Voting System

A privacy-preserving voting system using Zama's Fully Homomorphic Encryption (FHE) technology.

**🎮 Interactive Learning** - Learn FHEVM technology through actual deployment and testing

## ✨ Features

- 🔐 **Real FHEVM Integration**: Using `@fhevm/solidity` and `@zama-fhe/relayer-sdk`
- 🗳️ **Privacy Voting**: All voting data is encrypted using FHE
- 🔑 **Access Control**: Only contract owner can create voting sessions
- 🌐 **Sepolia Testnet**: Configured and supports Sepolia deployment
- ⚡ **Modern React UI**: Beautiful interface using Tailwind CSS
- 🛡️ **Secure Voting**: Prevents duplicate voting and inference attacks

## 🏗️ Project Structure

```
zama/
├── example/                    # Example contracts
│   ├── contracts/
│   │   └── PrivateVoting.sol  # FHEVM privacy voting contract
│   ├── scripts/
│   │   ├── deploy-voting.js   # Deployment script
│   │   └── update-addresses.js # Address management script
│   ├── hardhat.config.cjs     # Hardhat configuration
│   └── package.json           # Example dependencies
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── App.jsx            # Main React application
│   │   ├── fheClient.js       # FHEVM client wrapper
│   │   ├── config/
│   │   │   └── contracts.js   # Contract configuration
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Tailwind CSS styles
│   └── package.json           # Frontend dependencies
├── env.example                 # Environment variables template
├── package.json               # Project dependencies
└── README.md                  # Project documentation
```

## 🚀 Quick Start

### Method 1: Deploy Real Contract

#### 1. Install Dependencies

```bash
npm install
npm run frontend:install
```

#### 2. Configure Environment Variables

```bash
# Copy environment variable templates
cd example
cp env.example .env

# Edit .env files
PRIVATE_KEY=your_private_key_here
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
ETHERSCAN_API_KEY=your_etherscan_api_key
```

#### 3. Deploy Smart Contracts

```bash
# Compile contracts
npm run compile

# Deploy privacy voting contract
npm run deploy:voting

# Update address configuration
npm run addresses

# Verify contracts (optional)
npm run verify:all
```

#### 4. Start Frontend

```bash
npm run frontend:start
```

The application will open at `http://localhost:3000`.

## 📝 Usage

1. **Connect MetaMask**: Ensure MetaMask is connected to Sepolia testnet
2. **Create Voting Session**: Only contract owner can create voting sessions
3. **Vote**: Use FHEVM encrypted voting to ensure privacy
4. **View Results**: Results can be revealed after voting ends

## 🔐 Privacy Features

- **Encrypted Voting**: All voting data is encrypted using FHE
- **Privacy Protection**: Voting content is completely invisible on-chain
- **Transparent Results**: Final results can be revealed after voting ends
- **Anti-Duplicate Voting**: Each address can only vote once

## 🛠️ Tech Stack

### Smart Contracts
- `@fhevm/solidity`: Zama FHE Solidity library
- `hardhat`: Ethereum development framework

### Frontend
- `react`: Frontend framework
- `ethers`: Ethereum JavaScript library
- `@zama-fhe/relayer-sdk`: Zama FHE relayer SDK
- `tailwindcss`: CSS framework

## 🔧 Development Tips

### Using Cursor IDE

1. Open the project in Cursor
2. Use `@docs` to load Zama documentation for inline guidance
3. Create `.cursorrules` file to ensure consistent code generation

### Testing

```bash
# Run frontend tests
cd frontend && npm test

# Run contract tests (if added)
npx hardhat test
```

## 🐛 Troubleshooting

### Common Issues

1. **MetaMask Connection**: Ensure connected to Sepolia testnet
2. **Contract Not Found**: Verify contract address in `.env`
3. **FHEVM Errors**: Check FHEVM client initialization
4. **Gas Fees**: Ensure sufficient Sepolia ETH

### Getting Help

- Check Zama documentation: https://docs.zama.ai/
- Check official relayer SDK documentation
- Ensure all dependencies are properly installed

## 📄 License

MIT License - See LICENSE file for details.

## ⚠️ Disclaimer

This is a demonstration project. Use at your own risk, ensure proper security measures before any production deployment.

## 🙏 Acknowledgments

- Using [Zama FHEVM technology](https://github.com/zama-ai/fhevm)
