import {
  OperationVariables,
  UseFragmentOptions as UseApolloFragmentOptions,
  useFragment
} from '@apollo/client'
import useClient from './useClient'
import omit from 'lodash/omit'

export type UseFragmentOptions<TData, TVariables> = UseApolloFragmentOptions<TData, TVariables> & {
  clientName?: string
}

/**
 * useQuery from apollo using the same defaults and multi client support
 */
export function useApolloQuery<
  TData = any,
  TVariables extends OperationVariables = OperationVariables
>(options: UseFragmentOptions<TData, TVariables>) {
  const client = useClient(options.clientName)

  const result = useFragment<TData, TVariables>({
    ...omit(options, 'clientName'),
    client
  })

  return result
}
