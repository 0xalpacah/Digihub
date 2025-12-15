import { useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  provider: BrowserProvider | null;
  balance: string | null;
  chainId: number | null;
  loading: boolean;
  error: string | null;
}

export function useWalletConnection() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    provider: null,
    balance: null,
    chainId: null,
    loading: false,
    error: null,
  });

  /**
   * Connect wallet using MetaMask
   */
  const connectWallet = async () => {
    try {
      setWallet((prev) => ({ ...prev, loading: true, error: null }));

      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned');
      }

      const address = accounts[0];
      const provider = new BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();

      setWallet({
        address,
        isConnected: true,
        provider,
        balance: (Number(balance) / 1e18).toFixed(4),
        chainId: Number(network.chainId),
        loading: false,
        error: null,
      });

      return address;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      setWallet((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  /**
   * Disconnect wallet
   */
  const disconnectWallet = () => {
    setWallet({
      address: null,
      isConnected: false,
      provider: null,
      balance: null,
      chainId: null,
      loading: false,
      error: null,
    });
  };

  /**
   * Get contract instance
   */
  const getContract = async (contractAddress: string, contractABI: any) => {
    if (!wallet.provider || !wallet.address) {
      throw new Error('Wallet not connected');
    }

    const signer = await wallet.provider.getSigner();
    return new Contract(contractAddress, contractABI, signer);
  };

  /**
   * Send transaction
   */
  const sendTransaction = async (to: string, value: string) => {
    try {
      if (!wallet.provider || !wallet.address) {
        throw new Error('Wallet not connected');
      }

      const signer = await wallet.provider.getSigner();
      const tx = await signer.sendTransaction({
        to,
        value,
      });

      return tx;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
      setWallet((prev) => ({
        ...prev,
        error: errorMessage,
      }));
      throw error;
    }
  };

  /**
   * Check if connected to Arc Network (chainId 42161)
   */
  const isArcNetwork = (): boolean => {
    return wallet.chainId === 42161;
  };

  /**
   * Switch to Arc Network
   */
  const switchToArcNetwork = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xa4b1' }], // 42161 in hex
      });

      // Update chainId
      if (wallet.provider) {
        const network = await wallet.provider.getNetwork();
        setWallet((prev) => ({
          ...prev,
          chainId: Number(network.chainId),
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to switch network';
      setWallet((prev) => ({
        ...prev,
        error: errorMessage,
      }));
      throw error;
    }
  };

  /**
   * Listen for account changes
   */
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      // Reload page on chain change
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  return {
    ...wallet,
    connectWallet,
    disconnectWallet,
    getContract,
    sendTransaction,
    isArcNetwork,
    switchToArcNetwork,
  };
}

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
