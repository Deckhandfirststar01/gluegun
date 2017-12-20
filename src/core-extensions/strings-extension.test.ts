import test from 'ava'
import createExtension from './strings-extension'

test('has the proper interface', t => {
  const context = {}
  createExtension(context)
  const ext = context.strings
  t.truthy(ext)
  t.is(typeof ext.trim, 'function')
  t.is(ext.trim('  lol'), 'lol')
})
