import useClients from './useClients'
import filterObject from './filterObject'
import cloneDeep from 'lodash/cloneDeep'
import getClient from './getClient'

export default function useMutation(mutation: any, baseOptions?: any) {
  const clients = useClients()
  return async (variables, localOptions = {}) => {
    const finalOptions = {...baseOptions, ...localOptions}
    const client = getClient(clients, finalOptions.clientName)
    const finalVariables = filterObject(cloneDeep(variables), '__typename')
    const result = await client.mutate({
      mutation,
      variables: finalVariables,
      ...finalOptions
    })
    return result.data
  }
}
