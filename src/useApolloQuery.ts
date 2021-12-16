import useQueryBase from './useQueryBase'

// the useQuery with the API I like
export default function useQuery<TData, TVariables>(passedOptions) {
  const options = {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
    ...passedOptions
  }

  const result = useQueryBase<TData, TVariables>(options)

  return {
    ...result.data,
    ...result
  }
}
