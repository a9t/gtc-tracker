PROP_SPREADHSEET_ID = "SPREADSHEET_ID";
PROP_SHEET_NAME_TRANSLATORS = "SHEET_NAME_TRANSLATORS";

/**
 * Retrieve a sheet object identifying the storage place of the word count.
 */
function getTranslatorsSheet() {
  var spreadSheetId = PropertiesService.getScriptProperties().getProperty(PROP_SPREADHSEET_ID);
  var translatorsSheetName = PropertiesService.getScriptProperties().getProperty(PROP_SHEET_NAME_TRANSLATORS);

  var spreadSheet = SpreadsheetApp.openById(spreadSheetId);
  var sheet = spreadSheet.getSheetByName(translatorsSheetName);

  return sheet;
}
