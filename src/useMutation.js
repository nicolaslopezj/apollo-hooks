import useClient from './useClient'
import filterObject from './filterObject'
import cloneDeep from 'lodash/cloneDeep'

export default function useMutation(mutation, baseOptions) {
  const client = useClient()
  return async (variables, localOptions) => {
    const finalVariables = filterObject(cloneDeep(variables), '__typename')
    const result = await client.mutate({
      mutation,
      variables: finalVariables,
      ...baseOptions,
      ...localOptions
    })
    return result.data
  }
}
