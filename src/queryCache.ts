// Source https://github.com/trojanowski/react-apollo-hooks/blob/master/src/queryCache.js

import ApolloClient, {ObservableQuery, WatchQueryOptions} from 'apollo-client'
import objToKey from './objectToKey'
import {UseQueryOptions} from './useQueryBase'

export type ApolloHooksObservableQuery<ResultType, Variables> = ObservableQuery<
  ResultType,
  Variables
> & {
  _fetchOnceSubscription?: ZenObservable.Subscription
}
const cachedQueriesByClient = new Map<
  ApolloClient<any>,
  Map<string, ApolloHooksObservableQuery<any, any>>
>()

export function getCachedObservableQuery<ResultType, Variables>(
  client: ApolloClient<any>,
  options: UseQueryOptions<Variables>
) {
  const queriesForClient = getCachedQueriesForClient<ResultType, Variables>(client)
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

export function invalidateCachedObservableQuery(client, options) {
  const queriesForClient = getCachedQueriesForClient(client)
  const currentObservable = getCachedObservableQuery(client, options)
  if (currentObservable && currentObservable._fetchOnceSubscription) {
    currentObservable._fetchOnceSubscription.unsubscribe()
  }
  const cacheKey = getCacheKey(options)
  queriesForClient.delete(cacheKey)
}

function getCachedQueriesForClient<ResultType, Variables>(
  client: ApolloClient<any>
): Map<string, ApolloHooksObservableQuery<ResultType, Variables>> {
  let queriesForClient = cachedQueriesByClient.get(client)
  if (queriesForClient == null) {
    queriesForClient = new Map()
    cachedQueriesByClient.set(client, queriesForClient)
  }
  return queriesForClient
}

export function getCacheKey(options: WatchQueryOptions) {
  return objToKey(options)
}
