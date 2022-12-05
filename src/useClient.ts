import ApolloContext from './ApolloContext'
import {useContext} from 'react'
import getClient from './getClient'

export default function useClient(clientName?: string) {
  const clients = useContext(ApolloContext)
  return getClient(clients, clientName)
}
