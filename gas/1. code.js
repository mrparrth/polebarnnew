const login = (payload) => new Auth().login(payload)

const webAppURL = () => ScriptApp.getService().getUrl()

const doGet = (e) =>
  HtmlService.createTemplateFromFile('index').evaluate().setTitle(settings.appName)

const newProject = ({ data, token }) => {
  console.log(JSON.stringify(data), token)

  let time = new Date()
  let userInfo = new Auth().login({ token })
  if (!userInfo.user) throw 'Invalid login. Please login again and try'

  let ss = SpreadsheetApp.getActive()
  let shSubmission = ss.getSheetByName('Submission')

  //generate new project id
  let cache = PropertiesService.getScriptProperties()
  let currentProjectId = cache.getProperty('currentProjectId')

  let [projectBase, projectPart] = currentProjectId.toString().split('.')
  let newProjectId = projectBase + '.' + (parseInt(projectPart) + 1).toString()
  cache.setProperty('currentProjectId', newProjectId)

  data.projectId = newProjectId
  let files = data.sketchData || []
  delete data.sketchData

  let driveFileUrls = []
  let folder = _getOrCreateFolder_(['Project - ' + data.projectId + ' ' + data.projectName])

  for (let file of files) {
    let fileData = Utilities.newBlob(
      Utilities.base64Decode(file.data),
      file.mimeType,
      file.fileName,
    )
    let driveFile = folder.createFile(fileData)
    driveFileUrls.push({ id: file.fileId, url: driveFile.getUrl(), name: file.fileName })
  }

  data.driveFolder = folder.getUrl()

  let fbInvoice = createFreshbooksInvoice(data)
  data.fBInvoiceNo = fbInvoice.response.result.invoice.invoice_number
  data.fBInvoiceId = fbInvoice.response.result.invoice.id

  if (!settings.testMode) shareInvoiceWithClient(data.fBInvoiceId)

  try {
    data.fbInvoiceLink = getSharableFBInvoiceLink(data.fBInvoiceId)
  } catch (e) {
    console.log(e)
  }

  try {
    let { pdfUrl, slideUrl, errors } = generatePresentation(data)

    data.presentationUrl = pdfUrl

    if (pdfUrl) {
      const subject = `PDF Generated - ${data.clientName} - ${data.projectName}`

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">
            PDF Generated Successfully
          </h2>

          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            Hello,
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            PDF has been generated for <strong>${data.clientName}</strong> - <strong>${data.projectName}</strong>
          </p>

          <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0 0 6px 0; font-weight: bold; color: #333;">Presentation URL:</p>
            <a href="${pdfUrl}" style="color: #007bff; text-decoration: none; word-break: break-all;">
              ${pdfUrl}
            </a>
            <p></p>
            <p style="margin: 0 0 6px 0; font-weight: bold; color: #333;">Slide URL (In case you want to make changes):</p>
            <a href="${slideUrl}" style="color: #007bff; text-decoration: none; word-break: break-all;">
              ${slideUrl}
            </a>
          </div>

          ${
            errors && errors.length > 0
              ? `
          <div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0 0 15px 0; font-weight: bold; color: #721c24;">
              ⚠️ Errors Encountered:
            </p>
            <ul style="margin: 0; padding-left: 20px; color: #721c24;">
              ${errors.map((error) => `<li style="margin-bottom: 5px;">${error}</li>`).join('')}
            </ul>
          </div>
          `
              : ''
          }

          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Pole Barn Report Generator Bot
          </p>
        </div>
      `

      // Send email
      if (!settings.testMode)
        MailApp.sendEmail({
          to: 'ryanhoover@ceedcivil.com,Mehta@ceedcivil.com', //'iamparrth@gmail.com,erparthas@gmail.com',
          subject: subject,
          htmlBody: htmlBody,
        })
    }
  } catch (e) {
    console.log(e)
  }

  shSubmission.appendRow([
    time,
    userInfo.user.email,
    data.projectId,
    JSON.stringify(data),
    JSON.stringify(driveFileUrls),
    data.status,
    data.price,
  ])

  let { draftSubject, to } = getEmailDraft_('', 'New Project')
  sendEmail(draftSubject, to, data)

  return { data, images: driveFileUrls }
}

const updateProject = ({ data, token }) => {
  console.log(JSON.stringify(data), token)

  let time = new Date()
  let userInfo = new Auth().login({ token })
  let ss = SpreadsheetApp.getActive()
  let files = data.sketchData || []
  let existingImages = data.existingImages || []
  delete data.sketchData
  delete data.existingImages

  let projectInfo = getDataByProjectName_(data.projectId)
  let row = projectInfo['_row_']

  let driveFileUrls = []
  let folder = _getOrCreateFolder_(['Project - ' + data.projectId + ' ' + data.projectName])

  for (let file of files) {
    let fileData = Utilities.newBlob(
      Utilities.base64Decode(file.data),
      file.mimeType,
      file.fileName,
    )
    let driveFile = folder.createFile(fileData)
    driveFileUrls.push({ id: file.fileId, url: driveFile.getUrl(), name: file.fileName })
  }

  for (let { id, url, name } of existingImages) {
    driveFileUrls.push({ id, url, name })
  }

  //updates the properties present in the sheet.
  let oldData = { ...projectInfo.data }
  let newData = { ...projectInfo.data, ...data }
  for (let property in data) {
    newData[property] = data[property]
  }

  let rowData = [
    time,
    userInfo.user.email,
    data.projectId,
    JSON.stringify(newData),
    JSON.stringify(driveFileUrls),
    data.status,
    data.price,
  ]
  console.log(`${row} - rowData ${JSON.stringify(rowData)}`)
  ss.getSheetByName('Submission').getRange(row, 1, 1, rowData.length).setValues([rowData])

  //Send email
  if (settings.testMode) return { data: newData, images: driveFileUrls }
  if (data.status && projectInfo.status !== data.status) {
    data.oldStatus = projectInfo.status
    let { draftSubject, to } = getEmailDraft_(data.oldStatus, data.status)

    if (draftSubject) {
      console.log(`Sending email with draft subject ${draftSubject} to ${to}`)
      sendEmail(draftSubject, to, data)
    }
  }

  console.log(newData.price)
  console.log(oldData.price)
  if (newData.price && newData.price != oldData.price) {
    console.log(`Sending email for project price change`)
    sendEmail(
      'Project Price Changed For {{projectId}}',
      'ceedcivil@gmail.com,RyanHoover@ceedcivil.com',
      { ...data, oldPrice: oldData.price, newPrice: newData.price },
    )
  }

  return { data: newData, images: driveFileUrls }
}

const updateProjectStatus = ({ data: { projectId, newStatus } }) => {
  console.log(`Updating ${projectId} with status ${newStatus}`)
  let project = getDataByProjectName_(projectId)
  let currentStatus = project.data.status

  project.data.status = newStatus
  project.status = newStatus

  let rowData = Object.values(project)
  rowData[3] = JSON.stringify(rowData[3])
  rowData[4] = JSON.stringify(rowData[4])
  rowData.pop()

  console.log(`Updating ${projectId} with status ${newStatus} at row ${project['_row_']}`)
  SpreadsheetApp.getActive()
    .getSheetByName('Submission')
    .getRange(project['_row_'], 1, 1, rowData.length)
    .setValues([rowData])

  if (currentStatus && currentStatus !== newStatus) {
    project.data.oldstatus = currentStatus

    let { draftSubject, to } = getEmailDraft_(currentStatus, newStatus)

    if (draftSubject) sendEmail(draftSubject, to, project.data)
  }
}

const getEmailDraft_ = (oldStatus, newStatus) => {
  let ss = SpreadsheetApp.getActive()
  let sh = ss.getSheetByName('Emails')
  let emailData = _getSheetValuesAsJson_(sh)

  let foundEmailDetail = emailData
    .filter(({ statusFrom, statusTo }) => !!statusFrom || !!statusTo)
    .find(
      ({ statusFrom, statusTo }) =>
        ['', 'all', oldStatus.toLowerCase()].includes(statusFrom.toLowerCase()) &&
        ['', 'all', newStatus.toLowerCase()].includes(statusTo.toLowerCase()),
    )

  return foundEmailDetail || {}
}

const getSubmissionData = (token) => {
  let userInfo = new Auth().login({ token })
  if (!userInfo) throw 'Timed Out, please log in again'

  let ss = SpreadsheetApp.getActive()

  let data = _getSheetValuesAsJson_(ss.getSheetByName('Submission'))

  let dashboardData = data.map(({ data, images }) => {
    return { data, images }
  })

  return dashboardData
}

class Auth {
  constructor() {
    this.ss = SpreadsheetApp.getActive()
    this.settings = settings
    this.shUser = this.ss.getSheetByName(this.settings.sheetNames.user)
  }

  validateLogin(cookie) {
    if (!cookie) return false
    let timeComponent36 = cookie.slice(0, cookie.indexOf('.'))
    let timeComponent = parseInt(timeComponent36, 36)
    let currTime = new Date().getTime()
    let msInHour = 1000 * 60 * 60
    let nHour = 24 //Expired after 25 hours

    if ((currTime - timeComponent) / msInHour > nHour) {
      return false
    } else {
      let user = this.getUserByToken(cookie)
      return !!user
    }
  }

  getUserByEmail(email) {
    email = email.trim().toLowerCase()
    return _getItemsFromSheet_(
      this.ss.getSheetByName(this.settings.sheetNames.user),
      (v) => v.email.trim().toLowerCase() === email,
    )[0]
  }

  getUserByToken(token) {
    token = token.trim().toLowerCase()
    return _getItemsFromSheet_(
      this.ss.getSheetByName(this.settings.sheetNames.user),
      (v) => v.currentToken.trim().toLowerCase() === token,
    )[0]
  }

  createToken() {
    let time = new Date().getTime()
    return time.toString(36) + '.' + Math.floor(Math.random() * 1000).toString(36)
  }

  updateUserToken(user) {
    let headers = this.shUser.getRange(`1:1`).getValues()[0]
    let tokenCol = headers.indexOf('Current Token')
    this.shUser.getRange(user._rowIndex, tokenCol + 1).setValue(user.currentToken)
  }

  login(loginInfo) {
    console.log(loginInfo)

    let { data: { email, password } = {}, token } = loginInfo
    if (token && token !== 'null') {
      const validToken = this.getUserByToken(token)
      if (!validToken) throw 'Invalid login'

      const tokenUser = this.getUserByEmail(validToken.email)
      if (!tokenUser) {
        tokenUser.currentToken = ''
        this.updateUserToken(tokenUser)
        return 'Invalid login'
      }

      if (!validToken) {
        tokenUser.currentToken = ''
        this.updateUserToken(tokenUser)
        return 'Invalid login'
      }
      let data = _getSheetValuesAsJson_(SpreadsheetApp.getActive().getSheetByName('Submission'))

      let dashboardData = data.map(({ data, images }) => {
        return { data, images }
      })

      delete tokenUser.password

      return {
        user: tokenUser,
        token,
        data: dashboardData,
      }
    }

    if (email && password) {
      const user = this.getUserByEmail(email)
      if (!user) throw new Error('User not found in the database.')
      if (user.password.toString() !== password.toString()) throw new Error('Invalid credentials!')

      delete user.password
      token = this.createToken()
      user.currentToken = token

      this.updateUserToken(user)
      let data = _getSheetValuesAsJson_(SpreadsheetApp.getActive().getSheetByName('Submission'))

      let dashboardData = data.map(({ data, images }) => {
        return { data, images }
      })

      return {
        user,
        token,
        data: dashboardData,
      }
    }

    return {
      user: null,
      token: null,
    }
  }
}

function getDataByProjectName_(projectId) {
  let ss = SpreadsheetApp.getActive()
  let shSubmission = ss.getSheetByName('Submission')
  let allData = _getSheetValuesAsJson_(shSubmission)
  let data = allData.find((row) => row.projectId == projectId)

  if (data.images)
    data.images = data.images.map(({ id, url, name }) => {
      return { id, url, name }
    }) //: _driveFileExportUrl_(url)
  return data
}

function markAsArchived() {
  let ss = SpreadsheetApp.getActive()
  let activeSheet = ss.getActiveSheet()

  if (activeSheet.getName() !== '_BU_Submission') {
    SpreadsheetApp.getUi().alert('Please select some rows in submission sheet and try again')
    return
  }

  let activeRng = activeSheet.getActiveRange()
  let activeRow = activeRng.getRow()
  let totalRows = activeRng.getNumRows()

  let data = _getSheetValuesAsJson_(activeSheet)
  let selectedData = data.slice(activeRow - 2, activeRow + totalRows - 2)
  let updatedData = []
  for (let row of selectedData) {
    Object.assign(row.data, { status: 'Archived' })
    updatedData.push([JSON.stringify(row.data)])
  }

  console.log(Object.keys(data[0]))
  let dataColumn = Object.keys(data[0]).indexOf('data') + 1
  let statusColumn = Object.keys(data[0]).indexOf('status') + 1

  if (dataColumn == 0 || statusColumn == 0) throw `Can't find data or status column!`

  if (updatedData.length == 0) return
  activeSheet.getRange(activeRow, dataColumn, totalRows, 1).setValues(updatedData)
  activeSheet.getRange(activeRow, statusColumn, totalRows, 1).setValue('Archived')
}

function generatePdfForRow() {
  let ss = SpreadsheetApp.getActive()
  let sh = ss.getSheetByName('Submission')
  let data = _getSheetValuesAsJson_(sh)
  if (ss.getActiveSheet().getName() !== 'Submission') return
  let activeRow = sh.getActiveRange().getRow()

  let dataRow = data.find((dr) => dr._row_ == activeRow)?.data
  if (!dataRow) return

  let { pdfUrl, slideUrl, errors } = generatePresentation(dataRow)

  if (pdfUrl) {
    const subject = `PDF Generated - ${dataRow.clientName} - ${dataRow.projectName}`

    const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">
            PDF Generated Successfully
          </h2>

          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            Hello,
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            PDF has been generated for <strong>${dataRow.clientName}</strong> - <strong>${dataRow.projectName}</strong>
          </p>

          <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0 0 6px 0; font-weight: bold; color: #333;">Presentation URL:</p>
            <a href="${pdfUrl}" style="color: #007bff; text-decoration: none; word-break: break-all;">
              ${pdfUrl}
            </a>
            <p></p>
            <p style="margin: 0 0 6px 0; font-weight: bold; color: #333;">Slide URL (In case you want to make changes):</p>
            <a href="${slideUrl}" style="color: #007bff; text-decoration: none; word-break: break-all;">
              ${slideUrl}
            </a>
          </div>

          ${
            errors && errors.length > 0
              ? `
          <div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0 0 15px 0; font-weight: bold; color: #721c24;">
              ⚠️ Errors Encountered:
            </p>
            <ul style="margin: 0; padding-left: 20px; color: #721c24;">
              ${errors.map((error) => `<li style="margin-bottom: 5px;">${error}</li>`).join('')}
            </ul>
          </div>
          `
              : ''
          }

          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Pole Barn Report Generator Bot
          </p>
        </div>
      `

    // Send email
    if (!settings.testMode)
      MailApp.sendEmail({
        to: 'ryanhoover@ceedcivil.com,Mehta@ceedcivil.com', //'iamparrth@gmail.com,erparthas@gmail.com',
        subject: subject,
        htmlBody: htmlBody,
      })
  }
  _openLink_(pdfUrl)
}

const includes = (e) => HtmlService.createHtmlOutputFromFile(e).getContent()
