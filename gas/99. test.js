function testPdfGen() {
  // let rootFolder = DriveApp.getFolderById('1JsvErbd5LAb4qakBbzFUDNCzl4dBDQE3')
  // let folder = _getOrCreateFolder_(['InReview'], rootFolder.getId())
  // console.log(folder.getUrl())
  let data = new testApp().pdfGenData
  // let data = JSON.parse(testData)
  let { pdfUrl, slideUrl, errors, isStandardProject, isFileCreated } = generatePresentation(data)
  console.log({ pdfUrl, slideUrl, errors, isStandardProject, isFileCreated })
}

function testLeanToPresentation() {
  let data = new testApp().opbProjectData
  data.projectType = 'standardLeanTo'
  data.pepbSize = data.opbSize
  data.pepbMainBldgPitch = data.opbMainBldgPitch
  data.pepbPostSpacing = data.opbPostSpacing
  data.pepbPostSize = data.opbPostSize
  data.pepbMetalRoofPanelGauge = data.opbMetalRoofPanelGauge
  data.pepbConnectSlab = data.opbConnectSlab

  let { pdfUrl, slideUrl, errors, isStandardProject, isFileCreated } = generatePresentation(data)
  console.log({ pdfUrl, slideUrl, errors, isStandardProject, isFileCreated })
}

function testSingleSlopePresentation() {
  let data = new testApp().opbProjectData
  data.projectType = 'standardSingleSlope'
  data.exposureCategory = 'C'

  let { pdfUrl, slideUrl, errors, isStandardProject, isFileCreated } = generatePresentation(data)
  console.log({ pdfUrl, slideUrl, errors, isStandardProject, isFileCreated })
}

function testUpdateProject() {
  let data = { projectId: '450.981', riskCategory: '2', city: 'test2jan14' }

  let token = 'mjcwc1gn.pr'
  // newProject({ data, token })
  updateProject({ data, token })
}

function testFieldChangeEmail() {
  let data = new testApp().projectData

  let newData = { ...data }
  newData.price = 2
  newData.projectName = 'Test 2'
  sendFieldChangeEmail(data, newData, { user: { name: 'Test User' } })
}

function testGgeneratePresentation() {
  let data = new testApp().opbProjectData

  let exportData = generatePresentation(JSON.parse(data))
}

function testStatusChange() {
  let projectId = '999.33'
  let newStatus = 'For Review by BW'

  let app = new App()
  app.updateProjectStatus({ data: { projectId, newStatus } })
}

function testSendStatusChangeEmail() {
  let projectId = '450.461'
  let oldStatus = 'Rework'
  let newStatus = 'Approved by BW'
  let projectData = getDataByProjectName_(projectId)
  sendStatusChangeEmail(oldStatus, newStatus, projectData.data)
}

function testPresentationEmail() {
  createDelayedPresentationEmailTrigger({ data: new testApp().projectData })
  let trigger = {
    second: 14,
    minute: 54,
    hour: 17,
    timezone: 'UTC',
    month: 8,
    year: 2025,
    'week-of-year': 34,
    triggerUid: '954954836834452111',
  }

  executeDelayedPresentationEmail(trigger)
}

function updateAllProjects() {
  let activeSheet = SpreadsheetApp.getActive().getSheetByName('Submission')

  if (activeSheet.getName() !== 'Submission') {
    SpreadsheetApp.getUi().alert('Please select some rows in submission sheet and try again')
    return
  }

  let data = _getSheetValuesAsJson_(activeSheet)

  let updatedData = []
  for (let row of data) {
    if (!row.data.projectType || row.data.projectType == 'custom') {
      row.data.projectType = 'customPoleBarn'

      let rowData = Object.values(row)
      rowData[3] = JSON.stringify(rowData[3])
      rowData[4] = JSON.stringify(rowData[4])
      rowData.pop()

      updatedData.push(rowData)
    } else {
      console.log(row.data.projectId, row.data.projectType)
    }
  }
  let dataColumn = Object.keys(data[0]).indexOf('data') + 1

  if (dataColumn == 0) throw `Can't find data column!`

  if (data.length == 0) return
  activeSheet.getRange(2, 1, updatedData.length, updatedData[0].length).setValues(updatedData)
}

