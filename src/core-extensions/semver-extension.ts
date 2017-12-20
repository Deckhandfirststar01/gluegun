import semver from 'semver'

/**
 * Extensions to access semver and helpers
 *
 * @param  {RunContext} context The running context.
 */
function attach(context) {
  const extension = semver // semver
  // Add bells and whistles here

  context.semver = extension
}

export default attach
