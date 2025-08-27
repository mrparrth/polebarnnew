const settings = {
  appName: 'Pole Barn Web App',
  emailAliasName: 'Ceed Civil Pole Barn Admin',
  exportDrive: '1XPwl5KDtLeoW-4TcGHr_1c6defz4BFn4',
  appUrl: 'https://script.google.com/macros/s/AKfycbx-WLlepdmgDRnS0s-kbDtVnQLGKUlt-11hb1Q6Er10/dev',
  testNewProject: false,
  testMode: false,
  createFbItems: true,
  presentationSendDelay: 2 * 60 * 60 * 1000,
  emailTos: {
    noPresentation: 'ryanhoover@ceedcivil.com,Mehta@ceedcivil.com',
    presentation: 'ryanhoover@ceedcivil.com,Mehta@ceedcivil.com',
    fieldChange: 'ceedcivil@gmail.com,RyanHoover@ceedcivil.com,Mehta@ceedcivil.com',
  },
  windCalcSheet: `https://docs.google.com/spreadsheets/d/1Tw2dkZkjcKvajTliYFWxYmFSmTPO5-u1iQa_U2yK2-s/edit`,
  outputDocFolder: `https://drive.google.com/drive/folders/1PIAkAnbwZIoH_jrq-RV3bBz-m-CSm72G`,
}

//https://script.google.com/macros/s/AKfycbwlMhk694ZaK0lvZ-QK_CRzBmAYCpLru11AcS3cxV42B5Qt3lANM0kARfFbAdv6xdi--A/exec
if (settings.testNewProject) {
  var CLIENT_ID = '841f323753d5f44eef3ac63b78b3ec685d81c0ce3bc4d7dbb138240269581840'
  var CLIENT_SECRET = 'e42aae8bb6428209a9bd2171419acd3a12fef133e16d859db58ec523fe57d3f9'
  var ACCOUNT_ID = 'Qp8dk6'
  var BUSINESS_ID = '4726317'
} else {
  var CLIENT_ID = 'edb8f237849b7c18ec91ee867644ba652c9e2478c1b09ea9e973d7bcc26bec83'
  var CLIENT_SECRET = '6b92ee6f1cdb69f7c6286004561dd1ad4e44bff6e17f2ebd89e8b8c8c67693a7'
  var ACCOUNT_ID = 'Qp8dk6'
  var BUSINESS_ID = '4726317'
}

if (settings.testMode) {
  var WIND_CALC_SLIDE = `https://docs.google.com/presentation/d/1apJuXIqwyFPkE-NcmVy91bzZuyTanzNmog4kqe5_jnM/edit`
  settings.appUrl = `https://script.google.com/macros/s/AKfycbx-WLlepdmgDRnS0s-kbDtVnQLGKUlt-11hb1Q6Er10/dev`
} else {
  var WIND_CALC_SLIDE = `https://docs.google.com/presentation/d/1QyOHy2kOWU03fmNT8aIy1yTsbTXnylDmLT-mKy7Oo1Y/edit` //TO DO - This is the original slide template
  settings.appUrl = `https://script.google.com/macros/s/AKfycbwlMhk694ZaK0lvZ-QK_CRzBmAYCpLru11AcS3cxV42B5Qt3lANM0kARfFbAdv6xdi--A/exec`
}
