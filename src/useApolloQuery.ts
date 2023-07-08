import {WatchQueryOptions, useQuery} from '@apollo/client'
import useClient from './useClient'
import omit from 'lodash/omit'

export type UseApolloQueryOptions<TData, TVariables> = WatchQueryOptions<TVariables, TData> & {
  clientName?: string
}

/**
 * useQuery from apollo using the same defaults and multi client support
 */
export function useApolloQuery<TData, TVariables>(
  options: UseApolloQueryOptions<TData, TVariables>
) {
  const client = useClient(options.clientName)

  if (!options.fetchPolicy) {
    options.fetchPolicy = 'cache-and-network'
  }

  return useQuery<TData, TVariables>(options.query, {
    ...omit(options, 'clientName', 'query'),
    client: client
  })
}
