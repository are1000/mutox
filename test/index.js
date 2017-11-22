import test from 'ava'

import * as lib from '../src/index.js'

test('compose composes all functions', async t => {
  const add = x => y => x + y
  const multiply = x => async y => x * y
  const add5multiply3 = lib.compose(add(5), multiply(3))

  const result = await add5multiply3(10)

  t.is(result, 45)
})
