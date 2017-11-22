import test from 'ava'

import * as lib from '../src/index.js'

test('compose composes all functions', async t => {
  const add = x => y => x + y
  const multiply = x => async y => x * y
  const add5multiply3 = lib.compose(add(5), multiply(3))

  const result = await add5multiply3(10)

  t.is(result, 45)
})

test('clone creates a deep clone of an object', t => {
  t.plan(2)

  const original = { a: { b: 42 }, c: new Date('13-12-2017') }
  const copy = lib.clone(original)

  original.a.b = 32

  t.not(original, copy)
  t.not(original.a.b, copy.a.b)
})

test('mutate changes a field deep inside the object using a mutation function', async t => {
  const source = { counter: 10 }
  const mutation = x => x / 2

  const result = await lib.mutate('counter')(mutation)(source)

  t.is(result.counter, 5)
})

test('createStore returns an object with the same interface as redux store', t => {
  t.plan(3)

  const store = lib.createStore()

  t.true(typeof store.getState === 'function')
  t.true(typeof store.dispatch === 'function')
  t.true(typeof store.subscribe === 'function')
})
