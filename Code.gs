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
  var RegExp = /^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/; 
  if(RegExp.test(url)){ 
    return true; 
  }else{ 
    return false; 
  } 
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
  var startdateTime = new Date(millis * 1);
  eventDetails[1] = startdateTime;
  var minsHours = timeLimit.split(' ')[1];
  var timeAmount = timeLimit.split(' ')[0];
  var end = (millis / 1000);
  if (minsHours == 'Minutes') {
    end = end + (timeAmount * 60);
  }
  if (minsHours == 'Hours') {
    end = end + (timeAmount * 3600);
  }
  var endDateTime = new Date(end * 1000);
  eventDetails.splice(2, 1);
  eventDetails.splice(3, 1);
  eventDetails.splice(2, 0,endDateTime);
  var options = {location: location, description: descriptionhtml, sendInvites: false};
  try {
    var cal = CalendarApp.getCalendarById(CALENDARID);
    var event = cal.createEvent(title, startdateTime, endDateTime, options)
    .setGuestsCanSeeGuests(false);
    var ss = SpreadsheetApp.openById(SPREADSHEETID);
    var sheet = ss.getSheetByName('events');
    var lastRow = sheet.getLastRow();
    var range = sheet.getRange(lastRow + 1, 1, 1, eventDetails.length);
    range.setValues([eventDetails]);
    return cal.getName();
  } catch(e) {
    Logger.log(e);
    return 'failed';
  }
}