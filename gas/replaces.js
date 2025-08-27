function makeNewVersionOfData() {
  let json = {
    openpolebarnsize: 'opbSize',
    enclosedpolesize: 'epbSize',
    partialyenclosedsize: 'pepbSize',
    trussonlysize: 'trussSize',
    postspacingopenpolebarn: 'opbPostSpacing',
    postspacingenclosedpole: 'epbPostSpacing',
    postspacingpartialyenclosed: 'pepbPostSpacing',
    postspacingtrussonly: 'trussPostSpacing',
    postsizeopenpolebarn: 'opbPostSize',
    postsizeenclosedpole: 'epbPostSize',
    postsizepartialyenclosed: 'pepbPostSize',
    postsizetrussonly: 'trussPostSize',
    maibbldgpitchopenpolebarn: 'opbMainBldgPitch',
    maibbldgpitchenclosedpole: 'epbMainBldgPitch',
    maibbldgpitchpartialyenclosed: 'pepbMainBldgPitch',
    maibbldgpitchtrussonly: 'trussMainBldgPitch',
    metalroofpanelgaugeopenpolebarn: 'opbMetalRoofPanelGauge',
    metalroofpanelgaugeenclosedpole: 'epbMetalRoofPanelGauge',
    metalroofpanelgaugepartialyenclosed: 'pepbMetalRoofPanelGauge',
    metalroofpanelgaugetrussonly: 'trussMetalRoofPanelGauge',
    connectslabopenpolebarn: 'opbConnectSlab',
    connectslabenclosedpole: 'epbConnectSlab',
    connectslabpartialyenclosed: 'pepbConnectSlab',
    connectslabtrussonly: 'trussConnectSlab',
    selectaddonsfordoors: 'addOnDoorSelected',
    addonsfordoorsquantityenclosedpole: 'addOnDoorEpbQty',
    addonsfordoorssizeenclosedpole: 'addOnDoorEpbSize',
    addonsfordoorsquantitypartialyenclosedpolebarn: 'addOnDoorPepbQty',
    addonsfordoorssizepartialyenclosedpolebarn: 'addOnDoorPepbSize',
    selectaddonsforwindows: 'addOnWindowSelected',
    addonsforwindowsquantityenclosedpole: 'addOnWindowEpbQty',
    addonsforwindowssizeenclosedpole: 'addOnWindowEpbSize',
    addonsforwindowsquantitypartialyenclosedpolebarn: 'addOnWindowPepbQty',
    addonsforwindowssizepartialyenclosedpolebarn: 'addOnWindowPepbSize',
    selectaddonsforleanto: 'addOnLeanToSelected',
    addonsleantoopenpolebarnsize: 'addOnLeanToOpbSize',
    addonsleantoopenpolebarnpitch: 'addOnLeanToOpbPitch',
    addonsleantoslabopenpolebarnpitch: 'addOnLeanToOpbSlab',
    addonsleantopostsizeopenpolebarn: 'addOnLeanToOpbPostSize',
    addonsleantoenclosedpolepostsize: 'addOnLeanToEpbSize',
    addonsleantopostpitchopenpolebarn: 'addOnLeanToEpbPitch',
    addonsleantoslabenclosedpole: 'addOnLeanToEpbSlab',
    addonsleantopartialyenclosedpolebarnsize: 'addOnLeanToPepbSize',
    addonsleantopitchpartialyenclosedpolebarn: 'addOnLeanToPepbPitch',
    addonsleantoslabpartialyenclosepolebarn: 'addOnLeanToPepbSlab',
    addonsleantopostsizepartialyenclosepolebarn: 'addOnLeanToPepbPostSize',
    orderedby: 'orderedBy',
    signature: 'signature',
    orderdate: 'orderDate',
    additionalinformationnotes: 'additionalInformation',
    overhangtype: 'overhangType',
    overhangvalue: 'overhangValue',
    riskcategory: 'riskCategory',
    exposurecategory: 'exposureCategory',
    plywoodonsiding: 'plywoodOnSiding',
    plywoodonroof: 'plywoodOnRoof',
    windspeed: 'windSpeed',
    wetmapandseal: 'wetMapAndSeal',
    studspacing: 'studSpacing',
    studspacingcustomvalue: 'studSpacingCustomValue',
    projectpricing: 'price',
    projectname: 'projectName',
    siteaddress: 'siteAddress',
    cname: 'clientName',
    projectid: 'projectId',
  }
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  var shSubmission = spreadsheet.getSheetByName('Submission')

  var sheetData = shSubmission.getDataRange().getValues()
  let newSheetData = []
  for (var i = 1; i < sheetData.length; i++) {
    let dataRow = JSON.parse(sheetData[i][3])

    let newData = {}

    for (let key in dataRow) {
      if (json[key]) {
        newData[json[key]] = dataRow[key]
      } else {
        newData[key] = dataRow[key]
      }
    }

    newSheetData.push([JSON.stringify(newData)])
  }

  shSubmission.getRange(2, 4, newSheetData.length, newSheetData[0].length).setValues(newSheetData)

  Logger.log('Sheet updated successfully')
}
