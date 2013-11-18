/**
 *  Sample implementation of the jawbone-up library using Express
 */

var express = require("express");
var app = express();

var JawboneUpClient = require("./lib/jawbone-up");
var client = new JawboneUpClient({
  // fill in with info from Jawbone Developer portal
  clientId : 'MY-CLIENT-ID',
  appSecret: 'MY-APP-SECRET'
});

app.get('/oauth/url', function(req, res) {
  var oAuthUrl = client.getAuthorizeUrl({
    scope: ['basic_read',
            'cardiac_read',
            'extended_read',
            'friends_read',
            'location_read',
            'meal_read',
            'mood_read',
            'move_read'
           ].join(' '),
    redirect_uri: "https://jawbone-up-client.herokuapp.com/oauth"
  });
  res.set("Content-Type","application/json");
  res.send(JSON.stringify({
    url: oAuthUrl
  }));
});

app.get("/oauth", function(req, res) {
  if(req.query && req.query.code) {
    client.getAccessToken(req.query.code, function(token) {
      // go store the token somewhere nice.
      res.send("Houston, we have a token.");
    });
  } else {
    throw new Error("no code");
  }
});

app.get("/up/*", function(req, res) {
  // look ma, no hands!
  var token = req.query.token;
  var endpoint = req.path.substr("/up/".length,req.path.length);
  client.setToken(token).proxy(endpoint,function(json) {
    res.set("Content-Type","application/json");
    res.send(json);
  });
});


// start listening
var port = process.env.PORT || 5000;
app.listen(port);
