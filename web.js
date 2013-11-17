var express = require("express");
var app = express();
app.use(express.static(__dirname + "/public"));

var JawboneUpClient = require("./jawbone-up");
var client = new JawboneUpClient({
  clientId : '5Le5Fk6S4JA',
  appSecret: 'fc6b15312b6da7038c9b4b2f7215f1ecfe7a8add'
});

app.get('/auth/url', function(req, res) {
  var oAuthUrl = client.getAuthorizeUrl({
    scope: ['basic_read','extended_read','location_read','friends_read','cardiac_read','meal_read','move_read','mood_read'].join(' '),
    redirectURI: "https://jawbone-up-client.herokuapp.com/oauth"
  });
  res.set("Content-Type","application/json");
  res.set("Access-Control-Allow-Origin","*");
  res.send(JSON.stringify({
    url: oAuthUrl
  }));
});

app.get("/token", function(req, res) {
  res.set("Content-Type","application/json");
  res.set("Access-Control-Allow-Origin","*");
  if(app.token) {
    res.send(JSON.stringify({
      token: app.token
    }));
  } else {
    res.send(JSON.stringify({
      token: null,
      error: "No token found"
    }));
  }
});

app.get("/oauth", function(req, res) {
  if(req.query && req.query.code) {
    client.getAccessToken(req.query.code, function(token) {
      app.token = token;
      res.send("Connection successful. Please close this window.");
    });
  } else {
    throw new Error("no code");
  }
});

app.get("/up/*", function(req, res) {
  var token = req.query.token;
  var endpoint = req.path.substr("/up/".length,req.path.length);
  client.setToken(token).get(endpoint,function(json) {
    res.set("Content-Type","application/json");
    res.set("Access-Control-Allow-Origin","*");
    res.send(json);
  });
});



// start listening

var port = process.env.PORT || 5000;
app.listen(port);
