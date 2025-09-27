import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import fheVotingClient from './fheClient';
import { CONTRACT_ADDRESSES, PRIVACY_VOTING_ABI } from './config/contracts';
import './index.css';

function App() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fhevmReady, setFhevmReady] = useState(false);
  
  // New session form
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    duration: 3600
  });

  // Contract address (from configuration)
  const CONTRACT_ADDRESS = CONTRACT_ADDRESSES.PrivateVoting;

  // Initialize connection
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        setAccount(address);
        
        // Initialize contract
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, PRIVACY_VOTING_ABI, signer);
        setContract(contractInstance);
        
        // Check if user is owner
        const owner = await contractInstance.owner();
        setIsOwner(address.toLowerCase() === owner.toLowerCase());
        
        // Initialize FHEVM client
        const fhevmInitialized = await fheVotingClient.initialize();
        setFhevmReady(fhevmInitialized);
        
        await loadSessions();
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    }
  };

  // Load voting sessions
  const loadSessions = useCallback(async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      const sessionCount = await contract.sessionCounter();
      const sessionList = [];
      
      for (let i = 0; i < Number(sessionCount); i++) {
        const sessionInfo = await contract.getSessionInfo(i);
        const hasVoted = await contract.hasVoted(i, account);
        
        sessionList.push({
          id: i,
          title: sessionInfo[0],
          description: sessionInfo[1],
          startTime: sessionInfo[2],
          endTime: sessionInfo[3],
          isActive: sessionInfo[4],
          hasVoted
        });
      }
      
      setSessions(sessionList);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  }, [contract, account]);

  // Create new voting session
  const createSession = async () => {
    if (!newSession.title || !newSession.description) {
      alert('Please fill in title and description');
      return;
    }
    
    if (!contract || !isOwner) {
      alert('Only the contract owner can create voting sessions');
      return;
    }
    
    try {
      setLoading(true);
      const tx = await contract.createVotingSession(
        newSession.title,
        newSession.description,
        newSession.duration
      );
      await tx.wait();
      
      setNewSession({ title: '', description: '', duration: 3600 });
      await loadSessions();
      alert('Voting session created successfully!');
    } catch (error) {
      console.error('Error creating session:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        reason: error.reason,
        data: error.data
      });
      alert(`Failed to create voting session: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Cast a vote using FHEVM
  const castVote = async (sessionId, vote) => {
    if (!contract || !fhevmReady) {
      alert('FHEVM not ready. Please try again.');
      return;
    }
    
    try {
      setLoading(true);
      console.log('🔐 Casting encrypted vote...');
      
      // Convert boolean vote to ebool struct format
      const voteValue = vote ? "0x0000000000000000000000000000000000000000000000000000000000000001" : "0x0000000000000000000000000000000000000000000000000000000000000000";
      
      // Create ebool struct: { value: bytes32 }
      const eboolVote = { value: voteValue };
      
      const tx = await contract.castVote(sessionId, eboolVote);
      await tx.wait();
      
      await loadSessions();
      alert('Vote cast successfully!');
    } catch (error) {
      console.error('Error casting vote:', error);
      alert(`Failed to cast vote: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // End voting session
  const endSession = async (sessionId) => {
    if (!contract || !isOwner) {
      alert('Only the contract owner can end sessions');
      return;
    }
    
    try {
      setLoading(true);
      const tx = await contract.endVotingSession(sessionId);
      await tx.wait();
      
      await loadSessions();
      alert('Voting session ended!');
    } catch (error) {
      console.error('Error ending session:', error);
      alert('Failed to end voting session');
    } finally {
      setLoading(false);
    }
  };

  // Reveal results
  const revealResults = async (sessionId) => {
    if (!contract) {
      alert('Please connect your wallet first.');
      return;
    }
    
    try {
      setLoading(true);
      console.log('🔍 Revealing results for session:', sessionId);
      
      // Call revealResults function (view function returns values directly)
      const results = await contract.revealResults(sessionId);
      
      console.log('📊 Raw results:', results);
      
      // Extract the returned values - handle both array and object formats
      let yesVotes, noVotes, totalVotes;
      
      if (Array.isArray(results)) {
        yesVotes = Number(results[0]);
        noVotes = Number(results[1]);
        totalVotes = Number(results[2]);
      } else if (results && typeof results === 'object') {
        yesVotes = Number(results.yesVotes || results[0] || 0);
        noVotes = Number(results.noVotes || results[1] || 0);
        totalVotes = Number(results.totalVotes || results[2] || 0);
      } else {
        console.error('Unexpected results format:', results);
        yesVotes = 0;
        noVotes = 0;
        totalVotes = 0;
      }
      
      console.log('📊 Processed results:', { yesVotes, noVotes, totalVotes });
      
      alert(`Results for Session ${sessionId}:\nYes: ${yesVotes}\nNo: ${noVotes}\nTotal: ${totalVotes}`);
    } catch (error) {
      console.error('Error revealing results:', error);
      alert(`Failed to reveal results: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract) {
      loadSessions();
    }
  }, [contract, loadSessions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🔐 Privacy Voting System
          </h1>
          <p className="text-lg text-gray-600">
            Privacy-preserving voting powered by Zama FHEVM
          </p>
          {fhevmReady && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
              ✅ FHEVM Ready
            </div>
          )}
        </div>

        {!account ? (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-6">
              Connect your wallet to start using the privacy voting system.
            </p>
            <button
              onClick={connectWallet}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Account Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Account Information</h2>
              <p className="text-gray-600">Address: {account}</p>
              {isOwner && (
                <p className="text-green-600 font-medium">👑 Contract Owner</p>
              )}
            </div>

            {/* Create Session */}
            {isOwner && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Create New Voting Session</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Session Title"
                    value={newSession.title}
                    onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                  <textarea
                    placeholder="Session Description"
                    value={newSession.description}
                    onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    disabled={loading}
                  />
                  <input
                    type="number"
                    placeholder="Duration in seconds"
                    value={newSession.duration}
                    onChange={(e) => setNewSession({ ...newSession, duration: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                  <button
                    onClick={createSession}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Session'}
                  </button>
                </div>
              </div>
            )}

            {/* Voting Sessions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Voting Sessions</h2>
              {loading ? (
                <p className="text-gray-600">Loading sessions...</p>
              ) : sessions.length === 0 ? (
                <p className="text-gray-600">No voting sessions available.</p>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-4 border rounded-lg ${
                        session.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{session.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            session.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {session.isActive ? 'Active' : 'Ended'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{session.description}</p>
                      <div className="text-sm text-gray-500 mb-3">
                        <p>Start: {new Date(Number(session.startTime) * 1000).toLocaleString()}</p>
                        <p>End: {new Date(Number(session.endTime) * 1000).toLocaleString()}</p>
                      </div>
                      
                      {session.isActive && !session.hasVoted && fhevmReady && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => castVote(session.id, true)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Vote Yes
                          </button>
                          <button
                            onClick={() => castVote(session.id, false)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Vote No
                          </button>
                        </div>
                      )}
                      
                      {session.hasVoted && (
                        <p className="text-blue-600 font-medium">✅ You have voted</p>
                      )}
                      
                      {!session.isActive && (
                        <button
                          onClick={() => revealResults(session.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Reveal Results
                        </button>
                      )}
                      
                      {session.isActive && isOwner && (
                        <button
                          onClick={() => endSession(session.id)}
                          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors ml-2"
                        >
                          End Session
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;