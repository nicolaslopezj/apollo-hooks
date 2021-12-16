import {QueryHookOptions, useQuery} from '@apollo/client'
import {suspend} from './suspend'
import useClient from './useClient'

export type UseQueryOptions<TData, TVariables> = QueryHookOptions<TData, TVariables> & {
  /**
   * Select the client to use for this query.
   */
  clientName?: string
  /**
   * Set to false to disable Suspense.
   */
  partial?: boolean
}

export default function useQueryBase<TData = any, TVariables = any>(
  options: UseQueryOptions<TData, TVariables>
) {
  const client = useClient(options.clientName)
  const result = useQuery<TData, TVariables>(options.query, {...options, client})

  if (!options.partial) {
    if (result.networkStatus === 7) {
      suspend(new Promise(resolve => result.networkStatus !== 7 && resolve(null))).read()
    }
  }

  return result
}
