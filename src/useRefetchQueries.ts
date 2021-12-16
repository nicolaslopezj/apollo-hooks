import useClient from './useClient'
import isArray from 'lodash/isArray'

export default function useRefetchQueries(options: any = {}) {
  const client = useClient(options.clientName) as any

  return async names => {
    names = isArray(names) ? names : [names]
    const refetchQueryPromises = []

    const qManager = client.queryManager
    qManager.queries.forEach(({observableQuery}) => {
      if (observableQuery && names.includes(observableQuery.queryName)) {
        refetchQueryPromises.push(observableQuery.refetch())
      }
    })

    const results = await Promise.all(refetchQueryPromises)
    return isArray(names) ? results : results[0]
  }
}
