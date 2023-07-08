import {OperationVariables, QueryHookOptions, useQuery} from '@apollo/client'
import useClient from './useClient'
import omit from 'lodash/omit'

export type UseApolloQueryOptions<TData, TVariables> = QueryHookOptions<TData, TVariables> & {
  clientName?: string
}

/**
 * useQuery from apollo using the same defaults and multi client support
 */
export function useApolloQuery<
  TData = any,
  TVariables extends OperationVariables = OperationVariables
>(options: UseApolloQueryOptions<TData, TVariables>) {
  const client = useClient(options.clientName)

  if (!options.fetchPolicy) {
    options.fetchPolicy = 'cache-and-network'
  }

  const result = useQuery<TData, TVariables>(options.query, {
    ...omit(options, 'clientName', 'query'),
    client: client
  })

  return {
    ...result,
    data: result.data || ({} as TData)
  }
}
