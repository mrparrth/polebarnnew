const RISK_CATEG_MAP = {
  1: 'Category I : Buildings and other structures that represent a low hazard to human life in ',
  2: 'Category II : All bldgs and other structures except those listed in Categories I, III, & IV ',
  3: 'Category III : Buildings and other structures that represent a substantial hazard to ',
  4: 'Category IV : Buildings and other structures designated as essential facilities ',
}

const STRUCTURE_STRATEGIES = {
  standardOpb: {
    isMatch: (projectType) => projectType === 'standardOpb',
    fieldMap: { pitch: 'opbMainBldgPitch', size: 'opbSize' },
    buildingType: 'Open Pole Barn',
    validationFields: [
      'opbMainBldgPitch',
      'opbSize',
      'riskCategory',
      'windSpeed',
      'exposureCategory',
    ],
    configureInputs: (shCode, shWind, data, dims) => {
      let numericalPitch = dims.pitch.split('/')[0]
      shCode.getRange('E12').setValue('Florida Building Code 2023')
      shCode.getRange('RoofHt').setValue('Utility & Miscellaneous')
      shCode.getRange('G20').setValue(RISK_CATEG_MAP[data.riskCategory])
      shCode.getRange('F34').setValue(numericalPitch)
      shCode.getRange('building_l').setValue(dims.length)
      shCode.getRange('building_w').setValue(dims.width)
      shCode.getRange('Roof_h').setValue(dims.height)

      shWind.getRange('wind_speed').setValue(data.windSpeed.toLowerCase().replace('mph', ''))
      shWind.getRange('G15').setValue(`Exposure ${data.exposureCategory}`)
      shWind.getRange('G16').setValue('Open Building')
      shWind.getRange('G22').setValue('Gable')

      let shOpenBarn = shCode.getParent().getSheetByName('Open Bldg')
      shOpenBarn.getRange('roof_type').setValue('Pitched Free Roofs')
      shOpenBarn.getRange('wind_flow').setValue('Clear')
    },
    extractCalculatedData: (ss) => {
      let shOpenBldg = ss.getSheetByName('Open Bldg')
      let rawData = shOpenBldg.getRange('D61:K63').getValues()
      let windAreas = ['wa1', 'wa2', 'wa3']
      let zones = ['z3', 'z2', 'z1']
      let pressureTypes = ['pos', 'neg']

      let flatData = {}
      rawData.forEach((row, rIdx) => {
        if (row && row[0]) {
          flatData['WindArea' + (rIdx + 1)] = row[0].toString().replace(' sf', '').trim()
        }

        zones.forEach((zone, zIdx) => {
          pressureTypes.forEach((type, tIdx) => {
            let rawVal = row ? row[2 + zIdx * 2 + tIdx] : 0
            let val = parseFloat(rawVal) || 0
            flatData[`${windAreas[rIdx]}.${zone}.${type}.ult`] = Math.round(val * 100) / 100
            flatData[`${windAreas[rIdx]}.${zone}.${type}.asd`] = Math.round((val / 1.6) * 100) / 100
          })
        })
      })
      return flatData
    },
  },
  standardLeanTo: {
    isMatch: (projectType) => projectType === 'leanToOnly',
    fieldMap: { pitch: 'pepbMainBldgPitch', size: 'pepbSize' },
    buildingType: 'Lean-To',
    validationFields: [
      'pepbMainBldgPitch',
      'pepbSize',
      'riskCategory',
      'windSpeed',
      'exposureCategory',
    ],
    configureInputs: (shCode, shWind, data, dims) => {
      let numericalPitch = dims.pitch.split('/')[0]
      shCode.getRange('E12').setValue('Florida Building Code 2023')
      shCode.getRange('G20').setValue(RISK_CATEG_MAP[data.riskCategory])
      shCode.getRange('F34').setValue(numericalPitch)
      shCode.getRange('building_l').setValue(dims.length)
      shCode.getRange('building_w').setValue(dims.width)
      shCode.getRange('Roof_h').setValue(dims.height)

      shWind.getRange('wind_speed').setValue(data.windSpeed.toLowerCase().replace('mph', ''))
      shWind.getRange('G15').setValue(`Exposure ${data.exposureCategory}`)
      shWind.getRange('G16').setValue('Partially Enclosed')
      shWind.getRange('G22').setValue('MonoSlope')
    },
    extractCalculatedData: (ss) => {
      let shOpenBldg = ss.getSheetByName('C&C')
      let rawRoofData = shOpenBldg.getRange('I19:L22').getValues()
      let rawWallData = shOpenBldg.getRange('I46:L47').getValues()

      let flatData = {}
      rawRoofData.forEach((roofRow, index) => {
        let pressureType = index == 3 ? `pos` : `neg${index + 1}`
        flatData[`r.10sf.${pressureType}.ult`] = Math.round(roofRow[0] * 100) / 100
        flatData[`r.10sf.${pressureType}.asd`] = Math.round((roofRow[0] / 1.6) * 100) / 100
        flatData[`r.100sf.${pressureType}.ult`] = Math.round(roofRow[2] * 100) / 100
        flatData[`r.100sf.${pressureType}.asd`] = Math.round((roofRow[2] / 1.6) * 100) / 100
      })

      rawWallData.forEach((roofRow, index) => {
        let pressureType = index == 2 ? `pos` : `neg${index + 1}`
        flatData[`w.10sf.${pressureType}.ult`] = Math.round(roofRow[0] * 100) / 100
        flatData[`w.10sf.${pressureType}.asd`] = Math.round((roofRow[0] / 1.6) * 100) / 100
        flatData[`w.100sf.${pressureType}.ult`] = Math.round(roofRow[2] * 100) / 100
        flatData[`w.100sf.${pressureType}.asd`] = Math.round((roofRow[2] / 1.6) * 100) / 100
      })

      return flatData
    },
  },
}

