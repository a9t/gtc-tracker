PROP_GTC_REQUEST_REFERER = "GTC_REQUEST_REFERER";
PROP_GTC_REQUEST_COOKIE = "GTC_REQUEST_COOKIE";

CONST_URL_LEADERBOARD = "https://translate-coursera.org/new_gtc/services/leaderboard.php";

function _getGTCRequestReferer() {
  return PropertiesService.getScriptProperties().getProperty(PROP_GTC_REQUEST_REFERER);
}

function _getGTCRequestCookie() {
  return PropertiesService.getScriptProperties().getProperty(PROP_GTC_REQUEST_COOKIE);
}

function getGTCRequestOptions() {
  var headers = {
    "Referer" : _getGTCRequestReferer(),
    "Cookie"  : _getGTCRequestCookie(),
  };
  var options = {
    "method" : "GET",
    "validateHttpsCertificates" : false,
    "headers" : headers,
  };
  
  return options;
}

function getLeaderBoardAsJSON() {
  var response = UrlFetchApp.fetch(CONST_URL_LEADERBOARD, getGTCRequestOptions());
  var json = JSON.parse(response);

  return json;
}