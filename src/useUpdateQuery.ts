import useClient from './useClient'
import {UseQueryOptions} from './useQueryBase'

export interface UpdateQueryOptions<TData, TVariables> {
  clientName?: UseQueryOptions<TData, TVariables>['clientName']
  query?: UseQueryOptions<TData, TVariables>['query']
  variables?: UseQueryOptions<TData, TVariables>['variables']
}

export function useUpdateQuery<TData = any, TVariables = any>(
  options: UpdateQueryOptions<TData, TVariables>
) {
  const client = useClient(options.clientName)

  return function updateQuery(
    updater: (previousResult: TData) => TData,
    updaterOptions?: Omit<UpdateQueryOptions<TData, TVariables>, 'clientName'>
  ) {
    const finalOptions = {
      query: updaterOptions?.query || options.query,
      variables: updaterOptions?.variables || options.variables
    }
    const prevData = client.readQuery(finalOptions)
    const newData = updater(prevData)
    client.writeQuery({
      ...finalOptions,
      data: newData
    })
  }
}
