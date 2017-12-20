import { resolve } from 'path'
import { chmodSync } from 'fs'

export default context => {
  context.filesystem.resolve = resolve
  context.filesystem.chmodSync = chmodSync
}
