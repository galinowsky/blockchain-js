const  Blockchain  = require('./blockchain')



const hubiCoin  = new Blockchain();
// hubiCoin.createNewBlock(12131,"234WETW",'3214WEF4R2');
// hubiCoin.createNewTransaction(123,"marcin","michas");
// hubiCoin.createNewTransaction(41,"dupa","jaja");
// hubiCoin.createNewTransaction(2342123,"pupi","hubi");
// // hubiCoin.createNewBlock(435432,"2WEFWSAF",'23567YRTH');

// // hubiCoin.createNewBlock(2341,'23RQWFQW4','ADSF432RQW')
// // hubiCoin.createNewBlock(12,'23R32QWFQW4','2342342342')
// // hubiCoin.createNewBlock(234231,'23RQW234FQW4','23434')
// // console.log(hubiCoin.chain[1].transactions);
// console.log(hubiCoin.pendingTransactions);
console.log(hubiCoin);
// const previousBlockHash = '142451243543DFAWER4Q3';
// const currentBlockData = [
//     { amount: 123, sender: 'marcin', recipient: 'michas' },
//     { amount: 41, sender: 'dupa', recipient: 'jaja' },
//     { amount: 2342123, sender: 'pupi', recipient: 'hubi' }
//   ];

//   console.log(hubiCoin.proofOfWork(previousBlockHash, currentBlockData));