function testApp() {
  this.opbProjectData = JSON.parse(
    `{"signature":"12","windSpeed":"145MPH","projectName":"Test","epbConnectSlab":"","pepbPostSpacing":"","addOnWindowPepbSize":"","wetMapAndSeal":true,"addOnDoorEpbQty":"","trussConnectSlab":"","driveFolder":"https://drive.google.com/drive/u/0/folders/1ngT1I1dOlqlzjeoH7piYmuJJOxbpcw1Y","overhangType":"","pepbSize":"","overhangValue":"","pepbMainBldgPitch":"","pepbPostSize":"","trussMainBldgPitch":"","trussMetalRoofPanelGauge":"","addOnLeanToOpbPitch":"","addOnWindowSelected":false,"opbPostSpacing":"12'","riskCategory":"3","siteAddress":"98, Ninety Eight Cross","opbMetalRoofPanelGauge":"26g","addOnWindowEpbQty":"","opbPaperSold":"","orderDate":"2025-09-08","trussPostSize":"","addOnLeanToSelected":false,"addOnWindowPepbQty":"","pepbConnectSlab":"","existingImages":[],"addOnWindowEpbSize":"","addOnDoorPepbQty":"","singleSlopePaperSold":"","addOnLeanToPepbSlab":"","addOnLeanToEpbSlab":"","opbConnectSlab":"OPTIONAL","addOnLeanToPepbPostSize":"","projectType":"standardOpb","addOnLeanToEpbPostSize":"","epbMainBldgPitch":"","trussSize":"","epbMetalRoofPanelGauge":"","addOnLeanToEpbPitch":"","studSpacing":"","country":"","trussPostSpacing":"","price":"1","leanToPaperSold":"","plywoodOnSiding":"No","epbSize":"","studSpacingCustomValue":"","addOnLeanToOpbSize":"","state":"Florida","addOnLeanToOpbPostSize":"","zip":"560077","projectId":"999.33","addOnDoorPepbSize":"","orderedBy":"JESSIE CHANEY","plywoodOnRoof":"Yes","addOnLeanToEpbSize":"","epbPostSize":"","addOnLeanToPepbSize":"","opbSize":"12x12x12","city":"Bengaluru","epbPostSpacing":"","opbMainBldgPitch":"3/12","addOnDoorEpbSize":"","exposureCategory":"D","status":"For Review by BW","addOnLeanToOpbSlab":"","addOnDoorSelected":false,"clientName":"test test","pepbMetalRoofPanelGauge":"","opbPostSize":"12x12","additionalInformation":"Test","addOnLeanToPepbPitch":"","fullAddress":"98, Ninety Eight Cross, Bengaluru, Florida, 560077","buildingType":"Open Pole Barn","pdfUrl":"https://drive.google.com/file/d/1ejMW5RDUudTkC5NL6U6xT25Eljqaduwu/view?usp=drivesdk","oldstatus":"New Request"}`,
  )

  this.pdfGenData = {
    singleSlopePaperSold: '',
    addOnLeanToPepbSize: '',
    pepbMetalRoofPanelGauge: '',
    exposureCategory: 'B',
    epbMainBldgPitch: '',
    wetMapAndSeal: false,
    additionalInformation:
      "DIGITAL TYPICAL OPEN POLE BARN PLANS WITH CUSTOMER'S NAME, ADDRESS AND BARN SIZE IN TITLE BLOCK\nNO CUSTOM DETAILS",
    addOnLeanToPepbPitch: '',
    sketchData: [],
    trussPostSize: '',
    orderDate: '2025-10-13',
    opbPostSize: '8x8',
    projectId: '999.99',
    addOnDoorPepbQty: '',
    trussPostSpacing: '',
    projectSubtype: '',
    studSpacing: '',
    opbPaperSold: '',
    addOnWindowPepbSize: '',
    addOnDoorEpbSize: '',
    addOnDoorSelected: false,
    addOnLeanToPepbPostSize: '',
    addOnWindowEpbQty: '',
    driveFolder: '',
    addOnLeanToOpbPitch: '',
    epbSize: '',
    addOnLeanToSelected: false,
    existingImages: [],
    addOnWindowSelected: false,
    addOnDoorEpbQty: '',
    epbPostSize: '',
    pepbMainBldgPitch: '',
    addOnLeanToEpbPostSize: '',
    addOnLeanToEpbPitch: '',
    addOnWindowPepbQty: '',
    trussMetalRoofPanelGauge: '',
    clientName: 'FLORIDA POLE BARN',
    opbMainBldgPitch: '4/12',
    riskCategory: '1',
    windSpeed: '145MPH',
    trussMainBldgPitch: '',
    pepbPostSpacing: '',
    zip: '34488',
    opbPostSpacing: "10'",
    opbSize: '30x40x12',
    price: '180',
    orderedBy: 'JESSIE CHANEY',
    epbConnectSlab: '',
    projectName: 'BARRET MCRAE',
    epbMetalRoofPanelGauge: '',
    state: 'FL',
    addOnLeanToEpbSize: '',
    plywoodOnRoof: 'No',
    addOnLeanToOpbPostSize: '',
    addOnWindowEpbSize: '',
    leanToPaperSold: '',
    opbConnectSlab: 'OPTIONAL',
    overhangType: '',
    overhangValue: '',
    siteAddress: '16965 SE 6TH LN',
    pepbConnectSlab: '',
    signature: 'JESSIE CHANEY',
    addOnLeanToEpbSlab: '',
    trussSize: '',
    opbMetalRoofPanelGauge: '26g',
    addOnLeanToOpbSlab: '',
    addOnLeanToPepbSlab: '',
    addOnDoorPepbSize: '',
    projectType: 'standardOpb',
    status: 'New Request',
    studSpacingCustomValue: '',
    city: 'SILVER SPRINGS',
    epbPostSpacing: '',
    plywoodOnSiding: 'No',
    pepbSize: '',
    trussConnectSlab: '',
    addOnLeanToOpbSize: '',
    pepbPostSize: '',
    country: '',
  }

  this.customProjectData = {}
}

