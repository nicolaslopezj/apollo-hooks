const createPromise = observableQuery => {
  return new Promise(async resolve => {
    const subscription = observableQuery.subscribe(nextResult => {
      if (!nextResult.loading) {
        subscription.unsubscribe()
        resolve()
        observableQuery.resultPromise = null
      }
    })
  })
}

export default function getResultPromise(observableQuery) {
  if (observableQuery.resultPromise) return observableQuery.resultPromise
  observableQuery.resultPromise = createPromise(observableQuery)
  return observableQuery.resultPromise
}
