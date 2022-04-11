import Web3 from "web3";
require('dotenv').config()

// const web3 = new Web3("ws://"+process.env.GANACHE_URL)

const network = process.env.REACT_APP_ETHEREUM_NETWORK;
const infuraProjectId = process.env.REACT_APP_INFURA_PROJECT_ID
const web3 = new Web3(`wss://${network}.infura.io/ws/v3/${infuraProjectId}`);
// console.log(`https://${network}.infura.io/v3/${infuraProjectId}`)
const signer1 = web3.eth.accounts.privateKeyToAccount(process.env.REACT_APP_SIGNER_PRIVATE_KEY);
const signer2 = web3.eth.accounts.privateKeyToAccount(process.env.REACT_APP_SIGNER_PRIVATE_KEY2);
web3.eth.accounts.wallet.add(signer1);
web3.eth.accounts.wallet.add(signer2);


export default web3;