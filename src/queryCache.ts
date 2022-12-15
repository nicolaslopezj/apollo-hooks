// Source https://github.com/trojanowski/react-apollo-hooks/blob/master/src/queryCache.js

import {ApolloClient, ObservableQuery, WatchQueryOptions} from '@apollo/client'
import objToKey from './objectToKey'
import {UseQueryOptions} from './useQueryBase'

export type ApolloHooksObservableQuery<ResultType, Variables> = ObservableQuery<
  ResultType,
  Variables
> & {
  _fetchOnceSubscription?: ZenObservable.Subscription
}
const cachedQueriesByClient = new Map<string, Map<string, ApolloHooksObservableQuery<any, any>>>()

export function getCachedObservableQuery<ResultType, Variables>(
  client: ApolloClient<any>,
  options: UseQueryOptions<ResultType, Variables>
) {
  const queriesForClient = getCachedQueriesForClient<ResultType, Variables>(
    options.clientName || 'main'
  )
  const cacheKey = getCacheKey(options)
  let observableQuery = queriesForClient.get(cacheKey)
  if (observableQuery == null) {
    observableQuery = client.watchQuery(options)
    // this is added to only fetch once
    const subscription = observableQuery.subscribe(() => {})
    observableQuery._fetchOnceSubscription = subscription
    queriesForClient.set(cacheKey, observableQuery)
  }
  return observableQuery
}

export function invalidateCachedObservableQuery(clientName: string, options: any) {
  const queriesForClient = getCachedQueriesForClient(clientName)
  const cacheKey = getCacheKey(options)

  const currentObservable = queriesForClient.get(cacheKey)

  if (currentObservable && currentObservable._fetchOnceSubscription) {
    currentObservable._fetchOnceSubscription.unsubscribe()
  }

  queriesForClient.delete(cacheKey)
}

function getCachedQueriesForClient<ResultType, Variables>(
  clientName: string
): Map<string, ApolloHooksObservableQuery<ResultType, Variables>> {
  let queriesForClient = cachedQueriesByClient.get(clientName)
  if (queriesForClient == null) {
    queriesForClient = new Map()
    cachedQueriesByClient.set(clientName, queriesForClient)
  }
  return queriesForClient
}

export function getCacheKey(options: WatchQueryOptions) {
  return objToKey(options)
}
