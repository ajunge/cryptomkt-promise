var CryptoMKT = require('./cryptomkt');

var publicCryptoMKT = new CryptoMKT();

//publicCryptoMKT.market().then(function(result) { console.log(result) });
//publicCryptoMKT.ticker('ETHCLP').then(function(result) { console.log(result) });
//publicCryptoMKT.book('ETHCLP','buy',2,1).then(function(result) { console.log(result) });
//publicCryptoMKT.trades('ETHCLP').then(function(result) { console.log(result) });

var api_key = 'your-key';
var api_secret = 'your-secret';
var privateCryptoMKT = new CryptoMKT(api_key, api_secret);

//commented out for your protection

//privateCryptoMKT.balance().then(function(result) { console.log(result) });
//privateCryptoMKT.account().then(function(result) { console.log(result) });
//privateCryptoMKT.order('M123456').then(function(result) { console.log(result) });
//privateCryptoMKT.active_orders('BTCCLP').then(function(result) { console.log(result) });
//privateCryptoMKT.executed_orders('BTCCLP').then(function(result) { console.log(result) });