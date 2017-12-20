import Plugin from './plugin'
import Command from './command'
import Runtime from '../runtime/runtime'

class RunContext {
  // our catch-all! since we can add whatever to this object
  [key: string]: any

  // known properties
  result?: any
  error?: any
  config: object
  parameters: object
  plugin?: Plugin
  command?: Command
  pluginName?: string
  commandName?: string
  runtime?: Runtime

  constructor() {
    /**
     * The result of the run command.
     */
    this.result = null

    /**
     * An error, if any.
     */
    this.error = null

    /**
     * The configuration.  A mashup of defaults + overrides.
     */
    this.config = {}

    /**
     *  The parameters like the command line options and arguments.
     */
    this.parameters = {}
  }
}

export default RunContext
