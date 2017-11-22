const compose = (...functions) => async value => {
  let result = value

  for (const fn of functions) {
    result = (await fn)(result)
  }

  return result
}

module.exports = {
  compose
}
