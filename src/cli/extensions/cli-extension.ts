import { resolve } from 'path'
import { chmodSync } from 'fs'

module.exports = context => {
  context.filesystem.resolve = resolve
  context.filesystem.chmodSync = chmodSync
}
