const { twitter_api_key, twitter_api_secret, twitter_token_access, twitter_token_secret } = require('../utils/config.js');

//

var Twit = require('twit')
 
var twitter = new Twit({
    consumer_key:         twitter_api_key,
    consumer_secret:      twitter_api_secret,
    access_token:         twitter_token_access,
    access_token_secret:  twitter_token_secret,
    timeout_ms:           60 * 1000, 
    strictSSL:            true,
});

function createNewTwit(message) {

    twitter.post('statuses/update', { 
        status: message

    }, function(err, data, response) {
        if(err) throw err;
        console.log('[TWITTER] Nuevo twit creado.')
    });
}

module.exports = {
    createNewTwit,
};