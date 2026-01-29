// TypeScript declarations for Web3 wallets
declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
    phantom?: any;
    braveSolana?: any;
  }
}

export {};
