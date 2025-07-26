function testUpdateProject() {
  let data = { data: { "wetMapAndSeal": false, "pepbConnectSlab": "", "addOnLeanToSelected": false, "additionalInformation": "DIGITAL TYPICAL OPEN POLE BARN PLANS WITH CUSTOMER'S NAME, ADDRESS AND BARN SIZE IN TITLE BLOCK\nNO CUSTOM DETAILS", "epbMetalRoofPanelGauge": "", "files": [], "addOnLeanToPepbPitch": "", "overhangValue": "", "addOnLeanToPepbSize": "", "studSpacingCustomValue": "STANDARD", "pepbSize": "", "opbConnectSlab": "OPTIONAL", "country": "USA", "trussPostSpacing": "", "orderedBy": "JESSIE CHANEY", "addOnDoorPepbQty": "", "signature": "JESSIE CHANEY", "opbMetalRoofPanelGauge": "26", "opbPostSize": "6x6", "zip": "32043", "addOnLeanToOpbPostSize": "", "pepbMainBldGpitch": "", "epbMainBldGpitch": "", "addOnDoorEpbSize": "", "city": "GREEN COVE SPRINGS", "addOnDoorEpbQty": "", "exposureCategory": "B", "epbPostSize": "", "existingImages": [], "epbPostSpacing": "", "epbSize": "", "addOnDoorSelected": false, "addOnLeanToOpbSlab": "", "orderDate": "2025-06-17", "addOnLeanToEpbPostSize": "", "addOnLeanToEpbPitch": "", "riskCategory": "1", "addOnLeanToEpbSize": "", "trussConnectSlab": "", "pepbPostSpacing": "", "addOnLeanToPepbSlab": "", "siteAddress": "459 BRANSCOMB ROAD", "opbMainBldGpitch": "4/12", "plywoodOnRoof": "No", "addOnLeanToPepbPostSize": "", "status": "S&S", "windSpeed": "145 MPH", "addOnWindowSelected": false, "trussMainBldGpitch": "", "sketchData": [], "addOnLeanToOpbPitch": "", "pepbPostSize": "", "overhangType": "standard", "addOnLeanToOpbSize": "", "plywoodOnSiding": "No", "projectName": "CHARLES PACE", "projectId": "450.424", "clientName": "CHARLES PACE", "epbConnectSlab": "", "addOnWindowEpbSize": "", "trussSize": "", "opbSize": "24x24x10", "trussMetalRoofPanelGauge": "", "driveFolder": "https://drive.google.com/drive/folders/1e5eQapIs7RBne51pjmLtk0Uaf5RNUBg6", "addOnWindowEpbQty": "", "trussPostSize": "", "addOnWindowPepbQty": "", "addOnDoorPepbSize": "", "addOnLeanToEpbSlab": "", "opbPostSpacing": "12'", "addOnWindowPepbSize": "", "studSpacing": "custom", "pepbMetalRoofPanelGauge": "", "price": "180", "state": "FL" }, 'token': 'mdkbv1by.al' }
  let login = updateProject(data)
  console.log(login)
}
function testDrive() {
  console.log(getEmailDraft_('', 'New Project'))

  let statuses = ['New Project', 'For Review by BW', 'Approved by BW', 'S&S', 'Rework', 'Delivered']
  statuses.forEach(status => getGmailTemplateFromDrafts_(getEmailDraft_('', status).draftSubject))
  // updateProjectStatus('100.001', 'For Review by BW')
  // DriveApp.getFolderById('1XPwl5KDtLeoW-4TcGHr_1c6defz4BFn4')
}

