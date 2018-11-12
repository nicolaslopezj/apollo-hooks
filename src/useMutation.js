/**
 * This code is from
 * https://github.com/trojanowski/react-apollo-hooks/blob/master/src/index.js
 */

import useClient from './useClient'

export default function useMutation(mutation, baseOptions) {
  const client = useClient()
  return async (variables, localOptions) => {
    const result = await client.mutate({
      mutation,
      variables,
      ...baseOptions,
      ...localOptions
    })
    return result.data
  }
}
