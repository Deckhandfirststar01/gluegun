import test from 'ava'
import createExtension from './prompt-extension'

test('has the proper interface', t => {
  const context = {}
  createExtension(context)
  const ext = context.prompt
  t.truthy(ext)
  t.is(typeof ext.ask, 'function')
  t.is(typeof ext.separator, 'function')
  t.is(typeof ext.question, 'function')
})