function testNewProject() {
  getDataByProjectName_('450.227')
  let data = { "city": "xxxxx", "projectname": "xxxx", "addonsleantopostsizeopenpolebarn": "", "addonsleantopitchpartialyenclosedpolebarn": "", "maibbldgpitchpartialyenclosed": "", "postsizeopenpolebarn": "", "postspacingpartialyenclosed": "", "orderedby": "test", "metalroofpanelgaugetrussonly": "", "projectpricing": "1", "addonsleantopostpitchopenpolebarn": "", "signature": "test", "addonsforwindowsquantityenclosedpole": "", "country": "xxxx", "plywoodonsiding": "No", "addonsforwindowsquantitypartialyenclosedpolebarn": "", "connectslabopenpolebarn": "", "siteaddress": "xxxxx", "postspacingtrussonly": "", "addonsfordoorsquantityenclosedpole": "", "additionalinformationnotes": "sample", "windspeed": "145MPH", "state": "AL", "postsizepartialyenclosed": "", "addonsleantopostsizepartialyenclosepolebarn": "", "addonsleantosizepartialyenclosedpolebarn": "", "connectslabenclosedpole": "", "status": "Archived", "zip": "xxxx", "addonsfordoorssizepartialyenclosedpolebarn": "", "addonsforwindowssizepartialyenclosedpolebarn": "", "addonsleantoopenpolebarnpitch": "", "trussonlysize": "", "postspacingopenpolebarn": "", "addonsfordoorsquantitypartialyenclosedpolebarn": "", "openpolebarnsize": "", "orderdate": "2024-03-07", "postspacingenclosedpole": "", "addonsleantoopenpolebarnsize": "", "exposurecategory": "C", "connectslabtrussonly": "", "maibbldgpitchenclosedpole": "", "addonsforwindowssizeenclosedpole": "", "connectslabpartialyenclosed": "", "addonsfordoorssizeenclosedpole": "", "addonsleantopostsizeenclosedpole": "", "partialyenclosedsize": "", "cname": "test test", "metalroofpanelgaugeenclosedpole": "", "studspacing": "24", "studspacingcustomvalue": "0", "postsizetrussonly": "", "enclosedpolesize": "", "metalroofpanelgaugepartialyenclosed": "", "maibbldgpitchopenpolebarn": "", "postsizeenclosedpole": "", "maibbldgpitchtrussonly": "", "riskcategory": "1", "plywoodonroof": "No", "metalroofpanelgaugeopenpolebarn": "", "projectid": "450.981", "driveFolder": "https://drive.google.com/drive/folders/1kkZPcXA37fh6kWxtZ2Gvd6RGvK9hvS3V", "fBInvoiceNo": "0001344", "fBInvoiceId": 729497, "fbInvoiceLink": "https://my.freshbooks.com/#/link/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzeXN0ZW1pZCI6NTg3MTIzNSwiYWNjb3VudGlkIjoiUXA4ZGs2IiwidXNlcmlkIjoyMzQ0OTQsInR5cGUiOiJpbnZvaWNlIiwib2JqZWN0aWQiOiI3Mjk0OTciLCJleHAiOjE3NDEzMTEwMzIsImxldmVsIjowLCJidXNpbmVzc19pZCI6bnVsbCwiaWRlbnRpdHlfaWQiOm51bGx9.EsLE63ooNmsvvrl_PSlN0svPPgAfo9D8AUr1DUv29lU?type=secondary&share_method=share_link", "wetmapandseal": "off" }

  updateProject(data, 'm23hhitl.mw')
  // let cache = PropertiesService.getScriptProperties()
  // let currentProjectId = cache.getProperty('currentProjectId')
  // let [projectBase, projectPart] = currentProjectId.toString().split('.')
  // let newProjectId = projectBase + '.' + (parseInt(projectPart) + 1).toString()
  // cache.setProperty('currentProjectId', newProjectId)

  // data = { "maibbldgpitchenclosedpole": "", "addonsforwindowsquantityenclosedpole": "", "postsizepartialyenclosed": "", "addonsfordoorsquantityenclosedpole": "", "projectid": "450.00", "state": "FL", "partialyenclosedsize": "", "city": "LABELLE", "addonsleantoopenpolebarnpitch": "", "maibbldgpitchopenpolebarn": "4/12", "plywoodonroof": "No", "exposurecategory": "C", "metalroofpanelgaugeenclosedpole": "", "signature": "JAMES CRAFT", "postspacingenclosedpole": "", "addonsleantopitchpartialyenclosedpolebarn": "", "addonsforwindowsquantitypartialyenclosedpolebarn": "", "addonsfordoorsquantitypartialyenclosedpolebarn": "", "orderedby": "JAMES CRAFT", "addonsleantosizepartialyenclosedpolebarn": "", "addonsleantopostsizeopenpolebarn": "", "postspacingpartialyenclosed": "", "maibbldgpitchtrussonly": "", "postspacingtrussonly": "", "projectpricing": "0.01", "metalroofpanelgaugeopenpolebarn": "26G", "status": "Approved by BW", "addonsleantoopenpolebarnsize": "", "connectslabenclosedpole": "", "addonsleantopostsizeenclosedpole": "", "riskcategory": "1", "addonsfordoorssizepartialyenclosedpolebarn": "", "connectslabpartialyenclosed": "", "metalroofpanelgaugetrussonly": "", "postsizeenclosedpole": "", "cname": "JENNIFER AVILA", "addonsforwindowssizepartialyenclosedpolebarn": "", "addonsfordoorssizeenclosedpole": "", "trussonlysize": "", "studspacing": "24", "addonsforwindowssizeenclosedpole": "", "enclosedpolesize": "", "connectslabtrussonly": "", "maibbldgpitchpartialyenclosed": "", "addonsleantopostsizepartialyenclosepolebarn": "", "plywoodonsiding": "No", "addonsleantopostpitchopenpolebarn": "", "projectname": "Test Project", "orderdate": "2023-11-22", "postspacingopenpolebarn": "12", "studspacingcustomvalue": "n/a", "postsizeopenpolebarn": "6X6", "openpolebarnsize": "30X48X12", "zip": "33935", "additionalinformationnotes": "STANDARD OPEN POLE BARN PLANS / UPDATE CUSTOMER DETAILS IN TITLE BLOCK\n***PLEASE CHANGE PURLIN SPACING DETAIL TO 24\" OC FOR THIS SET OF PLANS***", "connectslabopenpolebarn": "OPTIONAL", "siteaddress": "1670 EVANS RD", "country": "USA", "postsizetrussonly": "", "metalroofpanelgaugepartialyenclosed": "" }
  // newProject(data, `ltg261vj.1t`)
}

