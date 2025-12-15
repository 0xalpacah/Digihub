import React, { useState } from 'react';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { Heart, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { parseUnits } from 'ethers';

interface DonateUSDCFormProps {
  registryAddress: string;
  onSuccess?: () => void;
}

// USDC on Arc Network
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b3EA6957D0f';

// USDC ABI (minimal - only approve and transfer)
const USDC_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export default function DonateUSDCForm({ registryAddress, onSuccess }: DonateUSDCFormProps) {
  const { isConnected, isArcNetwork, getContract } = useWalletConnection();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      if (!isArcNetwork()) {
        throw new Error('Please switch to Arc Network');
      }

      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }

      setLoading(true);

      // Get USDC contract instance
      const usdcContract = await getContract(USDC_ADDRESS, USDC_ABI);

      // Convert amount to USDC units (6 decimals)
      const amountInUnits = parseUnits(amount, 6);

      // Approve transfer
      const approveTx = await usdcContract.approve(registryAddress, amountInUnits);
      await approveTx.wait();

      // Transfer USDC to registry
      const transferTx = await usdcContract.transfer(registryAddress, amountInUnits);
      await transferTx.wait();

      setSuccess(`Successfully donated ${amount} USDC! Thank you for supporting Arc Network.`);
      setAmount('');

      // Call onSuccess callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to donate';
      setError(errorMessage);
      console.error('Error donating USDC:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="border border-yellow-500 bg-yellow-950 p-4 rounded">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          <span className="text-yellow-200 font-mono text-sm">Connect wallet to donate USDC</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Amount Input */}
      <div>
        <label className="block text-magenta-400 font-mono text-sm mb-2">Amount (USDC)</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="flex-1 px-3 py-2 bg-black border border-magenta-500 text-white font-mono text-sm rounded focus:outline-none focus:border-magenta-400"
            disabled={loading}
          />
          <span className="px-3 py-2 bg-black border border-magenta-500 text-magenta-400 font-mono text-sm rounded">
            USDC
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="text-xs text-gray-400 font-mono">
        <p>• Minimum: 0.01 USDC</p>
        <p>• Your donation supports Arc Network development</p>
        <p>• 100% of funds go to the Arc ecosystem</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="border border-red-500 bg-red-950 p-3 rounded flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-red-200 font-mono text-sm">{error}</span>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="border border-green-500 bg-green-950 p-3 rounded flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-green-200 font-mono text-sm">{success}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-magenta-500 text-black font-mono font-bold rounded hover:bg-magenta-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            PROCESSING...
          </>
        ) : (
          <>
            <Heart className="w-4 h-4" />
            DONATE USDC
          </>
        )}
      </button>
    </form>
  );
}
