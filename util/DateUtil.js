/*
 * Support functionality for date generation.
 */

var MONTHS_STRINGS = {
   "1" : "JAN",
   "2" : "FEB",
   "3" : "MAR",
   "4" : "APR",
   "5" : "MAY",
   "6" : "JUN",
   "7" : "JUL",
   "8" : "AUG",
   "9" : "SEP",
  "10" : "OCT",
  "11" : "NOV",
  "12" : "DEC",
};

function getYesterdayAsString() {
  var today = new Date();
  var yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  var day = yesterday.getDate();
  var month = yesterday.getMonth()+1;
  var year = yesterday.getFullYear();
  
  return ""+year+"-"+month+"-"+day;
}

function getDateAsString() {
  var d = new Date();
  var day = d.getDate();
  var month = d.getMonth()+1;
  var year = d.getFullYear();
  
  return ""+year+"/"+month+"/"+day;
}

function getDateFromString(strDate) {
  var vect = strDate.split("-");
  return new Date(vect[0], vect[1], vect[2]);
}

function getHumanReadable(strDate) {
  var vect = strDate.split("-");
  return vect[2]+" "+MONTHS_STRINGS[vect[1]]+" "+vect[0];
}
