import cloneDeep from 'lodash/cloneDeep'
import useQueryBase, {UseQueryOptions} from './useQueryBase'

// the useQuery with the API I like
export default function useQuery<TData = any, TVariables = any>(
  passedOptions: UseQueryOptions<TData, TVariables>
) {
  const options: UseQueryOptions<TData, TVariables> = {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
    ...passedOptions
  }

  const result = useQueryBase<TData, TVariables>(options)

  return {
    ...cloneDeep(result.data),
    ...result
  }
}
