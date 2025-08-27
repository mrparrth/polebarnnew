let RISK_CATEG_MAP = {
  1: 'Category I : Buildings and other structures that represent a low hazard to human life in ',
  2: 'Category II : All bldgs and other structures except those listed in Categories I, III, & IV ',
  3: 'Category III : Buildings and other structures that represent a substantial hazard to ',
  4: 'Category IV : Buildings and other structures designated as essential facilities ',
}

function generatePresentation(projectData) {
  let {
    siteAddress,
    city,
    state,
    country,
    zip,
    opbMainBldgPitch,
    opbSize,
    opbPostSize,
    riskCategory,
    windSpeed,
    exposureCategory,
  } = projectData

  projectData.fullAddress = [
    siteAddress.toProperCase(),
    city.toProperCase(),
    state.toProperCase(),
    country.toProperCase(),
    zip,
  ]
    .filter((addr) => !!addr)
    .join(', ')
  projectData.buildingType = 'Open Pole Barn'

  if (!['FL', 'FLORIDA'].includes(state.toUpperCase())) {
    console.log('Not a Florida project')
    return { isOpenPoleBarn: false, errors: ['Not a Florida project'] }
  }

  if (projectData.projectType !== 'typicalOpbOnly') {
    console.log('Not a typical open pole barn form')
    return { isOpenPoleBarn: false, errors: ['Not a typical open pole barn form'] }
  }

  if (!opbMainBldgPitch) {
    console.log('Not an open pole barn form - no pitch')
    return { isOpenPoleBarn: false, errors: ['Not an open pole barn form - no pitch'] }
  }

  if (!opbSize) {
    console.log('Not an open pole barn form')
    return { isOpenPoleBarn: false, errors: ['Not an open pole barn form'] }
  }

  const requiredFields = [
    'opbMainBldgPitch',
    'opbSize',
    'riskCategory',
    'windSpeed',
    'exposureCategory',
  ]

  let validationErrors = []

  // 1. Check for missing required fields
  requiredFields.forEach((field) => {
    if (!projectData[field] || projectData[field].toString().trim() === '') {
      validationErrors.push(`${field} is required but missing or empty`)
    }
  })

  // 2. Validate Risk Category
  if (!RISK_CATEG_MAP[riskCategory]) {
    validationErrors.push(
      `Risk category '${riskCategory}' is not valid. Must be one of: ${Object.keys(RISK_CATEG_MAP).join(', ')}`,
    )
  }

  // 3. Validate Pitch Format
  if (opbMainBldgPitch) {
    const pitchParts = opbMainBldgPitch.split('/')
    if (pitchParts.length !== 2) {
      validationErrors.push(
        `Main building pitch should be in format 'x/12', got: '${opbMainBldgPitch}'`,
      )
    } else {
      const pitchValue = parseInt(pitchParts[0])
      const pitchBase = parseInt(pitchParts[1])
      if (isNaN(pitchValue) || isNaN(pitchBase)) {
        validationErrors.push(`Pitch values must be numeric, got: '${opbMainBldgPitch}'`)
      } else if (pitchBase !== 12) {
        validationErrors.push(`Pitch base should be 12, got: '${pitchBase}'`)
      } else if (pitchValue <= 0) {
        validationErrors.push(`Pitch value must be positive, got: '${pitchValue}'`)
      }
    }
  }

  // 4. Validate Building Size Format (LxWxH)
  if (opbSize) {
    const sizeParts = opbSize.toLowerCase().split('x')
    if (sizeParts.length !== 3) {
      validationErrors.push(`Open pole barn size should be in format 'LxWxH', got: '${opbSize}'`)
    } else {
      const [length, width, height] = sizeParts
      const lengthNum = parseInt(length)
      const widthNum = parseInt(width)
      const heightNum = parseInt(height)

      if (isNaN(lengthNum) || isNaN(widthNum) || isNaN(heightNum)) {
        validationErrors.push(`Building dimensions must be numeric, got: '${opbSize}'`)
      } else if (lengthNum <= 0 || widthNum <= 0 || heightNum <= 0) {
        validationErrors.push(`Building dimensions must be positive values, got: '${opbSize}'`)
      }
    }
  }

  // 5. Validate Wind Speed Format
  if (windSpeed) {
    const windSpeedMatch = windSpeed.match(/^(\d+(?:\.\d+)?)(?:\s*(?:MPH|mph))?$/)
    if (!windSpeedMatch) {
      validationErrors.push(
        `Wind speed should be numeric (optionally followed by 'MPH'), got: '${windSpeed}'`,
      )
    } else {
      const windValue = parseFloat(windSpeedMatch[1])
      if (windValue <= 0) {
        validationErrors.push(`Wind speed must be positive, got: '${windValue}'`)
      }
    }
  }

  // 6. Validate Exposure Category
  if (exposureCategory) {
    const validExposureCategories = ['B', 'C', 'D']
    if (!validExposureCategories.includes(exposureCategory.toUpperCase())) {
      validationErrors.push(
        `Exposure category must be one of: ${validExposureCategories.join(', ')}, got: '${exposureCategory}'`,
      )
    }
  }

  if (!RISK_CATEG_MAP[riskCategory]) {
    validationErrors.push(`Risk category is not in ${Object.keys(RISK_CATEG_MAP)}`)
  }

  if (!opbMainBldgPitch) {
    validationErrors.push(`Open pole barn pitch is not defined`)
  } else if (opbMainBldgPitch.split('/').length < 2) {
    validationErrors.push(`The pitch should be in format of x/12`)
  }

  if (opbSize.toLowerCase().split('x').length < 3) {
    validationErrors.push(`The openpolebarnsize should be in format of wxlxh`)
  }

  if (validationErrors.length > 0) {
    const errorMessage = `Validation failed:\n${validationErrors.map((error) => `- ${error}`).join('\n')}`
    console.error(errorMessage)
    return { isOpenPoleBarn: true, errors: validationErrors, isFileCreated: false }
  }

  let [measure1, measure2, measure3] = opbSize.toLowerCase().split('x')
  let numMeasure1 = Number(measure1)
  let numMeasure2 = Number(measure2)
  let numMeasure3 = Number(measure3)

  let length = Math.max(numMeasure1, numMeasure2, numMeasure3)
  let height = Math.min(numMeasure1, numMeasure2, numMeasure3)
  let width = numMeasure1 + numMeasure2 + numMeasure3 - length - height

  let lock = LockService.getScriptLock()
  let rawData
  try {
    lock.tryLock(30000)

    let windCalcSs = SpreadsheetApp.openByUrl(settings.windCalcSheet)
    let shCode = windCalcSs.getSheetByName('Code')
    let pitch = opbMainBldgPitch.split('/')[0]
    shCode.getRange('E12').setValue(`Florida Building Code 2023`)
    shCode.getRange('RoofHt').setValue(`Utility & Miscellaneous`)
    shCode.getRange('G20').setValue(RISK_CATEG_MAP[riskCategory])
    shCode.getRange('F34').setValue(pitch)
    shCode.getRange('building_l').setValue(length)
    shCode.getRange('building_w').setValue(width)
    shCode.getRange('Roof_h').setValue(height)

    let shWind = windCalcSs.getSheetByName('Wind')
    shWind.getRange('wind_speed').setValue(windSpeed.toLowerCase().replace('mph', ''))
    shWind.getRange('G15').setValue(`Exposure ${exposureCategory}`)
    shWind.getRange('G16').setValue(`Open Building`)
    shWind.getRange('G22').setValue(`Gable`)
    let shOpenBarn = windCalcSs.getSheetByName('Open Bldg')
    shOpenBarn.getRange('roof_type').setValue('Pitched Free Roofs')
    shOpenBarn.getRange('wind_flow').setValue('Clear')

    SpreadsheetApp.flush()
    rawData = shOpenBarn.getRange('D61:K63').getValues()
  } catch (error) {
    console.error('Error processing wind calculation:', error)
    throw error
  } finally {
    lock.releaseLock()
  }

  let windAreas = ['wa1', 'wa2', 'wa3']
  let zones = ['z3', 'z2', 'z1']
  let pressureTypes = ['pos', 'neg']

  let flatData = {}

  for (let row = 0; row < rawData.length; row++) {
    flatData['WindArea' + (row + 1)] = rawData[row][0].replace(' sf', '').trim()
  }

  windAreas.forEach((wa, waIdx) => {
    zones.forEach((zone, zIdx) => {
      pressureTypes.forEach((type, tIdx) => {
        flatData[`${wa}.${zone}.${type}.ult`] =
          Math.round(rawData[waIdx][2 + zIdx * 2 + tIdx] * 100) / 100
        flatData[`${wa}.${zone}.${type}.asd`] =
          Math.round((rawData[waIdx][2 + zIdx * 2 + tIdx] / 1.6) * 100) / 100
      })
    })
  })

  flatData.riskCategoryRoman = new Array(riskCategory).fill(`I`).join('')

  let errors = []
  let trussData = _getTrussData_(width)
  if (Object.keys(trussData).length == 0) {
    errors.push(`There is no truss data for width : ${width}`)
  }

  //TODO: This is a temporary fix to ensure the post size is not too small for the width
  let chartData = _getChartData_(windSpeed, exposureCategory, width, height)
  let chartPostSize = chartData.postSize.split('x')
  let maxPostSize = Math.max(parseInt(chartPostSize[0]), parseInt(opbPostSize.split('x')[0]))
  chartData.postSize = `${maxPostSize}x${maxPostSize}`
  if (Object.keys(chartData).length == 0) {
    errors.push(
      `There is no chart data for Wind Speed - ${windSpeed}, Exposure ${exposureCategory}, Width - ${width}, Height - ${height}`,
    )
  }

  let allData = { ...projectData, ...flatData, ...trussData, ...chartData }
  allData.date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMMM dd, yyyy')

  let presOPB = _createNewSlideFromTemplate_(allData.clientName, allData.projectName)
  let slides = presOPB.getSlides()

  for (let slideNo = 0; slideNo < slides.length; slideNo++) {
    _replaceTemplateFieldsInShapes_(slides[slideNo], allData) //project data needs replacing in all the slides
    _replaceTemplateFieldsInTables_(slides[slideNo], allData)
    slides[slideNo].refreshSlide()
  }

  Utilities.sleep(3000)
  presOPB.saveAndClose()
  Utilities.sleep(3000)

  let pdfUrl = _convertPresToPDF_(presOPB)

  return {
    pdfUrl: pdfUrl.getUrl(),
    slideUrl: presOPB.getUrl(),
    errors,
    isFileCreated: true,
    isOpenPoleBarn: true,
  }
}

