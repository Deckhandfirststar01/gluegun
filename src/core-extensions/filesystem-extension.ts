import jetpack from 'fs-jetpack'
import { EOL } from 'os'
import { sep } from 'path'
import { subdirectories } from '../utils/filesystem-utils'

/**
 * Extensions to filesystem.  Brought to you by fs-jetpack.
 *
 * @param  {RunContext} context The running context.
 */
function attach(context) {
  const extension = jetpack // jetpack
  extension.eol = EOL // end of line marker
  extension.separator = sep // path separator
  extension.subdirectories = subdirectories

  context.filesystem = extension
}

export default attach
