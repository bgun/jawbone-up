/**
 *  node.js API consumer
 *  
 *  Ben Gundersen, Ace Hotel codeathon 2013-Nov-16
 */

var request     = require("request");
var querystring = require("querystring");
var _           = require("underscore");

var UpClient = module.exports = function(options) {
  this.settings = _.extend({
    baseUrl: "https://jawbone.com/nudge/api/v.1.0/",
    authUrl: "https://jawbone.com/auth/oauth2/"
  }, options);
};

UpClient.prototype.getAuthorizeUrl = function(options) {
  // get the URL to Jawbone's OAuth login/permissions page
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
  // get permanent token from auth code
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

UpClient.prototype.setToken = function(token) {
  // optionally set token inline
  this.token = token;
  return this;
};

UpClient.prototype.get = function(read_endpoint, callback) {
  // authorized passthrough for Jawbone read API endpoints
  request({
    uri: this.settings.baseUrl+read_endpoint,
    headers: {
      "Authorization": "Bearer "+this.token
    }
  }, function(err, res, body) {
    callback.call(null, JSON.parse(body));
  });
};
