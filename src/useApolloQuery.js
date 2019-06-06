import useQueryBase from './useQueryBase'

// the useQuery with the API I like
export default function useQuery(passedOptions) {
  const options = {
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
