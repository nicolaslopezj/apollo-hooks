import useClient from './useClient'
import isArray from 'lodash/isArray'

export default function useRefetchQueries() {
  const client = useClient()

  return async names => {
    names = isArray(names) ? names : [names]
    const refetchQueryPromises = []

    client.queryManager.queries.forEach(({observableQuery}) => {
      if (observableQuery && names.includes(observableQuery.queryName)) {
        refetchQueryPromises.push(observableQuery.refetch())
      }
    })

    const results = await Promise.all(refetchQueryPromises)
    return isArray(names) ? results : results[0]
  }
}
