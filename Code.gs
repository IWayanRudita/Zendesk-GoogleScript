function onOpen() {  
  //Add Custom Menu to Spreadsheet 
  SpreadsheetApp.getUi().createMenu('Zendesk')
  .addItem('Get Ticket', 'getTicket')
  .addItem("Add Tag", "openTagsDialog")
  .addToUi();
};
