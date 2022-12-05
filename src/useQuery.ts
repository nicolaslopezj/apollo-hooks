import useQueryBase from './useQueryBase'

/**
 * @deprecated. Use useQuery instead.
 */
export default function useQuery(query: any, variables?: any, passedOptions?: any) {
  const options = {
    query,
    variables,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
    ...passedOptions
  }
  const result = useQueryBase(options)
  return {
    ...result.data,
    ...result
  }
}
