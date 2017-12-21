import test from 'ava'
import { commandInfo } from './command-info'
import RunContext from '../domain/run-context'
import Runtime from '../runtime/runtime'
import Plugin from '../domain/plugin'
import Command from '../domain/command'

test('commandInfo', t => {
  const fakeContext = new RunContext()
  fakeContext.runtime = new Runtime()
  const fakePlugin = new Plugin()
  const fakeCommand = new Command()
  fakeCommand.name = 'foo'
  fakeCommand.description = 'foo is a command'
  fakeCommand.commandPath = ['foo']
  fakeCommand.alias = ['f']
  fakePlugin.commands = [fakeCommand]

  const info = commandInfo(fakeContext)
  t.deepEqual(info, [['foo (f)', 'foo is a command']])
})
