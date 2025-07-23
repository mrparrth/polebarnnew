// src/services/api.js
import { Mock } from './Mock'

const isGoogleEnvironment = typeof google !== 'undefined'

export class API {
  static async execute(functionName, data = {}) {
    try {
      const token = localStorage.getItem('app_token')
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

  // Google Apps Script execution
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
      localStorage.setItem('app_token', result.token)
    }
    return result
  }
}
