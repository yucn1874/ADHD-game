// 1. 请把这里替换成你刚才 npx hardhat ignition deploy ... 获得的地址
// 如果你找不到，重新运行 deploy 命令就能看到
export const CONTRACT_ADDRESS = "0x340457A601B6D9d313eC7fD9A83499637eA269BE"; 

// 2. 这是我们刚才写的合约的 ABI (接口定义)
export const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "player", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "score", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "newBest", "type": "uint256" }
    ],
    "name": "GameFinished",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "bestScore",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "score", "type": "uint256" }],
    "name": "submitGameResult",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