function _getChartData_(windSpeed, exposure, width, height) {
  windSpeed = parseInt(windSpeed.toLowerCase().replace('mph', ''))
  width = parseInt(width)
  height = parseInt(height)
  let shChartData = SpreadsheetApp.getActive().getSheetByName('ChartData')

  let chartData = _getItemsFromSheet_(shChartData) //, row => row.windSpeed == windSpeed && row.exposure == exposure && row.minEaveHeight == height

  let foundData = chartData.find(
    (row) =>
      row.windSpeed == (windSpeed <= 145 ? 145 : 160) &&
      row.exposure == exposure &&
      row.minWidth <= width &&
      row.maxWidth >= width &&
      row.minEaveHeight <= height &&
      row.maxEaveHeight >= height,
  )

  if (!foundData) {
    console.error(
      `Chart data is not found for ${JSON.stringify({ windSpeed, exposure, width, height })}`,
    )
    return {}
  }

  return foundData
}

function _getTrussData_(width) {
  width = parseInt(width)
  let shTruss = SpreadsheetApp.getActive().getSheetByName('TrussSizeDetails')
  let trussData = _getItemsFromSheet_(shTruss)

  let foundData = trussData.find((row) => width >= row.minWidth && width <= row.maxWidth)

  if (!foundData) {
    console.error(`Truss data is not found for width - ${width}`)
    return {}
  }

  return foundData
}

