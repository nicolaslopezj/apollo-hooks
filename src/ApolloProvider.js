import React from 'react'
import ApolloContext from './ApolloContext'

export default function ApolloProvider({children, client}) {
  return <ApolloContext.Provider value={client}>{children}</ApolloContext.Provider>
}
