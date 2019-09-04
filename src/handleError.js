export default function(result) {
  const message = result.errors[0].message
  const error = new Error(message)
  error.isApolloError = true
  error.errors = result.errors
  throw error
}
