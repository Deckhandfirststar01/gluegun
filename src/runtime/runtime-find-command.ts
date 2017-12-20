// TODODOOOOOOO

export default function findCommand(runtime, parameters) {
  return find(plugin => {
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
      const dashedOptions = Object.keys(options).filter(k => options[k] === true)

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
  }, plugins)
}
