const express = require('express');
const Blockchain = require("./blockchain");
const bodyParser = require('body-parser');
const uuid = require("uuid");
const app = express();
const port = process.argv[2];
const nodeAdress = uuid.v1().split('-').join("");
const axios = require('axios');
const requestPromise = require('request-promise');


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
    const { newTransaction } = req.body;

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
            // console.log(data);
            res.json({ note: 'Transaction created and broadcaast succesfully.' });
        }).catch(err => res.json(err.response.data));
    });

});
app.post('/register-transaction', (req, res) => {
    const { transaction } = req.body;

    this.addTransactionToPendingTransactions(transaction);

});
app.post('/receive-new-block', (req, res) => {
    const { newBlock } = req.body;
    console.log(req.body.body);
    const lastBlock = hubiCoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock.index + 1 === newBlock.index;
    // this.addTransactionToPendingTransactions(transaction);
    // console.log('wiisz mje?');
    if (correctHash && correctIndex) {
        hubiCoin.chain.push(newBlock);
        hubiCoin.pendingTransactions = [];
        res.json({
            note: 'New block received and accepted.',
            newBlock
        });
    } else {
        res.json({
            note: "New block rejected.",
            newBlock
        });
    }
});


app.get('/mine', (req, res) => {

    const lastBlock = hubiCoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: hubiCoin.pendingTransactions,
        index: lastBlock.index + 1
    };

    const nonce = hubiCoin.proofOfWork(previousBlockHash, currentBlockData);
    const hash = hubiCoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = hubiCoin.createNewBlock(nonce, previousBlockHash, hash);


    const requestPromises = []
    hubiCoin.networkNodes.forEach((networkNodeUrl => {
        const requestOptions = {

            newBlock
        };
        // console.log(requestOptions);
        requestPromises.push(axios.post(networkNodeUrl + "/receive-new-block", requestOptions));
    }));

    Promise.all(requestPromises).then(data => {

        const requestOptions = {

            amount: 12.5,
            sender: "00",
            recipient: nodeAdress

        }
        return axios.post(hubiCoin.currentNodeUrl + '/transaction/broadcast', requestOptions);
    }).then(data => {
        console.log(data);
        res.send({
            note: `New Block mined succesfully`,
            block: newBlock,
        });
    }).catch(err => res.json(err.response.data));


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
    }).catch(err => res.json(err.response.data));

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

app.get('/consensus', (req, res) => {

    hubiCoin.networkNodes.forEach(networkNodeUrl => {
        const requestPromises = [];
        // const requestOptions = {
        //     json: true,
        // };

        requestPromises.push(axios.get(networkNodeUrl + '/blockchain'));
    })

    Promie.all(requestPromise).then(blockchains => {
        const currentChainLength = hubiCoin.chain.length;
        let maxChainLength = currentChainLength;
        let newLongestChain = null;
        let newPendingTransactions;



        blockchains.forEach(blockchain => {

            if (blockchain.chain.length > maxChainLength) {
                maxChainLength = blockchain.chain.length;
                newLongestChain = blockchain.chain;
                newPendingTransactions = blockchain.pendingTransactions;
            }
        })
        if (!newLongestChain || (newLongestChain && !hubiCoin.chainIsValid(newLongestChain))) {
            res.json({
                note: 'Current chain has not been replaced',
                chain: hubiCoin.chain
            });

        }else if (newLongestChain && hubiCoin.chainIsValid(newLongestChain)) {
            hubiCoin.chain = newLongestChain;
            hubiCoin.pendingTransactions = newPendingTransactions;
            res.json({
                note: "this chain has been replaced",
                chain: hubiCoin.chain

            });
        }
    });


});

app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});

