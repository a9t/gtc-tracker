PROP_LANGUAGE_COMMUNITY = "LANGUAGE_COMMUNITY";
PROP_EXCLUDE_TRANSLATOR_IDS = "EXCLUDE_TRANSLATOR_IDS";

CONST_TABLE_TRANSLATOR = {
  COLUMN_START: 1,
  COLUMN_END: 6,
  COLUMN_INDEX: {
    NAME:    1,
    ID:      2,
    TOTAL:   3,
    LAST_7:  4,
    LAST_30: 5,
    UPDATE:  6
  },
  ROW_START: 2,
}

function _getExcludedTranslators() {
  var excludedTranslatorIdAsString = PropertiesService.getScriptProperties().getProperty(PROP_EXCLUDE_TRANSLATOR_IDS);
  var arrayStringIds = excludedTranslatorIdAsString.split(",");

  return arrayStringIds.map(function (stringId) { return parseInt(stringId);})
}

function getUsersFromGTC() {
  var jsonLeaderBoardResult = getLeaderBoardAsJSON();
  var leaderboard = jsonLeaderBoardResult["ranking"];

  var language = PropertiesService.getScriptProperties().getProperty(PROP_LANGUAGE_COMMUNITY);
  var excludedTranslators = _getExcludedTranslators();

  Logger.log(excludedTranslators.indexOf(71118));

  var translatorsById = {}
  leaderboard.filter(function (entry) { return entry["languages"].indexOf(language) !== -1; })
    .filter(function (entry) { return excludedTranslators.indexOf(entry["user_id"]) == -1; })
    .forEach(function (entry) { translatorsById[entry["user_id"]] = entry; });

  return translatorsById;
}

function getUsersFromSheet() {
  var sheet = getTranslatorsSheet();
  
  var height = sheet.getLastRow() - CONST_TABLE_TRANSLATOR.ROW_START + 1;
  var width = CONST_TABLE_TRANSLATOR.COLUMN_END - CONST_TABLE_TRANSLATOR.COLUMN_START + 1;

  // only valid for first run
  if (height <= 0) {
    return {};
  }

  var values = sheet.getSheetValues(CONST_TABLE_TRANSLATOR.ROW_START,
                                    CONST_TABLE_TRANSLATOR.COLUMN_START,
                                    height,
                                    width);
  
  var currentUsers = {};
  
  for (var index=0; index<values.length; index++) {
    var newUser = {"id"   :values[index][CONST_TABLE_TRANSLATOR.COLUMN_INDEX.ID    - CONST_TABLE_TRANSLATOR.COLUMN_START],
                   "name" :values[index][CONST_TABLE_TRANSLATOR.COLUMN_INDEX.NAME  - CONST_TABLE_TRANSLATOR.COLUMN_START],
                   "score":values[index][CONST_TABLE_TRANSLATOR.COLUMN_INDEX.TOTAL - CONST_TABLE_TRANSLATOR.COLUMN_START],
                   "diff" :0};
    currentUsers[newUser["id"]] = newUser;
  }

  return currentUsers;
}
