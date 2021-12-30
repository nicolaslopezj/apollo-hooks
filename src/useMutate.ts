import filterObject from './filterObject'
import cloneDeep from 'lodash/cloneDeep'
import useClients from './useClients'
import getClient from './getClient'
import {MutationOptions} from '@apollo/client'
import {omit} from 'lodash'

export type UseMutateOptions<TData, TVariables> = MutationOptions<TData, TVariables, any> & {
  clientName?: string
}

export default function useMutate() {
  const clients = useClients()
  return async <TData, TVariables>(options: UseMutateOptions<TData, TVariables>) => {
    const finalVariables = filterObject(cloneDeep(options.variables || {}), '__typename')
    const client = getClient(clients, options.clientName)
    const result = await client.mutate<TData, TVariables>({
      ...omit(options, 'clientName'),
      variables: finalVariables
    })
    return result.data
  }
}