function test() {
  let data = { "addonsforwindowsquantityenclosedpole": "", "status": "Accepted", "postspacingenclosedpole": "", "addonsforwindowssizeenclosedpole": "", "plywoodonroof": "Yes", "addonsleantopitchpartialyenclosedpolebarn": "", "addonsleantoopenpolebarnsize": "", "signature": "safd", "projectpricing": "0", "maibbldgpitchopenpolebarn": "safd", "postsizepartialyenclosed": "", "metalroofpanelgaugeopenpolebarn": "asfd", "postspacingtrussonly": "", "maibbldgpitchpartialyenclosed": "", "connectslabenclosedpole": "", "postspacingpartialyenclosed": "", "studspacingcustomvalue": "", "addonsfordoorssizepartialyenclosedpolebarn": "", "addonsleantopostsizeenclosedpole": "", "plywoodonsiding": "Yes", "riskcategory": "3", "siteaddress": "sadf", "addonsleantoopenpolebarnpitch": "", "addonsforwindowssizepartialyenclosedpolebarn": "", "additionalinformationnotes": "safd", "exposurecategory": "B", "studspacing": "24", "addonsleantopostpitchopenpolebarn": "", "country": "asdf", "maibbldgpitchtrussonly": "", "addonsleantopostsizeopenpolebarn": "", "orderedby": "sfad", "wetmapandseal": "on", "state": "asfd", "openpolebarnsize": "asdf", "metalroofpanelgaugepartialyenclosed": "", "cname": "Test", "addonsleantopostsizepartialyenclosepolebarn": "", "maibbldgpitchenclosedpole": "", "connectslabopenpolebarn": "asdf", "metalroofpanelgaugetrussonly": "", "addonsfordoorsquantitypartialyenclosedpolebarn": "", "orderdate": "2024-12-11", "addonsfordoorssizeenclosedpole": "", "city": "asdf", "addonsforwindowsquantitypartialyenclosedpolebarn": "", "zip": "asdf", "postsizetrussonly": "", "connectslabtrussonly": "", "postsizeopenpolebarn": "asdf", "postspacingopenpolebarn": "sadf", "addonsleantosizepartialyenclosedpolebarn": "", "postsizeenclosedpole": "", "enclosedpolesize": "", "trussonlysize": "", "projectname": "Tst", "windspeed": "145MPH", "metalroofpanelgaugeenclosedpole": "", "connectslabpartialyenclosed": "", "partialyenclosedsize": "", "addonsfordoorsquantityenclosedpole": "", "projectid": "450.282", "driveFolder": "https://drive.google.com/drive/folders/1x5pV5IVbVQWsvVqzkqR73aquxUMUjbe5", "fBInvoiceNo": "0001746", "fBInvoiceId": 879901, "fbInvoiceLink": "https://my.freshbooks.com/#/link/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzeXN0ZW1pZCI6NTg3MTIzNSwiYWNjb3VudGlkIjoiUXA4ZGs2IiwidXNlcmlkIjoyMzQ0OTQsInR5cGUiOiJpbnZvaWNlIiwib2JqZWN0aWQiOiI4Nzk5MDEiLCJleHAiOjE3NjQ3Nzg2ODMsImxldmVsIjowLCJidXNpbmVzc19pZCI6bnVsbCwiaWRlbnRpdHlfaWQiOm51bGx9.k-arYt9oSJtupxpFPhAiviVw1SabgY_nf74_0fCULU4?type=secondary&share_method=share_link" }

  updateProjectStatus('450.282', 'test')
}

