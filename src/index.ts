// --- Hackasaurus Rex --------------------------------------------------------
//
// https://github.com/patrick-steele-idem/app-module-path-node
// https://gist.github.com/branneman/8048520
//
// This adds the node_modules for `gluegun` to the "search path".
//
// So, wherever folks have their scripts (plugins or their apps), they will be
// given a chance to resolve dependencies back up to gluegun's node_modules.
//
// I may be going to hell for this, but I'm taking you bastards with me.
// ----------------------------------------------------------------------------

// first, do a sniff test to ensure our dependencies are met
const sniff = require('../sniff')

// check the node version
if (!sniff.isNewEnough) {
  console.log('Node.js 7.6+ is required to run. You have ' + sniff.nodeVersion + '. Womp, womp.')
  process.exit(1)
}

// bring in a few extensions to make available for stand-alone purposes
import attachFilesystemExtension from './core-extensions/filesystem-extension'
import attachSemverExtension from './core-extensions/semver-extension'
import attachSystemExtension from './core-extensions/system-extension'
import attachPromptExtension from './core-extensions/prompt-extension'
import attachHttpExtension from './core-extensions/http-extension'
import attachTemplateExtension from './core-extensions/template-extension'
import attachPatchingExtension from './core-extensions/patching-extension'

// bring in some context
import build from './domain/builder'
import strings from './utils/string-utils'
import print from './utils/print'
import { printHelp, printCommands } from './utils/print-help'

// we want to see real exceptions with backtraces and stuff
process.removeAllListeners('unhandledRejection')
process.on('unhandledRejection', up => {
  throw up
})

require('app-module-path').addPath(`${__dirname}/../node_modules`)
require('app-module-path').addPath(process.cwd())
// ----------------------------------------------------------------------------

// wrap all this in a function call to avoid global scoping

const context = {
  build,
  strings,
  print,
  printCommands,
  printHelp,
}

attachFilesystemExtension(context)
attachSemverExtension(context)
attachSystemExtension(context)
attachPromptExtension(context)
attachHttpExtension(context)
attachTemplateExtension(context)
attachPatchingExtension(context)

export { build, strings, print, printCommands, printHelp }

// export our API
// export { build, strings, print, printCommands, printHelp }
export default context
