import { always, is, isEmpty, pipe, when } from 'ramda'
import camelCase from 'lodash.camelcase'
import kebabCase from 'lodash.kebabcase'
import snakeCase from 'lodash.snakecase'
import upperCase from 'lodash.uppercase'
import lowerCase from 'lodash.lowercase'
import startCase from 'lodash.startcase'
import upperFirst from 'lodash.upperfirst'
import lowerFirst from 'lodash.lowerfirst'
import pad from 'lodash.pad'
import padStart from 'lodash.padstart'
import padEnd from 'lodash.padend'
import trim from 'lodash.trim'
import trimStart from 'lodash.trimstart'
import trimEnd from 'lodash.trimend'
import repeat from 'lodash.repeat'
import pluralize from 'pluralize'

const {
  plural,
  singular,
  addPluralRule,
  addSingularRule,
  addIrregularRule,
  addUncountableRule,
  isPlural,
  isSingular,
} = pluralize

/**
 * Is this not a string?
 *
 * @param  {any}     value The value to check
 * @return {boolean}       True if it is not a string, otherwise false
 */
const isNotString = value => {
  return !is(String, value)
}

/**
 * Is this value a blank string?
 *
 * @param   {any}     value The value to check.
 * @returns {boolean}       True if it was, otherwise false.
 */
const isBlank = value => {
  const check = pipe(when(isNotString, always('')), trim, isEmpty)

  return check(value)
}

/**
 * Returns the value it is given
 *
 * @param {any} value
 * @returns     the value.
 */
function identity(value) {
  return value
}

/**
 * Converts the value ToPascalCase.
 *
 * @param {string} value The string to convert
 * @returns {string}
 */
function pascalCase(value) {
  return pipe(camelCase, upperFirst)(value)
}

export default {
  identity,
  isBlank,
  isNotString,
  camelCase,
  kebabCase,
  snakeCase,
  upperCase,
  lowerCase,
  startCase,
  upperFirst,
  lowerFirst,
  pascalCase,
  pad,
  padStart,
  padEnd,
  trim,
  trimStart,
  trimEnd,
  repeat,
  pluralize,
  plural,
  singular,
  addPluralRule,
  addSingularRule,
  addIrregularRule,
  addUncountableRule,
  isPlural,
  isSingular,
}
