// Auto-generated contract addresses
// Updated: 2025-01-27T00:00:00.000Z

export const CONTRACT_ADDRESSES = {
  PrivateVoting: "0xCaD6d787703600cd534324FB2F19AF909d172E86", // Deployed on Sepolia
  // Add more contracts as needed
};

export const NETWORK_CONFIG = {
  name: "sepolia",
  deployedAt: "2025-01-27T13:32:00.000Z"
};

// Contract ABI (simplified for demo)
export const PRIVACY_VOTING_ABI = [
  "function createVotingSession(string memory title, string memory description, uint256 duration) public returns (uint256)",
  "function castVote(uint256 sessionId, tuple(bytes32 value) vote) public",
  "function getSessionInfo(uint256 sessionId) public view returns (string memory, string memory, uint256, uint256, bool)",
  "function hasVoted(uint256 sessionId, address voter) public view returns (bool)",
  "function endVotingSession(uint256 sessionId) public",
  "function revealResults(uint256 sessionId) public view returns (uint32, uint32, uint32)",
  "function sessionCounter() public view returns (uint256)",
  "function owner() public view returns (address)",
  "event VotingSessionCreated(uint256 indexed sessionId, string title, uint256 startTime, uint256 endTime)",
  "event VoteCast(uint256 indexed sessionId, address indexed voter)",
  "event SessionEnded(uint256 indexed sessionId)",
  "event ResultsRevealed(uint256 indexed sessionId, uint32 yesVotes, uint32 noVotes, uint32 totalVotes)"
];

export default CONTRACT_ADDRESSES;
