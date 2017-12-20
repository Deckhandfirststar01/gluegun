import yargsParse from 'yargs-parser'
import { merge } from 'ramda'

const COMMAND_DELIMITER = ' '

/**
 * Parses given command arguments into a more useful format.
 *
 * @param {string|string[]} commandArray
 * @param {Object} extraOpts
 * @returns {Object}
 */
function parseParams(commandArray, extraOpts = {}) {
  // use the command line args if not passed in
  if (is(String, commandArray)) {
    commandArray = commandArray.split(COMMAND_DELIMITER)
  }

  // remove the first 2 args if it comes from process.argv
  if (equals(commandArray, process.argv)) {
    commandArray = commandArray.slice(2)
  }

  // chop it up yargsParse!
  const parsed = yargsParse(commandArray)
  const array = parsed._.slice()
  delete parsed._
  const options = merge(parsed, extraOpts)
  return { array, options }
}

/**
 * Constructs the parameters object.
 *
 * @param {{}} params         Provided parameters
 * @return {{}}               An object with normalized parameters
 */
function createParams(params) {
  // make a copy of the args so we can mutate it
  const array = params.array.slice()

  // Remove the first two elements from the array if they're the plugin and command
  if (array[0] === params.plugin) array.shift()
  if (array[0] === params.command) array.shift()

  const first = array[0]
  const second = array[1]
  const third = array[2]

  // the string is the rest of the words
  const string = array.join(' ')

  // :shipit:
  return Object.assign(params, {
    array,
    first,
    second,
    third,
    string,
  })
}

export default { parseParams, createParams }