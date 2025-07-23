export const DEV_ENV = typeof google === 'undefined'
export const MAX_SYNC_RETRY_ATTEMPTS = 5
export const DEFAULT_MOCK_API_DELAY = 0 // Delay in ms for mock API calls
export const DEFAULT_MOCK_API_BATCH_DELAY = 1000 // Delay in ms for mock API batch calls
export const IDLE_SYNC_WAIT_TIME = 0.25 * 60 * 1000 // Wait for idle time to start syncing
export const APP_DATA_REFRESH_THRESHOLD = 3 * 60 * 1000 // 5 minutes

export const PILLAR_COLORS = {
  '1-effective-communication': {
    deep: 'deep-orange-lighten-1',
    light: 'deep-orange-lighten-3',
  },
  '2-engaging-culture-experience': { deep: 'blue', light: 'blue-lighten-3' },
  '3-maximize-employee-productivity': {
    deep: 'amber',
    light: 'amber-lighten-3',
  },
}

export const NOTIFICATION_TYPES = {
  SNACKBAR: 'snackbar',
  ALERT: 'alert',
  CONFIRM: 'confirm',
  PROMPT: 'prompt',
  URL: 'dialog',
  TOAST: 'toast',
}

export const NOTIFICATION_STYLES = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
}

export const OPERATION_TYPES = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LINK: 'link',
}

export const OP_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  SUCCESS: 'success',
  FAILED: 'failed',
}

export const OPERATION_PRIORITY = {
  [OPERATION_TYPES.CREATE]: 1,
  [OPERATION_TYPES.UPDATE]: 2,
  [OPERATION_TYPES.LINK]: 3,
  [OPERATION_TYPES.DELETE]: 4,
}
