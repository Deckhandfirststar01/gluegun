import { pipe, map, sortBy, prop, propEq, reject, replace, unnest, equals } from 'ramda'

import RunContext from '../domain/run-context'
import Plugin from '../domain/plugin'

/**
 * Is this a hidden command?
 */
const isHidden = propEq('hidden', true)

/**
 * Gets the list of plugins.
 *
 * @param {RunContext} context     The context
 * @param {Plugin[]} plugins       The plugins holding the commands
 * @param {string[]} commandRoot   Optional, only show commands with this root
 * @return {[string, string]}
 */
export function commandInfo(context: RunContext, plugins?: Plugin[], commandRoot?: string[]): any {
  return pipe(reject(isHidden), sortBy(prop('name')), map(p => getListOfCommands(context, p, commandRoot)), unnest)(
    plugins || context.runtime.plugins,
  )
}

/**
 * Gets the list of commands for the given plugin.
 *
 * @param {RunContext} context     The context
 * @param {Plugin} plugin          The plugins holding the commands
 * @param {string[]} commandRoot   Optional, only show commands with this root
 * @return {[string, string]}
 */
export function getListOfCommands(context: RunContext, plugin?: Plugin, commandRoot?: string[]) {
  return pipe(
    reject(isHidden),
    reject(command => {
      if (!commandRoot) {
        return false
      }
      return !equals(command.commandPath.slice(0, commandRoot.length), commandRoot)
    }),
    map(command => {
      const alias = command.hasAlias() ? `(${command.aliases.join(', ')})` : ''
      return [
        `${command.commandPath.join(' ')} ${alias}`,
        replace('$BRAND', context.runtime.brand, command.description || '-'),
      ]
    }),
  )(plugin.commands)
}
