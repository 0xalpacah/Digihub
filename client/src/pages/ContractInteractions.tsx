import React, { useState } from 'react';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { AlertCircle, RefreshCw } from 'lucide-react';
import RegisterProjectForm from '@/components/RegisterProjectForm';
import DonateUSDCForm from '@/components/DonateUSDCForm';
import { trpc } from '@/lib/trpc';

export default function ContractInteractions() {
  const { isConnected, isArcNetwork } = useWalletConnection();
  const [activeTab, setActiveTab] = useState<'register' | 'donate'>('register');

  // Contract address - will be set from environment or hardcoded after deployment
  const REGISTRY_ADDRESS = import.meta.env.VITE_ARC_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000000';

  // Fetch on-chain data to refresh after transactions
  const onChainDataQuery = trpc.onChainData.getDashboardData.useQuery();

  const handleSuccess = () => {
    // Refresh on-chain data after successful transaction
    setTimeout(() => {
      onChainDataQuery.refetch();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          <span className="text-cyan-400 neon-cyan">[</span>
          <span className="text-cyan-400 neon-cyan">CONTRACT</span>
          <span className="text-cyan-400 neon-cyan">]</span>
        </h1>
        <p className="text-gray-400 font-mono text-sm">Register Projects & Support Arc Network</p>
      </div>

      {/* Network Warning */}
      {isConnected && !isArcNetwork() && (
        <div className="mb-6 border border-yellow-500 bg-yellow-950 p-4 rounded">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-200 font-mono text-sm">
              Please switch to Arc Network (Arbitrum One) to interact with contracts
            </span>
          </div>
        </div>
      )}

      {/* Contract Address Info */}
      {REGISTRY_ADDRESS !== '0x0000000000000000000000000000000000000000' ? (
        <div className="mb-6 border border-cyan-500 bg-black p-4 rounded">
          <p className="text-cyan-400 font-mono text-xs mb-2">Registry Contract Address:</p>
          <p className="text-white font-mono text-sm break-all">{REGISTRY_ADDRESS}</p>
        </div>
      ) : (
        <div className="mb-6 border border-red-500 bg-red-950 p-4 rounded">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-200 font-mono text-sm">
              Registry contract not deployed yet. Please deploy to Arc Network first.
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-8 flex gap-4 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('register')}
          className={`px-4 py-2 font-mono text-sm transition-colors ${
            activeTab === 'register'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-gray-400 hover:text-cyan-400'
          }`}
        >
          REGISTER PROJECT
        </button>
        <button
          onClick={() => setActiveTab('donate')}
          className={`px-4 py-2 font-mono text-sm transition-colors ${
            activeTab === 'donate'
              ? 'text-magenta-400 border-b-2 border-magenta-400'
              : 'text-gray-400 hover:text-magenta-400'
          }`}
        >
          DONATE USDC
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="border border-gray-800 bg-black p-6 rounded">
            {activeTab === 'register' && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-cyan-400">
                  <span className="text-cyan-400">&gt;</span> Register Project
                </h2>
                <RegisterProjectForm
                  contractAddress={REGISTRY_ADDRESS}
                  onSuccess={handleSuccess}
                />
              </div>
            )}

            {activeTab === 'donate' && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-magenta-400">
                  <span className="text-magenta-400">&gt;</span> Support Arc Network
                </h2>
                <DonateUSDCForm
                  registryAddress={REGISTRY_ADDRESS}
                  onSuccess={handleSuccess}
                />
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="lg:col-span-2 space-y-4">
          {activeTab === 'register' && (
            <div className="space-y-4">
              <div className="border border-cyan-500 bg-black p-4 rounded">
                <h3 className="text-cyan-400 font-mono text-sm mb-2">How to Register</h3>
                <ol className="text-gray-300 font-mono text-xs space-y-2 list-decimal list-inside">
                  <li>Connect your wallet to Arc Network</li>
                  <li>Fill in your project details</li>
                  <li>Click "Register Project"</li>
                  <li>Approve the transaction in MetaMask</li>
                  <li>Wait for confirmation</li>
                </ol>
              </div>

              <div className="border border-magenta-500 bg-black p-4 rounded">
                <h3 className="text-magenta-400 font-mono text-sm mb-2">Benefits</h3>
                <ul className="text-gray-300 font-mono text-xs space-y-1 list-disc list-inside">
                  <li>Your project appears on the Arc Network registry</li>
                  <li>Increased visibility in the community</li>
                  <li>On-chain verification of your project</li>
                  <li>Featured on the Arc Network blog</li>
                </ul>
              </div>

              <div className="border border-green-500 bg-black p-4 rounded">
                <h3 className="text-green-400 font-mono text-sm mb-2">Requirements</h3>
                <ul className="text-gray-300 font-mono text-xs space-y-1">
                  <li>• Valid project name</li>
                  <li>• Project description</li>
                  <li>• Valid project URL</li>
                  <li>• Connected wallet on Arc Network</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'donate' && (
            <div className="space-y-4">
              <div className="border border-magenta-500 bg-black p-4 rounded">
                <h3 className="text-magenta-400 font-mono text-sm mb-2">Why Donate?</h3>
                <p className="text-gray-300 font-mono text-xs mb-3">
                  Your donations directly support the Arc Network ecosystem, funding development, community
                  initiatives, and creator projects.
                </p>
                <ul className="text-gray-300 font-mono text-xs space-y-1 list-disc list-inside">
                  <li>Support network development</li>
                  <li>Fund community initiatives</li>
                  <li>Enable creator grants</li>
                  <li>Transparent on-chain tracking</li>
                </ul>
              </div>

              <div className="border border-cyan-500 bg-black p-4 rounded">
                <h3 className="text-cyan-400 font-mono text-sm mb-2">How to Donate</h3>
                <ol className="text-gray-300 font-mono text-xs space-y-2 list-decimal list-inside">
                  <li>Connect your wallet to Arc Network</li>
                  <li>Enter the USDC amount you want to donate</li>
                  <li>Click "Donate USDC"</li>
                  <li>Approve USDC transfer in MetaMask</li>
                  <li>Confirm the transaction</li>
                </ol>
              </div>

              <div className="border border-yellow-500 bg-black p-4 rounded">
                <h3 className="text-yellow-400 font-mono text-sm mb-2">Donation Info</h3>
                <ul className="text-gray-300 font-mono text-xs space-y-1">
                  <li>• Minimum: 0.01 USDC</li>
                  <li>• No maximum limit</li>
                  <li>• All donations are public on-chain</li>
                  <li>• Donors are recognized in the community</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {onChainDataQuery.data?.data && (
        <div className="mt-12 border-t border-gray-800 pt-8">
          <h2 className="text-2xl font-bold mb-4">
            <span className="text-green-400">&gt;</span> Recent Activity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Projects */}
            <div className="border border-cyan-500 bg-black p-4 rounded">
              <p className="text-cyan-400 font-mono text-xs mb-2">TOTAL PROJECTS</p>
              <p className="text-2xl font-bold text-white">
                {onChainDataQuery.data.data.registry?.projectCount || 0}
              </p>
            </div>

            {/* Total Donations */}
            <div className="border border-magenta-500 bg-black p-4 rounded">
              <p className="text-magenta-400 font-mono text-xs mb-2">TOTAL DONATIONS</p>
              <p className="text-2xl font-bold text-white">
                ${parseFloat(onChainDataQuery.data.data.registry?.usdcBalance || '0').toFixed(2)}
              </p>
            </div>

            {/* Active Contributors */}
            <div className="border border-green-500 bg-black p-4 rounded">
              <p className="text-green-400 font-mono text-xs mb-2">CONTRIBUTORS</p>
              <p className="text-2xl font-bold text-white">
                {onChainDataQuery.data.data.registry?.contributorCount || 0}
              </p>
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => onChainDataQuery.refetch()}
            disabled={onChainDataQuery.isLoading}
            className="mt-4 px-4 py-2 border border-cyan-500 text-cyan-400 rounded hover:border-cyan-400 hover:bg-cyan-950 transition-colors disabled:opacity-50 font-mono text-sm flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${onChainDataQuery.isLoading ? 'animate-spin' : ''}`} />
            REFRESH DATA
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-800 text-center">
        <p className="text-gray-500 font-mono text-xs">
          Arc Network Contract Interactions • Powered by Ethers.js
        </p>
      </div>
    </div>
  );
}
