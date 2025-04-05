const configs = {
  'rootstock': {
    'ca': '0x6Aef6B0B33a4f99Cdd4baC962700bF17b700B6b7',
    'sym': 'RBTC',
    'cid': '0x1e',
    'name': 'Rootstock Mainnet',
    'rpcs': ['https://mycrypto.rsk.co'],
    'exps': ['https://explorer.rootstock.io/'],
  },
  'flow': {
    'ca': '0x85938cf4e73bb05882bbeb572b7b490b02ed4dee',
    'sym': 'FLOW',
    'cid': '0x2eb',
    'name': 'Rootstock Mainnet',
    'rpcs': ['https://mainnet.evm.nodes.onflow.org'],
    'exps': ['https://evm.flowscan.io/'],
  },
  'citrea-testnet': {
    'ca': '0x85938cf4e73bb05882bbeb572b7b490b02ed4dee',
    'sym': 'cBTC',
    'cid': '0x13fb',
    'name': 'Citrea Testnet',
    'rpcs': ['https://rpc.testnet.citrea.xyz'],
    'exps': ['https://explorer.testnet.citrea.xyz/'],
  },
  'rootstock-testnet': {
    'ca': '0xbF31eC2eFBEeC6F5cfdbb3febc703BC1be0A8FE5',
    'sym': 'tRBTC',
    'cid': '0x1f',
    'name': 'Rootstock Testnet',
    'rpcs': ['https://public-node.testnet.rsk.co'],
    'exps': ['https://rootstock-testnet.blockscout.com/'],
  },
  'flow-testnet': {
    'ca': '0xB9F473490Fc5f6466C60137C4016e15E5330f10B',
    'sym': 'FLOW',
    'cid': '0x221',
    'name': 'Flow EVM Testnet',
    'rpcs': ['https://testnet.evm.nodes.onflow.org'],
    'exps': ['https://evm-testnet.flowscan.io/'],
  }
};

const contractABI = [{
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "reclaimAddress",
    "type": "address"
  }, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}, {
    "indexed": false,
    "internalType": "uint256",
    "name": "lockedTime",
    "type": "uint256"
  }, {"indexed": false, "internalType": "uint256", "name": "unlockTime", "type": "uint256"}],
  "name": "Locked",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "reclaimAddress",
    "type": "address"
  }, {"indexed": true, "internalType": "address", "name": "newAddress", "type": "address"}, {
    "indexed": false,
    "internalType": "uint256",
    "name": "lockId",
    "type": "uint256"
  }],
  "name": "ReclaimAddressUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "reclaimAddress",
    "type": "address"
  }, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}],
  "name": "Reclaimed",
  "type": "event"
}, {
  "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
  "name": "getLocks",
  "outputs": [{
    "components": [{
      "internalType": "address",
      "name": "reclaimAddress",
      "type": "address"
    }, {"internalType": "uint256", "name": "amount", "type": "uint256"}, {
      "internalType": "uint256",
      "name": "lockedTime",
      "type": "uint256"
    }, {"internalType": "uint256", "name": "unlockTime", "type": "uint256"}, {
      "internalType": "bool",
      "name": "reclaimed",
      "type": "bool"
    }], "internalType": "struct DeFiKeep.Lock[]", "name": "", "type": "tuple[]"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "reclaimAddress", "type": "address"}, {
    "internalType": "uint256",
    "name": "lockId",
    "type": "uint256"
  }],
  "name": "isUnlocked",
  "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "reclaimAddress", "type": "address"}, {
    "internalType": "uint256",
    "name": "timeInSeconds",
    "type": "uint256"
  }],
  "name": "lock",
  "outputs": [{"internalType": "uint256", "name": "lockId", "type": "uint256"}],
  "stateMutability": "payable",
  "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "reclaimAddress", "type": "address"}, {
    "internalType": "uint256",
    "name": "lockId",
    "type": "uint256"
  }],
  "name": "lockDetails",
  "outputs": [{
    "components": [{
      "internalType": "address",
      "name": "reclaimAddress",
      "type": "address"
    }, {"internalType": "uint256", "name": "amount", "type": "uint256"}, {
      "internalType": "uint256",
      "name": "lockedTime",
      "type": "uint256"
    }, {"internalType": "uint256", "name": "unlockTime", "type": "uint256"}, {
      "internalType": "bool",
      "name": "reclaimed",
      "type": "bool"
    }], "internalType": "struct DeFiKeep.Lock", "name": "", "type": "tuple"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "", "type": "address"}, {
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "name": "locks",
  "outputs": [{"internalType": "address", "name": "reclaimAddress", "type": "address"}, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {"internalType": "uint256", "name": "lockedTime", "type": "uint256"}, {
    "internalType": "uint256",
    "name": "unlockTime",
    "type": "uint256"
  }, {"internalType": "bool", "name": "reclaimed", "type": "bool"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "uint256", "name": "lockId", "type": "uint256"}],
  "name": "reclaim",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "reclaimAddress", "type": "address"}, {
    "internalType": "uint256",
    "name": "lockId",
    "type": "uint256"
  }],
  "name": "timeLeft",
  "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "uint256", "name": "lockId", "type": "uint256"}, {
    "internalType": "address",
    "name": "newAddress",
    "type": "address"
  }], "name": "updateReclaimAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {"stateMutability": "payable", "type": "receive"}];