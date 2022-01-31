const express = require('express');
const Blockchain = require("./blockchain");
const bodyParser = require('body-parser');
const uuid = require("uuid");
const app = express();
const port = process.argv[2];
const nodeAdress = uuid.v1().split('-').join("");
const rp = require('request-promise');

const hubiCoin = new Blockchain();




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/blockchain', (req, res) => {
    res.send(hubiCoin);
});

app.post('/transaction', (req, res) => {
    const blockIndex = hubiCoin.createNewTransaction(
        req.body.amount,
        req.body.sender,
        req.body.recipient
    );
    res.json({ note: `transaction will be added in block ${blockIndex}` });
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

    const newNodeUrl = req.body.newNodeUrl;
    if (!(hubiCoin.networkNodes.includes(newNodeUrl))) hubiCoin.networkNodes.push(newNodeUrl);

    const regNodesPromises = [];
    hubiCoin.networkNodes.forEach(networkNodeUrl => {
        //register-node
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: { newNodeUrl },
            json: true,
        };
        regNodesPromises.push(rp(requestOptions));

    });

    Promise.all(regNodesPromises).then(data => {
        //use data..
        const bulkRegisterOptions = {
            uri: newNodeUrl + 'register-nodes-bulk',
            method: 'POST',
            body: { allNetworkNodes: [...hubiCoin.networkNodes, hubiCoin.curretNodeUrl] },
            json: true
        };
        return rp(bulkRegisterOprions);

    }).then(data => {

        res.json({note:'New node registered with network succesfully'});
    })

});
// register a node with the network
app.post('/register-node', (req, res) => {
    hubiCoin.push(req.body.newNodeUrl);
});
app.post('/register-nodes-bulk', (req, res) => {

    hubiCoin.networkNodes = req.body.allNetworkNodes;

});
app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});

