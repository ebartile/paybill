import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import type { components } from 'common'
import { get, handleError } from 'data/fetchers'
import { invoicesKeys } from './keys'
import { useIsLoggedIn } from 'common'

export type OverdueInvoicesResponse = components['schemas']['OverdueInvoiceCount']

export async function getOverdueInvoices(signal?: AbortSignal) {
  const { data, error } = await get('/platform/stripe/invoices/overdue', {
    signal,
  })

  if (error) handleError(error)
  return data
}

export type OverdueInvoicesData = Awaited<ReturnType<typeof getOverdueInvoices>>
export type OverdueInvoicesError = unknown

export const useOverdueInvoicesQuery = <TData = OverdueInvoicesData>({
  enabled = true,
  ...options
}: UseQueryOptions<OverdueInvoicesData, OverdueInvoicesError, TData> = {}) => {
  const isLoggedIn = useIsLoggedIn()
  return useQuery<OverdueInvoicesData, OverdueInvoicesError, TData>(
    invoicesKeys.overdueInvoices(),
    ({ signal }) => getOverdueInvoices(signal),
    {
      enabled: enabled && isLoggedIn,
      staleTime: 30 * 60 * 1000, // 30 minutes
      ...options,
    }
  )
}
