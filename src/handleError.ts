import {ApolloQueryResult} from '@apollo/client'
import {UseQueryOptions} from './useQuery'

export default function defaultHandleError(
  result: ApolloQueryResult<any>,
  options: UseQueryOptions<any, any>
) {
  const message = result.errors[0].message
  const error: any = new Error(message)
  error.isApolloError = true
  error.errors = result.errors
  error.result = result
  error.options = options
  throw error
}