function testInvoiceCreation() {
  let data = { "addonsleantopitchpartialyenclosedpolebarn": "", "metalroofpanelgaugeopenpolebarn": "29 GAUGE", "connectslabtrussonly": "", "postspacingenclosedpole": "", "addonsleantopostsizeopenpolebarn": "", "addonsforwindowssizepartialyenclosedpolebarn": "", "siteaddress": "PARCEL ID# 3707250000006.005", "partialyenclosedsize": "", "signature": "TASHA LEE", "maibbldgpitchpartialyenclosed": "", "plywoodonroof": "No", "addonsleantosizepartialyenclosedpolebarn": "", "maibbldgpitchopenpolebarn": "4/12", "postspacingopenpolebarn": "12", "trussonlysize": "", "state": "AL", "additionalinformationnotes": "ALABAMA STAMPED Typical open pole barn plan with customer name, address and barn size in title block\nPhysical copy", "orderedby": "TASHA LEE", "zip": "36544", "metalroofpanelgaugetrussonly": "", "addonsfordoorssizeenclosedpole": "", "addonsleantoopenpolebarnpitch": "", "postspacingpartialyenclosed": "", "addonsforwindowssizeenclosedpole": "", "postsizetrussonly": "", "addonsleantoslabopenpolebarnpitch": "N/A", "addonsfordoorssizepartialyenclosedpolebarn": "", "metalroofpanelgaugepartialyenclosed": "", "exposurecategory": "B", "addonsforwindowsquantitypartialyenclosedpolebarn": "", "addonsleantopostsizeenclosedpole": "", "metalroofpanelgaugeenclosedpole": "", "maibbldgpitchenclosedpole": "", "plywoodonsiding": "No", "addonsleantopostsizepartialyenclosepolebarn": "", "enclosedpolesize": "", "connectslabenclosedpole": "", "connectslabpartialyenclosed": "", "status": "Rework", "openpolebarnsize": "24X48X12", "orderdate": "2023-11-28", "studspacing": "custom", "addonsforwindowsquantityenclosedpole": "", "postsizeenclosedpole": "", "addonsfordoorsquantitypartialyenclosedpolebarn": "", "riskcategory": "1", "postspacingtrussonly": "", "addonsleantopostpitchopenpolebarn": "", "country": "UNTIED STATES", "projectname": "Test Project", "maibbldgpitchtrussonly": "", "postsizepartialyenclosed": "", "connectslabopenpolebarn": "N", "studspacingcustomvalue": "STANDARD SPACING", "postsizeopenpolebarn": "6X6", "city": "IRVINGTON", "projectpricing": "180", "addonsleantoopenpolebarnsize": "", "addonsfordoorsquantityenclosedpole": "", "cname": "NICHOLAS NASSAR", "projectid": "000.58", "driveFolder": "https://drive.google.com/drive/folders/1xm9wHCQRARnLM7Xg8Eqo4DH2D8A_iIn-" }
  let jsonInvoice = createFreshbooksInvoice(data)
  // let response = fbPostRequest_(`https://api.freshbooks.com/accounting/account/${ACCOUNT_ID}/invoices/invoices`, jsonInvoice)

  console.log(response)
}

function uploadAttachment() {
  var pdfUrl = "https://drive.google.com/uc?export=download&id=1tBHNFme6iCxLnY8URm8Jr8FhYzuFJj_z"
  var pdfBlob = UrlFetchApp.fetch(pdfUrl).getBlob();

  let fbEndpoint = `https://api.freshbooks.com/accounting/account/${ACCOUNT_ID}/documents`

  var uploadResponse = fbPostRequest_(fbEndpoint, pdfBlob, false)
  var documentId = JSON.parse(uploadResponse.getContentText()).response.result.document.document_id;

  Logger.log("Attachment uploaded. Document ID: " + documentId);
  return documentId;
}

