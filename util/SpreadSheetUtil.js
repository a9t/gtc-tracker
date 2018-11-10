PROP_SPREADHSEET_ID = "SPREADSHEET_ID";
PROP_SHEET_NAME_TRANSLATORS = "SHEET_NAME_TRANSLATORS";
PROP_SHEET_NAME_COURSES = "SHEET_NAME_COURSES";

/**
 * Retrieve a sheet object identifying the storage place of the tracked courses.
 */
function getTranslatorsSheet() {
  var coursesSheetName = PropertiesService.getScriptProperties().getProperty(PROP_SHEET_NAME_COURSES);

  var spreadSheet = _getSpreadSheet();
  var sheet = spreadSheet.getSheetByName(coursesSheetName);

  return sheet;
}

/**
 * Retrieve a sheet object identifying the storage place of the word count.
 */
function getTranslatorsSheet() {
  var translatorsSheetName = PropertiesService.getScriptProperties().getProperty(PROP_SHEET_NAME_TRANSLATORS);

  var spreadSheet = _getSpreadSheet();
  var sheet = spreadSheet.getSheetByName(translatorsSheetName);

  return sheet;
}

function _getSpreadSheet() {
  var spreadSheetId = PropertiesService.getScriptProperties().getProperty(PROP_SPREADHSEET_ID);
  var spreadSheet = SpreadsheetApp.openById(spreadSheetId);

  return spreadSheet;
}