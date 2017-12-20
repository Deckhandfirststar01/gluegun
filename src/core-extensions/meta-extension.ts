import { getVersion } from '../utils/get-version'
import { commandInfo } from '../utils/command-info'

/**
 * Extension that lets you learn more about the currently running CLI.
 *
 * @param  {RunContext} context The running context.
 */
function attach(context) {
  context.meta = {
    version: () => getVersion(context),
    commandInfo: () => commandInfo(context),
  }
  context.version = context.meta.version // easier access to version
}

module.exports = attach