// Example usage
// var existingDocumentId = uploadAttachment();

function testDocu() {
  console.log(ACCOUNT_ID)
}

function updateSheetWithFileNames() {
  // Open the active spreadsheet
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Submission");

  // Get all data from the sheet
  var data = sheet.getDataRange().getValues();

  // Find the index of the "Images" column
  var headers = data[0];
  var imagesColumnIndex = headers.indexOf("Images");

  if (imagesColumnIndex === -1) {
    Logger.log("Images column not found");
    return;
  }

  let startIndex = 200
  let endIndex = startIndex + 10
  // Loop through each row (skipping the header row)
  for (var i = startIndex; i < endIndex; i++) {
    var row = data[i];
    var imageData = row[imagesColumnIndex];

    if (imageData) {
      try {
        // Parse the JSON string
        var images = JSON.parse(imageData);
        if (images.length == 0) continue

        // Add file name to each image object
        images = images.map(function (image) {
          image.fileName = getFileNameFromUrl(image.url);
          return image;
        });

        // Convert the updated image data back to a JSON string
        var updatedImageData = JSON.stringify(images);

        // Update the cell in the sheet
        sheet.getRange(i + 1, imagesColumnIndex + 1).setValue(updatedImageData);
      } catch (error) {
        Logger.log("Error processing row " + (i + 1) + ": " + error);
      }
    }
  }

  Logger.log("Sheet updated successfully");
}

function getFileNameFromUrl(url) {
  // Extract the file ID from the URL
  var fileId = url.match(/[-\w]{25,}/);

  if (fileId && fileId[0]) {
    try {
      // Use the Drive API to get the file name
      var file = DriveApp.getFileById(fileId[0]);
      return file.getName();
    } catch (e) {
      Logger.log("Error accessing file: " + e);
      console.log(url)
      return null;
    }
  }

  return null
}


