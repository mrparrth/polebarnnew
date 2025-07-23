// import LOCAL_DATA from '@/data/data.json'
import LOCAL_DATA from '@/data/data.json'

import { DEFAULT_MOCK_API_BATCH_DELAY, DEFAULT_MOCK_API_DELAY } from '../global'

const FAKE_USER = {
  id: '090a95ce-3933-4b57-a191-96dc067f9851',
  createdAt: '2024-10-03T13:55:51.772Z',
  modifiedAt: '2024-10-03T13:55:51.772Z',
  name: 'Admin',
  email: 'admin@ceedcivil.com',
  password: '111111',
  role: '',
  status: 'Active',
  _rowIndex: 3,
}

export class Mock {
  static async executeMockFunction(functionName, { data, token }) {
    await this.simulateNetworkDelay()

    const handlers = {
      login: () => this.handleMockLogin({ ...data, token }),
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

  // Mock Handlers
  static handleMockLogin({ email, password }) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      localStorage.setItem('app_data', JSON.stringify(LOCAL_DATA))
      return {
        user: FAKE_USER,
        token: `dev_fake_token_${Date.now()}`,
        data: LOCAL_DATA,
      }
    }

    throw new Error('Invalid credentials')
  }

  static simulateNetworkDelay(ms = DEFAULT_MOCK_API_DELAY) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  static getMetaData() {
    return CONFIG
  }
}
