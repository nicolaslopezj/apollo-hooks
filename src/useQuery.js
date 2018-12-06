import useQueryBase from './useQueryBase'

// the useQuery with the API I like
export default function useQuery(query, variables, passedOptions) {
  const options = {
    query,
    fetchPolicy: 'cache-and-network',
    variables,
    ...passedOptions
  }
  const result = useQueryBase(options)
  return {
    ...result.data,
    ...result
  }
}
