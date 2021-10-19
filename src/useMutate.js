import filterObject from './filterObject'
import cloneDeep from 'lodash/cloneDeep'
import useClients from './useClients'
import getClient from './getClient'

export default function useMutate() {
  const clients = useClients()
  return async options => {
    const finalVariables = filterObject(cloneDeep(options.variables || {}), '__typename')
    const client = getClient(clients, options.clientName)
    const result = await client.mutate({
      ...options,
      variables: finalVariables
    })
    return result.data
  }
}
