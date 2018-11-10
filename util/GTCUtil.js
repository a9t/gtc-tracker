PROP_GTC_REQUEST_REFERER = "GTC_REQUEST_REFERER";
PROP_GTC_REQUEST_COOKIE = "GTC_REQUEST_COOKIE";

CONST_URL_LEADERBOARD = "https://translate-coursera.org/new_gtc/services/leaderboard.php";
CONST_URL_PROJECTS = "https://translate-coursera.org/new_gtc/services/Projects.php";

function _getGTCRequestReferer() {
  // TODO: look into hard coding this, since it should only change
  //       something changes on GTC side
  return PropertiesService.getScriptProperties().getProperty(PROP_GTC_REQUEST_REFERER);
}

function _getGTCRequestCookie() {
  // TODO: this should not rely on a manually set property, there should
  //       be code to retrieve it whenever the cookie expires based
  //       on email and password
  return PropertiesService.getScriptProperties().getProperty(PROP_GTC_REQUEST_COOKIE);
}

/**
 * Retrieve options to execute http requests to GTC.
 */
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

/**
 * Retrieves a JSON object representing the current GTC leaderboard.
 */
function getLeaderBoardAsJSON() {
  return _getJSONForGTCURL(CONST_URL_LEADERBOARD);
}

/**
 * Retrieves a JSON object representing the current GTC courses.
 */
function getLeaderBoardAsJSON() {
  return _getJSONForGTCURL(CONST_URL_PROJECTS);
}

function _getJSONForGTCURL(url) {
  var response = UrlFetchApp.fetch(url, getGTCRequestOptions());
  var json = JSON.parse(response);

  return json;
}