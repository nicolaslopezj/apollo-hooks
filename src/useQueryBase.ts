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
import {ApolloQueryResult, WatchQueryOptions} from '@apollo/client'

export type UseQueryOptions<TVariables> = WatchQueryOptions<TVariables> & {
  clientName?: string
  omit?: boolean
  partial?: boolean
  handleError?: Function
}

export type UseQueryResult<TData, TVariables> = ApolloQueryResult<TData> &
  ApolloHooksHelpers<TData, TVariables> & {
    observableQuery?: ApolloHooksObservableQuery<TData, TVariables>
  }

export default function useQueryBase<TData = any, TVariables = any>(
  options: UseQueryOptions<TVariables>
): UseQueryResult<TData, TVariables> {
  const client = useClient(options.clientName)
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
      invalidateCachedObservableQuery(client, options)
    }
  }, [getCacheKey(options)])

  const helpers = getHelpers<TData, TVariables>(observableQuery)

  if (options.omit) return {...helpers} as any as UseQueryResult<TData, TVariables>

  if (!isEqual(optionsRef.current, options)) {
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

  return {
    observableQuery,
    ...result,
    ...helpers
  }
}
