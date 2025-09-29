function testLogin() {
  let authApp = new Auth()
  let test = authApp.login({ token: 'mdkbv1by.al' })
  debugger
}

function testPaperCopyProject() {
  let token = 'mdkbv1by.al'
  const data = { singleSlope: 10 }
  // let data = { "state": "Karnatak", "status": "", "clientName": "test test", "siteAddress": "28, First Floor, First Cross", "city": "Bengaluru", "projectType": "paperCopy", "singleSlopePaperSold": 9, "zip": "560077", "orderDate": "2025-09-06" }  // new project
  // newPaperCopyProject({ data, token })
  // let data = {"leanTo":{"qty":4}}  //update
  // updatePaperCopyStock({data, token})
  // let data = { openPoleBarn: 10, leanTo: 10 } //orderpapercopy
  orderPaperCopy({ data, token })
}

function testUpdateProject() {
  let data = JSON.parse(new testApp().opbProjectData)

  let token = 'mdkbv1by.al'
  newProject({ data, token })
  // updateProject({ data, token: 'mdkbv1by.al' })
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
  this.opbProjectData = `{"signature":"12","windSpeed":"145MPH","projectName":"Test","epbConnectSlab":"","pepbPostSpacing":"","addOnWindowPepbSize":"","wetMapAndSeal":true,"addOnDoorEpbQty":"","trussConnectSlab":"","driveFolder":"https://drive.google.com/drive/folders/1Y5Wti1TjX_WGAf2BzBx9CtaTQgAcWYd3","overhangType":"","pepbSize":"","overhangValue":"","pepbMainBldgPitch":"","pepbPostSize":"","trussMainBldgPitch":"","trussMetalRoofPanelGauge":"","addOnLeanToOpbPitch":"","addOnWindowSelected":false,"opbPostSpacing":"12'","riskCategory":"3","siteAddress":"28, First Floor, First Cross","opbMetalRoofPanelGauge":"26g","addOnWindowEpbQty":"","opbPaperSold":"","orderDate":"2025-09-08","trussPostSize":"","addOnLeanToSelected":false,"addOnWindowPepbQty":"","pepbConnectSlab":"","existingImages":[],"addOnWindowEpbSize":"","addOnDoorPepbQty":"","singleSlopePaperSold":"","addOnLeanToPepbSlab":"","addOnLeanToEpbSlab":"","opbConnectSlab":"OPTIONAL","addOnLeanToPepbPostSize":"","projectType":"typicalOpbOnly","addOnLeanToEpbPostSize":"","epbMainBldgPitch":"","trussSize":"","epbMetalRoofPanelGauge":"","addOnLeanToEpbPitch":"","studSpacing":"","country":"","trussPostSpacing":"","price":"1","leanToPaperSold":"","plywoodOnSiding":"No","epbSize":"","studSpacingCustomValue":"","addOnLeanToOpbSize":"","state":"Florida","addOnLeanToOpbPostSize":"","zip":"560077","projectId":"999.33","addOnDoorPepbSize":"","orderedBy":"JESSIE CHANEY","plywoodOnRoof":"Yes","addOnLeanToEpbSize":"","epbPostSize":"","addOnLeanToPepbSize":"","opbSize":"12x12x12","city":"Bengaluru","epbPostSpacing":"","opbMainBldgPitch":"3/12","addOnDoorEpbSize":"","exposureCategory":"D","status":"For Review by BW","addOnLeanToOpbSlab":"","addOnDoorSelected":false,"clientName":"test test","pepbMetalRoofPanelGauge":"","opbPostSize":"12x12","additionalInformation":"Test","addOnLeanToPepbPitch":"","fullAddress":"28, First Floor, First Cross, Bengaluru, Florida, 560077","buildingType":"Open Pole Barn","pdfUrl":"https://drive.google.com/file/d/1ejMW5RDUudTkC5NL6U6xT25Eljqaduwu/view?usp=drivesdk","oldstatus":"New Request"}`

  this.customProjectData = {}
}
