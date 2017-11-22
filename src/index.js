import 'babel-polyfill'

import equals from 'shallow-equals'

export function clone (item) {
  if (!item) { return item }

  let types = [ Number, String, Boolean ]

  for (let type of types) {
    if (item instanceof type) {
      return type(item)
    }
  }

  if (Array.isArray(item)) {
    let result = []

    for (let e of item) {
      result.push(clone(e))
    }

    return result
  }

  if (item instanceof Date) {
    return new Date(item)
  }

  if (item instanceof RegExp) {
    return new RegExp(item)
  }

  if (typeof item === 'object') {
    let result = {}
    for (let [ key, value ] of Object.entries(item)) {
      result[key] = clone(value)
    }

    return result
  }

  return item
}

export const compose = (...functions) => async value => {
  let result = value

  for (const fn of functions) {
    result = (await fn)(result)
  }

  return result
}

export const mutate = ppath => (...pmutations) => async psubject => {
  let path = await ppath
  let paths = path.split('.')
  let mutation = await compose(...pmutations)
  let subject = await psubject

  let root = clone(subject)
  let target = root
  let fields = paths.slice(0, -1)
  let lastField = paths.slice(-1)

  for (const field of fields) {
    target = target[field]
  }

  target[lastField] = await mutation(target[lastField])
  return root
}

export const get = ppath => psubject => async (...pmutation) => {
  let path = await ppath
  let paths = path.split('.')
  let mutation = await compose(...pmutation)
  let subject = await psubject

  let target = clone(subject)
  let fields = paths.slice(0, -1)
  let lastField = paths.slice(-1)

  for (const field of fields) {
    target = target[field]
  }

  return mutation(target[lastField])
}

export const bind = fn => (...args) => (...rest) => fn(...args, ...rest)

export function createStore (initialState) {
  let state = initialState
  let subscribers = []

  function subscribe (handler) {
    subscribers = subscribers.concat(handler)
  }

  function notify (state) {
    subscribers.forEach(subscriber => {
      subscriber(state)
    })
  }

  function getState () {
    return state
  }

  function isEqual (x, y) {
    return equals(x, y, function compareInner (a, b) {
      if (typeof a === 'object' && typeof b === 'object') {
        return equals(a, b, compareInner)
      }

      return a === b
    })
  }

  function dispatchSync (morphism) {
    let newState = morphism(state)

    if (!isEqual(state, newState)) {
      state = newState

      notify(state)
    }
  }

  function dispatch (morphism) {
    morphism(state).then(newState => {
      if (!isEqual(state, newState)) {
        state = newState

        notify(state)
      }
    })
  }

  return {
    subscribe,
    getState,
    dispatchSync,
    dispatch
  }
}