function _replaceTemplateFieldsInShapes_(slide, valueObject) {
  slide.getShapes().forEach((shape) => {
    let textRange = shape.getText()
    let mergeFields = _extractMergeFieldsFromRange_(textRange)
    if (!mergeFields) return

    mergeFields.forEach((mergeField) => {
      textRange.replaceAllText(`{{${mergeField}}}`, valueObject[mergeField] || '')
    })
  })
}

function _replaceTemplateFieldsInTables_(slide, valueObject, headerRows = 0) {
  slide.getTables().forEach((table, index) => {
    for (let r = 0; r < table.getNumRows(); r++) {
      // if (r == 0) continue //for development - it starts at second row

      for (let c = 0; c < table.getNumColumns(); c++) {
        try {
          let mergeState = table.getCell(r, c).getMergeState()
          if (
            !(
              mergeState == SlidesApp.CellMergeState.HEAD ||
              mergeState == SlidesApp.CellMergeState.NORMAL
            )
          )
            continue

          let textRange = table.getCell(r, c).getText()

          let mergeFields = textRange.asString().match(/\{\{([^{}]+)\}\}/g)
          if (!mergeFields) continue
          mergeFields
            .map((mergeField) => mergeField.substring(2, mergeField.length - 2))
            .forEach((mergeField) => {
              textRange.replaceAllText(`{{${mergeField}}}`, valueObject[mergeField] || '')
            })
        } catch (e) {
          console.log(e)
        }
      }
    }
  })
}

