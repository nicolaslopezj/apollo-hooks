import ApolloContext from './ApolloContext'
import {useContext} from 'react'

export default function useClient() {
  const client = useContext(ApolloContext)
  if (!client) {
    throw new Error(
      `Could not find "client" in the context of ApolloConsumer. Wrap the root component in an <ApolloProvider>`
    )
  }
  return client
}
