/*
 * Utility class to run quick tests to debug issues that may be
 * determined by API changes.
 */ 

function _testGTCRequest() {
  Logger.log(getLeaderBoardAsJSON());
}

function _testTranslatorsSheet() {
  Logger.log(getTranslatorsSheet().getName());
}