function generatePresentation(projectData) {
  let settings = _getSettings_()
  const strategy = Object.values(STRUCTURE_STRATEGIES).find((s) =>
    s.isMatch(projectData.projectType),
  )

  if (!strategy) {
    return { isOpenPoleBarn: false, errors: ['Unsupported or missing project type'] }
  }

  // Modifying projectData with fullAddress exactly like earlier
  projectData.fullAddress = [
    projectData.siteAddress?.toProperCase(),
    projectData.city?.toProperCase(),
    projectData.state?.toProperCase(),
    projectData.country?.toProperCase(),
    projectData.zip,
  ]
    .filter(Boolean)
    .join(', ')
  projectData.buildingType = strategy.buildingType

  if (!['FL', 'FLORIDA'].includes(projectData.state?.toUpperCase())) {
    console.log('Not a Florida project')
    return { isOpenPoleBarn: false, errors: ['Not a Florida project'] }
  }

  const sizeKey = strategy.fieldMap.size
  const pitchKey = strategy.fieldMap.pitch
  const [width, length, height] = (projectData[sizeKey] || '').toLowerCase().split('x')
  const pitch = projectData[pitchKey]

  let validationErrors = _validateInputs_(projectData, strategy, sizeKey, pitchKey)
  if (validationErrors.length > 0) {
    console.error(`Validation failed:\n${validationErrors.map((e) => `- ${e}`).join('\n')}`)
    return { isOpenPoleBarn: true, errors: validationErrors, isFileCreated: false }
  }

  let lock = LockService.getScriptLock()
  let flatData
  try {
    lock.tryLock(30000)
    let windCalcSs = SpreadsheetApp.openByUrl(settings.windCalcSheet)

    strategy.configureInputs(
      windCalcSs.getSheetByName('Code'),
      windCalcSs.getSheetByName('Wind'),
      projectData,
      { width, length, height, pitch },
    )

    SpreadsheetApp.flush()
    flatData = strategy.extractCalculatedData(windCalcSs)
  } catch (error) {
    console.error('Error processing wind calculation:', error)
    throw error
  } finally {
    lock.releaseLock()
  }

  flatData.riskCategoryRoman = new Array(parseInt(projectData.riskCategory) || 1).fill('I').join('')

  let errors = []
  let trussData = _getTrussData_(width)
  if (Object.keys(trussData).length === 0) {
    errors.push(`There is no truss data for width : ${width}`)
  }

  let chartData = _getChartData_(projectData.windSpeed, projectData.exposureCategory, width, height)
  if (Object.keys(chartData).length === 0) {
    errors.push(
      `There is no chart data for Wind Speed - ${projectData.windSpeed}, Exposure ${projectData.exposureCategory}, Width - ${width}, Height - ${height}`,
    )
  }

  // Build template payload; width, length, height, pitch are kept purely local to allData
  let allData = {
    ...projectData,
    ...flatData,
    ...trussData,
    ...chartData,
    width,
    length,
    height,
    pitch,
    date: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMMM dd, yyyy'),
  }

  let presOPB = _createNewSlideFromTemplate_(allData)
  let slides = presOPB.getSlides()

  for (let slideNo = 0; slideNo < slides.length; slideNo++) {
    _replaceTemplateFieldsInShapes_(slides[slideNo], allData)
    _replaceTemplateFieldsInTables_(slides[slideNo], allData)
    slides[slideNo].refreshSlide()
  }

  Utilities.sleep(3000)
  presOPB.saveAndClose()
  Utilities.sleep(3000)

  let pdfFile = _convertPresToPDF_(presOPB)

  let outputFolder
  if (projectData.driveFolder) {
    let rootFolder = DriveApp.getFolderById(_getIdFromUrl_(projectData.driveFolder))
    outputFolder = _getOrCreateFolder_(['For Review'], rootFolder.getId())
  } else {
    outputFolder = DriveApp.getFolderById(_getIdFromUrl_(settings.outputDocFolder))
  }

  pdfFile.moveTo(outputFolder)

  return {
    pdfUrl: pdfFile.getUrl(),
    slideUrl: presOPB.getUrl(),
    errors,
    isFileCreated: true,
    isOpenPoleBarn: true,
  }
}

