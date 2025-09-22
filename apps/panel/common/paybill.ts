import { AuthClient, navigatorLock, User } from '@paybilldev/auth-js'

export const STORAGE_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY || 'paybill.dashboard.auth.token'
export const AUTH_DEBUG_KEY =
  process.env.NEXT_PUBLIC_AUTH_DEBUG_KEY || 'paybill.dashboard.auth.debug'
export const AUTH_DEBUG_PERSISTED_KEY =
  process.env.NEXT_PUBLIC_AUTH_DEBUG_PERSISTED_KEY || 'paybill.dashboard.auth.debug.persist'
export const AUTH_NAVIGATOR_LOCK_DISABLED_KEY =
  process.env.NEXT_PUBLIC_AUTH_NAVIGATOR_LOCK_KEY ||
  'paybill.dashboard.auth.navigatorLock.disabled'

/**
 * Transfers the search params from the current location path to a newly built path
 */
export const buildPathWithParams = (pathname: string) => {
  const [basePath, existingParams] = pathname.split('?', 2)

  const pathnameSearchParams = new URLSearchParams(existingParams || '')

  // Merge the parameters, with pathname parameters taking precedence
  // over the current location's search parameters
  const mergedParams = new URLSearchParams(location.search)
  for (const [key, value] of pathnameSearchParams.entries()) {
    mergedParams.set(key, value)
  }

  const queryString = mergedParams.toString()
  return queryString ? `${basePath}?${queryString}` : basePath
}

/**
 * Catches errors thrown when accessing localStorage. Safari with certain
 * security settings throws when localStorage is accessed.
 */
function safeGetLocalStorage(key: string) {
  try {
    return globalThis?.localStorage?.getItem(key)
  } catch {
    return null
  }
}

const debug =
  process.env.NEXT_PUBLIC_IS_PLATFORM === 'true' && safeGetLocalStorage(AUTH_DEBUG_KEY) === 'true'

const persistedDebug =
  process.env.NEXT_PUBLIC_IS_PLATFORM === 'true' &&
  safeGetLocalStorage(AUTH_DEBUG_PERSISTED_KEY) === 'true'

const shouldEnableNavigatorLock =
  process.env.NEXT_PUBLIC_IS_PLATFORM === 'true' &&
  !(safeGetLocalStorage(AUTH_NAVIGATOR_LOCK_DISABLED_KEY) === 'true')

const shouldDetectSessionInUrl = process.env.NEXT_PUBLIC_AUTH_DETECT_SESSION_IN_URL
  ? process.env.NEXT_PUBLIC_AUTH_DETECT_SESSION_IN_URL === 'true'
  : true

const navigatorLockEnabled = !!(shouldEnableNavigatorLock && globalThis?.navigator?.locks)

if (shouldEnableNavigatorLock && !globalThis?.navigator?.locks) {
  console.warn('This browser does not support the Navigator Locks API. Please update it.')
}

const tabId = Math.random().toString(16).substring(2)

let dbHandle = new Promise<IDBDatabase | null>((accept, _) => {
  if (!persistedDebug) {
    accept(null)
    return
  }

  const request = indexedDB.open('auth-debug-log', 1)

  request.onupgradeneeded = (event: any) => {
    const db = event?.target?.result

    if (!db) {
      return
    }

    db.createObjectStore('events', { autoIncrement: true })
  }

  request.onsuccess = (event: any) => {
    console.log('Opened persisted auth debug log IndexedDB database', tabId)
    accept(event.target.result)
  }

  request.onerror = (event: any) => {
    console.error('Failed to open persisted auth debug log IndexedDB database', event)
    accept(null)
  }
})

const logIndexedDB = (message: string, ...args: any[]) => {
  console.log(message, ...args)

  const copyArgs = structuredClone(args)

  copyArgs.forEach((value) => {
    if (typeof value === 'object' && value !== null) {
      delete value.user
      delete value.access_token
      delete value.token_type
      delete value.provider_token
    }
  })
  ;(async () => {
    try {
      const db = await dbHandle

      if (!db) {
        return
      }

      const tx = db.transaction(['events'], 'readwrite')
      tx.onerror = (event: any) => {
        console.error('Failed to write to persisted auth debug log IndexedDB database', event)
        dbHandle = Promise.resolve(null)
      }

      const events = tx.objectStore('events')

      events.add({
        m: message.replace(/^PaybillClient@/i, ''),
        a: copyArgs,
        l: window.location.pathname,
        t: tabId,
      })
    } catch (e: any) {
      console.error('Failed to log to persisted auth debug log IndexedDB database', e)
      dbHandle = Promise.resolve(null)
    }
  })()
}

export const paybillClient = new AuthClient({
  url: process.env.NEXT_PUBLIC_PAYBILL_URL,
  storageKey: STORAGE_KEY,
  detectSessionInUrl: shouldDetectSessionInUrl,
  debug: debug ? (persistedDebug ? logIndexedDB : true) : false,
  lock: navigatorLockEnabled ? navigatorLock : undefined,

  ...('localStorage' in globalThis
    ? { storage: globalThis.localStorage, userStorage: globalThis.localStorage }
    : null),
})

export type { User }

export const DEFAULT_FALLBACK_PATH = '/organizations'

export const validateReturnTo = (
  returnTo: string,
  fallback: string = DEFAULT_FALLBACK_PATH
): string => {
  // Block protocol-relative URLs and external URLs
  if (returnTo.startsWith('//') || returnTo.includes('://')) {
    return fallback
  }

  // For internal paths:
  // 1. Must start with /
  // 2. Only allow alphanumeric chars, slashes, hyphens, underscores
  // 3. For query params, also allow =, &, and ?
  const safePathPattern = /^\/[a-zA-Z0-9/\-_]*(?:\?[a-zA-Z0-9\-_=&]*)?$/
  return safePathPattern.test(returnTo) ? returnTo : fallback
}

export const getReturnToPath = (fallback = DEFAULT_FALLBACK_PATH) => {
  const searchParams = new URLSearchParams(location.search)

  let returnTo = searchParams.get('returnTo') ?? fallback

  if (process.env.NEXT_PUBLIC_BASE_PATH) {
    returnTo = returnTo.replace(process.env.NEXT_PUBLIC_BASE_PATH, '')
  }

  searchParams.delete('returnTo')

  const remainingSearchParams = searchParams.toString()
  const validReturnTo = validateReturnTo(returnTo, fallback)

  const [path, existingQuery] = validReturnTo.split('?')

  const finalSearchParams = new URLSearchParams(existingQuery || '')

  // Add all remaining search params to the final search params
  if (remainingSearchParams) {
    const remainingParams = new URLSearchParams(remainingSearchParams)
    remainingParams.forEach((value, key) => {
      finalSearchParams.append(key, value)
    })
  }

  const finalQuery = finalSearchParams.toString()
  return path + (finalQuery ? `?${finalQuery}` : '')
}