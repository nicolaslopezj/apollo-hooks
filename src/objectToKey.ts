export default function objectToKey(obj) {
  if (!obj) {
    return null
  }
  const keys = Object.keys(obj)
  keys.sort()
  const sortedObj = keys.reduce((result, key) => {
    result[key] = obj[key]
    return result
  }, {})
  return JSON.stringify(sortedObj)
}
