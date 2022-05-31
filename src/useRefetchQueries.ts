import useClient from './useClient'
import isArray from 'lodash/isArray'

export interface RefetchQueriesOptions {
  clientName?: string
}

export default function useRefetchQueries(options: RefetchQueriesOptions = {}) {
  const client = useClient(options.clientName) as any

  return async (queryNames: string | string[]) => {
    queryNames = isArray(queryNames) ? queryNames : [queryNames]
    const refetchQueryPromises = []

    const qManager = client.queryManager
    qManager.queries.forEach(({observableQuery}) => {
      if (observableQuery && queryNames.includes(observableQuery.queryName)) {
        refetchQueryPromises.push(observableQuery.refetch())
      }
    })

    const results = await Promise.all(refetchQueryPromises)
    return isArray(queryNames) ? results : results[0]
  }
}
