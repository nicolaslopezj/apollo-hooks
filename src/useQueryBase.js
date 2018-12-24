import {useEffect, useRef} from 'react'
import useClient from './useClient'
import useForceUpdate from './useForceUpdate'
import isEqual from 'react-fast-compare'
import {getCachedObservableQuery, invalidateCachedObservableQuery} from './queryCache'

const getResultPromise = function(observableQuery) {
  return new Promise(async resolve => {
    const subscription = observableQuery.subscribe(nextResult => {
      if (!nextResult.loading) {
        subscription.unsubscribe()
        resolve()
      }
    })
  })
}

export default function useQueryBase(options) {
  const client = useClient()
  const forceUpdate = useForceUpdate()
  const observableQuery = getCachedObservableQuery(client, options)
  const resultRef = useRef(null)
  const optionsRef = useRef(options)
  const result = observableQuery.currentResult()

  useEffect(() => {
    const subscription = observableQuery.subscribe(nextResult => {
      if (!resultRef.current || !isEqual(resultRef.current.data, nextResult.data)) {
        forceUpdate()
      }
    })
    invalidateCachedObservableQuery(client, optionsRef.current)
    return () => subscription.unsubscribe()
  }, [])

  if (!isEqual(optionsRef.current, options)) {
    observableQuery.setOptions(options)
  }

  if (result.partial && options.fetchPolicy !== 'cache-only') {
    throw getResultPromise(observableQuery)
  }

  resultRef.current = result

  if (result.errors && result.errors.length) {
    const message = result.errors[0].message
    const error = new Error(message)
    error.isApolloError = true
    error.errors = result.errors
    throw error
  }

  const helpers = {
    fetchMore: observableQuery.fetchMore.bind(observableQuery),
    refetch: observableQuery.refetch.bind(observableQuery),
    startPolling: observableQuery.startPolling.bind(observableQuery),
    stopPolling: observableQuery.stopPolling.bind(observableQuery),
    subscribeToMore: observableQuery.subscribeToMore.bind(observableQuery),
    updateQuery: observableQuery.updateQuery.bind(observableQuery)
  }

  return {
    ...result,
    observableQuery,
    ...helpers
  }
}
