import useQueryBase from './useQueryBase'

export default function useQuery(query, variables, passedOptions) {
  const options = {
    fetchPolicy: 'network-only',
    variables,
    ...passedOptions
  }
  const result = useQueryBase(query, options)
  return {
    ...result.data,
    ...result
  }
}
