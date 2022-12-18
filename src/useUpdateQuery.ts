import useClient from './useClient'
import {UseQueryOptions} from './useQueryBase'

export interface UpdateQueryOptions<TData, TVariables> {
  clientName?: UseQueryOptions<TData, TVariables>['clientName']
  query: UseQueryOptions<TData, TVariables>['query']
  variables: UseQueryOptions<TData, TVariables>['variables']
}

export function useUpdateQuery<TData, TVariables>(options: UpdateQueryOptions<TData, TVariables>) {
  const client = useClient(options.clientName)

  return function updateQuery(updater: (previousResult: TData) => TData) {
    const prevData = client.readQuery({
      query: options.query,
      variables: options.variables
    })
    const newData = updater(prevData)
    client.writeQuery({
      query: options.query,
      variables: options.variables,
      data: newData
    })
  }
}
