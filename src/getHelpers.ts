export default function(observableQuery) {
  return {
    fetchMore: observableQuery.fetchMore.bind(observableQuery),
    refetch: observableQuery.refetch.bind(observableQuery),
    startPolling: observableQuery.startPolling.bind(observableQuery),
    stopPolling: observableQuery.stopPolling.bind(observableQuery),
    subscribeToMore: observableQuery.subscribeToMore.bind(observableQuery),
    updateQuery: observableQuery.updateQuery.bind(observableQuery)
  }
}
