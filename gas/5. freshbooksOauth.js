var SCOPE = 'user:profile:read user:invoices:write user:invoices:read'
//Actuals

/**
 * Authorizes and makes a request to the Freshbooks API.
 */
function fbGetRequest_(url) {
  let service = getService_()
  if (!validateService_(service)) throw 'Authorize using the prompt'

  let response = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: 'Bearer ' + service.getAccessToken(),
      'x-api-key': CLIENT_ID,
    },
  })

  return JSON.parse(response.getContentText())
}

function fbPostRequest_(url, jsonData, isJson = true) {
  let service = getService_()
  let options = {
    method: 'post',
    headers: { Authorization: 'Bearer ' + service.getAccessToken(), Accept: 'application/json' },
    contentType: 'application/json',
    payload: isJson ? JSON.stringify(jsonData) : jsonData,
    muteHtmlExceptions: true,
  }

  let response = UrlFetchApp.fetch(url, options)

  let result = JSON.parse(response.getContentText())
  // Logger.log(JSON.stringify(result, null, 2), false);
  return result
}

function fbPutRequest_(url, jsonData, isJson = true) {
  let service = getService_()
  let options = {
    method: 'put',
    headers: { Authorization: 'Bearer ' + service.getAccessToken(), Accept: 'application/json' },
    contentType: 'application/json',
    payload: isJson ? JSON.stringify(jsonData) : jsonData,
    muteHtmlExceptions: true,
  }

  let response = UrlFetchApp.fetch(url, options)

  let result = JSON.parse(response.getContentText())
  return result
}

/**
 * Reset the authorization state, so that it can be re-tested.
 */
function reset() {
  getService_().reset()
}

/**
 * Configures the service.
 */
function getService_() {
  var service = OAuth2.createService('Freshbooks')
    // Set the endpoint URLs.
    .setAuthorizationBaseUrl('https://auth.freshbooks.com/oauth/authorize')
    .setTokenUrl('https://auth.freshbooks.com/oauth/token')

    // Set the client ID and secret.
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)

    // Set the name of the callback function that should be invoked to
    // complete the OAuth flow.
    .setCallbackFunction('authCallback_')

    // Set the property store where authorized tokens should be persisted.
    .setPropertyStore(PropertiesService.getScriptProperties())

    // Set the scopes.
    .setScope(SCOPE)

  return service
}

function validateService_(service) {
  if (!service.hasAccess()) {
    var authorizationUrl = service.getAuthorizationUrl()
    var template = HtmlService.createTemplate(
      '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. ' +
        'Close sidebar when the authorization is complete.',
    )
    template.authorizationUrl = authorizationUrl
    var page = template.evaluate()
    try {
      SpreadsheetApp.getUi().showSidebar(page)
    } catch (e) {
      throw `Use this url to validate ${authorizationUrl}`
    }

    return false
  }

  return true
}

/**
 * Handles the OAuth callback.
 */
function authCallback_(request) {
  var service = getService_()
  var authorized = service.handleCallback(request)
  if (authorized) {
    return HtmlService.createHtmlOutput('Success! You can close this window')
  } else {
    return HtmlService.createHtmlOutput('Denied.')
  }
}

/**
 * Logs the redict URI to register in the Dropbox application settings.
 */
function logRedirectUri() {
  Logger.log(OAuth2.getRedirectUri())
}

function getAccessToken() {
  Logger.log(PropertiesService.getScriptProperties().getProperties())
}
