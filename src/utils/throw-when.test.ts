import { T, F } from 'ramda'
import test from 'ava'
import { throwWhen } from './throw-when'

test('it throws', t => {
  t.throws(() => throwWhen('lulz', T, 1))
})

test("it doesn't throws", t => {
  throwWhen('lulz', F, 1)
  t.pass()
})
