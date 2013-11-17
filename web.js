var express = require("express");
var app = express();

var JawboneUpClient = require("./jawbone-up");
var client = new JawboneUpClient({
  clientId : '5Le5Fk6S4JA',
  appSecret: 'fc6b15312b6da7038c9b4b2f7215f1ecfe7a8add'
});

var token = "";

var oAuthUrl = client.getAuthorizeUrl({
  scope: "basic_read,extended_read",
  redirectURI: "https://jawbone-up-client.herokuapp.com/oauth"
});

app.get('/', function(req, res) {
  res.send('<body><a href="'+oAuthUrl+'">Authorize</a></body>');
});

app.get("/oauth", function(req, res) {
  if(req.query && req.query.code) {
    var code = req.query.code;
    client.getAccessToken(code, function(token) {
      token = token;
      res.send('<a href="/basic?token='+token+'">Get stuff with token</a>');
    });
  } else {
    throw new Error("no code");
  }
});

app.get("/basic/:token", function(req, res) {
  var token = req.param("token");
  var basicInfo = client.getBasicInfo(token,function(json) {
    res.send(json);
  });
});

var port = process.env.PORT || 5000;
app.listen(port);
