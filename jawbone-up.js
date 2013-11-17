var request     = require("request");
var querystring = require("querystring");
var _           = require("underscore");

var UpClient = module.exports = function(options) {
  this.settings = _.extend({}, options);
  console.log("Initializing",this.settings);
};

UpClient.prototype.getAuthorizeUrl = function(options) {
  var authUrl = "https://jawbone.com/auth/oauth2/auth?";
  var params = {
    "response_type": "code",
    "client_id"    : this.settings.clientId,
    "scope"        : options.scope,
    "redirect_uri" : options.redirectURI
  };
  return authUrl + querystring.stringify(params);
};

UpClient.prototype.getAccessToken = function(code, callback) {
  var tokenUrl = "https://jawbone.com/auth/oauth2/token";
  var params = {
    "client_id" : this.settings.clientId,
    "app_secret": this.settings.appSecret,
    "grant_type": "authorization_code",
    "code"      : code
  };
  request(tokenUrl + querystring.stringify(params), callback);
};
