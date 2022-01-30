const express = require('express');
const Blockchain = require("./blockchain");
const bodyParser = require('body-parser');
const uuid = require("uuid");
const app = express();

const nodeAdress  = uuid.v1().split('-').join("");


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
        trnasactions : hubiCoin.pendingTransactions,
        index: lastBlock.index + 1
    };

    const nonce = hubiCoin.proofOfWork(previousBlockHash, currentBlockData);
    const hash = hubiCoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = hubiCoin.createNewBlock(nonce, previousBlockHash, hash);

    hubiCoin.createNewTransaction(12.5, "00", req.body.adress , nodeAdress);

    res.send({
        note: `New Block mined succesfully`,
        block:newBlock
    });
});


app.listen('3000');

