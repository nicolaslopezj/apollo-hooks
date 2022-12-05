import cloneDeep from 'lodash/cloneDeep'
import useQueryBase from './useQueryBase'

// the useQuery with the API I like
export default function useQuery(passedOptions) {
  const options = {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
    ...passedOptions
  }

  const result = useQueryBase<any, any>(options)

  return {
    ...cloneDeep(result.data),
    ...result
  }
}
