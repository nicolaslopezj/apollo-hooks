import {useEffect, useRef} from 'react'
import useClient from './useClient'
import {
  getCachedObservableQuery,
  invalidateCachedObservableQuery,
  getCacheKey
} from './subscriptionQueryCache'

export default function useSubscriptionBase(options) {
  const client = useClient()
  const observableQuery = getCachedObservableQuery(client, options)
  const optionsRef = useRef(options)

  useEffect(
    () => {
      return () => invalidateCachedObservableQuery(client, optionsRef.current)
    },
    [getCacheKey(options)]
  )

  useEffect(() => {
    const subscription = observableQuery.subscribe({
      next: params => {
        if (options.onData) {
          options.onData(params.data, params)
        }
      },
      error: error => {
        if (options.onError) {
          options.onError(error)
        } else {
          console.error('Error in subscription', error)
        }
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    observableQuery
  }
}
