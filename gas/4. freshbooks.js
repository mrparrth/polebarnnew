function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚙️Custom Menu')
    .addItem('Validate Freshbooks Service', 'getAccountId')
    .addItem('Archive Selected Rows', 'markAsArchived')
    .addItem('Generate PDF for Selected Row', 'generatePdfForRow')
    .addToUi()
}

function getAccountId() {
  let response = fbGetRequest_('https://api.freshbooks.com/auth/api/v1/users/me')

  console.log('Your client id is ' + response['response']['roles'][1]['accountid'])
  console.log(
    'Your business id is ' + response['response']['business_memberships'][1]['business']['id'],
  )
}

function getFBClient(client) {
  Logger.log(JSON.stringify(client))
  let namesplit = client['client-name'].split(' ')
  let lastName, firstName
  if (namesplit.length > 1) {
    lastName = namesplit[namesplit.length - 1]
    firstName = client['client-name'].replace(' ' + lastName, '')
  } else {
    firstName = client['client-name']
  }

  let queryString = `https://api.freshbooks.com/accounting/account/${ACCOUNT_ID}/users/clients?search[email]=${client['client-email']}&search[fname_like]=${firstName}&search[lname_like]=${lastName}`
  Logger.log(queryString)
  let response = fbGetRequest_(queryString)

  if (response.response.result.total == 0) {
    return
  } else {
    return response.response.result.clients[0].id
  }
}

function createFBClient(client) {
  let namesplit = client['client-name'].split(' ')

  let lastName, firstName
  if (namesplit.length > 1) {
    lastName = namesplit[namesplit.length - 1]
    firstName = client['client-name'].replace(' ' + lastName, '')
  } else {
    firstName = client['client-name']
  }

  jsonClient = {
    client: {
      fname: firstName,
      lname: lastName,
      home_phone: client['client-phone'],
      email: client['client-email'],
      organization: client['client-company'],
      p_street: client['client-street'],
      p_city: client['client-city'],
      p_province: client['client-state'],
      p_code: client['client-zip'],
      p_country: 'United States',
      currency_code: 'USD',
      language: 'en',
    },
  }

  let response = fbPostRequest_(
    `https://api.freshbooks.com/accounting/account/${ACCOUNT_ID}/users/clients`,
    jsonClient,
  )

  return response.response.result.client.id
}

function createFBInvoice(data) {
  let jsonInvoice = createInvoiceJson(data)
  let response = fbPostRequest_(
    `https://api.freshbooks.com/accounting/account/${ACCOUNT_ID}/invoices/invoices`,
    jsonInvoice,
  )

  Logger.log(`Invoice Created ${response.response.result.invoice.id}`)
  return response.response.result.invoice.invoice_number
}

function createInvoiceJson(clientData) {
  let finalDict = {}
  let rootDict = {}
  let allItems = []
  let scopes = clientData['scopes']

  rootDict['customerid'] = clientData['clientId']
  rootDict['create_date'] = Utilities.formatDate(new Date(), 'UTC', 'yyyy-MM-dd')
  rootDict['terms'] = SpreadsheetApp.getActive().getSheetByName('Terms').getRange('A1').getValue()

  let individualItems = {}
  individualItems['type'] = 0
  individualItems['name'] = 'Info'
  individualItems['description'] =
    `Project ${clientData['project-number']} - ${clientData['project']}${clientData['upwork-job'] ? ' - Upwork Job' : ''}`
  individualItems['qty'] = 1
  individualItems['unit_cost'] = { amount: 0, code: 'USD' }
  allItems.push(individualItems)

  scopes.forEach((scope) => {
    let individualItems = {}
    individualItems['type'] = 0
    individualItems['name'] = scope.description
    individualItems['description'] = scope.detail
    individualItems['qty'] = 1
    individualItems['unit_cost'] = {
      amount: parseFloat(scope.rate.replace(/[$,]/g, '')) || 0,
      code: 'USD',
    }

    allItems.push(individualItems)
  })

  rootDict['lines'] = allItems
  finalDict['invoice'] = rootDict
  Logger.log(`Invoice data ${JSON.stringify(finalDict)}`)
  return finalDict
}

