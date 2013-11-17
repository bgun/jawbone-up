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
  request(tokenUrl + querystring.stringify(params), function(err, resp, body) {
    var token = JSON.parse(body).access_token;
    callback.call(null, token);
  });
};

UpClient.prototype.getBasicInfo = function(token, callback) {
  request({
    uri: this.settings.baseUrl+"users/@me",
    headers: {
      "Authorization": "Bearer "+token
    }
  }, function(err, res, body) {
    callback.call(null, JSON.parse(body));
  });
};

UpClient.prototype.getExtendedInfo = function(token, callback) {
  request({
    uri: this.settings.baseUrl+"users/@me",
    headers: {
      "Authorization": "Bearer "+token
    }
  }, function(err, res, body) {
    callback.call(null, JSON.parse(body));
  });
};

UpClient.prototype.getMeals = function(token, callback) {
  request({
    uri: this.settings.baseUrl+"users/@me/meals",
    headers: {
      "Authorization": "Bearer "+token
    }
  }, function(err, res, body) {
    callback.call(null, JSON.parse(body));
  });
};
