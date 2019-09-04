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
  const observableQuery = getCachedObservableQuery(client, options)
  const resultRef = useRef(null)
  const optionsRef = useRef(options)
  const result = observableQuery.currentResult()

  useEffect(() => {
    return () => invalidateCachedObservableQuery(client, optionsRef.current)
  }, [getCacheKey(options)])

  useEffect(() => {
    const subscription = observableQuery.subscribe(nextResult => {
      if (!resultRef.current || !isEqual(resultRef.current.data, nextResult.data)) {
        forceUpdate()
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const promise = getResultPromise(observableQuery)

  if (!isEqual(optionsRef.current, options)) {
    observableQuery.setOptions(options)
  }

  if (result.partial && options.fetchPolicy !== 'cache-only') {
    throw promise
  }

  resultRef.current = result

  if (result.errors && result.errors.length) {
    handleError(result)
  }

  const helpers = getHelpers(observableQuery)

  return {
    observableQuery,
    ...result,
    ...helpers
  }
}
