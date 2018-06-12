var querystring = require("querystring");
var requestPromise = require('request-promise');
var _ = require('underscore');
var CryptoJS = require('crypto-js');
var crypto = require('crypto');
var Promise = require('bluebird');

_.mixin({
  // compact for objects
  compactObject: function(to_clean) {
    _.map(to_clean, function(value, key, to_clean) {
      if (value === undefined)
        delete to_clean[key];
    });
    return to_clean;
  }
});

var CryptoMKT = function(api_key, api_secret) {
  this.api_key = api_key;
  this.api_secret = api_secret;

  _.bindAll.apply(_, [this].concat(_.functions(this)));
}

CryptoMKT.prototype._request = function(method, path, args, data, auth=false) {
  var fullPath = path + (querystring.stringify(args) === '' ? '' : '?') + querystring.stringify(args);

  var options = {
    uri: 'https://api.cryptomkt.com' + fullPath,
    method: method,
    headers: {
      //'User-Agent': 'Mozilla/4.0 (compatible; cryptomkt-promise Node.js client)',
      //'Content-Type': 'application/x-www-form-urlencoded'
    },
    timeout: 5000,
    resolveWithFullResponse: true,
  };

  if (data) {
    options.form = data;
  }

  
  if(auth){
    if(!this.api_key || !this.api_secret)
      return Promise.reject('Must provide api_key and api_secret to make this API request.');

    var authHeader=this._authHeader(method,fullPath, data)
    options.headers =Object.assign(options.headers, authHeader);
  }

  console.log(options);

  return requestPromise(options)
    .then(function(res) {
        return JSON.parse(res.body);
    }).catch(function(err) {
      let message;
      if (err.name === 'StatusCodeError') {
        message = 'CryptoMKT error ' + err.statusCode + ': ' + (err.statusCode === 404 ? 'Not found' : err.response.body);
      } else {
        message = 'CryptoMKT error: ' + err.message;
      }
      throw new Error(message);
    });
  }
  
  CryptoMKT.prototype._authHeader = function(method, path, body){
    var time = Math.floor(new Date() / 1000); 
    var message=time+path;
    
    console.log(message)
    var signature = crypto.createHmac('sha384', this.api_secret).update(message).digest('hex');

    return {
        'X-MKT-APIKEY': this.api_key,
        'X-MKT-SIGNATURE': signature,
        'X-MKT-TIMESTAMP': time
    };

  }
  
//
// Public API
//

//https://developers.cryptomkt.com/es/?typescript#mercado
CryptoMKT.prototype.market = function() {
    return this._request('GET','/v1/market');
}

// https://developers.cryptomkt.com/es/?typescript#ticker
CryptoMKT.prototype.ticker = function(market) {
    return this._request('GET','/v1/ticker',{market: market});
}
  
// https://developers.cryptomkt.com/es/?typescript#ordenes
CryptoMKT.prototype.book = function(market, type, page, limit) {
    var args={
        market: market,
        type: type
    }
    if(page) args.page=page;
    if(limit) args.limit=limit;
    
    return this._request('GET','/v1/book',args);
}

// https://developers.cryptomkt.com/es/?typescript#trades
CryptoMKT.prototype.trades = function(market, start, end, page, limit) {
    var args={market: market}

    if(start) args.start=start;
    if(end) args.end=end;
    if(page) args.page=page;
    if(limit) args.limit=limit;
    
    return this._request('GET','/v1/trades',args);
}

//
// Private API
// (you need to have api_key / api_secret)
//


// https://developers.cryptomkt.com/es/?typescript#balance
CryptoMKT.prototype.balance = function() {
    return this._request('GET','/v1/balance',null,null,true);
}

module.exports = CryptoMKT;