import { Mock } from './Mock'

const isGoogleEnvironment = typeof google !== 'undefined'

export class API {
  static async execute(functionName, data = {}) {
    try {
      const token = localStorage.getItem('authToken')
      const enrichedData = token ? { data, token } : { data }

      console.info(`API: executing ${functionName}`, enrichedData)

      const result = await (isGoogleEnvironment
        ? this.executeGoogleFunction(functionName, enrichedData)
        : Mock.executeMockFunction(functionName, enrichedData))

      console.info('result', result)
      return result
    } catch (error) {
      console.info('error', error)
      throw error
    }
  }

  static executeGoogleFunction(functionName, data) {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler((result) => {
          resolve(result)
        })
        .withFailureHandler((error) => {
          reject(error)
        })
        [functionName](data)
    })
  }

  static async login(email, password) {
    const result = await this.execute('login', { email, password })
    if (result.token) {
      localStorage.setItem('authToken', result.token)
    }
    return JSON.parse(result)
  }

  static async autoLogin() {
    const result = await this.execute('login')
    if (result.token) {
      localStorage.setItem('authToken', result.token)
    }
    return JSON.parse(result)
  }

  static async logout() {
    await this.execute('logout')
    localStorage.removeItem('authToken')
  }

  static async validateUser(email) {
    const result = await this.execute('validateUser', { email })

    return result
  }

  static async getLatestData() {
    const result = await this.execute('getLatestData')

    return result
  }

  static async newProject(projectData) {
    const result = await this.execute('newProject', projectData)

    return result
  }

  static async newPaperCopyProject(projectData) {
    const result = await this.execute('newPaperCopyProject', projectData)

    return result
  }

  static async orderPaperCopy(orderQuantities) {
    const result = await this.execute('orderPaperCopy', orderQuantities)

    return result
  }

  static async updatePaperCopyStock(paperStock) {
    const result = await this.execute('updatePaperCopyStock', paperStock)

    return result
  }

  static async updateProject(projectData) {
    const result = await this.execute('updateProject', projectData)

    return result
  }

  static async updateProjectStatus(projectId, newStatus) {
    const result = await this.execute('updateProjectStatus', { projectId, newStatus })

    return result
  }

  static getMetaData() {
    let dataElem = document.getElementById('meta-data')
    let data
    if (isGoogleEnvironment) {
      if (dataElem) {
        data = JSON.parse(dataElem.getAttribute('meta-data'))
        console.info('Metadata found in google environment', data)
      } else {
        console.error('Metadata not found')
      }
    } else {
      data = Mock.getMetaData()
    }

    return data
  }
}
