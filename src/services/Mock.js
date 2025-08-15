import LOCAL_DATA from '@/data/data.json'
import { DEFAULT_MOCK_API_DELAY } from '../global'

const FAKE_USER = {
  email: 'test@test.com',
  password: '123456',
  type: 'Admin1',
  token: 'dev_fake_token_123456',
}

export class Mock {
  static async executeMockFunction(functionName, { data, token }) {
    await this.simulateNetworkDelay()

    const handlers = {
      // Auth related functions
      login: () => this.handleMockLogin({ ...data, token }),
      autoLogin: () => this.handleMockAutoLogin(),
      logout: () => this.handleMockLogout(),

      // Data related functions
      newProject: () => this.handleMockNewProject(data),
      updateProject: () => this.handleMockUpdateProject(data),
      updateProjectStatus: () => this.handleMockUpdateProjectStatus(data),
      getLatestData: () => this.handleMockGetLatestData(),
    }

    const handler = handlers[functionName]
    if (!handler) {
      throw new Error(
        `Unhandled function: ${functionName}${
          Object.keys(data).length ? ` with data: ${JSON.stringify(data)}` : ''
        }`,
      )
    }

    return handler()
  }

  static handleMockLogin({ email, password, token }) {
    console.log('handleMockLogin', email, password, token)
    if (token) {
      if (token === FAKE_USER.token) {
        return {
          user: FAKE_USER,
          token: `dev_fake_token_123456`,
          data: LOCAL_DATA,
        }
      }
      localStorage.removeItem('authToken')
      throw new Error('Invalid token')
    }

    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      return {
        user: FAKE_USER,
        token: `dev_fake_token_123456`,
        data: LOCAL_DATA,
      }
    }

    throw new Error('Invalid credentials')
  }

  static handleMockAutoLogin() {
    if (LOCAL_DATA) {
      return {
        user: FAKE_USER,
        token: `dev_fake_token_123456`,
        data: LOCAL_DATA,
      }
    }
  }

  static handleMockLogout() {
    return { success: true }
  }

  static handleMockNewProject(data) {
    console.log('handleMockNewProject', data)
    data.projectId = '999.999'
    return { data, images: [] }
  }

  static handleMockUpdateProject(data) {
    console.log('handleMockUpdateProject', data)
    return { data, images: [] }
  }

  static handleMockGetLatestData() {
    console.log('handleMockGetLatestData')
    return { success: true }
  }

  static handleMockUpdateProjectStatus(data) {
    console.log('handleMockUpdateProjectStatus', data)
    return { success: true }
  }

  static simulateNetworkDelay(ms = DEFAULT_MOCK_API_DELAY) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  static getMetaData() {
    return { startingProjectId: '450.424' }
  }
}