function getAllServices() {
  const response = fbGetRequest_(
    `https://api.freshbooks.com/comments/business/${BUSINESS_ID}/services`,
  )
  const services = response.services
  const arrServices = []

  for (let i = 0; i < services.length; i++) {
    let name = services[i].name
    let id = services[i].id
    arrServices.push({ name, id })
  }

  return arrServices
}

function createFBProject(data) {
  const jsonProject = createProjectJson(data)
  const response = fbPostRequest_(
    `https://api.freshbooks.com/projects/business/${BUSINESS_ID}/project`,
    jsonProject,
  )

  return response
}

function createProjectJson(clientData) {
  Logger.log(JSON.stringify(clientData))
  const finalDict = {}
  const rootDict = {}
  const allServices = []

  const serviceData = getAllServices()

  let scopes = clientData['scopes']

  rootDict['title'] = `${clientData['project-number']} - ${clientData['project']}`
  rootDict['client_id'] = clientData['clientId']
  rootDict['project_type'] = 'fixed_price'

  scopes.forEach((scope) => {
    let indivService = {}
    indivService['name'] = scope.description
    let serviceId = getServiceIdByName(serviceData, scope.description)
    if (serviceId) indivService['id'] = serviceId
    allServices.push(indivService)
  })

  rootDict['fixed_price'] = parseFloat(clientData['total_cost'].replace(/[$,]/g, ''))
  rootDict['services'] = allServices
  finalDict['project'] = rootDict

  console.log(finalDict)

  return finalDict
}

function getServiceIdByName(serviceData, scopeDesc) {
  let service = serviceData.find((service) => service.name == scopeDesc)
  if (service) return service.id
}

