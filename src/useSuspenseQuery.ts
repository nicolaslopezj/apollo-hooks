import {
  DocumentNode,
  OperationVariables,
  SuspenseQueryHookOptions,
  TypedDocumentNode,
  useSuspenseQuery as useApolloSuspenseQuery
} from '@apollo/client'
import useClient from './useClient'
import omit from 'lodash/omit'

export type UseSuspenseQueryOptions<TData, TVariables> = SuspenseQueryHookOptions<
  TData,
  TVariables
> & {
  clientName?: string
  query: DocumentNode | TypedDocumentNode<TData, TVariables>
}

/**
 * useQuery from apollo using the same defaults and multi client support
 */
export function useSuspenseQuery<
  TData = any,
  TVariables extends OperationVariables = OperationVariables
>(options: UseSuspenseQueryOptions<TData, TVariables>) {
  const client = useClient(options.clientName)

  if (!options.fetchPolicy) {
    options.fetchPolicy = 'cache-and-network'
  }

  const result = useApolloSuspenseQuery<TData, TVariables>(options.query, {
    ...omit(options, 'clientName', 'query'),
    client: client
  })

  return {
    ...result,
    data: result.data || ({} as TData)
  }
}
