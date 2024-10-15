import {DocumentNode, MutationOptions, TypedDocumentNode} from '@apollo/client'
import cloneDeep from 'lodash/cloneDeep'
import omit from 'lodash/omit'
import filterObject from './filterObject'
import getClient from './getClient'
import useClients from './useClients'

export type UseMutateOptions<TData, TVariables> = Omit<
  MutationOptions<TData, TVariables, any>,
  'mutation'
> & {
  clientName?: string
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>
}

export function useMutate() {
  const clients = useClients()
  return async <TData = any, TVariables = any>(options: UseMutateOptions<TData, TVariables>) => {
    const finalVariables = filterObject(cloneDeep(options.variables || {}), '__typename')
    const client = getClient(clients, options.clientName)
    const result = await client.mutate<TData, TVariables>({
      ...omit(options, 'clientName'),
      variables: finalVariables,
    })
    return result.data
  }
}
