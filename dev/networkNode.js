const express = require('express');
const Blockchain = require("./blockchain");
const bodyParser = require('body-parser');
const uuid = require("uuid");
const app = express();
const port = process.argv[2];
const nodeAdress = uuid.v1().split('-').join("");
const axios = require('axios');


const hubiCoin = new Blockchain();




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send(hubiCoin);
});
app.get('/blockchain', (req, res) => {
    res.send(hubiCoin);
});
//taskk broadcast transaction to every node
//change createNewTransakction into 2 seperate functions
app.post('/transaction', (req, res) => {
    console.log(req.body);
    const {newTransaction} = req.body

    const blockIndex = hubiCoin.addTransactionToPendingTransactions(newTransaction);
    res.json({ note: `Transaction will be added in block ${blockIndex}` });
});
app.post('/transaction/broadcast', (req, res) => {
    const newTransaction = hubiCoin.createNewTransaction(
        req.body.amount,
        req.body.sender,
        req.body.recipient
    );
    hubiCoin.addTransactionToPendingTransactions(newTransaction);

    const requestPromises = [];
    hubiCoin.networkNodes.forEach(newtworkNodeUrl => {

        const requestOptions = {
            newTransaction,
            json: true,
        };

        const requestPromise = axios.post(newtworkNodeUrl + '/transaction', requestOptions);
        requestPromises.push(requestPromise);

        Promise.all(requestPromises).then(data => {
            res.json({ note: 'Transaction created and broadcaast succesfully.' });
        });
    });

});
app.post('/register-transaction', (req, res) => {
    const { transaction } = req.body;

    this.addTransactionToPendingTransactions(transaction);

});


app.get('/mine', (req, res) => {

    const lastBlock = hubiCoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        trnasactions: hubiCoin.pendingTransactions,
        index: lastBlock.index + 1
    };

    const nonce = hubiCoin.proofOfWork(previousBlockHash, currentBlockData);
    const hash = hubiCoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = hubiCoin.createNewBlock(nonce, previousBlockHash, hash);

    hubiCoin.createNewTransaction(12.5, "00", req.body.adress, nodeAdress);

    res.send({
        note: `New Block mined succesfully`,
        block: newBlock
    });
});
//register the node and broadcast to network
app.post('/register-and-broadcast-node', (req, res) => {

    const { newNodeUrl } = req.body;

    if (!(hubiCoin.isNodeRegistered(newNodeUrl))) hubiCoin.networkNodes.push(newNodeUrl);

    const regNodesPromises = [];
    hubiCoin.networkNodes.forEach(networkNodeUrl => {
        //register-node
        const requestOptions = {
            newNodeUrl,
            json: true,
        };

        regNodesPromises.push(axios.post(networkNodeUrl + '/register-node', requestOptions));

    });

    Promise.all(regNodesPromises).then(data => {
        //use data..
        const bulkRegisterOptions = {
            allNetworkNodes: [...hubiCoin.networkNodes, hubiCoin.currentNodeUrl]

        };

        return axios.post(newNodeUrl + '/register-nodes-bulk', bulkRegisterOptions);

    }).then(data => {
        res.json({ note: 'New node registered with network succesfully' });
    }).catch(err => console.log(err));

});
// register a node with the network
app.post('/register-node', (req, res) => {
    const { newNodeUrl } = req.body;


    if (!hubiCoin.isNodeRegistered(newNodeUrl) && !hubiCoin.isGivenNodeAdressCurrent(newNodeUrl)) {
        hubiCoin.networkNodes.push(req.body.newNodeUrl);
    }
    res.json({ note: 'New node registered succesfully.' });

});
app.post('/register-nodes-bulk', (req, res) => {
    const { allNetworkNodes } = req.body;

    allNetworkNodes.forEach(networkNodeUrl => {

        const nodeNotAlreadyPresent = !(hubiCoin.networkNodes.includes(networkNodeUrl));

        const notCurrentNode = hubiCoin.currentNodeUrl !== networkNodeUrl;

        if (notCurrentNode && nodeNotAlreadyPresent) hubiCoin.networkNodes.push(networkNodeUrl);
    });
    res.json({ note: 'Bulk registration succesfull.' });

});
app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});

