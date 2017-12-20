import RunContext from './run-context'

/**
 * A command is user-callable function that runs stuff.
 */
class Command {
  name?: string
  description?: string
  file?: string
  run?: (context: RunContext) => any
  hidden: boolean
  commandPath?: string[]
  alias: string[]
  dashed: boolean

  constructor() {
    this.name = null
    this.description = null
    this.file = null
    this.run = null
    this.hidden = false
    this.commandPath = null
    this.alias = []
    this.dashed = false
  }

  get aliases(): string[] {
    if (!this.alias) {
      return []
    }
    return Array.isArray(this.alias) ? this.alias : [this.alias]
  }

  hasAlias() {
    return this.aliases.length > 0
  }

  /**
   * Checks if a given alias matches with this command's aliases, including name.
   * Can take a list of aliases too and check them all.
   *
   * @param {string|string[]} alias
   */
  matchesAlias(alias) {
    const aliases = Array.isArray(alias) ? alias : [alias]
    return aliases.find(a => this.name === a || this.aliases.includes(a))
  }
}

export default Command
