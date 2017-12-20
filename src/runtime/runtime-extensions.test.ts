import test from 'ava'
import Runtime from './runtime'
import { pipe, pluck, join } from 'ramda'

test('loads the core extensions in the right order', t => {
  const r = new Runtime()
  const list = pipe(pluck('name'), join(', '))(r.extensions)

  t.is(list, 'meta, strings, print, template, filesystem, semver, system, http, prompt, patching')
})
