import RunContext from './run-context'

/**
 * An extension will add functionality to the context that each command will receive.
 */
export default class Extension {
  name?: string
  description?: string
  file?: string
  setup?: (context: RunContext) => void

  constructor() {
    this.name = null
    this.description = null
    this.file = null
    this.setup = null
  }
}
