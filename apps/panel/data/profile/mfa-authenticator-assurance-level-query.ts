import type { AuthMFAGetAuthenticatorAssuranceLevelResponse } from '@paybilldev/auth-js'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { paybillClient } from 'common/paybill'
import { profileKeys } from './keys'
import type { Profile } from '~/types'

export type ProfileResponse = Profile

export async function getMfaAuthenticatorAssuranceLevel() {
  const { error, data } = await paybillClient.mfa.getAuthenticatorAssuranceLevel()

  if (error) throw error
  return data
}

type CustomAuthMFAGetAuthenticatorAssuranceLevelData = NonNullable<
  AuthMFAGetAuthenticatorAssuranceLevelResponse['data']
>
type CustomAuthMFAGetAuthenticatorAssuranceLevelError = NonNullable<
  AuthMFAGetAuthenticatorAssuranceLevelResponse['error']
>

export const useAuthenticatorAssuranceLevelQuery = <
  TData = CustomAuthMFAGetAuthenticatorAssuranceLevelData,
>({
  enabled = true,
  ...options
}: UseQueryOptions<
  CustomAuthMFAGetAuthenticatorAssuranceLevelData,
  CustomAuthMFAGetAuthenticatorAssuranceLevelError,
  TData
> = {}) => {
  return useQuery<
    CustomAuthMFAGetAuthenticatorAssuranceLevelData,
    CustomAuthMFAGetAuthenticatorAssuranceLevelError,
    TData
  >(profileKeys.aaLevel(), () => getMfaAuthenticatorAssuranceLevel(), {
    staleTime: 1000 * 60 * 30, // default good for 30 mins
    ...options,
  })
}
