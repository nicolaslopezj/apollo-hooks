import useSubscriptionBase from './useSubscriptionBase'

// the useQuery with the API I like
export default function useQuery(query, variables, passedOptions) {
  const options = {
    query,
    variables,
    ...passedOptions
  }
  return useSubscriptionBase(options)
}
