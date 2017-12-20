// check the node version
import semver from 'semver'

const nodeMinimum = '7.6.0'
const nodeVersion = process.version.replace('v', '')
const isNewEnough = semver.satisfies(nodeVersion, '>= ' + nodeMinimum)
let hasAsyncAwait = false
let ok = false

// check for the harmony-enabled features
try {
  require('./src/utils/async-await-check')
  hasAsyncAwait = true
} catch (e) {}

ok = hasAsyncAwait && isNewEnough

export default {
  nodeMinimum,
  nodeVersion,
  isNewEnough,
  hasAsyncAwait,
  ok,
}
