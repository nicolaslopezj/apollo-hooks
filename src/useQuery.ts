import {useEffect, useRef, useReducer} from 'react'
import useClient from './useClient'
import isEqual from 'react-fast-compare'
import {
  getCachedObservableQuery,
  invalidateCachedObservableQuery,
  getCacheKey,
  ApolloHooksObservableQuery
} from './queryCache'
import getHelpers, {ApolloHooksHelpers} from './getHelpers'
import handleError from './handleError'
import getResultPromise from './getResultPromise'
import {
  ApolloQueryResult,
  NetworkStatus,
  OperationVariables,
  WatchQueryOptions
} from '@apollo/client'
import objectToKey from './objectToKey'

export type UseQueryOptions<TData, TVariables> = WatchQueryOptions<TVariables, TData> & {
  clientName?: string
  omit?: boolean
  /**
   * @deprecated if use are not using suspense, use useApolloQuery instead.
   */
  partial?: boolean
  handleError?: (
    result: ApolloQueryResult<TData>,
    options: UseQueryOptions<TData, TVariables>
  ) => void
}

export type UseQueryResult<TData, TVariables> = ApolloQueryResult<TData> &
  ApolloHooksHelpers<TData, TVariables> & {
    observableQuery?: ApolloHooksObservableQuery<TData, TVariables>
  }

export function useQuery<TData = any, TVariables extends OperationVariables = OperationVariables>(
  options: UseQueryOptions<TData, TVariables>
): UseQueryResult<TData, TVariables> {
  const client = useClient(options.clientName)

  if (!options.fetchPolicy) {
    options.fetchPolicy = 'cache-and-network'
  }

  const observableQuery = options.omit
    ? null
    : getCachedObservableQuery<TData, TVariables>(client, options)
  const resultRef = useRef(null)
  const optionsRef = useRef(options)
  const forceUpdate = useReducer(x => x + 1, 0)[1]

  const result = options.omit ? null : observableQuery.getCurrentResult()

  useEffect(() => {
    if (options.omit) return

    const subscription = observableQuery.subscribe(nextResult => {
      if (
        !resultRef.current ||
        !isEqual(resultRef.current.data, nextResult.data) ||
        resultRef.current.networkStatus !== nextResult.networkStatus
      ) {
        forceUpdate()
      }
    })
    return () => {
      subscription.unsubscribe()
      invalidateCachedObservableQuery(options.clientName, options)
    }
  }, [getCacheKey(options)])

  const helpers = getHelpers<TData, TVariables>(observableQuery)

  if (options.omit) {
    return {
      data: {} as TData,
      loading: false,
      partial: false,
      networkStatus: NetworkStatus.ready,
      errors: undefined,
      ...helpers
    }
  }

  if (objectToKey(options) !== objectToKey(optionsRef.current)) {
    optionsRef.current = options
    observableQuery.setOptions(options)
  }

  if (!options.partial && result.partial && options.fetchPolicy !== 'cache-only') {
    const promise = getResultPromise(observableQuery)
    throw promise
  }

  resultRef.current = result

  if (result.errors && result.errors.length) {
    if (options.handleError) {
      options.handleError(result, options)
    } else {
      handleError(result, options)
    }
  }

  // when partial is true and omit is false, we return the partial data
  if (!result.data) {
    result.data = {} as TData
  }

  return {
    observableQuery,
    ...result,
    ...helpers
  }
}
