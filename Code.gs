const SPREADSHEETID = "Insert your spreadsheet ID here";
const CALENDARID = "Insert your calendar ID here";

function doGet(request) {
  return HtmlService.createTemplateFromFile('Index')
      .evaluate();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function isValidURL(url){
  if (url.indexOf("https://silph.gg") > -1) {
    var RegExp = /^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/;
    if(RegExp.test(url)){
      return true;
    }
  }
  return false;
}

function getsilphPage(url) {
  //var url = 'https://silph.gg/t/tg9r';  //used for testing this function
  var content = UrlFetchApp.fetch(url).getContentText();
  //Extract the Event details from the page
  if (content.search('class="cupImage">') > -1) {
    var eventHTML = content.split('class="cupImage">')[1];
    eventHTML = eventHTML.split('</div>')[0];
  }
  //extract the Round Time Limit from the page and add it to the eventHTML
  if (content.search('Round Time Limit:</b>') > -1) {
    var timeHTML = content.split('Round Time Limit:</b>')[1];
    timeHTML = timeHTML.split('</tr>')[0].split('\n')[2].replace('</td>',"").trim();
    eventHTML = '<div id="eventDiv">' + eventHTML  + 
      '<p id="timeLimit">Round Time Limit: ' + timeHTML + '</p>'
      + '</div>';
  } else {
    eventHTML = '<div id="eventDiv">' + eventHTML + '</div>';
  }
  //Extract the description details from the page and add it to the eventHTML
  if (content.search('class="description">') > -1) {
    var descHTML = content.split('class="description">')[1];
    descHTML = descHTML.split('<div class="col-sm-4 col-sm-push-2 text-center"')[0];
    eventHTML = eventHTML + '<div><div id="descrpDIV">' + descHTML;
  }
  return eventHTML;
}

function createEvent(eventDetails) {
  var title = eventDetails[0];
  var millis = eventDetails[1];
  var timeLimit = eventDetails[2];
  var location =  eventDetails[3];
  var descriptionhtml = eventDetails[4];
  var descriptionTXT = eventDetails[5].replace(/[\n\r]\s*[\n\r]/g, '\n');
  var url = eventDetails[6];
  var ruleSet = eventDetails[7];
  var host = eventDetails[8];
  var startdateTime = new Date(millis * 1);
  eventDetails[1] = startdateTime;
  var timeAmount = getMilliSeconds(timeLimit);
  var end = (millis * 1) + timeAmount;
  var endDateTime = new Date(end);
  eventDetails.splice(4, 1);
  eventDetails.splice(3, 0,endDateTime);
  var options = {location: location, description: descriptionhtml, sendInvites: false};
  try {
    var cal = CalendarApp.getCalendarById(CALENDARID);
    var event = cal.createEvent(title, startdateTime, endDateTime, options)
    .setGuestsCanSeeGuests(false);
    var ss = SpreadsheetApp.openById(SPREADSHEETID);
    var sheet = ss.getSheetByName('Sheet1');
    var range = '';
    if (sheet.getLastRow()) {
      var lastRow = sheet.getLastRow();
      range = sheet.getRange(lastRow + 1, 1, 1, eventDetails.length);
    } else {
      var headings = ['Title','Start','RoundTime','End','Location','Description','URL','Ruleset','Host']; 
      sheet.appendRow(headings);
      range = sheet.getRange(2, 1, 1, eventDetails.length);
    }
    range.setValues([eventDetails]);
    return cal.getName();
  } catch(e) {
    Logger.log(e);
    return 'failed';
  }
}

function getMilliSeconds(str) {
  var minutes = 0,hours = 0,days = 0,totalSeconds = 0;
  str = str.toLowerCase().replace('minutes','minute')
                         .replace('hours','hour')
                         .replace('days','day');
  var array = str.split(' ');
  if (array.indexOf('minute') > -1) {
    var mIDX = array.indexOf('minute') - 1;
    minutes = array[mIDX];
    totalSeconds = minutes * 60;
  }
  if (array.indexOf('hour') > -1) {
    var mIDX = array.indexOf('hour') - 1;
    hours = array[mIDX];
    totalSeconds = totalSeconds + (hours * 3600);
  }
  if (array.indexOf('day') > -1) {
    var mIDX = array.indexOf('day') - 1;
    days = array[mIDX];
    totalSeconds = totalSeconds + (days * 86400);
  }
  var milliseconds = (totalSeconds * 4) * 1000;
  return milliseconds;
}