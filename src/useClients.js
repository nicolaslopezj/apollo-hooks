import ApolloContext from './ApolloContext'
import {useContext} from 'react'

export default function useClients() {
  return useContext(ApolloContext)
}
