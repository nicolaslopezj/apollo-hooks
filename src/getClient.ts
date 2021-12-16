import {ClientsMap} from './ApolloContext'

export default function (clients: ClientsMap, clientName: string) {
  if (!clients) {
    throw new Error(
      `Could not find "client" in the context of ApolloConsumer. Wrap the root component in an <ApolloProvider>`
    )
  }

  if (!clientName) {
    clientName = 'client'
  }

  if (!clients[clientName]) {
    throw new Error(
      `Could not find client "${clientName}" in the context of ApolloConsumer. Wrap the root component in an <ApolloProvider>`
    )
  }

  const client = clients[clientName]
  return client
}
