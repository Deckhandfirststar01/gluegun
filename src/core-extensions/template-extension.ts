import ejs from 'ejs'
import jetpack from 'fs-jetpack'
import { replace, forEach, keys } from 'ramda'
import * as stringUtils from '../utils/string-utils'
import { isFile } from '../utils/filesystem-utils'
import Options from '../domain/options'

/**
 * Builds the code generation feature.
 *
 * @param  {RunContext} context The running context.
 */
function attach(context) {
  const { plugin } = context

  /**
   * Generates a file from a template.
   *
   * @param  {{}} opts Generation options.
   * @return {string}  The generated string.
   */
  async function generate(opts: Options = {}) {
    // required
    const template = opts.template

    // optional
    const target = opts.target
    const props = opts.props || {}

    // add some goodies to the environment so templates can read them
    const data = {
      config: context && context.config,
      parameters: context && context.parameters,
      props: props,
    }

    // add our string utils to the filters available.
    forEach(x => {
      data[x] = stringUtils[x]
    }, keys(stringUtils))

    // pick a base directory for templates
    const directory = opts.directory ? opts.directory : `${plugin && plugin.directory}/templates`

    const pathToTemplate = `${directory}/${template}`

    // bomb if the template doesn't exist
    if (!isFile(pathToTemplate)) {
      throw new Error(`template not found ${pathToTemplate}`)
    }

    // read the template
    const templateContent = jetpack.read(pathToTemplate)

    // render the template
    const content = ejs.render(templateContent, data)

    // save it to the file system
    if (!stringUtils.isBlank(target)) {
      // prep the destination directory
      const dir = replace(/$(\/)*/g, '', target)
      const dest = `${jetpack.cwd()}/${dir}`

      jetpack.write(dest, content)
    }

    // send back the rendered string
    return content
  }

  context.template = { generate }
}

module.exports = attach
