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

/**
 * Retrieve translators that are not really contributing to this language.
 *
 * These translators might be the GTC staff or people that are
 * multilingual and gave up translating in the language.
 */
function _getExcludedTranslators() {
  var excludedTranslatorIdAsString = PropertiesService.getScriptProperties().getProperty(PROP_EXCLUDE_TRANSLATOR_IDS);
  var arrayStringIds = excludedTranslatorIdAsString.split(",");

  return arrayStringIds.map(function (stringId) { return parseInt(stringId);})
}

/**
 * Retrieve a filtered list of translators that contribute to the language.
 */
function getTranslatorsFromGTC() {
  var jsonLeaderBoardResult = getLeaderBoardAsJSON();
  var leaderboard = jsonLeaderBoardResult["ranking"];

  var language = PropertiesService.getScriptProperties().getProperty(PROP_LANGUAGE_COMMUNITY);
  var excludedTranslators = _getExcludedTranslators();

  return leaderboard.filter(function (entry) { return entry["languages"].indexOf(language) !== -1; })
    .filter(function (entry) { return excludedTranslators.indexOf(entry["user_id"]) == -1; });
}

/**
 * Retrieve existing translators from the sheet as a map.
 *
 * The keys are the translator ids, and each translator entry
 * stores the id, name, score and the word count difference,
 * set to 0.
 */
function getTranslatorsFromSheet() {
  var sheet = getTranslatorsSheet();
  
  var height = sheet.getLastRow() - CONST_TABLE_TRANSLATOR.ROW_START + 1;
  var width = CONST_TABLE_TRANSLATOR.COLUMN_END - CONST_TABLE_TRANSLATOR.COLUMN_START + 1;

  // no translators yet
  if (height <= 0) {
    return {};
  }

  var values = sheet.getSheetValues(CONST_TABLE_TRANSLATOR.ROW_START,
                                    CONST_TABLE_TRANSLATOR.COLUMN_START,
                                    height,
                                    width);
  
  var currentTranslators = {};
  
  for (var index=0; index<values.length; index++) {
    var translator = {"id"   :values[index][CONST_TABLE_TRANSLATOR.COLUMN_INDEX.ID    - CONST_TABLE_TRANSLATOR.COLUMN_START],
                      "name" :values[index][CONST_TABLE_TRANSLATOR.COLUMN_INDEX.NAME  - CONST_TABLE_TRANSLATOR.COLUMN_START],
                      "score":values[index][CONST_TABLE_TRANSLATOR.COLUMN_INDEX.TOTAL - CONST_TABLE_TRANSLATOR.COLUMN_START],
                      "diff" :0};
    currentTranslators[translator["id"]] = translator;
  }

  return currentTranslators;
}

/**
 * Retrieve a list of the translators that show up in the leaderboard,
 * but not in the sheet.
 */
function extractNewTranslators(listFreshTranslators, mapOldTranslators) {
  return listFreshTranslators.filter(function (entry) { return !(entry["user_id"] in mapOldTranslators); });
}

/**
 * Add one new translator to the sheet.
 */
function addTranslator(user) {
  var sheet = getTranslatorsSheet();
  var index = sheet.getLastRow()+1;
  sheet.appendRow([user["name"],
                   user["user_id"],
                   user["score"],
                   // sum up the weekly contributions
                   "=SUM(OFFSET($A" + index + ", 0, 5, 1, 7))",
                   // sum up the monthly contributions
                   "=SUM(OFFSET($A" + index + ", 0, 5, 1, 30))",
                   user["score"]]);

  var range = sheet.getRange(index, 1, 1, sheet.getLastColumn());
  range.setBorder(true, true, true, true, true, true);

  range = sheet.getRange(index, 3, 1, 3);
  range.setBackground("#efefef");
}

/**
 * Add a new column that will store the word contributions
 * for the current day (latest GTC update versus previous one).
 */
function insertNewColumnDailyCount() {
  var sheet = getTranslatorsSheet();
  sheet.insertColumnBefore(CONST_TABLE_TRANSLATOR.COLUMN_INDEX.UPDATE);
  sheet.setColumnWidth(CONST_TABLE_TRANSLATOR.COLUMN_INDEX.UPDATE, 80)
  
  // insert date at the top
  var range = sheet.getRange(1, CONST_TABLE_TRANSLATOR.COLUMN_INDEX.UPDATE);
  range.setValue(getDateAsString());
  range.setFontWeight("bold");
  range.setBorder(true, true, true, true, null, null);
}

/**
 * Order translators by their total word count
 */
function orderTranslators() {
  var sheet = getTranslatorsSheet();

  var height = sheet.getLastRow() - CONST_TABLE_TRANSLATOR.ROW_START + 1;

  // no translators yet
  if (height <= 0) {
    return {};
  }

  var width = sheet.getLastColumn() - CONST_TABLE_TRANSLATOR.COLUMN_START + 1;

  var range = sheet.getRange(CONST_TABLE_TRANSLATOR.ROW_START, 1, height, width);
  range.sort({column: CONST_TABLE_TRANSLATOR.COLUMN_INDEX.TOTAL, ascending: false});
}

/**
 * Update the contributions of the translators that had
 * contributions in the previous days.
 */
function updateExistingTranslators(newUsers) {
  var sheet = getTranslatorsSheet();

  // last row that has a user
  var last = sheet.getLastRow();
  
  // no translators yet
  if (last == 1) {
    return;
  }

  var idRange = sheet.getRange(CONST_TABLE_TRANSLATOR.ROW_START, CONST_TABLE_TRANSLATOR.COLUMN_INDEX.ID, last -1, 1);
  var totalRange = sheet.getRange(CONST_TABLE_TRANSLATOR.ROW_START, CONST_TABLE_TRANSLATOR.COLUMN_INDEX.TOTAL, last -1, 1);
  var updateRange = sheet.getRange(CONST_TABLE_TRANSLATOR.ROW_START, CONST_TABLE_TRANSLATOR.COLUMN_INDEX.UPDATE, last -1, 1);
  
  var idValues = idRange.getValues();
  var totalValues = totalRange.getValues();
  var updateValues = updateRange.getValues();
  
  for (var i=0; i<last - 1; i++) {
    var id = idValues[i];
    
    // guaranteed to have entry, already checked in previous function
    var user = newUsers[id];
    
    totalValues[i][0] = user["score"];
    updateValues[i][0] = user["diff"];
  }
  totalRange.setValues(totalValues);
  updateRange.setValues(updateValues);
  updateRange.setBorder(true, true, true, true, null, null);
}

/**
 * Update the spreadsheet with the latest contributions.
 */
function updateTranslators() {
  var mapOldTranslators = getTranslatorsFromSheet();
  var listFreshTranslators = getTranslatorsFromGTC();

  var newTranslators = extractNewTranslators(listFreshTranslators, mapOldTranslators);

  insertNewColumnDailyCount();
  
  // update the already present translators
  listFreshTranslators.forEach(function (entry) {
    if (entry["user_id"] in mapOldTranslators) {
      var translator = mapOldTranslators[entry["user_id"]];

      // scores have been known to decrease due to bugs
      if (entry["score"] >= translator["score"]) {
        translator["diff"] = entry["score"] - translator["score"];
        translator["score"] = entry["score"];
      }
    }
  });
  updateExistingTranslators(mapOldTranslators);

  // add the new users to the sheet
  newTranslators.forEach(function (entry) { addTranslator(entry); } );

  orderTranslators();
}
