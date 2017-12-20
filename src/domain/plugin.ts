import Command from './command'

/**
 * Extends the environment with new commands.
 */
class Plugin {
  name?: string
  description?: string
  defaults: object
  directory?: string
  hidden: boolean
  commands: Command[]
  extensions: object[]

  constructor() {
    this.name = null
    this.description = null
    this.defaults = {}
    this.directory = null
    this.hidden = false
    /**
     * A list of commands.
     */
    this.commands = []
    this.extensions = []
  }
}

export default Plugin
