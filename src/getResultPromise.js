export default function(observableQuery) {
  if (observableQuery.resultPromise) return observableQuery.resultPromise
  observableQuery.resultPromise = new Promise(async resolve => {
    const subscription = observableQuery.subscribe(nextResult => {
      if (!nextResult.loading) {
        subscription.unsubscribe()
        resolve()
      }
    })
  })
  return observableQuery.resultPromise
}
