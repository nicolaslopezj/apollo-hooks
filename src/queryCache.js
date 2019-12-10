// Source https://github.com/trojanowski/react-apollo-hooks/blob/master/src/queryCache.js

import objToKey from './objectToKey'

const cachedQueriesByClient = new WeakMap()

export function getCachedObservableQuery(client, options) {
  const queriesForClient = getCachedQueriesForClient(client)
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

function getCachedQueriesForClient(client) {
  let queriesForClient = cachedQueriesByClient.get(client)
  if (queriesForClient == null) {
    queriesForClient = new Map()
    cachedQueriesByClient.set(client, queriesForClient)
  }
  return queriesForClient
}

export function getCacheKey(options) {
  return objToKey(options)
}
