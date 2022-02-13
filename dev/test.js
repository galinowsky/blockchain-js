const Blockchain = require('./blockchain');



const hubiCoin = new Blockchain();

const bc1 = {
    "chain": [
        {
            "index": 1,
            "timeStamp": 1644358790605,
            "transactions": [],
            "nonce": 100,
            "hash": "0",
            "previousBlockHash": "0"
        },
        {
            "index": 2,
            "timeStamp": 1644358813688,
            "transactions": [
                {
                    "amount": 123123,
                    "sender": "hubi",
                    "recipient": "pupi",
                    "transactionId": "45e6a5c0892d11ec853211b7e1789ea0"
                }
            ],
            "nonce": 4986,
            "hash": "0000ba83e68c6ff85116af96cd1bc88ec4a5eeae2195241e5812ef4b2664336b",
            "previousBlockHash": "0"
        },
        {
            "index": 3,
            "timeStamp": 1644358837425,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "3b6d1160892d11ec853211b7e1789ea0",
                    "transactionId": "493fbbd0892d11ec853211b7e1789ea0"
                },
                {
                    "amount": 12554,
                    "sender": "michas",
                    "recipient": "pupi",
                    "transactionId": "53379d10892d11ec853211b7e1789ea0"
                },
                {
                    "amount": 232411,
                    "sender": "dupa",
                    "recipient": "jaja",
                    "transactionId": "548fb300892d11ec853211b7e1789ea0"
                }
            ],
            "nonce": 4469,
            "hash": "0000130e7afcea520df8b03ff7eb54f9e24e8f06aebb580cb59c21854a21ec11",
            "previousBlockHash": "0000ba83e68c6ff85116af96cd1bc88ec4a5eeae2195241e5812ef4b2664336b"
        },
        {
            "index": 4,
            "timeStamp": 1644358854280,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "3b6d1160892d11ec853211b7e1789ea0",
                    "transactionId": "5765dd70892d11ec853211b7e1789ea0"
                },
                {
                    "amount": 12554,
                    "sender": "michas",
                    "recipient": "pupi",
                    "transactionId": "5d6a1650892d11ec853211b7e1789ea0"
                },
                {
                    "amount": 232411,
                    "sender": "dupa",
                    "recipient": "jaja",
                    "transactionId": "5eae5620892d11ec853211b7e1789ea0"
                },
                {
                    "amount": 123123,
                    "sender": "hubi",
                    "recipient": "pupi",
                    "transactionId": "6010f360892d11ec853211b7e1789ea0"
                }
            ],
            "nonce": 28755,
            "hash": "0000f79fe2c420b75d64c3f12a96c523d7c9df3bcd435d07912c3a03351810de",
            "previousBlockHash": "0000130e7afcea520df8b03ff7eb54f9e24e8f06aebb580cb59c21854a21ec11"
        }
    ],
    "pendingTransactions": [
        {
            "amount": 12.5,
            "sender": "00",
            "recipient": "3b6d1160892d11ec853211b7e1789ea0",
            "transactionId": "61716dc0892d11ec853211b7e1789ea0"
        }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": [
        "http://localhost:3002"
    ]
}

console.log(hubiCoin.chainIsValid(bc1.chain));