import { isNilOrEmpty } from 'ramdasauce'
import { find, isNil, equals, reduce, sort } from 'ramda'

import Runtime from './runtime'
import Command from '../domain/command'
import Plugin from '../domain/plugin'

export function findCommand(runtime: Runtime, parameters: any) {
  let rest: string[]
  let targetCommand: Command

  const commandPath: string[] = parameters.array

  const targetPlugin = find((plugin: Plugin) => {
    if (isNil(plugin) || isNilOrEmpty(plugin.commands)) return false

    // track the rest of the commandPath as we traverse
    rest = commandPath.slice() // dup

    // traverse through the command path, retrieving aliases along the way
    const finalCommandPath = reduce((prevPath, currName) => {
      // find a command that fits the previous path + currentName, which can be an alias
      const cmd = find(
        command => {
          return equals(command.commandPath.slice(0, -1), prevPath) && command.matchesAlias(currName)
        },
        // sorted shortest path to longest
        sort((a, b) => a.commandPath.length - b.commandPath.length, plugin.commands),
      )

      if (cmd) {
        rest.shift() // remove the current item
        return cmd.commandPath
      } else {
        return prevPath
      }
    }, [])(commandPath)

    if (finalCommandPath.length === 0) {
      // If we're not looking down a command path, look for dashed commands or a default command
      const dashedOptions = Object.keys(parameters.options).filter(k => parameters.options[k] === true)

      targetCommand = find(command => {
        // dashed commands, like --version or -v
        const dashMatch = command.dashed && command.matchesAlias(dashedOptions)
        const isDefault = equals(command.commandPath, [plugin.name])
        return dashMatch || isDefault
      }, plugin.commands)
    } else {
      targetCommand = find(command => equals(command.commandPath, finalCommandPath), plugin.commands)
    }

    // Did we find the targetCommand?
    return Boolean(targetCommand)
  }, runtime.plugins)

  return { plugin: targetPlugin, command: targetCommand, array: rest }
}
