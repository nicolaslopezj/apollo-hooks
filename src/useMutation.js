import useClient from './useClient'

export default function useMutation(mutation, baseOptions) {
  const client = useClient()
  return (variables, localOptions) => {
    return client.mutate({
      mutation,
      variables,
      ...baseOptions,
      ...localOptions
    })
  }
}
