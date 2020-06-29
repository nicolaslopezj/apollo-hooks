import {useEffect, useRef} from 'react'
import useClient from './useClient'
import useForceUpdate from './useForceUpdate'
import isEqual from 'react-fast-compare'
import {getCachedObservableQuery, invalidateCachedObservableQuery, getCacheKey} from './queryCache'
import getHelpers from './getHelpers'
import handleError from './handleError'
import getResultPromise from './getResultPromise'

export default function useQueryBase(options) {
  const client = useClient()
  const forceUpdate = useForceUpdate()
  const observableQuery = options.omit ? null : getCachedObservableQuery(client, options)
  const resultRef = useRef(null)
  const optionsRef = useRef(options)
  const result = options.omit ? null : observableQuery.currentResult()

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

  if (options.omit) return {}

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

  const helpers = getHelpers(observableQuery)

  return {
    observableQuery,
    ...result,
    ...helpers
  }
}
