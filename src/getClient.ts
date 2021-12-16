export default function (clients, clientName) {
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

  return clients[clientName]
}
