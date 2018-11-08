/**
 * This code is based on
 * https://github.com/trojanowski/react-apollo-hooks/blob/master/src/index.js
 */

import {useEffect, useRef, useState} from 'react'
import isEqual from 'react-fast-compare'
import useClient from './useClient'
import objToKey from './objectToKey'

export default function useQueryBase(
  query,
  {variables, context: apolloContextOptions, ...restOptions} = {}
) {
  const client = useClient()
  const [result, setResult] = useState()
  const previousQuery = useRef()
  // treat variables and context options separately because they are objects
  // and the other options are JS primitives
  const previousVariables = useRef()
  const previousApolloContextOptions = useRef()
  const previousRestOptions = useRef()
  const observableQuery = useRef()

  useEffect(
    () => {
      const subscription = observableQuery.current.subscribe(nextResult => {
        setResult(nextResult)
      })

      return () => {
        subscription.unsubscribe()
      }
    },
    [query, objToKey(variables), objToKey(previousApolloContextOptions), objToKey(restOptions)]
  )

  const helpers = {
    fetchMore: opts => observableQuery.current.fetchMore(opts),
    refetch: opts => observableQuery.current.refetch(opts)
  }

  if (
    !(
      query === previousQuery.current &&
      isEqual(variables, previousVariables.current) &&
      isEqual(apolloContextOptions, previousApolloContextOptions.current) &&
      isEqual(restOptions, previousRestOptions.current)
    )
  ) {
    previousQuery.current = query
    previousVariables.current = variables
    previousApolloContextOptions.current = apolloContextOptions
    previousRestOptions.current = restOptions
    const watchedQuery = client.watchQuery({
      query,
      variables,
      ...restOptions
    })
    observableQuery.current = watchedQuery
    const currentResult = watchedQuery.currentResult()
    if (currentResult.partial) {
      // throw a promise - use the react suspense to wait until the data is
      // available
      throw watchedQuery.result()
    }
    setResult(currentResult)
    return {...helpers, ...currentResult}
  }

  return {...helpers, ...result}
}
