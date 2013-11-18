/**
 *  node.js API consumer
 *  
 *  Ben Gundersen, Ace Hotel codeathon 2013-Nov-16
 */

var request = require("request");
var qs      = require("querystring");
var _       = require("underscore");

var UpClient = module.exports = function(options, token) {
  this.settings = _.extend({
    baseUrl: "https://jawbone.com/nudge/api/v.1.0/",
    authUrl: "https://jawbone.com/auth/oauth2"
  }, options);
  if(token) {
    this.token = token;
  }
};

UpClient.prototype.getAuthorizeUrl = function(options) {
  // Get the URL to Jawbone's OAuth login/permissions page.
  // 
  var authUrl = this.settings.authUrl+"/auth";
  var params = _.extend({
    "response_type": "code",
    "client_id"    : this.settings.clientId,
    "scope"        : "basic_read"
  }, options);
  return authUrl + "?" + qs.stringify(params);
};

UpClient.prototype.getAccessToken = function(code, callback) {
  // get permanent token from auth code
  var t = this;
  var tokenUrl = t.settings.authUrl+"/token";
  var params = {
    "client_id"    : t.settings.clientId,
    "client_secret": t.settings.appSecret,
    "grant_type"   : "authorization_code",
    "code"         : code
  };
  request(tokenUrl + "?" + qs.stringify(params), function(err, resp, body) {
    if(err) {
      throw new Error("error retrieving access token");
    } else {
      t.token = JSON.parse(body).access_token;
      callback.call(null, t.token);
    }
  });
};

UpClient.prototype.setToken = function(token) {
  // optionally set token inline if you already have it stored elsewhere
  this.token = token;
  return this;
};

UpClient.prototype.proxy = function(read_endpoint, callback) {
  // authorized passthrough for Jawbone read API endpoints
  // see: https://jawbone.com/up/developer/endpoints
  var uri = this.settings.baseUrl + read_endpoint;
  request({
    uri: uri,
    headers: {
      "Authorization": "Bearer "+this.token
    }
  }, function(err, res, body) {
    if(err) {
      throw new Error("error proxying to "+uri);
    } else {
      callback.call(null, JSON.parse(body));
    }
  });
};

// TODO: write endpoints
