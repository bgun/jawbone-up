var request     = require("request");
var querystring = require("querystring");
var _           = require("underscore");

var UpClient = module.exports = function(options) {
  this.settings = _.extend({
    baseUrl: "https://jawbone.com/nudge/api/v.1.0/",
    authUrl: "https://jawbone.com/auth/oauth2/"
  }, options);
  console.log("Initializing",this.settings);
};

UpClient.prototype.getAuthorizeUrl = function(options) {
  var authUrl = this.settings.authUrl+"auth?";
  var params = {
    "response_type": "code",
    "client_id"    : this.settings.clientId,
    "scope"        : options.scope,
    "redirect_uri" : options.redirectURI
  };
  return authUrl + querystring.stringify(params);
};

UpClient.prototype.getAccessToken = function(code, callback) {
  var t = this;
  var tokenUrl = t.settings.authUrl+"token?";
  var params = {
    "client_id"    : t.settings.clientId,
    "client_secret": t.settings.appSecret,
    "grant_type"   : "authorization_code",
    "code"         : code
  };
  console.log("GETTING TOKEN",params);
  request(tokenUrl + querystring.stringify(params), function(err, resp, body) {
    this.accessToken = JSON.parse(body).access_token;
    callback.call(null, accessToken);
  });
};

UpClient.prototype.setToken = function(token) {
  this.accessToken = token;
};

UpClient.prototype.getBasicInfo = function(callback) {
  request({
    uri: this.settings.baseUrl+"users/@me",
    headers: {
      "Authorization": "Bearer "+this.accessToken
    }
  }, function(err, res, body) {
    callback.call(null, JSON.parse(body));
  });
};
