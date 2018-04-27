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

function getTicket() {
  //Display popup dialog to input TicketID to be retrieved
  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt(
      'Ticket Dialog',
      'Please enter Ticket ID:',
      ui.ButtonSet.OK_CANCEL);
  
  var button = result.getSelectedButton();
  var text = result.getResponseText();
  if (button == ui.Button.OK) {
    var ticketID = text;
    
     
  
    // Grab the active spreadsheet
    var ticket_spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Select the "Data" sheet and make it active
    var data_sheet = ticket_spreadsheet.getSheetByName("Data");
    ticket_spreadsheet.setActiveSheet(data_sheet);
    
    // Setup basic authentication so we can get data via API. We'll pass this data to our API function
    var unamepass = "agustinusrudita@gmail.com/token:CNckJvuaW7TVcozmpE73s2UH0R3X2orgqpcb374F";
    var digest = Utilities.base64Encode(unamepass);
    var digestfull = "Basic "+digest;
    var zendeskURL = "https://rudita.zendesk.com";
    
    // Let's create an array which will contain all the data we're going to dump into the spreadsheet
    var dataTable = new Array();
    
    // Get the ticket data for each record via API request
    var realTicketObject = getAPIdata("/api/v2/tickets/" + ticketID + ".json", zendeskURL, digestfull);
    
    // Grab the details for this ticket     
    var requesterId = realTicketObject.ticket.requester_id;
    var requesterName = realTicketObject.ticket.via.source.from.name;
    var email = realTicketObject.ticket.via.source.from.address;
    var ticketSubject = realTicketObject.ticket.subject;
    
    // Construct the current row of data for this ticket as an array and then push to our parent array
    var currentRow = [requesterName, email, requesterId, ticketSubject];
    dataTable.push(currentRow);      
    
    // Let's count the number of records in the table of data so we know how many rows to add
    var number_of_records = dataTable.length;
    
    // Now we append new rows to the data sheet for each record
    Logger.log(number_of_records);  
    var lastRow = data_sheet.getLastRow();
    data_sheet.insertRowsAfter(lastRow + 1, number_of_records);
    
    // The code below will set the values for range A1:D2 to the values in an array.
    data_sheet.getRange(lastRow + 1, 1, number_of_records, 4).setValues(dataTable);
  } 
  
}
