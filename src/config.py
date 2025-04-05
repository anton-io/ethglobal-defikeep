#!/usr/bin/env python3

# Set up basic logging configuration to stdout.
import logging as _log
_log.basicConfig(
    level=_log.INFO,  # Set the level of logging (DEBUG, INFO, WARNING, ERROR, CRITICAL).
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',  # Log format
    handlers=[_log.StreamHandler()]  # Log to console (StreamHandler).
)
log = _log.getLogger('defikeep')

# Shared configuration that:
#  * setups up RPC address
#  * contract address
#  * loads private key from .pkey

import os
import eth_account
from web3 import Web3

DIR_THIS = os.path.abspath(os.path.dirname(__file__))

CONFIGS = {
    'citrea-testnet': {
        'ca': '0xa1AC5bD954aa0857F15287eC67Fee4d5587f6E04',
       'rpc': 'https://rpc.testnet.citrea.xyz'
    },
    'rootstock-testnet': {
        'ca': '0x88b9AD1E44b6Fc2E1F2B6A4D2b862c4C20144a6d',
       'rpc': 'https://public-node.testnet.rsk.co'
    },
}

config = CONFIGS['citrea-testnet']

# Target Chain RPC (using Ganache for testing).
# WEB3_PROVIDER = 'HTTP://127.0.0.1:7545'
WEB3_PROVIDER = config['rpc']
w3 = Web3(Web3.HTTPProvider(WEB3_PROVIDER))

# Contract's ABI.
CONTRACT_ABI  = f"{DIR_THIS}/../contract/DeFiKeep.abi"

# Contract's address after it has been deployed:
CONTRACT_ADDR = config['ca']

# Load private key (stored in .pkey).
try:
    PKEY = open(f"{DIR_THIS}/.pkey").read()
except Exception as _:
    print(f"Add private key to {DIR_THIS}/.pkey")
    exit(-1)

# Wallet address derived from the private key.
account   = eth_account.Account.from_key(PKEY)
addr_mine = account.address

# Contract's ABI.
contract_abi = open(CONTRACT_ABI, 'r').read()

# Initialize the contract.
contract = w3.eth.contract(address=CONTRACT_ADDR, abi=contract_abi)
