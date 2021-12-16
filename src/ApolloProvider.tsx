import React from 'react'
import ApolloContext from './ApolloContext'

export default function ApolloProvider({children, client, ...otherClients}) {
  const clients = {
    client,
    ...otherClients
  }
  return <ApolloContext.Provider value={clients}>{children}</ApolloContext.Provider>
}
