import { isBlank } from '../utils/string-utils'
import { isNotFile } from '../utils/filesystem-utils'
import { throwWhen } from '../utils/throw-when'

// try loading this module
function loadModule(path) {
  throwWhen('path is required', isBlank, path)
  throwWhen(`${path} is not a file`, isNotFile, path)

  require.resolve(path)
  return require(path)
}

export default loadModule
