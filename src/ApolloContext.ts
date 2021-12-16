import ApolloClient from 'apollo-client'
import React from 'react'

export interface ClientsMap {
  [key: string]: ApolloClient<any>
}

export default React.createContext<ClientsMap>(null)
