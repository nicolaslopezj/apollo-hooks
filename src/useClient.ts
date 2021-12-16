/**
 * This code is from
 * https://github.com/trojanowski/react-apollo-hooks/blob/master/src/index.js
 */

import ApolloContext from './ApolloContext'
import {useContext} from 'react'
import getClient from './getClient'

export default function useClient(clientName) {
  const clients = useContext(ApolloContext)
  return getClient(clients, clientName)
}