function test2() {
  let data = JSON.parse(
    `{"opbMetalRoofPanelGauge":"26g","addOnDoorPepbSize":"","addOnDoorSelected":false,"zip":"99999","city":"Test City","trussConnectSlab":"","trussPostSize":"","wetMapAndSeal":false,"opbPostSize":"6x6","epbPostSize":"","projectId":"450.691","pepbMetalRoofPanelGauge":"","siteAddress":"Test Street","addOnLeanToEpbSlab":"","driveFolder":"https://drive.google.com/drive/folders/1U-qRmMyJjVZZ3hrspknA8n8LoISY26-V","orderedBy":"jessie via email","opbSize":"12x12x12","epbMainBldgPitch":"","addOnLeanToEpbPostSize":"","opbConnectSlab":"Y","state":"FL","studSpacing":"","addOnDoorEpbQty":"","orderDate":"2026-06-23","pepbPostSize":"","plywoodOnRoof":"Yes","trussSize":"","singleSlopePaperSold":"","riskCategory":"3","epbSize":"","addOnLeanToOpbPostSize":"","trussPostSpacing":"","addOnLeanToSelected":false,"addOnDoorPepbQty":"","status":"New Request","pepbConnectSlab":"","trussMainBldgPitch":"","addOnLeanToPepbPostSize":"","addOnDoorEpbSize":"","pepbMainBldgPitch":"","projectName":"Chem-Stor - AZ - Cacls and Rev","clientName":"Test LastTest","addOnLeanToPepbSize":"","addOnLeanToPepbPitch":"","epbPostSpacing":"","opbMainBldgPitch":"4/12","projectSubtype":"","existingImages":[],"epbConnectSlab":"","epbMetalRoofPanelGauge":"","projectType":"standardSingleSlope","leanToPaperSold":"","trussMetalRoofPanelGauge":"","pepbSize":"","plywoodOnSiding":"Yes","pepbPostSpacing":"","addOnWindowEpbSize":"","country":"","addOnLeanToOpbSize":"","overhangType":"","windSpeed":"145MPH","addOnWindowEpbQty":"","signature":"sdfa","addOnWindowPepbQty":"","addOnLeanToPepbSlab":"","addOnLeanToEpbPitch":"","addOnWindowPepbSize":"","overhangValue":"","exposureCategory":"C","studSpacingCustomValue":"","addOnLeanToOpbSlab":"","opbPaperSold":"","addOnLeanToOpbPitch":"","opbPostSpacing":"1'","addOnWindowSelected":false,"additionalInformation":"Test","addOnLeanToEpbSize":"","price":"1","fullAddress":"Test Street, Test City, Alabama, 99999","buildingType":"Open Pole Barn","pdfUrl":""}`,
  )

  let leanToData = JSON.parse(
    `{"addOnDoorPepbQty":"","singleSlopePaperSold":"","clientName":"Test LastTest","addOnWindowEpbSize":"","country":"","overhangValue":"","orderedBy":"jessie via email","overhangType":"","addOnDoorEpbQty":"","addOnLeanToPepbSize":"","opbPaperSold":"","leanToPaperSold":"","riskCategory":"3","addOnDoorEpbSize":"","trussMainBldgPitch":"","addOnDoorSelected":false,"projectType":"standardLeanTo","status":"New Request","addOnLeanToEpbPitch":"","epbMetalRoofPanelGauge":"","opbPostSpacing":"","epbMainBldgPitch":"","addOnLeanToPepbSlab":"","pepbPostSize":"6x6","addOnLeanToOpbPostSize":"","addOnLeanToOpbSlab":"","addOnLeanToOpbPitch":"","addOnDoorPepbSize":"","addOnLeanToEpbSlab":"","additionalInformation":"","addOnLeanToEpbSize":"","trussSize":"","city":"Test City","opbPostSize":"","pepbConnectSlab":"Y","projectId":"450.697","windSpeed":"160 MPH","opbSize":"","addOnLeanToPepbPostSize":"","trussMetalRoofPanelGauge":"","opbMainBldgPitch":"","opbConnectSlab":"","addOnWindowEpbQty":"","addOnLeanToSelected":false,"epbConnectSlab":"","wetMapAndSeal":true,"trussConnectSlab":"","exposureCategory":"C","price":"1","trussPostSpacing":"","siteAddress":"Test Street","pepbSize":"12x12x12","pepbMetalRoofPanelGauge":"26g","studSpacing":"","orderDate":"2026-06-23","plywoodOnSiding":"No","projectName":"Chem-Stor - AZ - Cacls and Rev","projectSubtype":"","driveFolder":"https://drive.google.com/drive/folders/12IQtNRBGm5wjIqyh9u6hFABzZAMFf-pB","addOnLeanToEpbPostSize":"","existingImages":[],"addOnWindowPepbSize":"","signature":"sdfa","plywoodOnRoof":"Yes","epbPostSize":"","pepbMainBldgPitch":"4/12","trussPostSize":"","addOnWindowPepbQty":"","epbPostSpacing":"","pepbPostSpacing":"1'","epbSize":"","state":"Alabama","addOnLeanToOpbSize":"","addOnLeanToPepbPitch":"","zip":"99999","addOnWindowSelected":false,"opbMetalRoofPanelGauge":"","studSpacingCustomValue":"","fullAddress":"Test Street, Test City, Alabama, 99999","buildingType":"Lean To","pdfUrl":""}`,
  )
  newProject({ token: 'mqqb2o7u.69', data: leanToData })
}
