export const LOCAL_STORAGE_KEYS = {
  LAST_SIGN_IN_METHOD: 'paybill-last-sign-in-method',
  UI_PREVIEW_BRANCHING_2_0: 'paybill-ui-branching-2-0',
  UI_PREVIEW_UNIFIED_LOGS: 'paybill-ui-preview-unified-logs',
  MIDDLEWARE_OUTAGE_BANNER: 'middleware-outage-banner-2025-05-16',
  LAST_VISITED_ORGANIZATION: 'last-visited-organization',
  SENTRY_USER_ID: 'paybill-sentry-user-id',
  TELEMETRY_CONSENT: 'paybill-consent-ph',
  TELEMETRY_DATA: 'paybill-telemetry-data',
} as const

export type LocalStorageKey = (typeof LOCAL_STORAGE_KEYS)[keyof typeof LOCAL_STORAGE_KEYS]

const LOCAL_STORAGE_KEYS_ALLOWLIST = [
  'theme',
  'paybillDarkMode'
]

export function clearLocalStorage() {
  for (const key in localStorage) {
    if (!LOCAL_STORAGE_KEYS_ALLOWLIST.includes(key)) {
      localStorage.removeItem(key)
    }
  }
}
