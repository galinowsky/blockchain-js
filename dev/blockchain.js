const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require("uuid");

function Blockchain() {

	this.chain = [];
	this.pendingTransactions = [];
	this.currentNodeUrl = currentNodeUrl;
	this.networkNodes = [];
	this.createNewBlock(100, '0', '0');
}

Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
	const newBlock = {
		index: this.chain.length + 1,
		timestamp: Date.now(),
		transactions: this.pendingTransactions,
		nonce: nonce,
		hash: hash,
		previousBlockHash: previousBlockHash
	};

	this.pendingTransactions = [];
	this.chain.push(newBlock);

	return newBlock;
};


Blockchain.prototype.getLastBlock = function () {
	return this.chain[this.chain.length - 1];
};


Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
	const newTransaction = {
		amount,
		sender,
		recipient,
		transactionId: uuid.v1().split('-').join("")
	};

	return newTransaction;
};


Blockchain.prototype.addTransactionToPendingTransactions = function (transactionObj) {
	this.pendingTransactions.push(transactionObj);
	return this.getLastBlock()['index'] + 1;
};


Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
	// console.log(previousBlockHash, currentBlockData, nonce);
	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	return hash;
};

Blockchain.prototype.getBlock = function (blockHash) {

	return this.chain.find(block => block.hash === blockHash);
}
Blockchain.prototype.getTransaction = function (transactionId) {

	// return this.chain.find(block => block.transactions.find(transaction => transaction.transactionId === transactionId));
	let correctTransaction = null;
	let correctBlock = null;
	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if (transaction.transactionId === transactionId) {
				correctBlock = block;
				correctTransaction = transaction;
			}
		})


	})
	return {
		transaction: correctTransaction,
		block: correctBlock,
	};
};
Blockchain.prototype.getAddressData = function (address) {
	const addressTransactions = [];
	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if (transaction.sender === address || transaction.recipient === address) {
				addressTransactions.push(transaction);
			}
		});
	});
	let balance = 0;
	addressTransactions.forEach(transaction => {
		if (transaction.recipient === address) balance += transaction.amount;
		else if (transaction.sender === address) balance -= transaction.amount;
	});
	return {
		addressTransactions,
		addressBalance: balance
	}
};
Blockchain.prototype.proofOfWork = function (previousBlockHash, currentBlockData) {
	let nonce = 0;
	let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	while (hash.substring(0, 4) !== '0000') {
		nonce++;
		hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	}

	return nonce;
};



Blockchain.prototype.chainIsValid = function (blockchain) {
	let validChain = true;
	// blockchain.length
	for (var i = 1; i < blockchain.length; i++) {
		const currentBlock = blockchain[i];
		const prevBlock = blockchain[i - 1];
		const blockHash = this.hashBlock(prevBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce']);
		console.log(blockHash);
		console.log(blockHash.substring(0, 4) !== '0000');
		console.log(currentBlock['previousBlockHash'] !== prevBlock['hash']);


		if (blockHash.substring(0, 4) !== '0000') validChain = false;
		if (currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;
	};

	const genesisBlock = blockchain[0];
	const correctNonce = genesisBlock['nonce'] === 100;
	const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
	const correctHash = genesisBlock['hash'] === '0';
	const correctTransactions = genesisBlock['transactions'].length === 0;

	if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false;

	return validChain;
};


Blockchain.prototype.isNodeRegistered = function (nodeaddress) {
	return this.networkNodes.includes(nodeaddress);
};

Blockchain.prototype.isGivenNodeAddressCurrent = function (nodeaddress) {

	return this.currentNodeUrl === nodeaddress;
};

module.exports = Blockchain;