var express = require("express");
var app = express();
app.use(express.bodyParser());

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
    client.getAccessToken(code, function(err, resp, body) {
      res.set("Content-Type","application/json");
      res.send(body.access_token);
    });
  } else {
    throw new Error("no code");
  }
});

var port = process.env.PORT || 5000;
app.listen(port);
