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
    console.log(newNodeUrl);
    if (!(hubiCoin.networkNodes.includes(newNodeUrl))) hubiCoin.networkNodes.push(newNodeUrl);
console.log(hubiCoin.networkNodes);
    const regNodesPromises = [];
    hubiCoin.networkNodes.forEach(networkNodeUrl => {
        //register-node
        const requestOptions = {

            body: { newNodeUrl },
            json: true,
        };

        regNodesPromises.push(axios.post(networkNodeUrl + '/register-node',requestOptions));
// console.log(regNodesPromises);
    });

    Promise.all(regNodesPromises).then(data => {
        //use data..
        const bulkRegisterOptions = {
           allNetworkNodes: [...hubiCoin.networkNodes, hubiCoin.curretNodeUrl] 
  
        };
        return axios.post(newNodeUrl + '/register-nodes-bulk',bulkRegisterOptions);

    }).then(data => {
        console.log("then resolved 2nd ");
        console.log();
        res.json({ note: 'New node registered with network succesfully' });
    }).catch(err=> console.log(err));

});
// register a node with the network
app.post('/register-node', (req, res) => {
    const { newNodeUrl } = req.body
    const nodeNotAlreadyPresent = !(hubiCoin.networkNodes.includes(newNodeUrl));
    const notCurrentNode = hubiCoin.currentNodeUrl !== newNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) hubiCoin.networkNodes.push(req.body.newNodeUrl);
    res.json({ note: 'New node registered succesfully.' });

});
app.post('/register-nodes-bulk', (req, res) => {
    console.log("hellloooo");
    // console.log(req.body.body);
    const { allNetworkNodes } = req.body;
    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = !(hubiCoin.networkNodes.includes(networkNodeUrl));
        const notCurrentNode = hubiCoin.currentNodeUrl !== networkNodeUrl;

        if (notCurrentNode && nodeNotAlreadyPresent) hubiCoin.networkNodes.push(networkNodeUrl);
    });
    // hubiCoin.networkNodes = req.body.allNetworkNodes;
    res.json({note: 'Bulk registration succesfull.'});

});
app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});