function createFreshbooksInvoice(data) {
  let settings = _getSettings_()
  let finalDict = {}
  let rootDict = {}
  let allItems = []

  rootDict['customerid'] = settings.testNewProject ? `242330` : `234494`

  rootDict['create_date'] = Utilities.formatDate(new Date(), 'UTC', 'yyyy-MM-dd')
  rootDict['terms'] =
    `Billing routing info:\n\nCHECKS:Mailing Address\n278 Cedar Lane #4017\nVienna, Va 22180\n\n\nWire Instructions:\nChase Wire Details:\nAccount number - 000000767187757\nRouting number - 322271627\nCeed Civil Engineering LLC\nDomestic wire code XXX00021\nBank name: JP Morgan chase bank\nAddress for wire: 383 Madison Ave, New York NY, 10017\n\n\nThank you for trusting Ceed Civil Engineering with your project.\n\n\nFull payment due upon start of project. Plansets, calculations and feasibility studies are custom-made and are not returnable. Any charge-backs or bounced checks have a 100% fee applied to include applicable banking fees and original charges. Any payments made are an acknowledgment and acceptance of these terms of service. Client to verify all requirements of this project with their jurisdiction prior to initiating this project.`
  rootDict['show_attachments'] = true
  rootDict['po_number'] = `${data.projectId} - ${data.clientName}`
  rootDict['attachments'] = [
    {
      filename: 'upload-4ee2a733d9d8f9de8d8be5d9b88ff6a32d5aa73e',
      public_id:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50Ijo1ODcxMjM1LCJvcmlnaW5hbF9maWxlbmFtZSI6IjQ1MC0xMjQwIFNvdXRoIEJsdmQucGRmIiwibGVuZ3RoIjozMzczNDcsImZpbGVuYW1lIjoidXBsb2FkLTRlZTJhNzMzZDlkOGY5ZGU4ZDhiZTVkOWI4OGZmNmEzMmQ1YWE3M2UiLCJidWNrZXQiOiJ1cGxvYWRzIiwia2V5IjoiJ2RvY3MtJy01ODcxMjM1L3VwbG9hZC00ZWUyYTczM2Q5ZDhmOWRlOGQ4YmU1ZDliODhmZjZhMzJkNWFhNzNlIiwidXVpZCI6ImI0ZDE4ZGU5LWQ4YjYtNDlmZC04MTMxLTJmNWZlOTY5N2RhOSJ9.zDRsSeqvfn-THeHebDT257VRHK39YaIA8kQ6oFH4TIQ',
      jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50Ijo1ODcxMjM1LCJvcmlnaW5hbF9maWxlbmFtZSI6IjQ1MC0xMjQwIFNvdXRoIEJsdmQucGRmIiwibGVuZ3RoIjozMzczNDcsImZpbGVuYW1lIjoidXBsb2FkLTRlZTJhNzMzZDlkOGY5ZGU4ZDhiZTVkOWI4OGZmNmEzMmQ1YWE3M2UiLCJidWNrZXQiOiJ1cGxvYWRzIiwia2V5IjoiJ2RvY3MtJy01ODcxMjM1L3VwbG9hZC00ZWUyYTczM2Q5ZDhmOWRlOGQ4YmU1ZDliODhmZjZhMzJkNWFhNzNlIiwidXVpZCI6ImI0ZDE4ZGU5LWQ4YjYtNDlmZC04MTMxLTJmNWZlOTY5N2RhOSJ9.zDRsSeqvfn-THeHebDT257VRHK39YaIA8kQ6oFH4TIQ',
      media_type: 'application/pdf',
      uuid: 'b4d18de9-d8b6-49fd-8131-2f5fe9697da9',
    },
  ]

  let individualItems = {}
  individualItems['type'] = 0
  individualItems['name'] = 'Info'
  individualItems['description'] =
    `Project ${data['projectId']} - Backwoods Buildings & Truss LLC - Open Contract`
  individualItems['qty'] = 1
  individualItems['unit_cost'] = { amount: '0', code: 'USD' }
  allItems.push(individualItems)

  individualItems = {}
  individualItems['type'] = 0
  individualItems['name'] = `Basic Building Plan Set`
  individualItems['description'] = data['projectName']
  individualItems['qty'] = 1
  individualItems['unit_cost'] = {
    amount: `${parseFloat(data['price'].replace(/[$,]/g, '') || 0)}`,
    code: 'USD',
  }

  allItems.push(individualItems)

  rootDict['lines'] = allItems
  finalDict['invoice'] = rootDict

  let response = fbPostRequest_(
    `https://api.freshbooks.com/accounting/account/${ACCOUNT_ID}/invoices/invoices`,
    finalDict,
  )
  Logger.log(`Invoice Created ${response.response.result.invoice.invoice_number}`)

  return response
}

function shareInvoiceWithClient(invoiceId) {
  let settings = _getSettings_()
  let emailTo = settings.testNewProject ? 'iamparrth@gmail.com' : 'sales@backwoodsbuildings.net'

  console.log(`Sharing invoice id with ${invoiceId}`)

  let emailObject = {
    invoice: {
      email_recipients: [emailTo],
      email_include_pdf: true,
      invoice_customized_email: {
        subject: '::company name:: has sent you an invoice (::invoice number::)',
        body: "::company name:: sent you invoice (::invoice number::) for ::invoice amount:: that's due on ::invoice due date::",
      },
      action_email: true,
    },
  }

  let freshBooksEndPoint = `https://api.freshbooks.com/accounting/account/${ACCOUNT_ID}/invoices/invoices/${invoiceId}?include[]=direct_links`

  let response = fbPutRequest_(freshBooksEndPoint, emailObject)

  return response
}

function getSharableFBInvoiceLink(invoiceId) {
  let freshBooksEndPoint = `https://api.freshbooks.com/accounting/account/${ACCOUNT_ID}/invoices/invoices/${invoiceId}/share_link?share_method=share_link`

  let response = fbGetRequest_(freshBooksEndPoint)

  return response.response.result.share_link.share_link
}

function testShareInvoice() {
  // console.log(JSON.stringify(shareInvoiceWithClient('696078')))
  console.log(JSON.stringify(getSharableFBInvoiceLink('697862')))
}
