import { LOCAL_STORAGE_KEYS } from 'common'
import { useLocalStorage } from './useLocalStorage'

export type LastSignInType = 'github' | 'email' | 'google' | null

export function useLastSignIn() {
  return useLocalStorage<LastSignInType>(LOCAL_STORAGE_KEYS.LAST_SIGN_IN_METHOD, null)
}
