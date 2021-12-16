import {ObservableQuery} from '@apollo/client'

export type ApolloHooksHelpers<TData, TVariables> = Pick<
  ObservableQuery<TData, TVariables>,
  'fetchMore' | 'refetch' | 'subscribeToMore' | 'updateQuery' | 'startPolling' | 'stopPolling'
>

export default function <ResultType, Variables>(
  observableQuery: ObservableQuery<ResultType, Variables>
): ApolloHooksHelpers<ResultType, Variables> {
  return {
    fetchMore: observableQuery.fetchMore.bind(observableQuery),
    refetch: observableQuery.refetch.bind(observableQuery),
    startPolling: observableQuery.startPolling.bind(observableQuery),
    stopPolling: observableQuery.stopPolling.bind(observableQuery),
    subscribeToMore: observableQuery.subscribeToMore.bind(observableQuery),
    updateQuery: observableQuery.updateQuery.bind(observableQuery)
  }
}
