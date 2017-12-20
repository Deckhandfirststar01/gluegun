const Runtime = require('../runtime/runtime')
const { dissoc } = require('ramda')

/**
 * Provides a cleaner way to build a runtime.
 *
 * @class Builder
 */
class Builder {
  constructor () {
    this.runtime = new Runtime()
  }

  /**
   * Set the brand.
   *
   * @value {string} The brand.
   * @return {Builder} self.
   */
  brand (value) {
    this.runtime.brand = value
    return this
  }

  /**
   * Specifies where the default commands and extensions live.
   *
   * @param  {string}  value   The default plugin directory.
   * @param  {Object}  options Additional loading options.
   * @return {Builder}         self.
   */
  src (value, options = {}) {
    this.runtime.src(value, options)
    return this
  }

  /**
   * Add a plugin to the list.
   *
   * @param  {string}  value   The plugin directory.
   * @param  {Object}  options Additional loading options.
   * @return {Builder}         self.
   */
  plugin (value, options = {}) {
    this.runtime.plugin(value, options)
    return this
  }

  /**
   * Add a plugin group to the list.
   *
   * @param  {string}  value   The directory with sub-directories.
   * @param  {Object}  options Additional loading options.
   * @return {Builder}         self.
   */
  plugins (value, options = {}) {
    this.runtime.plugins(value, entry)
    return this
  }

  /**
   * Add a default help handler.
   * @param  {any} command An optional command function or object
   * @return {Builder}         self.
   */
  help (command) {
    command = command || require(`../core-commands/help`)
    if (typeof command === 'function') {
      command = { name: 'help', alias: ['h'], dashed: true, run: command }
    }
    return this.command(command)
  }

  /**
   * Add a default version handler.
   * @param  {any} command An optional command function or object
   * @return {Builder}         self.
   */
  version (command) {
    command = command || require(`../core-commands/version`)
    if (typeof command === 'function') {
      command = { name: 'version', alias: ['v'], dashed: true, run: command }
    }
    return this.command(command)
  }

  /**
   * Add a default command that runs if none other is found.
   * @param  {any} command An optional command function or object
   * @return {Builder}         self.
   */
  defaultCommand (command) {
    command = command || require(`../core-commands/default`)
    if (typeof command === 'function') {
      command = { run: command }
    }
    command.name = this.brand
    return this.command(command)
  }

  /**
   * Add a way to add an arbitrary command when building the CLI.
   * @param {Object}
   * @return {Builder}
   */
  command (command) {
    this.runtime.command(command)
    return this
  }
}

/**
 * Export it as a factory function.
 */
module.exports = function build () {
  return new Builder()
}
