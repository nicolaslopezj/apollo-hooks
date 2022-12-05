import {useEffect} from 'react'
import useClient from './useClient'
import {getCacheKey} from './subscriptionQueryCache'
import {OperationVariables, SubscriptionOptions} from '@apollo/client'

export type UseSubscriptionOptions<TVariables, TData> = SubscriptionOptions<TVariables, TData> & {
  clientName?: string
  skip?: boolean
  onData?: (data: TData) => void
  onError?: Function
}

export default function useSubscriptionBase<TData = any, TVariables = OperationVariables>(
  options: UseSubscriptionOptions<TVariables, TData>
) {
  const client = useClient(options.clientName)

  useEffect(() => {
    if (options.skip === true) return

    const subscription = client.subscribe(options).subscribe({
      next: params => {
        if (options.onData) {
          options.onData(params.data)
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
  }, [getCacheKey(options)])
}
