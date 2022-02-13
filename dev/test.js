const Blockchain = require('./blockchain');



const hubiCoin = new Blockchain();

const bc1 = {
    "chain": [
        {
            "index": 1,
            "timestamp": 1644757450703,
            "transactions": [],
            "nonce": 100,
            "hash": "0",
            "previousBlockHash": "0"
        },
        {
            "index": 2,
            "timestamp": 1644757547872,
            "transactions": [
                {
                    "amount": 123123,
                    "sender": "hubi",
                    "recipient": "pupi",
                    "transactionId": "7c50fef08ccd11ec8831f7e115c6ef39"
                },
                {
                    "amount": 12554,
                    "sender": "michas",
                    "recipient": "pupi",
                    "transactionId": "8bed6ce08ccd11ec8831f7e115c6ef39"
                }
            ],
            "nonce": 22152,
            "hash": "0000fc44f756832978dd7b8ac577ccb67fe9d7ab810e33c4babe796ca538bff9",
            "previousBlockHash": "0"
        },
        {
            "index": 3,
            "timestamp": 1644757575217,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "6f59c0608ccd11ec8831f7e115c6ef39",
                    "transactionId": "a957f1608ccd11ec8831f7e115c6ef39"
                },
                {
                    "amount": 232411,
                    "sender": "dupa",
                    "recipient": "jaja",
                    "transactionId": "aedbafa08ccd11ec8831f7e115c6ef39"
                },
                {
                    "amount": 12554,
                    "sender": "michas",
                    "recipient": "pupi",
                    "transactionId": "b20d67908ccd11ec8831f7e115c6ef39"
                },
                {
                    "amount": 123123,
                    "sender": "hubi",
                    "recipient": "pupi",
                    "transactionId": "b6e4b9308ccd11ec8831f7e115c6ef39"
                }
            ],
            "nonce": 7128,
            "hash": "000088fc284c63fcff8aedf2e06a45b39d9d3b3951b3415f4d49acd7084b4eaa",
            "previousBlockHash": "0000fc44f756832978dd7b8ac577ccb67fe9d7ab810e33c4babe796ca538bff9"
        }
    ],
    "pendingTransactions": [
        {
            "amount": 12.5,
            "sender": "00",
            "recipient": "6f59c0608ccd11ec8831f7e115c6ef39",
            "transactionId": "b9a44e608ccd11ec8831f7e115c6ef39"
        }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": [
        "http://localhost:3002"
    ]
}

console.log("VALID: " + hubiCoin.chainIsValid(bc1.chain));

// console.log(hubiCoin.hashBlock("0", {
//     transactions: [
//     ], index: 2
// }, 18140));
