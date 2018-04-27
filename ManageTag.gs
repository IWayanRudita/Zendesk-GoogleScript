function openTagsDialog() {
  var html = HtmlService.createHtmlOutputFromFile('TagsDialog')
  .setWidth(300)
  .setHeight(200);
  SpreadsheetApp.getUi() 
      .showModalDialog(html, 'Tags');
}

function processForm(formObject) {
  var ticketID = formObject.txtTicketID;
  var ticketTag = formObject.txtTag;   
  var data = '{ "tags": ["'+ ticketTag +'"] }';
  
  // Setup basic authentication so we can get and push data via API
  var unamepass = "agustinusrudita@gmail.com/token:CNckJvuaW7TVcozmpE73s2UH0R3X2orgqpcb374F";
  var digest = Utilities.base64Encode(unamepass);
  var digestfull = "Basic "+digest;
  var zendeskURL = "https://rudita.zendesk.com";
  var message;
  
  //Get existing Ticket's tag
  var getTicketTags = getAPIdata("/api/v2/tickets/" + ticketID + "/tags.json", zendeskURL, digestfull);
  
  //If ticket specified has tags then append existing tags list. otherwise create new list of tags
  if(getTicketTags.tags.length > 0)
  {
    message = putAPIdata("/api/v2/tickets/" + ticketID + "/tags.json", zendeskURL, digestfull, data);
  }
  else
  {
    message = postAPIdata("/api/v2/tickets/" + ticketID + "/tags.json", zendeskURL, digestfull, data);
  }
  
  return message;
}

// This function POST data to the Zendesk API using the parameters specified
function postAPIdata(apiAction, apiURL, apiAuth, data) {
 
  // Post tag data to the API via POST using the basic auth header
  var response = UrlFetchApp.fetch(apiURL + apiAction, 
  {
  method: "post",
  headers: {"Authorization": apiAuth},
  contentType : "application/json",
  payload: data
  });
  
  // Get API response
  var responseMessage = response.getContentText();
  
   
  return responseMessage;
}

// This function GETs data from the Zendesk API using the parameters specified
function getAPIdata(apiAction, apiURL, apiAuth) {
 
  // Grab Ticket data from the API via GET using the basic auth header
  var response = UrlFetchApp.fetch(apiURL + apiAction, 
  {
  method: "get",
  headers: {"Authorization": apiAuth}
  });
  
  // Get our ticket data
  var apiData = response.getContentText();
  
  // Convert that ticket data to a JSON object
  var apiObject = Utilities.jsonParse(apiData);
  
  return apiObject;
}

// This function PUT data to the Zendesk API using the parameters specified
function putAPIdata(apiAction, apiURL, apiAuth, data) {
 
  // Put tag data to the API via PUT using the basic auth header
  var response = UrlFetchApp.fetch(apiURL + apiAction, 
  {
  method: "put",
  headers: {"Authorization": apiAuth},
  contentType : "application/json",
  payload: data
  });
  
  // Get API response
  var responseMessage = response.getContentText();
  
   
  return responseMessage;
}
