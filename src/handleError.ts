export default function (result, options) {
  const message = result.errors[0].message
  const error: any = new Error(message)
  error.isApolloError = true
  error.errors = result.errors
  error.result = result
  error.options = options
  throw error
}