function _extractMergeFieldsFromRange_(textRange) {
  let mergeFields = textRange.asString().match(/\{\{([^{}]+)\}\}/g)
  if (!mergeFields) return

  return mergeFields.map((mergeField) => mergeField.substring(2, mergeField.length - 2))
}

function _createNewSlideFromTemplate_(clientName, projectName) {
  // return SlidesApp.openByUrl(`https://docs.google.com/presentation/d/1SkOoKng6CVNzzTCyMILGNIBfojG7qvP-Vzf09YgXOjA/edit`)
  let outputFolder = DriveApp.getFolderById(_getIdFromUrl_(settings.outputDocFolder))

  let documentName = `${clientName} - ${projectName} - ${Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm')}`
  let documentTemplate = DriveApp.getFileById(_getIdFromUrl_(WIND_CALC_SLIDE))

  let document = documentTemplate.makeCopy()
  document.moveTo(outputFolder)

  let outputDoc = SlidesApp.openById(document.getId())
  outputDoc.setName(documentName)

  return outputDoc
}

function _getIdFromUrl_(url) {
  const id = url.match(/[-\w]{25,}/)
  return id ? id[0] : null
}

function _convertPresToPDF_(presentation) {
  let url = `https://docs.google.com/presentation/d/${presentation.getId()}/export?format=pdf`
  console.log(url)
  let options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${ScriptApp.getOAuthToken()}`,
    },
  }

  let pdfBlob = UrlFetchApp.fetch(url, options).getBlob()

  pdfBlob.setName(presentation.getName() + '.pdf')

  const pdfFile = DriveApp.createFile(pdfBlob)

  DriveApp.getFileById(pdfFile.getId()).moveTo(
    DriveApp.getFolderById(_getIdFromUrl_(settings.outputDocFolder)),
  )

  // DriveApp.getFileById(presentation.getId()).setTrashed(true)

  return pdfFile
}

function testGenPresentations() {
  // _getTrussData_(20)
  let data = {
    connectslabtrussonly: '',
    addonsforwindowsquantitypartialyenclosedpolebarn: '',
    addonsleantopostsizepartialyenclosepolebarn: '',
    postspacingenclosedpole: '',
    addonsleantoopenpolebarnsize: '',
    projectname: 'KENNETH WOOTEN',
    connectslabopenpolebarn: 'OPTIONAL',
    maibbldgpitchopenpolebarn: '4/12',
    plywoodonroof: 'No',
    cname: 'Test Ken Wooten',
    overhangtype: 'standard',
    plywoodonsiding: 'No',
    country: 'UNITED STATES',
    addonsleantopartialyenclosedpolebarnsize: '',
    state: 'FL',
    overhangvalue: '',
    signature: 'TASHA MCKAY',
    addonsfordoorsquantitypartialyenclosedpolebarn: '',
    addonsforwindowsquantityenclosedpole: '',
    metalroofpanelgaugeenclosedpole: '',
    connectslabenclosedpole: '',
    connectslabpartialyenclosed: '',
    wetmapandseal: false,
    siteaddress: '601 EAST LAKESHORE BLVD',
    postsizeopenpolebarn: '8X8',
    addonsforwindowssizeenclosedpole: '',
    exposurecategory: 'C',
    maibbldgpitchtrussonly: '',
    postsizepartialyenclosed: '',
    postspacingopenpolebarn: "12'",
    openpolebarnsize: '30X36X12',
    projectid: '450.404',
    postsizeenclosedpole: '',
    windspeed: '160MPH',
    postspacingtrussonly: '',
    addonsfordoorssizeenclosedpole: '',
    postspacingpartialyenclosed: '',
    selectaddonsforwindows: false,
    addonsleantopostpitchopenpolebarn: '',
    enclosedpolesize: '',
    maibbldgpitchenclosedpole: '',
    additionalinformationnotes:
      '**DIGITAL SET OF TYPICAL OPEN POLE BARN PLANS WITH CUSTOMER DETAILS IN TITLE BLOCK\n**DIGITAL SET',
    addonsleantoenclosedpolepostsize: '',
    metalroofpanelgaugetrussonly: '',
    addonsleantopostsizeopenpolebarn: '',
    status: 'S&S',
    addonsleantoopenpolebarnpitch: '',
    trussonlysize: '',
    partialyenclosedsize: '',
    addonsleantopitchpartialyenclosedpolebarn: '',
    selectaddonsforleanto: false,
    metalroofpanelgaugepartialyenclosed: '',
    orderdate: '2025-05-16',
    riskcategory: '1',
    selectaddonsfordoors: false,
    postsizetrussonly: '',
    addonsfordoorsquantityenclosedpole: '',
    orderedby: 'TASHA MCKAY',
    zip: '34744',
    existingImages: [],
    studspacingcustomvalue: 'STANDARD SPACING',
    maibbldgpitchpartialyenclosed: '',
    addonsforwindowssizepartialyenclosedpolebarn: '',
    studspacing: 'custom',
    metalroofpanelgaugeopenpolebarn: '26',
    addonsfordoorssizepartialyenclosedpolebarn: '',
    city: 'KISSIMMEE',
    projectpricing: '180',
    driveFolder: 'https://drive.google.com/drive/folders/1Z6KgthfAoNgETBz1Q8XdWx4aUZvyjFPy',
    fBInvoiceNo: '0001976',
    fBInvoiceId: 970539,
    fbInvoiceLink:
      'https://my.freshbooks.com/#/link/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzeXN0ZW1pZCI6NTg3MTIzNSwiYWNjb3VudGlkIjoiUXA4ZGs2IiwidXNlcmlkIjoyMzQ0OTQsInR5cGUiOiJpbnZvaWNlIiwib2JqZWN0aWQiOiI5NzA1MzkiLCJleHAiOjE3Nzg5NDIzMzksImxldmVsIjowLCJidXNpbmVzc19pZCI6bnVsbCwiaWRlbnRpdHlfaWQiOm51bGx9.2UotjAR6fcvczBJTsbOxxz74ZrNHNFnLHRz7q4j_P5U?type=secondary&share_method=share_link',
  }

  console.log(generatePresentation(data))
}

function test2() {
  let slide = SlidesApp.openById('1m3QCKKvAy31S31A_ez4Dp6XhuB_bG2YCDrwvKGII5R8')
  console.log(DriveApp.getFileById('1m3QCKKvAy31S31A_ez4Dp6XhuB_bG2YCDrwvKGII5R8').getUrl())
  console.log(slide.getUrl())
}
