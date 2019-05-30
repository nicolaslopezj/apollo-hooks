import {useEffect} from 'react'
import useClient from './useClient'
import {getCacheKey} from './subscriptionQueryCache'

export default function useSubscriptionBase(options) {
  const client = useClient()

  useEffect(
    () => {
      if (options.skip === true) return

      const subscription = client.subscribe(options).subscribe({
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
    },
    [getCacheKey(options)]
  )
}
