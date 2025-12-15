import React, { useState } from 'react';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { Send, AlertCircle, CheckCircle, Loader } from 'lucide-react';
// ABI será passado como prop ou importado dinamicamente
const ArcNetworkRegistryABI = [
  {
    inputs: [
      { name: '_name', type: 'string' },
      { name: '_description', type: 'string' },
      { name: '_url', type: 'string' },
    ],
    name: 'registerProject',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

interface RegisterProjectFormProps {
  contractAddress: string;
  onSuccess?: () => void;
  abi?: any[];
}

export default function RegisterProjectForm({
  contractAddress,
  onSuccess,
}: RegisterProjectFormProps) {
  const { isConnected, isArcNetwork, getContract } = useWalletConnection();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

      if (!formData.name || !formData.description || !formData.url) {
        throw new Error('All fields are required');
      }

      setLoading(true);

      // Get contract instance
      const contract = await getContract(contractAddress, ArcNetworkRegistryABI);

      // Call registerProject function
      const tx = await contract.registerProject(
        formData.name,
        formData.description,
        formData.url
      );

      // Wait for transaction to be mined
      await tx.wait();

      setSuccess(`Project "${formData.name}" registered successfully!`);
      setFormData({ name: '', description: '', url: '' });

      // Call onSuccess callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register project';
      setError(errorMessage);
      console.error('Error registering project:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="border border-yellow-500 bg-yellow-950 p-4 rounded">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          <span className="text-yellow-200 font-mono text-sm">Connect wallet to register projects</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Project Name */}
      <div>
        <label className="block text-cyan-400 font-mono text-sm mb-2">Project Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter project name"
          className="w-full px-3 py-2 bg-black border border-cyan-500 text-white font-mono text-sm rounded focus:outline-none focus:border-cyan-400"
          disabled={loading}
        />
      </div>

      {/* Project Description */}
      <div>
        <label className="block text-magenta-400 font-mono text-sm mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your project"
          rows={3}
          className="w-full px-3 py-2 bg-black border border-magenta-500 text-white font-mono text-sm rounded focus:outline-none focus:border-magenta-400"
          disabled={loading}
        />
      </div>

      {/* Project URL */}
      <div>
        <label className="block text-green-400 font-mono text-sm mb-2">Project URL</label>
        <input
          type="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://example.com"
          className="w-full px-3 py-2 bg-black border border-green-500 text-white font-mono text-sm rounded focus:outline-none focus:border-green-400"
          disabled={loading}
        />
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
        className="w-full px-4 py-2 bg-cyan-500 text-black font-mono font-bold rounded hover:bg-cyan-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            REGISTERING...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            REGISTER PROJECT
          </>
        )}
      </button>
    </form>
  );
}