function _validateInputs_(data, strategy, sizeKey, pitchKey) {
  let errors = []

  strategy.validationFields.forEach((f) => {
    if (!data[f]?.toString().trim()) errors.push(`${f} is required but missing or empty`)
  })
  if (data.riskCategory && !RISK_CATEG_MAP[data.riskCategory])
    errors.push(`Risk category '${data.riskCategory}' is not valid.`)

  if (data[pitchKey]) {
    const pitchParts = data[pitchKey].split('/')
    if (
      pitchParts.length !== 2 ||
      parseInt(pitchParts[1]) !== 12 ||
      parseInt(pitchParts[0]) <= 0 ||
      isNaN(parseInt(pitchParts[0]))
    ) {
      errors.push(`${pitchKey} should be a valid positive pitch matching format 'x/12'`)
    }
  }

  if (data[sizeKey]) {
    const sizeParts = data[sizeKey].toLowerCase().split('x')
    if (
      sizeParts.length !== 3 ||
      sizeParts.some((dim) => isNaN(parseInt(dim)) || parseInt(dim) <= 0)
    ) {
      errors.push(`${sizeKey} should follow positive numeric format 'LxWxH'`)
    }
  }

  if (data.windSpeed) {
    const windSpeedMatch = data.windSpeed.match(/^(\d+(?:\.\d+)?)(?:\s*(?:MPH|mph))?$/)
    if (!windSpeedMatch || parseFloat(windSpeedMatch[1]) <= 0) {
      errors.push(`Wind speed must be a positive numeric value, got: '${data.windSpeed}'`)
    }
  }

  if (data.exposureCategory && !['B', 'C', 'D'].includes(data.exposureCategory.toUpperCase())) {
    errors.push(`Exposure category must be B, C, or D, got: '${data.exposureCategory}'`)
  }

  return errors
}

function _parseWindCalculations_(rawData) {
  let windAreas = ['wa1', 'wa2', 'wa3']
  let zones = ['z3', 'z2', 'z1']
  let pressureTypes = ['pos', 'neg']

  rawData.forEach((row, rIdx) => {
    if (row && row[0]) {
      flatData['WindArea' + (rIdx + 1)] = row[0].toString().replace(' sf', '').trim()
    }

    zones.forEach((zone, zIdx) => {
      pressureTypes.forEach((type, tIdx) => {
        let rawVal = row ? row[2 + zIdx * 2 + tIdx] : 0
        let val = parseFloat(rawVal) || 0
        flatData[`${windAreas[rIdx]}.${zone}.${type}.ult`] = Math.round(val * 100) / 100
        flatData[`${windAreas[rIdx]}.${zone}.${type}.asd`] = Math.round((val / 1.6) * 100) / 100
      })
    })
  })
  return flatData
}

function _getChartData_(windSpeed, exposure, width, height) {
  windSpeed = parseInt(windSpeed.toLowerCase().replace('mph', ''))
  width = parseInt(width)
  height = parseInt(height)
  let shChartData = SpreadsheetApp.getActive().getSheetByName('ChartData')
  let chartData = _getItemsFromSheet_(shChartData)

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

function _createNewSlideFromTemplate_({ clientName, projectId, projectType }) {
  let settings = _getSettings_()
  let outputFolder = DriveApp.getFolderById(_getIdFromUrl_(settings.outputDocFolder))
  let dateString = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy MM dd')
  let documentName = `11 x 17_${dateString}_${projectId}_${clientName}`

  let templateKey = 'windCalcSlideOpb'
  if (projectType === 'leanToOnly') {
    templateKey = 'windCalcSlideLeanTo'
  } else if (projectType === 'singleSlopeOnly') {
    templateKey = 'windCalcSlideSingleSlope'
  }
  let templateId = settings[templateKey] || settings.windCalcSlideOpb
  let documentTemplate = DriveApp.getFileById(_getIdFromUrl_(templateId))

  let document = documentTemplate.makeCopy()
  document.moveTo(outputFolder)

  let outputDoc = SlidesApp.openById(document.getId())
  outputDoc.setName(documentName)
  return outputDoc
}

function _convertPresToPDF_(presentation) {
  let settings = _getSettings_()
  let url = `https://docs.google.com/presentation/d/${presentation.getId()}/export?format=pdf`
  let options = {
    method: 'GET',
    headers: { Authorization: `Bearer ${ScriptApp.getOAuthToken()}` },
  }

  let pdfBlob = UrlFetchApp.fetch(url, options).getBlob()
  pdfBlob.setName(presentation.getName() + '.pdf')
  const pdfFile = DriveApp.createFile(pdfBlob)

  DriveApp.getFileById(pdfFile.getId()).moveTo(
    DriveApp.getFolderById(_getIdFromUrl_(settings.outputDocFolder)),
  )
  return pdfFile
}