function testNewProject() {
  getDataByProjectName_('450.227')
  let data = { "city": "xxxxx", "projectname": "xxxx", "addonsleantopostsizeopenpolebarn": "", "addonsleantopitchpartialyenclosedpolebarn": "", "maibbldgpitchpartialyenclosed": "", "postsizeopenpolebarn": "", "postspacingpartialyenclosed": "", "orderedby": "test", "metalroofpanelgaugetrussonly": "", "projectpricing": "1", "addonsleantopostpitchopenpolebarn": "", "signature": "test", "addonsforwindowsquantityenclosedpole": "", "country": "xxxx", "plywoodonsiding": "No", "addonsforwindowsquantitypartialyenclosedpolebarn": "", "connectslabopenpolebarn": "", "siteaddress": "xxxxx", "postspacingtrussonly": "", "addonsfordoorsquantityenclosedpole": "", "additionalinformationnotes": "sample", "windspeed": "145MPH", "state": "AL", "postsizepartialyenclosed": "", "addonsleantopostsizepartialyenclosepolebarn": "", "addonsleantosizepartialyenclosedpolebarn": "", "connectslabenclosedpole": "", "status": "Archived", "zip": "xxxx", "addonsfordoorssizepartialyenclosedpolebarn": "", "addonsforwindowssizepartialyenclosedpolebarn": "", "addonsleantoopenpolebarnpitch": "", "trussonlysize": "", "postspacingopenpolebarn": "", "addonsfordoorsquantitypartialyenclosedpolebarn": "", "openpolebarnsize": "", "orderdate": "2024-03-07", "postspacingenclosedpole": "", "addonsleantoopenpolebarnsize": "", "exposurecategory": "C", "connectslabtrussonly": "", "maibbldgpitchenclosedpole": "", "addonsforwindowssizeenclosedpole": "", "connectslabpartialyenclosed": "", "addonsfordoorssizeenclosedpole": "", "addonsleantopostsizeenclosedpole": "", "partialyenclosedsize": "", "cname": "test test", "metalroofpanelgaugeenclosedpole": "", "studspacing": "24", "studspacingcustomvalue": "0", "postsizetrussonly": "", "enclosedpolesize": "", "metalroofpanelgaugepartialyenclosed": "", "maibbldgpitchopenpolebarn": "", "postsizeenclosedpole": "", "maibbldgpitchtrussonly": "", "riskcategory": "1", "plywoodonroof": "No", "metalroofpanelgaugeopenpolebarn": "", "projectid": "450.981", "driveFolder": "https://drive.google.com/drive/folders/1kkZPcXA37fh6kWxtZ2Gvd6RGvK9hvS3V", "fBInvoiceNo": "0001344", "fBInvoiceId": 729497, "fbInvoiceLink": "https://my.freshbooks.com/#/link/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzeXN0ZW1pZCI6NTg3MTIzNSwiYWNjb3VudGlkIjoiUXA4ZGs2IiwidXNlcmlkIjoyMzQ0OTQsInR5cGUiOiJpbnZvaWNlIiwib2JqZWN0aWQiOiI3Mjk0OTciLCJleHAiOjE3NDEzMTEwMzIsImxldmVsIjowLCJidXNpbmVzc19pZCI6bnVsbCwiaWRlbnRpdHlfaWQiOm51bGx9.EsLE63ooNmsvvrl_PSlN0svPPgAfo9D8AUr1DUv29lU?type=secondary&share_method=share_link", "wetmapandseal": "off" }

  updateProject(data, 'm23hhitl.mw')
  // let cache = PropertiesService.getScriptProperties()
  // let currentProjectId = cache.getProperty('currentProjectId')
  // let [projectBase, projectPart] = currentProjectId.toString().split('.')
  // let newProjectId = projectBase + '.' + (parseInt(projectPart) + 1).toString()
  // cache.setProperty('currentProjectId', newProjectId)

  // data = { "maibbldgpitchenclosedpole": "", "addonsforwindowsquantityenclosedpole": "", "postsizepartialyenclosed": "", "addonsfordoorsquantityenclosedpole": "", "projectid": "450.00", "state": "FL", "partialyenclosedsize": "", "city": "LABELLE", "addonsleantoopenpolebarnpitch": "", "maibbldgpitchopenpolebarn": "4/12", "plywoodonroof": "No", "exposurecategory": "C", "metalroofpanelgaugeenclosedpole": "", "signature": "JAMES CRAFT", "postspacingenclosedpole": "", "addonsleantopitchpartialyenclosedpolebarn": "", "addonsforwindowsquantitypartialyenclosedpolebarn": "", "addonsfordoorsquantitypartialyenclosedpolebarn": "", "orderedby": "JAMES CRAFT", "addonsleantosizepartialyenclosedpolebarn": "", "addonsleantopostsizeopenpolebarn": "", "postspacingpartialyenclosed": "", "maibbldgpitchtrussonly": "", "postspacingtrussonly": "", "projectpricing": "0.01", "metalroofpanelgaugeopenpolebarn": "26G", "status": "Approved by BW", "addonsleantoopenpolebarnsize": "", "connectslabenclosedpole": "", "addonsleantopostsizeenclosedpole": "", "riskcategory": "1", "addonsfordoorssizepartialyenclosedpolebarn": "", "connectslabpartialyenclosed": "", "metalroofpanelgaugetrussonly": "", "postsizeenclosedpole": "", "cname": "JENNIFER AVILA", "addonsforwindowssizepartialyenclosedpolebarn": "", "addonsfordoorssizeenclosedpole": "", "trussonlysize": "", "studspacing": "24", "addonsforwindowssizeenclosedpole": "", "enclosedpolesize": "", "connectslabtrussonly": "", "maibbldgpitchpartialyenclosed": "", "addonsleantopostsizepartialyenclosepolebarn": "", "plywoodonsiding": "No", "addonsleantopostpitchopenpolebarn": "", "projectname": "Test Project", "orderdate": "2023-11-22", "postspacingopenpolebarn": "12", "studspacingcustomvalue": "n/a", "postsizeopenpolebarn": "6X6", "openpolebarnsize": "30X48X12", "zip": "33935", "additionalinformationnotes": "STANDARD OPEN POLE BARN PLANS / UPDATE CUSTOMER DETAILS IN TITLE BLOCK\n***PLEASE CHANGE PURLIN SPACING DETAIL TO 24\" OC FOR THIS SET OF PLANS***", "connectslabopenpolebarn": "OPTIONAL", "siteaddress": "1670 EVANS RD", "country": "USA", "postsizetrussonly": "", "metalroofpanelgaugepartialyenclosed": "" }
  // newProject(data, `ltg261vj.1t`)
}