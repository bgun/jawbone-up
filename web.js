var express = require("express");
var app = express();
app.use(express.static(__dirname + "/public"));

var JawboneUpClient = require("./jawbone-up");
var client = new JawboneUpClient({
  clientId : '5Le5Fk6S4JA',
  appSecret: 'fc6b15312b6da7038c9b4b2f7215f1ecfe7a8add'
});

app.get('/auth', function(req, res) {
  var oAuthUrl = client.getAuthorizeUrl({
    scope: ['basic_read','extended_read','location_read','friends_read','cardiac_read','meal_read'].join(' '),
    redirectURI: "https://jawbone-up-client.herokuapp.com/oauth"
  });
  res.send('<body><a href="'+oAuthUrl+'">Authorize</a></body>');
});

app.get("/oauth", function(req, res) {
  if(req.query && req.query.code) {
    client.getAccessToken(req.query.code, function(token) {
      res.send('<a href="/basic?token='+token+'">Get stuff with token</a>');
    });
  } else {
    throw new Error("no code");
  }
});

var token = "eQBwhd5FIoOCw_yKq24sxrBJ-vN59GZrdbvXv9Dv2oegs35DJ2kLhYNzxdW1Pl60kKMwPvEBJ55RAnYEZaPxlCzIBmUtBLpsaym2RYjpp5gDwoQTw2eSTw";

app.get("/up/*", function(req, res) {
  //var token = req.query.token;
  var endpoint = req.param('endpoint');
  console.log("PATH",req.path);
  console.log("REQUESTING ENDPOINT",endpoint);
  client.request(token,endpoint,function(json) {
    res.send(json);
  });
});



// start listening

var port = process.env.PORT || 5000;
app.listen(port);
