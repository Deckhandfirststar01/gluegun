import Plugin from './plugin'
import Command from './command'
import Runtime from '../runtime/runtime'
import Options from './options'
import { GluegunRunContext } from '../index'

export interface RunContextParameters {
  array?: string[]
  options?: Options
  first?: string
  second?: string
  third?: string
  string?: string
  raw?: any
  argv?: any
}

export interface GluegunRunContext {
  // our catch-all! since we can add whatever to this object
  [key: string]: any

  // known properties
  result?: any
  error?: any
  config: object
  parameters?: RunContextParameters
  plugin?: Plugin
  command?: Command
  pluginName?: string
  commandName?: string
  runtime?: Runtime
}

export default class RunContext implements GluegunRunContext {
  // our catch-all! since we can add whatever to this object
  [key: string]: any

  // known properties
  result?: any
  error?: any
  config: object
  parameters?: RunContextParameters
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
