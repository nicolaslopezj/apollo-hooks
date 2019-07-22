import useClient from './useClient'
import filterObject from './filterObject'
import cloneDeep from 'lodash/cloneDeep'

export default function useMutate() {
  const client = useClient()
  return async options => {
    const finalVariables = filterObject(cloneDeep(options.variables || {}), '__typename')
    const result = await client.mutate({
      ...options,
      variables: finalVariables
    })
    return result.data
  }
}
