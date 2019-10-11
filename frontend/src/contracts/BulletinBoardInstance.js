import web3 from './web3';

// const address = '0xc24267c0a67a2c2013d439a0eb85eb895fd7f30e'; // ropsten
const address = '0xa55b294a7fdd684f218994b54cf274d74de8175d'; // ropsten

const abi = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "board",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_nftIdx",
				"type": "uint256"
			},
			{
				"name": "newText",
				"type": "string"
			}
		],
		"name": "registerText",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "token",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_token",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	}
]


export default new web3.eth.Contract(abi, address);