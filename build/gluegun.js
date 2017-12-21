var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define("utils/string-utils", ["require", "exports", "ramda", "lodash.camelcase", "lodash.kebabcase", "lodash.snakecase", "lodash.uppercase", "lodash.lowercase", "lodash.startcase", "lodash.upperfirst", "lodash.lowerfirst", "lodash.pad", "lodash.padstart", "lodash.padend", "lodash.trim", "lodash.trimstart", "lodash.trimend", "lodash.repeat", "pluralize"], function (require, exports, ramda_1, camelCase, kebabCase, snakeCase, upperCase, lowerCase, startCase, upperFirst, lowerFirst, pad, padStart, padEnd, trim, trimStart, trimEnd, repeat, pluralize) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.camelCase = camelCase;
    exports.kebabCase = kebabCase;
    exports.snakeCase = snakeCase;
    exports.upperCase = upperCase;
    exports.lowerCase = lowerCase;
    exports.startCase = startCase;
    exports.upperFirst = upperFirst;
    exports.lowerFirst = lowerFirst;
    exports.pad = pad;
    exports.padStart = padStart;
    exports.padEnd = padEnd;
    exports.trim = trim;
    exports.trimStart = trimStart;
    exports.trimEnd = trimEnd;
    exports.repeat = repeat;
    exports.pluralize = pluralize;
    const { plural, singular, addPluralRule, addSingularRule, addIrregularRule, addUncountableRule, isPlural, isSingular, } = pluralize;
    exports.plural = plural;
    exports.singular = singular;
    exports.addPluralRule = addPluralRule;
    exports.addSingularRule = addSingularRule;
    exports.addIrregularRule = addIrregularRule;
    exports.addUncountableRule = addUncountableRule;
    exports.isPlural = isPlural;
    exports.isSingular = isSingular;
    /**
     * Is this not a string?
     *
     * @param  {any}     value The value to check
     * @return {boolean}       True if it is not a string, otherwise false
     */
    const isNotString = value => {
        return !ramda_1.is(String, value);
    };
    exports.isNotString = isNotString;
    /**
     * Is this value a blank string?
     *
     * @param   {any}     value The value to check.
     * @returns {boolean}       True if it was, otherwise false.
     */
    const isBlank = (value) => {
        return isNotString(value) || ramda_1.isEmpty(trim(value));
    };
    exports.isBlank = isBlank;
    /**
     * Returns the value it is given
     *
     * @param {any} value
     * @returns     the value.
     */
    function identity(value) {
        return value;
    }
    exports.identity = identity;
    /**
     * Converts the value ToPascalCase.
     *
     * @param {string} value The string to convert
     * @returns {string}
     */
    function pascalCase(value) {
        return ramda_1.pipe(camelCase, upperFirst)(value);
    }
    exports.pascalCase = pascalCase;
});
define("utils/filesystem-utils", ["require", "exports", "fs-jetpack", "ramda", "utils/string-utils"], function (require, exports, jetpack, ramda_2, string_utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Is this a file?
     *
     * @param  {string} path The filename to check.
     * @return {bool}        `true` if the file exists and is a file, otherwise `false`.
     */
    const isFile = path => jetpack.exists(path) === 'file';
    exports.isFile = isFile;
    /**
     * Is this not a file?
     *
     * @param  {string} path The filename to check
     * @return {bool}        `true` if the file doesn't exist.
     */
    const isNotFile = ramda_2.complement(isFile);
    exports.isNotFile = isNotFile;
    /**
     * Is this a directory?
     *
     * @param {string} path The directory to check.
     * @return {bool}       `true` if the directory exists, otherwise false.
     */
    const isDirectory = path => jetpack.exists(path) === 'dir';
    exports.isDirectory = isDirectory;
    /**
     * Is this not a directory?
     *
     * @param {string} path The directory to check.
     * @return {bool}       `true` if the directory does not exist, otherwise false.
     */
    const isNotDirectory = ramda_2.complement(isDirectory);
    exports.isNotDirectory = isNotDirectory;
    /**
     * Gets the immediate subdirectories.
     *
     * @param  {string} path       Path to a directory to check.
     * @param  {bool}   isRelative Return back the relative directory?
     * @param  {string} matching   A jetpack matching filter
     * @param  {boolean} symlinks  If true, will include any symlinks along the way.
     * @return {string[]}          A list of directories
     */
    const subdirectories = (base, isRelative = false, matching = '*', symlinks = false) => {
        if (string_utils_1.isBlank(base) || !isDirectory(base))
            return [];
        const dirs = jetpack.cwd(base).find({
            matching,
            directories: true,
            recursive: false,
            files: false,
            symlinks,
        });
        if (isRelative) {
            return dirs;
        }
        else {
            return ramda_2.map(ramda_2.concat(`${base}/`), dirs);
        }
    };
    exports.subdirectories = subdirectories;
});
define("domain/options", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("domain/run-context", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RunContext {
        constructor() {
            /**
             * The result of the run command.
             */
            this.result = null;
            /**
             * An error, if any.
             */
            this.error = null;
            /**
             * The configuration.  A mashup of defaults + overrides.
             */
            this.config = {};
            /**
             *  The parameters like the command line options and arguments.
             */
            this.parameters = {};
        }
    }
    exports.default = RunContext;
});
define("domain/command", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A command is user-callable function that runs stuff.
     */
    class Command {
        constructor() {
            this.name = null;
            this.description = null;
            this.file = null;
            this.run = null;
            this.hidden = false;
            this.commandPath = null;
            this.alias = [];
            this.dashed = false;
        }
        get aliases() {
            if (!this.alias) {
                return [];
            }
            return Array.isArray(this.alias) ? this.alias : [this.alias];
        }
        hasAlias() {
            return this.aliases.length > 0;
        }
        /**
         * Checks if a given alias matches with this command's aliases, including name.
         * Can take a list of aliases too and check them all.
         *
         * @param {string|string[]} alias
         */
        matchesAlias(alias) {
            const aliases = Array.isArray(alias) ? alias : [alias];
            return aliases.find(a => this.name === a || this.aliases.includes(a));
        }
    }
    exports.default = Command;
});
define("domain/extension", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * An extension will add functionality to the context that each command will receive.
     */
    class Extension {
        constructor() {
            this.name = null;
            this.description = null;
            this.file = null;
            this.setup = null;
        }
    }
    exports.default = Extension;
});
define("domain/plugin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Extends the environment with new commands.
     */
    class Plugin {
        constructor() {
            this.name = null;
            this.description = null;
            this.defaults = {};
            this.directory = null;
            this.hidden = false;
            /**
             * A list of commands.
             */
            this.commands = [];
            this.extensions = [];
        }
    }
    exports.default = Plugin;
});
define("loaders/config-loader", ["require", "exports", "cosmiconfig"], function (require, exports, cosmiconfig) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Loads the config for the app via CosmicConfig by searching in a few places.
     *
     * @param {string} name The base name of the config to load.
     * @param {string} src The directory to look in.
     */
    function loadConfig(name, src) {
        const cosmicOpts = {
            sync: true,
            rcExtensions: true,
        };
        // attempt to load
        const cosmic = cosmiconfig(name, cosmicOpts).load(src);
        // use what we found or fallback to an empty object
        const config = (cosmic && cosmic.config) || {};
        return config;
    }
    exports.loadConfig = loadConfig;
});
define("utils/throw-when", ["require", "exports", "ramda"], function (require, exports, ramda_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Throws an error if the predicate fails when applying value.
     *
     * @export
     * @param {string} message - The message to say in the error
     * @param {Function} predicate - The function to invoke
     * @param {*} value - The value to apply to the predicate
     */
    exports.throwWhen = ramda_3.curry((message, predicate, value) => {
        ramda_3.when(predicate, () => {
            throw new Error(message);
        }, value);
    });
});
define("loaders/module-loader", ["require", "exports", "utils/string-utils", "utils/filesystem-utils", "utils/throw-when"], function (require, exports, string_utils_2, filesystem_utils_1, throw_when_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // try loading this module
    function loadModule(path) {
        throw_when_1.throwWhen('path is required', string_utils_2.isBlank, path);
        throw_when_1.throwWhen(`${path} is not a file`, filesystem_utils_1.isNotFile, path);
        require.resolve(path);
        return require(path);
    }
    exports.default = loadModule;
});
define("loaders/command-loader", ["require", "exports", "utils/filesystem-utils", "utils/string-utils", "loaders/module-loader", "fs-jetpack", "ramda", "domain/command"], function (require, exports, filesystem_utils_2, string_utils_3, module_loader_1, jetpack, ramda_4, command_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Loads the command from the given file.
     *
     * @param  {string} file      The full path to the file to load.
     * @return {Command}          The command in any condition
     */
    function loadCommandFromFile(file, options = {}) {
        const command = new command_1.default();
        // sanity check the input
        if (string_utils_3.isBlank(file)) {
            throw new Error(`Error: couldn't load command (file is blank): ${file}`);
        }
        // not a file?
        if (filesystem_utils_2.isNotFile(file)) {
            throw new Error(`Error: couldn't load command (this isn't a file): ${file}`);
        }
        // remember the file
        command.file = file;
        // default name is the name without the file extension
        command.name = ramda_4.head(ramda_4.split('.', jetpack.inspect(file).name));
        // strip the extension from the end of the commandPath
        command.commandPath = (options.commandPath || ramda_4.last(file.split('/commands/')).split('/')).map(f => ([`${command.name}.js`, `${command.name}.ts`].includes(f) ? command.name : f));
        // if the last two elements of the commandPath are the same, remove the last one
        const lastElems = ramda_4.takeLast(2, command.commandPath);
        if (lastElems.length === 2 && lastElems[0] === lastElems[1]) {
            command.commandPath = command.commandPath.slice(0, -1);
        }
        // require in the module -- best chance to bomb is here
        const commandModule = module_loader_1.default(file);
        // are we expecting this?
        const valid = commandModule && typeof commandModule === 'object' && typeof commandModule.run === 'function';
        if (valid) {
            command.name = commandModule.name || ramda_4.last(command.commandPath);
            command.description = commandModule.description;
            command.hidden = Boolean(commandModule.hidden);
            command.alias = ramda_4.reject(ramda_4.isNil, ramda_4.is(Array, commandModule.alias) ? commandModule.alias : [commandModule.alias]);
            command.run = commandModule.run;
        }
        else {
            throw new Error(`Error: Couldn't load command ${command.name} -- needs a "run" property with a function.`);
        }
        return command;
    }
    exports.loadCommandFromFile = loadCommandFromFile;
    function loadCommandFromPreload(preload) {
        const command = new command_1.default();
        command.name = preload.name;
        command.description = preload.description;
        command.hidden = Boolean(preload.hidden);
        command.alias = preload.alias;
        command.run = preload.run;
        command.file = null;
        command.dashed = Boolean(preload.dashed);
        command.commandPath = preload.commandPath || [preload.name];
        return command;
    }
    exports.loadCommandFromPreload = loadCommandFromPreload;
});
define("loaders/extension-loader", ["require", "exports", "utils/filesystem-utils", "utils/string-utils", "loaders/module-loader", "fs-jetpack", "ramda", "domain/extension"], function (require, exports, filesystem_utils_3, string_utils_4, module_loader_2, jetpack, ramda_5, extension_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Loads the extension from a file.
     *
     * @param {string} file         The full path to the file to load.
     */
    function loadExtensionFromFile(file, options = {}) {
        const extension = new extension_1.default();
        // sanity check the input
        if (string_utils_4.isBlank(file)) {
            throw new Error(`Error: couldn't load extension (file is blank): ${file}`);
        }
        extension.file = file;
        // not a file?
        if (filesystem_utils_3.isNotFile(file)) {
            throw new Error(`Error: couldn't load command (not a file): ${file}`);
        }
        // default is the name of the file without the extension
        extension.name = ramda_5.head(ramda_5.split('.', jetpack.inspect(file).name));
        // require in the module -- best chance to bomb is here
        const extensionModule = module_loader_2.default(file);
        // should we try the default export?
        const valid = extensionModule && typeof extensionModule === 'function';
        if (valid) {
            extension.setup = extensionModule;
        }
        else {
            throw new Error(`Error: couldn't load ${extension.name}. Expected a function, got ${extensionModule}.`);
        }
        return extension;
    }
    exports.loadExtensionFromFile = loadExtensionFromFile;
});
define("loaders/plugin-loader", ["require", "exports", "fs-jetpack", "domain/plugin", "loaders/config-loader", "loaders/command-loader", "loaders/extension-loader", "utils/filesystem-utils", "utils/string-utils", "ramda"], function (require, exports, jetpack, plugin_1, config_loader_1, command_loader_1, extension_loader_1, filesystem_utils_4, string_utils_5, ramda_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Loads a plugin from a directory.
     *
     * @param {string} directory The full path to the directory to load.
     * @param {{}}     options   Additional options to customize the loading process.
     */
    function loadPluginFromDirectory(directory, options = {}) {
        const plugin = new plugin_1.default();
        const { brand = 'gluegun', commandFilePattern = [`*.{js,ts}`, `!*.test.{js,ts}`], extensionFilePattern = [`*.{js,ts}`, `!*.test.{js,ts}`], hidden = false, name, } = options;
        plugin.hidden = Boolean(options.hidden);
        if (!string_utils_5.isBlank(name)) {
            plugin.name = name;
        }
        // directory check
        if (filesystem_utils_4.isNotDirectory(directory)) {
            throw new Error(`Error: couldn't load plugin (not a directory): ${directory}`);
        }
        plugin.directory = directory;
        // the directory is the default name (unless we were told what it was)
        if (string_utils_5.isBlank(name)) {
            plugin.name = jetpack.inspect(directory).name;
        }
        const jetpackPlugin = jetpack.cwd(plugin.directory);
        // load any default commands passed in
        plugin.commands = ramda_6.map(command_loader_1.loadCommandFromPreload, options.preloadedCommands || []);
        // load the commands found in the commands sub-directory
        if (jetpackPlugin.exists('commands') === 'dir') {
            const commands = jetpackPlugin.cwd('commands').find({ matching: commandFilePattern, recursive: true });
            plugin.commands = plugin.commands.concat(ramda_6.map(file => command_loader_1.loadCommandFromFile(`${directory}/commands/${file}`), commands));
        }
        // load the extensions found in the extensions sub-directory
        if (jetpackPlugin.exists('extensions') === 'dir') {
            const extensions = jetpackPlugin.cwd('extensions').find({ matching: extensionFilePattern, recursive: false });
            plugin.extensions = ramda_6.map(file => extension_loader_1.loadExtensionFromFile(`${directory}/extensions/${file}`), extensions);
        }
        else {
            plugin.extensions = [];
        }
        // load config using cosmiconfig
        const config = config_loader_1.loadConfig(plugin.name, directory);
        // set the name if we have one (unless we were told what it was)
        plugin.name = config.name || plugin.name;
        plugin[brand] = config[brand];
        plugin.defaults = config.defaults || {};
        plugin.description = config.description;
        // set the hidden bit
        if (hidden) {
            plugin.commands.forEach(command => (command.hidden = true));
        }
        return plugin;
    }
    exports.loadPluginFromDirectory = loadPluginFromDirectory;
});
define("utils/normalize-params", ["require", "exports", "yargs-parser", "ramda"], function (require, exports, yargsParse, ramda_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const COMMAND_DELIMITER = ' ';
    /**
     * Parses given command arguments into a more useful format.
     *
     * @param {string|string[]} commandArray
     * @param {Object} extraOpts
     * @returns {RunContextParameters}
     */
    function parseParams(commandArray, extraOpts = {}) {
        // use the command line args if not passed in
        if (ramda_7.is(String, commandArray)) {
            commandArray = commandArray.split(COMMAND_DELIMITER);
        }
        // remove the first 2 args if it comes from process.argv
        if (ramda_7.equals(commandArray, process.argv)) {
            commandArray = commandArray.slice(2);
        }
        // chop it up yargsParse!
        const parsed = yargsParse(commandArray);
        const array = parsed._.slice();
        delete parsed._;
        const options = ramda_7.merge(parsed, extraOpts);
        return { array, options };
    }
    exports.parseParams = parseParams;
    /**
     * Constructs the parameters object.
     *
     * @param {{}} params         Provided parameters
     * @return {{}}               An object with normalized parameters
     */
    function createParams(params) {
        // make a copy of the args so we can mutate it
        const array = params.array.slice();
        // Remove the first two elements from the array if they're the plugin and command
        if (array[0] === params.plugin)
            array.shift();
        if (array[0] === params.command)
            array.shift();
        const first = array[0];
        const second = array[1];
        const third = array[2];
        // the string is the rest of the words
        const string = array.join(' ');
        // :shipit:
        return Object.assign(params, {
            array,
            first,
            second,
            third,
            string,
        });
    }
    exports.createParams = createParams;
});
define("runtime/runtime-find-command", ["require", "exports", "ramdasauce", "ramda"], function (require, exports, ramdasauce_1, ramda_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * This function performs some somewhat complex logic to find a command for a given
     * set of parameters and plugins.
     *
     * @param {Runtime} runtime The current runtime.
     * @param {any} parameters The parameters passed in
     * @returns { plugin: Plugin|null, command: Command|null, array: string[] }
     */
    function findCommand(runtime, parameters) {
        let rest;
        let targetCommand;
        const commandPath = parameters.array;
        // sort the default plugin to the front
        const otherPlugins = runtime.plugins.filter(p => p !== runtime.defaultPlugin);
        const plugins = [runtime.defaultPlugin, ...otherPlugins].filter(p => !ramda_8.isNil(p));
        // loop through each plugin, looking for a command that matches the parameters
        const targetPlugin = ramda_8.find((plugin) => {
            // if the plugin doesn't have any commands, we can skip it
            if (ramda_8.isNil(plugin) || ramdasauce_1.isNilOrEmpty(plugin.commands))
                return false;
            // track the rest of the commandPath as we traverse
            rest = commandPath.slice(); // dup
            // traverse through the command path, retrieving aliases along the way
            // and get a nice commandPath we can use to check for a matching command
            const finalCommandPath = ramda_8.reduce((prevPath, currName) => {
                // find a command that fits the previous path + currentName, which can be an alias
                const cmd = ramda_8.find(command => {
                    return ramda_8.equals(command.commandPath.slice(0, -1), prevPath) && command.matchesAlias(currName);
                }, 
                // sorted shortest path to longest
                ramda_8.sort((a, b) => a.commandPath.length - b.commandPath.length, plugin.commands));
                if (cmd) {
                    rest.shift(); // remove the current item
                    return cmd.commandPath;
                }
                else {
                    return prevPath;
                }
            }, [])(commandPath);
            // we don't actually have a command path
            if (finalCommandPath.length === 0) {
                // if we're not looking down a command path, look for dashed commands or a default command
                const dashedOptions = Object.keys(parameters.options).filter(k => parameters.options[k] === true);
                // go find a command that matches the dashed command or a default
                targetCommand = ramda_8.find(command => {
                    // dashed commands, like --version or -v
                    const dashMatch = command.dashed && command.matchesAlias(dashedOptions);
                    const isDefault = ramda_8.equals(command.commandPath, [plugin.name]);
                    return dashMatch || isDefault;
                }, plugin.commands);
            }
            else {
                // look for a command that matches this commandPath
                targetCommand = ramda_8.find(command => ramda_8.equals(command.commandPath, finalCommandPath), plugin.commands);
            }
            // Did we find the targetCommand?
            return Boolean(targetCommand);
        }, plugins);
        return { plugin: targetPlugin, command: targetCommand, array: rest };
    }
    exports.findCommand = findCommand;
});
define("runtime/run", ["require", "exports", "utils/normalize-params", "ramda", "domain/run-context", "runtime/runtime-find-command"], function (require, exports, normalize_params_1, ramda_9, run_context_1, runtime_find_command_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Runs a command.
     *
     * @param  {string} rawCommand Command string.
     * @param  {{}} extraOptions Additional options use to execute a command.
     * @return {RunContext} The RunContext object indicating what happened.
     */
    function run(rawCommand, extraOptions = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // use provided rawCommand or process arguments if none given
            rawCommand = rawCommand || process.argv;
            // prepare the run context
            const context = new run_context_1.default();
            // attach the runtime
            context.runtime = this;
            // parse the parameters initially
            context.parameters = normalize_params_1.parseParams(rawCommand, extraOptions);
            // find the plugin and command, and parse out aliases
            const { plugin, command, array } = runtime_find_command_1.findCommand(this, context.parameters);
            // jet if we have no plugin or command
            if (ramda_9.isNil(plugin) || ramda_9.isNil(command))
                return context;
            // rebuild the parameters, now that we know the plugin and command
            context.parameters = normalize_params_1.createParams({
                plugin: plugin.name,
                command: command.name,
                array: array,
                options: context.parameters.options,
                raw: rawCommand,
                argv: process.argv,
            });
            // set a few properties
            context.plugin = plugin;
            context.command = command;
            context.pluginName = plugin.name;
            context.commandName = command.name;
            // setup the config
            context.config = ramda_9.clone(this.config);
            context.config[context.plugin.name] = ramda_9.merge(context.plugin.defaults, (this.defaults && this.defaults[context.plugin.name]) || {});
            // kick it off
            if (context.command.run) {
                // allow extensions to attach themselves to the context
                this.extensions.forEach(extension => extension.setup(context));
                // run the command
                context.result = yield context.command.run(context);
            }
            return context;
        });
    }
    exports.run = run;
});
define("runtime/runtime", ["require", "exports", "utils/string-utils", "utils/filesystem-utils", "loaders/plugin-loader", "loaders/config-loader", "loaders/command-loader", "runtime/run", "ramda", "path"], function (require, exports, string_utils_6, filesystem_utils_5, plugin_loader_1, config_loader_2, command_loader_2, run_1, ramda_10, path_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Loads plugins, extensions, and invokes the intended command.
     */
    class Runtime {
        /**
         * Create and initialize an empty Runtime.
         */
        constructor(brand) {
            this.brand = brand;
            this.run = run_1.run; // awkward because node.js doesn't support async-based class functions yet.
            this.plugins = [];
            this.extensions = [];
            this.defaults = {};
            this.defaultPlugin = null;
            this.config = {};
            this.addCoreExtensions();
        }
        /**
         * For backwards compatability. No-op.
         * @returns {Runtime} This runtime.
         */
        create() {
            return this;
        }
        /**
         * Adds the core extensions.  These provide the basic features
         * available in gluegun, but follow the exact same method
         * for extending the core as 3rd party extensions do.
         */
        addCoreExtensions() {
            this.addExtension('meta', require('../core-extensions/meta-extension'));
            this.addExtension('strings', require('../core-extensions/template-extension'));
            this.addExtension('print', require('../core-extensions/print-extension'));
            this.addExtension('template', require('../core-extensions/filesystem-extension'));
            this.addExtension('filesystem', require('../core-extensions/semver-extension'));
            this.addExtension('semver', require('../core-extensions/system-extension'));
            this.addExtension('system', require('../core-extensions/prompt-extension'));
            this.addExtension('http', require('../core-extensions/http-extension'));
            this.addExtension('prompt', require('../core-extensions/strings-extension'));
            this.addExtension('patching', require('../core-extensions/patching-extension'));
        }
        /**
         * Adds a command to the runtime.
         *
         * @param {Object} command
         */
        addCommand(command) {
            if (!this.defaultPlugin) {
                throw new Error(`Can't add command ${command.name} - no default plugin. You may have forgotten a src() on your runtime.`);
            }
            const newCommand = command_loader_2.loadCommandFromPreload(command);
            this.defaultPlugin.commands.unshift(newCommand);
            return this;
        }
        /**
         * Adds an extension so it is available when commands run. They usually live
         * as the given name on the context object passed to commands, but are able
         * to manipulate the context object however they want. The second
         * parameter is a function that allows the extension to attach itself.
         *
         * @param {string} name   The context property name.
         * @param {object} setup  The setup function.
         */
        addExtension(name, setup) {
            this.extensions.push({ name, setup });
            return this;
        }
        /**
         * Loads a plugin from a directory and sets it as the default.
         *
         * @param  {string} directory The directory to load from.
         * @param  {Object} options   Additional loading options.
         * @return {Runtime}          This runtime.
         */
        addDefaultPlugin(directory, options = {}) {
            this.defaultPlugin = this.addPlugin(directory, Object.assign({ required: true, name: this.brand }, options));
            // load config and set defaults
            const config = config_loader_2.loadConfig(this.brand, directory) || {};
            this.defaults = config.defaults;
            this.config = ramda_10.dissoc('defaults', config);
            return this;
        }
        /**
         * Loads a plugin from a directory.
         *
         * @param  {string} directory The directory to load from.
         * @param  {Object} options   Additional loading options.
         * @return {Plugin | null}           The plugin that was created.
         */
        addPlugin(directory, options = {}) {
            if (!filesystem_utils_5.isDirectory(directory)) {
                if (options.required) {
                    throw new Error(`Error: couldn't load plugin (not a directory): ${directory}`);
                }
                else {
                    return;
                }
            }
            const plugin = plugin_loader_1.loadPluginFromDirectory(path_1.resolve(directory), {
                brand: this.brand,
                hidden: options['hidden'],
                name: options['name'],
                commandFilePattern: options['commandFilePattern'],
                extensionFilePattern: options['extensionFilePattern'],
                preloadedCommands: options['preloadedCommands'],
            });
            this.plugins.push(plugin);
            plugin.extensions.forEach(extension => this.addExtension(extension.name, extension.setup));
            return plugin;
        }
        /**
         * Loads a bunch of plugins from the immediate sub-directories of a directory.
         *
         * @param {string} directory The directory to grab from.
         * @param {Object} options   Addition loading options.
         * @return {Runtime}         This runtime
         */
        addPlugins(directory, options = {}) {
            if (string_utils_6.isBlank(directory) || !filesystem_utils_5.isDirectory(directory))
                return [];
            // find matching subdirectories
            const subdirs = filesystem_utils_5.subdirectories(directory, false, options['matching'], true);
            // load each one using `this.plugin`
            return subdirs.map(dir => this.addPlugin(dir, ramda_10.dissoc('matching', options)));
        }
    }
    exports.default = Runtime;
});
define("domain/builder", ["require", "exports", "runtime/runtime"], function (require, exports, runtime_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Provides a cleaner way to build a runtime.
     *
     * @class Builder
     */
    class Builder {
        constructor() {
            this.runtime = new runtime_1.default();
        }
        /**
         * Ideally named after the command line, the brand will be used
         * when searching for configuration files.
         *
         * @param name The name should be all lowercase and contains only numbers, letters, and dashes.
         */
        brand(value) {
            this.runtime.brand = value;
            return this;
        }
        /**
         * Specifies where the default commands and extensions live.
         *
         * @param value The path to the source directory.
         * @param options Additional plugin loading options.
         * @return {Builder} self.
         */
        src(value, options = {}) {
            this.runtime.addDefaultPlugin(value, options);
            return this;
        }
        /**
         * Add a plugin to the list.
         *
         * @param  {string}  value   The plugin directory.
         * @param  {Object}  options Additional loading options.
         * @return {Builder}         self.
         */
        plugin(value, options = {}) {
            this.runtime.addPlugin(value, options);
            return this;
        }
        /**
         * Add a plugin group to the list.
         *
         * @param  {string}  value   The directory with sub-directories.
         * @param  {Object}  options Additional loading options.
         * @return {Builder}         self.
         */
        plugins(value, options = {}) {
            this.runtime.addPlugin(value, options);
            return this;
        }
        /**
         * Add a default help handler.
         * @param  {any} command An optional command function or object
         * @return {Builder}         self.
         */
        help(command) {
            command = command || require(`../core-commands/help`);
            if (typeof command === 'function') {
                command = { name: 'help', alias: ['h'], dashed: true, run: command };
            }
            return this.command(command);
        }
        /**
         * Add a default version handler.
         * @param  {any} command An optional command function or object
         * @return {Builder}         self.
         */
        version(command) {
            command = command || require(`../core-commands/version`);
            if (typeof command === 'function') {
                command = { name: 'version', alias: ['v'], dashed: true, run: command };
            }
            return this.command(command);
        }
        /**
         * Add a default command that runs if none other is found.
         * @param  {any} command An optional command function or object
         * @return {Builder}         self.
         */
        defaultCommand(command) {
            command = command || require(`../core-commands/default`);
            if (typeof command === 'function') {
                command = { run: command };
            }
            command.name = this.runtime.brand;
            return this.command(command);
        }
        /**
         * Add a way to add an arbitrary command when building the CLI.
         * @param {Object}
         * @return {Builder}
         */
        command(command) {
            this.runtime.addCommand(command);
            return this;
        }
        /**
         * Hand over the runtime.
         */
        create() {
            return this.runtime;
        }
    }
    exports.Builder = Builder;
    /**
     * Export it as a factory function.
     */
    function build() {
        return new Builder();
    }
    exports.build = build;
});
define("utils/print", ["require", "exports", "colors", "cli-table2"], function (require, exports, colors, CLITable) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.colors = colors;
    const ora = require('ora');
    const CLI_TABLE_COMPACT = {
        top: '',
        'top-mid': '',
        'top-left': '',
        'top-right': '',
        bottom: '',
        'bottom-mid': '',
        'bottom-left': '',
        'bottom-right': '',
        left: ' ',
        'left-mid': '',
        mid: '',
        'mid-mid': '',
        right: '',
        'right-mid': '',
        middle: ' ',
    };
    const CLI_TABLE_MARKDOWN = Object.assign({}, CLI_TABLE_COMPACT, {
        left: '|',
        right: '|',
        middle: '|',
    });
    /**
     * Sets the color scheme.
     */
    colors.setTheme({
        highlight: 'cyan',
        info: 'reset',
        warning: 'yellow',
        success: 'green',
        error: 'red',
        line: 'grey',
        muted: 'grey',
    });
    /**
     * Print a blank line.
     */
    function newline() {
        console.log('');
    }
    exports.newline = newline;
    /**
     * Prints a divider line
     */
    function divider() {
        console.log(colors.line('---------------------------------------------------------------'));
    }
    exports.divider = divider;
    /**
     * Returns an array of the column widths.
     */
    function findWidths(table) {
        return [table.options.head, ...table].reduce((colWidths, row) => row.map((str, i) => Math.max(`${str}`.length + 1, colWidths[i] || 1)), []);
    }
    /**
     * Returns an array of column headers based on column widths.
     */
    function columnHeaderDivider(table) {
        return findWidths(table).map(w => Array(w).join('-'));
    }
    /**
     * Prints an object to table format.  The values will already be
     * stringified.
     *
     * @param {{}} object The object to turn into a table.
     */
    function table(data, options = {}) {
        let t;
        switch (options.format) {
            case 'markdown':
                const header = data.shift();
                t = new CLITable({
                    head: header,
                    chars: CLI_TABLE_MARKDOWN,
                });
                t.push(...data);
                t.unshift(columnHeaderDivider(t));
                break;
            case 'lean':
                t = new CLITable();
                t.push(...data);
                break;
            default:
                t = new CLITable({
                    chars: CLI_TABLE_COMPACT,
                });
                t.push(...data);
        }
        console.log(t.toString());
    }
    exports.table = table;
    /**
     * Prints text without theming.
     *
     * Use this when you're writing stuff outside the context of our
     * printing scheme.  hint: rarely.
     *
     * @param {string} message The message to write.
     */
    function fancy(message) {
        console.log(message);
    }
    exports.fancy = fancy;
    /**
     * Writes a normal information message.
     *
     * This is the default type you should use.
     *
     * @param {string} message The message to show.
     */
    function info(message) {
        console.log(colors.info(message));
    }
    exports.info = info;
    /**
     * Writes an error message.
     *
     * This is when something horribly goes wrong.
     *
     * @param {string} message The message to show.
     */
    function error(message) {
        console.log(colors.error(message));
    }
    exports.error = error;
    /**
     * Writes a warning message.
     *
     * This is when the user might not be getting what they're expecting.
     *
     * @param {string} message The message to show.
     */
    function warning(message) {
        console.log(colors.warning(message));
    }
    exports.warning = warning;
    /**
     * Writes a debug message.
     *
     * This is for devs only.
     *
     * @param {string} message The message to show.
     */
    function debug(message, title = 'DEBUG') {
        const topLine = `vvv -----[ ${title} ]----- vvv`;
        const botLine = `^^^ -----[ ${title} ]----- ^^^`;
        console.log(colors.rainbow(topLine));
        console.log(message);
        console.log(colors.rainbow(botLine));
    }
    exports.debug = debug;
    /**
     * Writes a success message.
     *
     * When something is successful.  Use sparingly.
     *
     * @param {string} message The message to show.
     */
    function success(message) {
        console.log(colors.success(message));
    }
    exports.success = success;
    /**
     * Creates a spinner and starts it up.
     *
     * @param {string|Object} config The text for the spinner or an ora configuration object.
     * @returns The spinner.
     */
    function spin(config) {
        return ora(config).start();
    }
    exports.spin = spin;
});
define("utils/command-info", ["require", "exports", "ramda"], function (require, exports, ramda_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Is this a hidden command?
     */
    const isHidden = ramda_11.propEq('hidden', true);
    /**
     * Gets the list of plugins.
     *
     * @param {RunContext} context     The context
     * @param {Plugin[]} plugins       The plugins holding the commands
     * @param {string[]} commandRoot   Optional, only show commands with this root
     * @return {[string, string]}
     */
    function commandInfo(context, plugins, commandRoot) {
        return ramda_11.pipe(ramda_11.reject(isHidden), ramda_11.sortBy(ramda_11.prop('name')), ramda_11.map(p => getListOfCommands(context, p, commandRoot)), ramda_11.unnest)(plugins || context.runtime.plugins);
    }
    exports.commandInfo = commandInfo;
    /**
     * Gets the list of commands for the given plugin.
     *
     * @param {RunContext} context     The context
     * @param {Plugin} plugin          The plugins holding the commands
     * @param {string[]} commandRoot   Optional, only show commands with this root
     * @return {[string, string]}
     */
    function getListOfCommands(context, plugin, commandRoot) {
        return ramda_11.pipe(ramda_11.reject(isHidden), ramda_11.reject(command => {
            if (!commandRoot) {
                return false;
            }
            return !ramda_11.equals(command.commandPath.slice(0, commandRoot.length), commandRoot);
        }), ramda_11.map(command => {
            const alias = command.hasAlias() ? `(${command.aliases.join(', ')})` : '';
            return [
                `${command.commandPath.join(' ')} ${alias}`,
                ramda_11.replace('$BRAND', context.runtime.brand, command.description || '-'),
            ];
        }))(plugin.commands);
    }
    exports.getListOfCommands = getListOfCommands;
});
define("utils/print-help", ["require", "exports", "utils/print", "utils/command-info"], function (require, exports, print, command_info_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Prints the list of commands.
     *
     * @param {RunContext} context     The context that was used
     * @param {string[]} commandRoot   Optional, only show commands with this root
     */
    function printCommands(context, commandRoot) {
        let printPlugins = [];
        if (context.plugin === context.defaultPlugin) {
            // print for all plugins
            printPlugins = context.plugins;
        }
        else {
            // print for one plugin
            printPlugins = [context.plugin];
        }
        const data = command_info_1.commandInfo(context, printPlugins, commandRoot);
        print.newline(); // a spacer
        print.table(data); // the data
    }
    exports.printCommands = printCommands;
    function printHelp(context) {
        const { print, runtime: { brand } } = context;
        print.info(`${brand} version ${context.meta.version()}`);
        print.printCommands(context);
    }
    exports.printHelp = printHelp;
});
// --- Hackasaurus Rex --------------------------------------------------------
//
// https://github.com/patrick-steele-idem/app-module-path-node
// https://gist.github.com/branneman/8048520
//
// This adds the node_modules for `gluegun` to the "search path".
//
// So, wherever folks have their scripts (plugins or their apps), they will be
// given a chance to resolve dependencies back up to gluegun's node_modules.
//
// I may be going to hell for this, but I'm taking you bastards with me.
// ----------------------------------------------------------------------------
define("index", ["require", "exports", "domain/builder", "utils/string-utils", "utils/print", "utils/print-help"], function (require, exports, builder_1, strings, print, print_help_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // first, do a sniff test to ensure our dependencies are met
    const sniff = require('../sniff');
    // check the node version
    if (!sniff.isNewEnough) {
        console.log('Node.js 7.6+ is required to run. You have ' + sniff.nodeVersion + '. Womp, womp.');
        process.exit(1);
    }
    // bring in a few extensions to make available for stand-alone purposes
    const attachFilesystemExtension = require('./core-extensions/filesystem-extension');
    const attachSemverExtension = require('./core-extensions/semver-extension');
    const attachSystemExtension = require('./core-extensions/system-extension');
    const attachPromptExtension = require('./core-extensions/prompt-extension');
    const attachHttpExtension = require('./core-extensions/http-extension');
    const attachTemplateExtension = require('./core-extensions/template-extension');
    const attachPatchingExtension = require('./core-extensions/patching-extension');
    exports.build = builder_1.build;
    exports.strings = strings;
    exports.print = print;
    exports.printHelp = print_help_1.printHelp;
    exports.printCommands = print_help_1.printCommands;
    // we want to see real exceptions with backtraces and stuff
    process.removeAllListeners('unhandledRejection');
    process.on('unhandledRejection', up => {
        throw up;
    });
    require('app-module-path').addPath(`${__dirname}/../node_modules`);
    require('app-module-path').addPath(process.cwd());
    // ----------------------------------------------------------------------------
    // wrap all this in a function call to avoid global scoping
    const context = {
        build: builder_1.build,
        strings,
        print,
        printCommands: print_help_1.printCommands,
        printHelp: print_help_1.printHelp,
    };
    attachFilesystemExtension(context);
    attachSemverExtension(context);
    attachSystemExtension(context);
    attachPromptExtension(context);
    attachHttpExtension(context);
    attachTemplateExtension(context);
    attachPatchingExtension(context);
    // export our API
    // export { build, strings, print, printCommands, printHelp }
    exports.default = context;
});
define("index.test", ["require", "exports", "ava", "index"], function (require, exports, ava_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava_1.default('create', t => {
        t.truthy(index_1.default);
        t.is(typeof index_1.default.build, 'function');
        const { build } = index_1.default;
        const runtime = build()
            .brand('test')
            .create();
        t.is(runtime.brand, 'test');
    });
    ava_1.default('print', t => {
        t.is(typeof index_1.default.printCommands, 'function');
        t.is(typeof index_1.default.print.info, 'function');
    });
    ava_1.default('strings', t => {
        t.is(index_1.default.strings.lowerCase('HI'), 'hi');
    });
    ava_1.default('filesystem', t => {
        t.truthy(index_1.default.filesystem);
        t.truthy(index_1.default.filesystem.eol);
        t.truthy(index_1.default.filesystem.separator);
        t.is(index_1.default.filesystem.cwd(), process.cwd());
    });
    ava_1.default('system', t => {
        t.truthy(index_1.default.system);
        t.truthy(index_1.default.system.which('node'));
    });
    ava_1.default('prompt', t => {
        t.truthy(index_1.default.prompt);
        t.truthy(typeof index_1.default.prompt.confirm, 'function');
    });
    ava_1.default('http', t => {
        t.truthy(index_1.default.http);
        t.truthy(typeof index_1.default.http.create, 'function');
        const api = index_1.default.http.create({ baseURL: 'https://api.github.com/v3' });
        t.is(typeof api.get, 'function');
        t.is(typeof api.post, 'function');
    });
    ava_1.default('generate', (t) => __awaiter(this, void 0, void 0, function* () {
        t.truthy(index_1.default.template);
        const actual = yield index_1.default.template.generate({
            template: './src/fixtures/good-plugins/generate/templates/simple.ejs',
            directory: process.cwd(),
        });
        t.is(actual, 'simple file\n');
    }));
    ava_1.default('patching', t => {
        t.truthy(index_1.default.patching);
        t.truthy(typeof index_1.default.patching.exists, 'function');
        t.truthy(typeof index_1.default.patching.update, 'function');
        t.truthy(typeof index_1.default.patching.append, 'function');
        t.truthy(typeof index_1.default.patching.prepend, 'function');
        t.truthy(typeof index_1.default.patching.replace, 'function');
        t.truthy(typeof index_1.default.patching.patch, 'function');
    });
});
define("cli/cli", ["require", "exports", "index"], function (require, exports, index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Create the cli and kick it off
     */
    function run(argv) {
        return __awaiter(this, void 0, void 0, function* () {
            // create a CLI runtime
            const cli = index_2.build()
                .brand('gluegun')
                .src(`${__dirname}`)
                .help()
                .version()
                .create();
            // and run it
            const context = yield cli.run(argv);
            // send it back (for testing, mostly)
            return context;
        });
    }
    exports.run = run;
});
define("cli/cli.test", ["require", "exports", "ava", "cli/cli", "sinon"], function (require, exports, ava_2, cli_1, sinon) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const uniqueTempDir = require('unique-temp-dir');
    sinon.stub(console, 'log');
    ava_2.default('can start the cli', (t) => __awaiter(this, void 0, void 0, function* () {
        const c = yield cli_1.run();
        t.truthy(c);
    }));
    ava_2.default('can create a new boilerplate cli', (t) => __awaiter(this, void 0, void 0, function* () {
        const pwd = process.cwd();
        const tmp = uniqueTempDir({ create: true });
        process.chdir(tmp);
        const context = yield cli_1.run('new foo');
        t.is(context.command.name, 'new');
        const pkg = context.filesystem.read(`${tmp}/foo/package.json`, 'json');
        t.is(pkg.name, 'foo');
        t.truthy(pkg.private);
        t.truthy(Object.keys(pkg.dependencies).includes('gluegun'));
        // Install local version of gluegun to test
        yield context.system.run(`cd ${tmp}/foo && npm install ${pwd}`);
        // Try running the help command, see what it does
        const runCommand = yield context.system.run(`${tmp}/foo/bin/foo help`);
        t.snapshot(runCommand);
        // Try running the generate command, see what it does
        const genCommand = yield context.system.run(`${tmp}/foo/bin/foo g model test`);
        t.snapshot(genCommand);
        process.chdir(pwd);
        // clean up
        context.filesystem.remove(`${tmp}/foo`);
    }));
});
define("cli/commands/new.test", ["require", "exports", "ava", "sinon", "utils/string-utils", "domain/run-context"], function (require, exports, ava_3, sinon, strings, run_context_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const command = require('./new');
    sinon.stub(console, 'log');
    function createContext() {
        const fakeContext = new run_context_2.default();
        fakeContext.strings = strings;
        fakeContext.filesystem = {
            resolve: sinon.stub(),
            dir: sinon.stub(),
            chmodSync: sinon.stub(),
            rename: sinon.stub(),
        };
        fakeContext.system = {
            spawn: sinon.stub(),
        };
        fakeContext.template = { generate: sinon.stub() };
        fakeContext.print = {
            info: sinon.stub(),
            error: sinon.stub(),
        };
        fakeContext.parameters = { first: null, options: {} };
        return fakeContext;
    }
    ava_3.default('has the right interface', t => {
        t.is(command.name, 'new');
        t.is(command.description, 'Creates a new gluegun cli');
        t.false(command.hidden);
        t.deepEqual(command.alias, ['n', 'create']);
        t.is(typeof command.run, 'function');
    });
    ava_3.default('name is required', (t) => __awaiter(this, void 0, void 0, function* () {
        const context = createContext();
        context.parameters.first = null;
        yield command.run(context);
        const { error } = context.print;
        t.is(error.getCall(0).args[0], 'You must provide a valid CLI name.');
        t.is(error.getCall(1).args[0], 'Example: gluegun new foo');
    }));
    ava_3.default('name cannot be blank', (t) => __awaiter(this, void 0, void 0, function* () {
        const context = createContext();
        context.parameters.first = '';
        yield command.run(context);
        const { error } = context.print;
        t.deepEqual(error.getCall(0).args, ['You must provide a valid CLI name.']);
        t.deepEqual(error.getCall(1).args, ['Example: gluegun new foo']);
    }));
    ava_3.default('name must pass regex', (t) => __awaiter(this, void 0, void 0, function* () {
        const context = createContext();
        const name = 'O M G';
        context.parameters.first = name;
        yield command.run(context);
        const { error } = context.print;
        t.deepEqual(error.getCall(0).args, [`${name} is not a valid name. Use lower-case and dashes only.`]);
        t.deepEqual(error.getCall(1).args, [`Suggested: gluegun new ${strings.kebabCase(name)}`]);
    }));
    ava_3.default('generates properly', (t) => __awaiter(this, void 0, void 0, function* () {
        const name = 'foo';
        const typescript = undefined;
        const context = createContext();
        context.parameters.first = name;
        // here we run the command
        const result = yield command.run(context);
        // setup some conveniences so we don't have giant lines
        const { dir, chmodSync } = context.filesystem;
        const { generate } = context.template;
        const { spawn } = context.system;
        const props = { name, typescript };
        // assure that the directory was created
        t.is(dir.firstCall.args[0], name);
        // tracks the number of files generated
        let i = 0;
        // the executable file
        t.deepEqual(generate.getCall(i++).args[0], {
            template: `cli/bin/cli-executable.ejs`,
            target: `./${name}/bin/${name}`,
            props,
        });
        const DEFAULT_FILES = [
            ['docs/commands.md.ejs', 'docs/commands.md'],
            ['docs/plugins.md.ejs', 'docs/plugins.md'],
            ['src/commands/generate.js.ejs', 'src/commands/generate.js'],
            ['src/commands/default.js.ejs', 'src/commands/default.js'],
            ['src/extensions/cli-extension.js.ejs', 'src/extensions/cli-extension.js'],
            ['src/templates/model.js.ejs.ejs', 'src/templates/model.js.ejs'],
            ['src/cli.js.ejs', 'src/cli.js'],
            ['LICENSE.ejs', 'LICENSE'],
            ['.prettierrc.ejs', '.prettierrc'],
            ['package.json.ejs', 'package.json'],
            ['readme.md.ejs', 'readme.md'],
            ['.gitignore.ejs', '.gitignore'],
        ];
        // test that each our files get generated
        DEFAULT_FILES.forEach(file => {
            t.deepEqual(generate.getCall(i++).args[0], {
                template: `cli/${file[0]}`,
                target: `${name}/${file[1]}`,
                props,
            });
        });
        // test permissions
        t.deepEqual(chmodSync.firstCall.args, [`${name}/bin/${name}`, '755']);
        // test package installation
        t.deepEqual(spawn.firstCall.args, [
            `cd ${props.name} && npm i && npm run format`,
            { shell: true, stdio: 'inherit', stderr: 'inherit' },
        ]);
        t.is(result, `new ${name}`);
    }));
    ava_3.default('generates with typescript', (t) => __awaiter(this, void 0, void 0, function* () {
        const name = 'foo';
        const typescript = true;
        const context = createContext();
        context.parameters.first = name;
        context.parameters.options.typescript = true;
        // here we run the command
        const result = yield command.run(context);
        // setup some conveniences so we don't have giant lines
        const { dir, chmodSync } = context.filesystem;
        const { generate } = context.template;
        const { spawn } = context.system;
        const props = { name, typescript };
        // assure that the directory was created
        t.is(dir.firstCall.args[0], name);
        // tracks the number of files generated
        let i = 0;
        // the executable file
        t.deepEqual(generate.getCall(i++).args[0], {
            template: `cli/bin/cli-executable.ejs`,
            target: `./${name}/bin/${name}`,
            props,
        });
        const DEFAULT_FILES = [
            ['docs/commands.md.ejs', 'docs/commands.md'],
            ['docs/plugins.md.ejs', 'docs/plugins.md'],
            ['src/commands/generate.js.ejs', 'src/commands/generate.ts'],
            ['src/commands/default.js.ejs', 'src/commands/default.ts'],
            ['src/extensions/cli-extension.js.ejs', 'src/extensions/cli-extension.ts'],
            ['src/templates/model.js.ejs.ejs', 'src/templates/model.ts.ejs'],
            ['src/cli.js.ejs', 'src/cli.ts'],
            ['LICENSE.ejs', 'LICENSE'],
            ['.prettierrc.ejs', '.prettierrc'],
            ['package.json.ejs', 'package.json'],
            ['readme.md.ejs', 'readme.md'],
            ['.gitignore.ejs', '.gitignore'],
        ];
        // test that each our files get generated
        DEFAULT_FILES.forEach(file => {
            t.deepEqual(generate.getCall(i++).args[0], {
                template: `cli/${file[0]}`,
                target: `${name}/${file[1]}`,
                props,
            });
        });
        // test permissions
        t.deepEqual(chmodSync.firstCall.args, [`${name}/bin/${name}`, '755']);
        // test package installation
        t.deepEqual(spawn.firstCall.args, [
            `cd ${props.name} && npm i && npm run format`,
            { shell: true, stdio: 'inherit', stderr: 'inherit' },
        ]);
        t.is(result, `new ${name}`);
    }));
});
module.exports = {
    name: 'new',
    alias: ['n', 'create'],
    description: 'Creates a new gluegun cli',
    hidden: false,
    run: (context) => __awaiter(this, void 0, void 0, function* () {
        const { parameters, template, filesystem, print, strings, system } = context;
        const { generate } = template;
        const { kebabCase } = strings;
        const props = {
            name: parameters.first,
            typescript: parameters.options.typescript,
        };
        if (!props.name || props.name.length === 0) {
            print.error('You must provide a valid CLI name.');
            print.error('Example: gluegun new foo');
            return;
        }
        else if (!/^[a-z0-9-]+$/.test(props.name)) {
            const validName = kebabCase(props.name);
            print.error(`${props.name} is not a valid name. Use lower-case and dashes only.`);
            print.error(`Suggested: gluegun new ${validName}`);
            return;
        }
        yield filesystem.dir(props.name);
        let active = [];
        // executable is treated specially
        active.push(generate({
            template: `cli/bin/cli-executable.ejs`,
            target: `./${props.name}/bin/${props.name}`,
            props: props,
        }));
        const files = [
            'docs/commands.md.ejs',
            'docs/plugins.md.ejs',
            'src/commands/generate.js.ejs',
            'src/commands/default.js.ejs',
            'src/extensions/cli-extension.js.ejs',
            'src/templates/model.js.ejs.ejs',
            'src/cli.js.ejs',
            'LICENSE.ejs',
            '.prettierrc.ejs',
            'package.json.ejs',
            'readme.md.ejs',
            '.gitignore.ejs',
        ];
        if (props.typescript) {
            files.push('tsconfig.json.ejs');
        }
        active = files.reduce((prev, file) => {
            const template = `cli/${file}`;
            const target = `${props.name}/` +
                (props.typescript && file.includes('.js.ejs') ? file.replace('.js.ejs', '.ts') : file.replace('.ejs', ''));
            const gen = generate({ template, target, props });
            return prev.concat([gen]);
        }, active);
        // let all generator calls run in parallel
        yield Promise.all(active);
        // make bin executable
        filesystem.chmodSync(`${props.name}/bin/${props.name}`, '755');
        // rename default.js to project name
        const ext = props.typescript ? 'ts' : 'js';
        filesystem.rename(`${props.name}/src/commands/default.${ext}`, `${props.name}/src/commands/${props.name}.${ext}`);
        yield system.spawn(`cd ${props.name} && npm i && npm run format`, {
            shell: true,
            stdio: 'inherit',
            stderr: 'inherit',
        });
        print.info(`Generated ${props.name} CLI.`);
        print.info(``);
        print.info(`Next:`);
        print.info(`  $ cd ${props.name}`);
        print.info(`  $ npm link`);
        print.info(`  $ ${props.name}`);
        print.info(``);
        // for tests
        return `new ${context.parameters.first}`;
    }),
};
define("cli/extensions/cli-extension", ["require", "exports", "path", "fs"], function (require, exports, path_2, fs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    module.exports = context => {
        context.filesystem.resolve = path_2.resolve;
        context.filesystem.chmodSync = fs_1.chmodSync;
    };
});
define("core-commands/default", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        run: ({ parameters, runtime, print, strings, meta }) => {
            const infoMessage = strings.isBlank(parameters.first)
                ? `Welcome to ${print.colors.cyan(runtime.brand)} CLI version ${meta.version()}!`
                : `Sorry, didn't recognize that command!`;
            print.info(`
  ${infoMessage}
  Type ${print.colors.magenta(`${runtime.brand} --help`)} to view common commands.`);
        },
    };
});
module.exports = {
    name: 'help',
    alias: 'h',
    dashed: true,
    run: context => {
        context.print.printHelp(context);
    },
};
define("core-commands/version", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        name: 'version',
        alias: 'v',
        dashed: true,
        run: context => {
            context.print.info(context.meta.version());
        },
    };
});
define("core-extensions/filesystem-extension.test", ["require", "exports", "ava", "os", "path", "ramda", "domain/run-context"], function (require, exports, ava_4, os, path, ramda_12, run_context_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const createExtension = require('./filesystem-extension');
    ava_4.default('has the proper interface', t => {
        const context = new run_context_3.default();
        createExtension(context);
        const ext = context.filesystem;
        t.truthy(ext);
        // a few dumb checks to ensure we're talking to jetpack
        t.is(typeof ext.copy, 'function');
        t.is(typeof ext.path, 'function');
        t.is(typeof ext.subdirectories, 'function');
        t.is(ramda_12.split('\n', ext.read(__filename))[0], "import test from 'ava'");
        // the extra values we've added
        t.is(ext.eol, os.EOL);
        t.is(ext.separator, path.sep);
    });
});
define("core-extensions/filesystem-extension", ["require", "exports", "fs-jetpack", "os", "path", "utils/filesystem-utils"], function (require, exports, jetpack, os, path, filesystem_utils_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Extensions to filesystem.  Brought to you by fs-jetpack.
     *
     * @param  {RunContext} context The running context.
     */
    function attach(context) {
        const extension = jetpack; // jetpack
        extension.eol = os.EOL; // end of line marker
        extension.separator = path.sep; // path separator
        extension.subdirectories = filesystem_utils_6.subdirectories;
        context.filesystem = extension;
    }
    module.exports = attach;
});
define("core-extensions/http-extension.test", ["require", "exports", "ava", "http", "domain/run-context"], function (require, exports, ava_5, http, run_context_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const createExtension = require('./http-extension');
    const context = new run_context_4.default();
    createExtension(context);
    const ext = context.http;
    /**
     * Sends a HTTP response.
     *
     * @param {*} res - The http response object.
     * @param {number} statusCode - The http response status code.
     * @param {string} body - The reponse data.
     */
    const sendResponse = (res, statusCode, body) => {
        res.writeHead(statusCode);
        res.write(body);
        res.end();
    };
    /**
     * Sends a 200 OK with some data.
     *
     * @param {*} res - The http response object.
     * @param {string} body - The http response data.
     */
    const send200 = (res, body) => {
        sendResponse(res, 200, body || '<h1>OK</h1>');
    };
    ava_5.default('has the proper interface', t => {
        t.truthy(ext);
        t.is(typeof ext.create, 'function');
    });
    ava_5.default('connects to a server', (t) => __awaiter(this, void 0, void 0, function* () {
        const server = http.createServer((req, res) => {
            send200(res, 'hi');
        });
        server.listen();
        const port = server.address().port;
        const api = ext.create({
            baseURL: `http://127.0.0.1:${port}`,
        });
        const response = yield api.get('/');
        t.is(response.data, 'hi');
    }));
});
define("core-extensions/http-extension", ["require", "exports", "apisauce"], function (require, exports, apisauce_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * An extension to talk to ye olde internet.
     *
     * @param  {RunContext} context The running context.
     */
    function attach(context) {
        context.http = { create: apisauce_1.create };
    }
    module.exports = attach;
});
define("utils/get-version", ["require", "exports", "fs-jetpack"], function (require, exports, jetpack) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Finds the version for the currently running CLI.
     *
     * @param {RunContext} context
     */
    function getVersion(context) {
        let directory = context.runtime.defaultPlugin && context.runtime.defaultPlugin.directory;
        if (!directory) {
            throw new Error('context.version: Unknown CLI version (no src folder found)');
        }
        // go at most 5 directories up to find the package.json
        for (let i = 0; i < 5; i += 1) {
            const pkg = jetpack.path(directory, 'package.json');
            // if we find a package.json, we're done -- read the version and return it
            if (jetpack.exists(pkg) === 'file') {
                return jetpack.read(pkg, 'json').version;
            }
            // if we reach the git repo or root, we can't determine the version -- this is where we bail
            const git = jetpack.path(directory, '.git');
            const root = jetpack.path('/');
            if (directory === root || jetpack.exists(git) === 'dir')
                break;
            // go up another directory
            directory = jetpack.path(directory, '..');
        }
        throw new Error(`context.version: Unknown CLI version (no package.json found in ${directory}`);
    }
    exports.getVersion = getVersion;
});
define("core-extensions/meta-extension", ["require", "exports", "utils/get-version", "utils/command-info"], function (require, exports, get_version_1, command_info_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Extension that lets you learn more about the currently running CLI.
     *
     * @param  {RunContext} context The running context.
     */
    function attach(context) {
        context.meta = {
            version: () => get_version_1.getVersion(context),
            commandInfo: () => command_info_2.commandInfo(context),
        };
        context.version = context.meta.version; // easier access to version
    }
    module.exports = attach;
});
define("core-extensions/patching-extension.test", ["require", "exports", "ava", "fs-jetpack", "domain/run-context"], function (require, exports, ava_6, jetpack, run_context_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const create = require('./patching-extension');
    const tempWrite = require('temp-write');
    // const { startsWith } = require('ramdasauce')
    const context = new run_context_5.default();
    create(context);
    const patching = context.patching;
    const CONFIG_STRING = `{
  "test": "what???",
  "test2": "never"
}
`;
    const TEXT_STRING = `These are some words.

They're very amazing.
`;
    ava_6.default.beforeEach(t => {
        t.context.textFile = tempWrite.sync(TEXT_STRING);
    });
    ava_6.default('exists - checks a TEXT file for a string', (t) => __awaiter(this, void 0, void 0, function* () {
        const exists = yield patching.exists(t.context.textFile, 'words');
        t.true(exists);
    }));
    ava_6.default('exists - checks a TEXT file for a short form regex', (t) => __awaiter(this, void 0, void 0, function* () {
        const exists = yield patching.exists(t.context.textFile, /ords\b/);
        t.true(exists);
    }));
    ava_6.default('exists - checks a TEXT file for a RegExp', (t) => __awaiter(this, void 0, void 0, function* () {
        const exists = yield patching.exists(t.context.textFile, new RegExp('Word', 'i'));
        t.true(exists);
    }));
    ava_6.default('update - updates a JSON file', (t) => __awaiter(this, void 0, void 0, function* () {
        const configFile = tempWrite.sync(CONFIG_STRING, '.json');
        const updated = yield patching.update(configFile, contents => {
            t.is(typeof contents, 'object');
            t.is(contents.test, 'what???');
            t.is(contents.test2, 'never');
            contents.mutated = true;
            return contents;
        });
        // returned the updated object
        t.true(updated.mutated);
        t.is(updated.test, 'what???');
        t.is(updated.test2, 'never');
        // file was actually written to with the right contents
        const newContents = yield jetpack.read(configFile, 'utf8');
        const expectedContents = `{\n  "test": "what???",\n  "test2": "never",\n  "mutated": true\n}`;
        t.is(newContents, expectedContents);
    }));
    ava_6.default('update - updates a text file', (t) => __awaiter(this, void 0, void 0, function* () {
        const updated = yield patching.update(t.context.textFile, contents => {
            t.is(contents, `These are some words.\n\nThey're very amazing.\n`);
            contents = `These are some different words.\nEven more amazing.\n`;
            return contents;
        });
        // returned the updated object
        t.is(updated, `These are some different words.\nEven more amazing.\n`);
        // file was actually written to with the right contents
        const newContents = yield jetpack.read(t.context.textFile, 'utf8');
        const expectedContents = `These are some different words.\nEven more amazing.\n`;
        t.is(newContents, expectedContents);
    }));
    ava_6.default('update - cancel updating a file', (t) => __awaiter(this, void 0, void 0, function* () {
        const updated = yield patching.update(t.context.textFile, contents => {
            return false;
        });
        // returned false
        t.false(updated);
        // file was not altered
        const newContents = yield jetpack.read(t.context.textFile, 'utf8');
        const expectedContents = `These are some words.\n\nThey're very amazing.\n`;
        t.is(newContents, expectedContents);
    }));
    ava_6.default('prepend - prepends a text file', (t) => __awaiter(this, void 0, void 0, function* () {
        const updated = yield patching.prepend(t.context.textFile, 'prepended info\n');
        // returned the updated object
        t.is(updated, `prepended info\nThese are some words.\n\nThey're very amazing.\n`);
        // file was actually written to with the right contents
        const newContents = yield jetpack.read(t.context.textFile, 'utf8');
        const expectedContents = `prepended info\nThese are some words.\n\nThey're very amazing.\n`;
        t.is(newContents, expectedContents);
    }));
    ava_6.default('append - appends a text file', (t) => __awaiter(this, void 0, void 0, function* () {
        const updated = yield patching.append(t.context.textFile, 'appended info\n');
        // returned the updated object
        t.is(updated, `These are some words.\n\nThey're very amazing.\nappended info\n`);
        // file was actually written to with the right contents
        const newContents = yield jetpack.read(t.context.textFile, 'utf8');
        const expectedContents = `These are some words.\n\nThey're very amazing.\nappended info\n`;
        t.is(newContents, expectedContents);
    }));
    ava_6.default('replace - replaces text in a text file', (t) => __awaiter(this, void 0, void 0, function* () {
        const updated = yield patching.replace(t.context.textFile, 'very amazing', 'replaced info');
        // returned the updated object
        t.is(updated, `These are some words.\n\nThey're replaced info.\n`);
        // file was actually written to with the right contents
        const newContents = yield jetpack.read(t.context.textFile, 'utf8');
        const expectedContents = `These are some words.\n\nThey're replaced info.\n`;
        t.is(newContents, expectedContents);
    }));
    ava_6.default('patch - replaces text in a text file', (t) => __awaiter(this, void 0, void 0, function* () {
        const updated = yield patching.patch(t.context.textFile, {
            replace: 'very amazing',
            insert: 'patched info',
        });
        // returned the updated object
        t.is(updated, `These are some words.\n\nThey're patched info.\n`);
        // file was actually written to with the right contents
        const newContents = yield jetpack.read(t.context.textFile, 'utf8');
        const expectedContents = `These are some words.\n\nThey're patched info.\n`;
        t.is(newContents, expectedContents);
    }));
    ava_6.default('patch - adds text before other text in a text file', (t) => __awaiter(this, void 0, void 0, function* () {
        const updated = yield patching.patch(t.context.textFile, {
            before: 'very amazing',
            insert: 'patched info ',
        });
        // returned the updated object
        t.is(updated, `These are some words.\n\nThey're patched info very amazing.\n`);
        // file was actually written to with the right contents
        const newContents = yield jetpack.read(t.context.textFile, 'utf8');
        const expectedContents = `These are some words.\n\nThey're patched info very amazing.\n`;
        t.is(newContents, expectedContents);
    }));
    ava_6.default('patch - adds text after other text in a text file', (t) => __awaiter(this, void 0, void 0, function* () {
        const updated = yield patching.patch(t.context.textFile, {
            after: 'some words',
            insert: ' patched info',
        });
        // returned the updated object
        t.is(updated, `These are some words patched info.\n\nThey're very amazing.\n`);
        // file was actually written to with the right contents
        const newContents = yield jetpack.read(t.context.textFile, 'utf8');
        const expectedContents = `These are some words patched info.\n\nThey're very amazing.\n`;
        t.is(newContents, expectedContents);
    }));
    ava_6.default('patch - deletes text in a text file', (t) => __awaiter(this, void 0, void 0, function* () {
        const updated = yield patching.patch(t.context.textFile, {
            delete: 'some words',
        });
        // returned the updated object
        t.is(updated, `These are .\n\nThey're very amazing.\n`);
        // file was actually written to with the right contents
        const newContents = yield jetpack.read(t.context.textFile, 'utf8');
        const expectedContents = `These are .\n\nThey're very amazing.\n`;
        t.is(newContents, expectedContents);
    }));
});
define("core-extensions/patching-extension", ["require", "exports", "fs-jetpack", "utils/filesystem-utils", "utils/string-utils", "ramda"], function (require, exports, jetpack, filesystem_utils_7, string_utils_7, ramda_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Builds the patching feature.
     *
     * @param  {RunContext} context The running context.
     */
    function attach(context) {
        /**
         * Identifies if something exists in a file. Async.
         *
         * @param {string} filename The path to the file we'll be scanning.
         * @param {string} findPattern The case sensitive string or RegExp that identifies existence.
         * @return {Promise<boolean>} Boolean of success that findPattern was in file.
         */
        function exists(filename, findPattern) {
            return __awaiter(this, void 0, void 0, function* () {
                // sanity check the filename
                if (string_utils_7.isNotString(filename) || filesystem_utils_7.isNotFile(filename)) {
                    return false;
                }
                // sanity check the findPattern
                const patternIsString = typeof findPattern === 'string';
                if (!(findPattern instanceof RegExp) && !patternIsString) {
                    return false;
                }
                // read from jetpack -- they guard against a lot of the edge
                // cases and return nil if problematic
                const contents = jetpack.read(filename);
                // only let the strings pass
                if (string_utils_7.isNotString(contents)) {
                    return false;
                }
                // do the appropriate check
                return patternIsString ? contents.includes(findPattern) : ramda_13.test(findPattern, contents);
            });
        }
        /**
         * Updates a text file or json config file. Async.
         *
         * @param  {string} filename File to be modified.
         * @param  {Function} callback Callback function for modifying the contents of the file.
         * @return {bool}  Whether the operation was successful
         */
        function update(filename, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                const contents = yield readFile(filename);
                // let the caller mutate the contents in memory
                const mutatedContents = callback(contents);
                // only write if they actually sent back something non-falsy
                if (mutatedContents) {
                    yield jetpack.writeAsync(filename, mutatedContents, { atomic: true });
                }
                // send back the rendered string
                return mutatedContents;
            });
        }
        /**
         * Convenience function for prepending a string to a given file. Async.
         *
         * @param {string} filename       File to be prepended to
         * @param {string} prependedData  String to prepend
         */
        function prepend(filename, prependedData) {
            return __awaiter(this, void 0, void 0, function* () {
                return update(filename, data => prependedData + data);
            });
        }
        /**
         * Convenience function for appending a string to a given file. Async.
         *
         * @param {string} filename       File to be appended to
         * @param {string} appendedData  String to append
         */
        function append(filename, appendedData) {
            return __awaiter(this, void 0, void 0, function* () {
                return update(filename, data => data + appendedData);
            });
        }
        /**
         * Convenience function for replacing a string in a given file. Async.
         *
         * @param {string} filename       File to be prepended to
         * @param {string} replace        String to replace
         * @param {string} newContent     String to write
         */
        function replace(filename, replace, newContent) {
            return __awaiter(this, void 0, void 0, function* () {
                return update(filename, data => data.replace(replace, newContent));
            });
        }
        /**
         * Conditionally places a string into a file before or after another string,
         * or replacing another string, or deletes a string. Async.
         *
         * @param {string}   filename        File to be patched
         * @param {Object}   opts            Options
         * @param {string}   opts.insert     String to be inserted
         * @param {string}   opts.before     Insert before this string
         * @param {string}   opts.after      Insert after this string
         * @param {string}   opts.replace    Replace this string
         * @param {string}   opts.delete     Delete this string
         * @param {boolean}  opts.force      Write even if it already exists
         *
         * @example
         *   await context.patching.patch('thing.js', { before: 'bar', insert: 'foo' })
         *
         */
        function patch(filename, opts = {}) {
            return __awaiter(this, void 0, void 0, function* () {
                return update(filename, data => patchString(data, opts));
            });
        }
        function readFile(filename) {
            return __awaiter(this, void 0, void 0, function* () {
                // bomb if the file doesn't exist
                if (!filesystem_utils_7.isFile(filename)) {
                    throw new Error(`file not found ${filename}`);
                }
                // check type of file (JSON or not)
                const fileType = filename.endsWith('.json') ? 'json' : 'utf8';
                // read the file
                const contents = yield jetpack.readAsync(filename, fileType);
                return contents;
            });
        }
        function patchString(data, opts) {
            // Already includes string, and not forcing it
            if (data.includes(opts.insert) && !opts.force)
                return false;
            // delete <string> is the same as replace <string> + insert ''
            const replaceString = opts.delete || opts.replace;
            if (replaceString) {
                if (!data.includes(replaceString)) {
                    return false;
                }
                // Replace matching string with new string or nothing if nothing provided
                return data.replace(replaceString, `${opts.insert || ''}`);
            }
            else {
                return insertNextToString(data, opts);
            }
        }
        function insertNextToString(data, opts) {
            // Insert before/after a particular string
            const findString = opts.before || opts.after;
            if (!data.includes(findString)) {
                return false;
            }
            const newContents = opts.after ? `${findString}${opts.insert || ''}` : `${opts.insert || ''}${findString}`;
            return data.replace(findString, newContents);
        }
        context.patching = { update, append, prepend, replace, patch, exists };
    }
    module.exports = attach;
});
define("core-extensions/print-extension.test", ["require", "exports", "ava"], function (require, exports, ava_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const printExtension = require('./print-extension');
    let context = {};
    printExtension(context);
    const { print } = context;
    ava_7.default('info', t => {
        t.is(typeof print.info, 'function');
    });
    ava_7.default('warning', t => {
        t.is(typeof print.warning, 'function');
    });
    ava_7.default('success', t => {
        t.is(typeof print.success, 'function');
    });
    ava_7.default('error', t => {
        t.is(typeof print.error, 'function');
    });
    ava_7.default('debug', t => {
        t.is(typeof print.debug, 'function');
    });
    ava_7.default('newline', t => {
        t.is(typeof print.newline, 'function');
    });
    ava_7.default('table', t => {
        t.is(typeof print.table, 'function');
    });
    ava_7.default('spin', t => {
        t.is(typeof print.spin, 'function');
    });
    ava_7.default('colors', t => {
        t.is(typeof print.colors.highlight, 'function');
        t.is(typeof print.colors.info, 'function');
        t.is(typeof print.colors.warning, 'function');
        t.is(typeof print.colors.success, 'function');
        t.is(typeof print.colors.error, 'function');
        t.is(typeof print.colors.line, 'function');
        t.is(typeof print.colors.muted, 'function');
    });
});
define("core-extensions/print-extension", ["require", "exports", "utils/print", "utils/print-help"], function (require, exports, print, print_help_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Extensions to print to the console.
     *
     * @param  {RunContext} context The running context.
     */
    function attach(context) {
        const { colors, debug } = print;
        const checkmark = colors.success('✔︎');
        const xmark = colors.error('ⅹ');
        /**
         * Prints an informational message.  Use this as your goto.
         */
        function info(message) {
            print.info(message);
        }
        /**
         * Prints a warning message.  Use this when you feel a disturbance in the force.
         */
        function warning(message) {
            print.warning(message);
        }
        /**
         * Prints an error message.  Use this when something goes Pants-On-Head wrong.
         * What does that mean?  Well, if your next line of code isn't process.exit(0), then
         * it was probably a warning.
         */
        function error(message) {
            print.error(message);
        }
        /**
         * Prints a success message.  Use this when something awesome just happened.
         */
        function success(message) {
            print.success(message);
        }
        /**
         * Creates a spinner and starts it up.
         *
         * @param {string|Object} config The text for the spinner or an ora configuration object.
         * @returns The spinner.
         */
        function spin(config) {
            return print.spin(config);
        }
        // attach the feature set
        context.print = {
            info,
            warning,
            error,
            success,
            debug,
            colors,
            checkmark,
            xmark,
            spin,
            printHelp: print_help_2.printHelp,
            printCommands: print_help_2.printCommands,
            table: print.table,
            newline: print.newline,
            color: colors,
        };
    }
    module.exports = attach;
});
define("core-extensions/prompt-extension.test", ["require", "exports", "ava", "domain/run-context"], function (require, exports, ava_8, run_context_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const createExtension = require('./prompt-extension');
    ava_8.default('has the proper interface', t => {
        const context = new run_context_6.default();
        createExtension(context);
        const ext = context.prompt;
        t.truthy(ext);
        t.is(typeof ext.ask, 'function');
        t.is(typeof ext.separator, 'function');
        t.is(typeof ext.question, 'function');
    });
});
define("core-extensions/prompt-extension", ["require", "exports", "enquirer"], function (require, exports, Enquirer) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Provides user input prompts via enquirer.js.
     *
     * @param  {RunContext} context The running context.
     */
    function attach(context) {
        const enquirer = new Enquirer();
        enquirer.register('list', require('prompt-list'));
        enquirer.register('rawlist', require('prompt-rawlist'));
        enquirer.register('confirm', require('prompt-confirm'));
        enquirer.register('expand', require('prompt-expand'));
        enquirer.register('checkbox', require('prompt-checkbox'));
        enquirer.register('radio', require('prompt-radio'));
        enquirer.register('password', require('prompt-password'));
        enquirer.register('question', require('prompt-question'));
        enquirer.register('autocomplete', require('prompt-autocompletion'));
        /**
         * A yes/no question.
         *
         * @param {string} message The message to display to the user.
         * @returns {bool}         The true/false answer.
         */
        const confirm = (message) => __awaiter(this, void 0, void 0, function* () {
            const answers = yield enquirer.ask({
                name: 'yesno',
                type: 'confirm',
                message,
            });
            return answers.yesno;
        });
        // attach our helpers
        enquirer.confirm = confirm;
        context.prompt = enquirer;
    }
    module.exports = attach;
});
define("core-extensions/semver-extension", ["require", "exports", "semver"], function (require, exports, semver_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Extensions to access semver and helpers
     *
     * @param  {RunContext} context The running context.
     */
    function attach(context) {
        const extension = semver_1.default; // semver
        // Add bells and whistles here
        context.semver = extension;
    }
    module.exports = attach;
});
define("core-extensions/strings-extension.test", ["require", "exports", "ava", "domain/run-context"], function (require, exports, ava_9, run_context_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const createExtension = require('./strings-extension');
    ava_9.default('has the proper interface', t => {
        const context = new run_context_7.default();
        createExtension(context);
        const ext = context.strings;
        t.truthy(ext);
        t.is(typeof ext.trim, 'function');
        t.is(ext.trim('  lol'), 'lol');
    });
});
const stringUtils = require('../utils/string-utils');
/**
 * Attaches some string helpers for convenience.
 *
 * @param  {RunContext} context The running context.
 */
function attach(context) {
    context.strings = stringUtils;
}
module.exports = attach;
define("core-extensions/system-extension.test", ["require", "exports", "ava", "domain/run-context"], function (require, exports, ava_10, run_context_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const create = require('./system-extension');
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const context = new run_context_8.default();
    create(context);
    const system = context.system;
    ava_10.default('survives the factory function', t => {
        t.truthy(system);
        t.is(typeof system.run, 'function');
    });
    ava_10.default('captures stdout', (t) => __awaiter(this, void 0, void 0, function* () {
        const stdout = yield system.run(`ls ${__filename}`);
        t.is(stdout, `${__filename}\n`);
    }));
    ava_10.default('captures stderr', (t) => __awaiter(this, void 0, void 0, function* () {
        t.plan(1);
        try {
            yield system.run(`omgdontrunlol ${__filename}`);
        }
        catch (e) {
            t.true(/not found/.test(e.stderr));
        }
    }));
    ava_10.default('knows about which', t => {
        const npm = system.which('npm');
        t.truthy(npm);
    });
    ava_10.default('can spawn and capture results', (t) => __awaiter(this, void 0, void 0, function* () {
        const good = yield system.spawn('echo hello');
        t.is(good.status, 0);
        t.is(good.stdout.toString(), 'hello\n');
    }));
    ava_10.default('spawn deals with missing programs', (t) => __awaiter(this, void 0, void 0, function* () {
        const crap = yield system.spawn('dfsjkajfkldasjklfajsd');
        t.truthy(crap.error);
        t.falsy(crap.output);
        t.is(crap.status, null);
    }));
    ava_10.default('spawn deals exit codes', (t) => __awaiter(this, void 0, void 0, function* () {
        const crap = yield system.spawn('npm');
        t.falsy(crap.error);
        t.is(crap.status, 1);
    }));
    ava_10.default.serial('start timer returns the number of milliseconds', (t) => __awaiter(this, void 0, void 0, function* () {
        const WAIT = 10;
        const elapsed = system.startTimer(); // start a timer
        yield delay(WAIT); // simulate a delay
        const duration = elapsed(); // how long was that?
        // due to rounding this can be before the timeout.
        t.true(duration >= WAIT - 1);
    }));
});
define("core-extensions/system-extension", ["require", "exports", "child_process", "ramda"], function (require, exports, child_process_1, ramda_14) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const execa = require('execa');
    const nodeWhich = require('which');
    const crossSpawn = require('cross-spawn');
    /**
     * Extensions to launch processes and open files.
     *
     * @param  {RunContext} context The running context.
     */
    function attach(context) {
        /**
         * Executes a commandline program asynchronously.
         *
         * @param {string} commandLine The command line to execute.
         * @param {options} options Additional child_process options for node.
         * @returns {Promise}
         */
        function run(commandLine, options = {}) {
            return __awaiter(this, void 0, void 0, function* () {
                const trimmer = options && options.trim ? ramda_14.trim : ramda_14.identity;
                const nodeOptions = ramda_14.dissoc('trim', options);
                return new Promise((resolve, reject) => {
                    child_process_1.exec(commandLine, nodeOptions, (error, stdout, stderr) => {
                        if (error) {
                            error.stderr = stderr;
                            reject(error);
                        }
                        resolve(trimmer(stdout || ''));
                    });
                });
            });
        }
        /**
         * Executes a commandline via execa.
         *
         * @param {string} commandLine The command line to execute.
         * @param {options} options Additional child_process options for node.
         * @returns {Promise}
         */
        function exec(commandLine, options) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    const args = ramda_14.split(' ', commandLine);
                    execa(ramda_14.head(args), ramda_14.tail(args), options)
                        .then(result => resolve(result.stdout))
                        .catch(error => reject(error));
                });
            });
        }
        /**
         * Uses cross-spawn to run a process.
         *
         * @param {any} commandLine The command line to execute.
         * @param {options} options Additional child_process options for node.
         * @returns {Promise} The response code.
         */
        function spawn(commandLine, options) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    const args = ramda_14.split(' ', commandLine);
                    const spawned = crossSpawn(ramda_14.head(args), ramda_14.tail(args), options);
                    let result = {
                        stdout: null,
                        status: null,
                        error: null,
                    };
                    if (spawned.stdout) {
                        spawned.stdout.on('data', data => {
                            if (ramda_14.isNil(result.stdout)) {
                                result.stdout = data;
                            }
                            else {
                                result.stdout += data;
                            }
                        });
                    }
                    spawned.on('close', code => {
                        result.status = code;
                        resolve(result);
                    });
                    spawned.on('error', err => {
                        result.error = err;
                        resolve(result);
                    });
                });
            });
        }
        /**
         * Finds the location of the path.
         *
         * @param {string} command The name of program you're looking for.
         * @return {string} The full path or null.
         */
        function which(command) {
            return nodeWhich.sync(command);
        }
        /**
         * Starts a timer used for measuring durations.
         *
         * @return {function} A function that when called will return the elapsed duration in milliseconds.
         */
        function startTimer() {
            const started = process.uptime();
            return () => Math.floor((process.uptime() - started) * 1000); // uptime gives us seconds
        }
        context.system = { exec, run, spawn, which, startTimer };
    }
    module.exports = attach;
});
define("core-extensions/template-extension.test", ["require", "exports", "ava", "runtime/runtime", "ramdasauce"], function (require, exports, ava_11, runtime_2, ramdasauce_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const createRuntime = () => {
        const r = new runtime_2.default();
        r.addPlugin(`${__dirname}/../fixtures/good-plugins/generate`);
        return r;
    };
    ava_11.default.only('generates a simple file', (t) => __awaiter(this, void 0, void 0, function* () {
        const context = yield createRuntime().run('generate simple');
        t.is(context.result, 'simple file\n');
    }));
    ava_11.default('supports props', (t) => __awaiter(this, void 0, void 0, function* () {
        const context = yield createRuntime().run('generate props Greetings_and_salutations', {
            stars: 5,
        });
        t.is(context.result, `greetingsAndSalutations world
red
green
blue
*****
`);
    }));
    ava_11.default('detects missing templates', (t) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield createRuntime().run('generate missing');
        }
        catch (e) {
            t.true(ramdasauce_2.startsWith('template not found', e.message));
        }
    }));
    ava_11.default('supports directories', (t) => __awaiter(this, void 0, void 0, function* () {
        const context = yield createRuntime().run('generate special location');
        t.is(context.result, `location
`);
    }));
});
define("core-extensions/template-extension", ["require", "exports", "ejs", "fs-jetpack", "ramda", "utils/string-utils", "utils/filesystem-utils"], function (require, exports, ejs, jetpack, ramda_15, stringUtils, filesystem_utils_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Builds the code generation feature.
     *
     * @param  {RunContext} context The running context.
     */
    function attach(context) {
        const { plugin } = context;
        /**
         * Generates a file from a template.
         *
         * @param  {{}} opts Generation options.
         * @return {string}  The generated string.
         */
        function generate(opts = {}) {
            return __awaiter(this, void 0, void 0, function* () {
                // required
                const template = opts.template;
                // optional
                const target = opts.target;
                const props = opts.props || {};
                // add some goodies to the environment so templates can read them
                const data = {
                    config: context && context.config,
                    parameters: context && context.parameters,
                    props: props,
                };
                // add our string utils to the filters available.
                ramda_15.forEach(x => {
                    data[x] = stringUtils[x];
                }, ramda_15.keys(stringUtils));
                // pick a base directory for templates
                const directory = opts.directory ? opts.directory : `${plugin && plugin.directory}/templates`;
                const pathToTemplate = `${directory}/${template}`;
                // bomb if the template doesn't exist
                if (!filesystem_utils_8.isFile(pathToTemplate)) {
                    throw new Error(`template not found ${pathToTemplate}`);
                }
                // read the template
                const templateContent = jetpack.read(pathToTemplate);
                // render the template
                const content = ejs.render(templateContent, data);
                // save it to the file system
                if (!stringUtils.isBlank(target)) {
                    // prep the destination directory
                    const dir = ramda_15.replace(/$(\/)*/g, '', target);
                    const dest = jetpack.path(dir);
                    jetpack.write(dest, content);
                }
                // send back the rendered string
                return content;
            });
        }
        context.template = { generate };
    }
    module.exports = attach;
});
define("domain/builder.test", ["require", "exports", "ava", "domain/builder", "domain/run-context"], function (require, exports, ava_12, builder_2, run_context_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava_12.default('the gauntlet', t => {
        const brand = 'test';
        const builder = builder_2.build()
            .brand(brand)
            .src(`${__dirname}/../fixtures/good-plugins/threepack`)
            .help()
            .version({
            name: 'gimmedatversion',
            alias: ['version', 'v'],
            run: context => 'it works',
        })
            .defaultCommand()
            .plugin(`${__dirname}/../fixtures/good-plugins/simplest`)
            .plugins(`${__dirname}/../fixtures/good-plugins`, { hidden: true });
        // test the builder
        t.is(builder.runtime.brand, 'test');
        const runtime = builder.create();
        t.truthy(runtime);
        // console.dir(runtime.defaultPlugin.commands, { colors: true, levels: 2 })
        // t.is({}, runtime.defaultPlugin.commands[2])
        t.is(runtime.defaultPlugin.commands.length, 6);
        t.is(runtime.defaultPlugin.commands[0].name, brand);
        t.is(runtime.defaultPlugin.commands[1].name, 'gimmedatversion');
        t.is(runtime.defaultPlugin.commands[1].run(new run_context_9.default()), 'it works');
        t.is(runtime.defaultPlugin.commands[2].name, 'help');
        t.is(runtime.defaultPlugin.commands[3].name, 'one');
        t.is(runtime.defaultPlugin.commands[4].name, 'three');
        t.is(runtime.defaultPlugin.commands[5].name, 'two');
    });
});
define("domain/command.test", ["require", "exports", "ava", "domain/command"], function (require, exports, ava_13, command_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava_13.default('default state', t => {
        const command = new command_2.default();
        t.truthy(command);
        t.falsy(command.name);
        t.falsy(command.file);
        t.falsy(command.description);
        t.falsy(command.run);
        t.falsy(command.dashed);
        t.is(command.hidden, false);
    });
    ava_13.default('matchesAlias', t => {
        const command = new command_2.default();
        command.name = 'yogurt';
        command.alias = ['yo', 'y'];
        t.truthy(command.matchesAlias(['asdf', 'i', 'yo']));
        t.truthy(command.matchesAlias('yogurt'));
        t.falsy(command.matchesAlias(['asdf', 'i', 'womp']));
    });
});
define("domain/plugin.test", ["require", "exports", "ava", "domain/plugin"], function (require, exports, ava_14, plugin_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava_14.default('default state', t => {
        const plugin = new plugin_2.default();
        t.truthy(plugin);
        t.falsy(plugin.directory);
        t.falsy(plugin.name);
        t.is(plugin.hidden, false);
        t.deepEqual(plugin.commands, []);
        t.deepEqual(plugin.extensions, []);
        t.deepEqual(plugin.defaults, {});
    });
});
define("domain/run-context.test", ["require", "exports", "ava", "domain/run-context"], function (require, exports, ava_15, run_context_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava_15.default('initial state', t => {
        const ctx = new run_context_10.default();
        t.falsy(ctx.result);
        t.falsy(ctx.error);
        t.deepEqual(ctx.config, {});
        t.deepEqual(ctx.parameters, {});
    });
});
define("loaders/command-loader.test", ["require", "exports", "ava", "loaders/command-loader", "domain/run-context"], function (require, exports, ava_16, command_loader_3, run_context_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava_16.default('loading from a missing file', (t) => __awaiter(this, void 0, void 0, function* () {
        const error = yield t.throws(() => command_loader_3.loadCommandFromFile('foo.js'), Error);
        t.is(error.message, "Error: couldn't load command (this isn't a file): foo.js");
    }));
    ava_16.default('deals with weird input', (t) => __awaiter(this, void 0, void 0, function* () {
        const error = yield t.throws(() => command_loader_3.loadCommandFromFile(''), Error);
        t.is(error.message, "Error: couldn't load command (file is blank): ");
    }));
    ava_16.default('open a weird js file', (t) => __awaiter(this, void 0, void 0, function* () {
        const file = `${__dirname}/../fixtures/bad-modules/text.js`;
        const error = yield t.throws(() => command_loader_3.loadCommandFromFile(file), Error);
        t.is(error.message, `hello is not defined`);
    }));
    ava_16.default('default but no run property exported', (t) => __awaiter(this, void 0, void 0, function* () {
        const file = `${__dirname}/../fixtures/good-modules/module-exports-object.js`;
        const error = yield t.throws(() => command_loader_3.loadCommandFromFile(file), Error);
        t.is(error.message, `Error: Couldn't load command module-exports-object -- needs a "run" property with a function.`);
    }));
    ava_16.default('fat arrows', (t) => __awaiter(this, void 0, void 0, function* () {
        const file = `${__dirname}/../fixtures/good-modules/module-exports-fat-arrow-fn.js`;
        yield t.notThrows(() => command_loader_3.loadCommandFromFile(file));
    }));
    ava_16.default('load command from preload', (t) => __awaiter(this, void 0, void 0, function* () {
        const command = command_loader_3.loadCommandFromPreload({
            name: 'hello',
            description: 'yiss dream',
            alias: ['z'],
            dashed: true,
            run: context => 'ran!',
        });
        t.is(command.name, 'hello');
        t.is(command.description, 'yiss dream');
        t.is(command.hidden, false);
        t.deepEqual(command.alias, ['z']);
        t.is(command.run(new run_context_11.default()), 'ran!');
        t.is(command.file, null);
        t.is(command.dashed, true);
        t.deepEqual(command.commandPath, ['hello']);
    }));
});
define("loaders/extension-loader.test", ["require", "exports", "ava", "loaders/extension-loader"], function (require, exports, ava_17, extension_loader_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava_17.default('loading from a missing file', (t) => __awaiter(this, void 0, void 0, function* () {
        const error = yield t.throws(() => extension_loader_2.loadExtensionFromFile('foo.js', 'extension'), Error);
        t.is(error.message, `Error: couldn't load command (not a file): foo.js`);
    }));
    ava_17.default('deals with wierd input', (t) => __awaiter(this, void 0, void 0, function* () {
        const error = yield t.throws(() => extension_loader_2.loadExtensionFromFile(''), Error);
        t.is(error.message, `Error: couldn't load extension (file is blank): `);
    }));
    ava_17.default('open a wierd js file', (t) => __awaiter(this, void 0, void 0, function* () {
        const file = `${__dirname}/../fixtures/bad-modules/text.js`;
        const error = yield t.throws(() => extension_loader_2.loadExtensionFromFile(file, 'extension'), Error);
        t.is(error.message, `hello is not defined`);
    }));
    ava_17.default('default but none exported', (t) => __awaiter(this, void 0, void 0, function* () {
        const file = `${__dirname}/../fixtures/good-modules/module-exports-object.js`;
        const error = yield t.throws(() => extension_loader_2.loadExtensionFromFile(file, 'extension'), Error);
        t.is(error.message, `Error: couldn't load module-exports-object. Expected a function, got [object Object].`);
    }));
    ava_17.default('has front matter', (t) => __awaiter(this, void 0, void 0, function* () {
        const file = `${__dirname}/../fixtures/good-plugins/front-matter/extensions/hello.js`;
        const extension = extension_loader_2.loadExtensionFromFile(file, 'extension');
        t.is(typeof extension.setup, 'function');
        t.is(extension.name, 'hello');
    }));
});
define("loaders/home-plugin-directories", ["require", "exports", "ramda", "fs-jetpack", "utils/filesystem-utils"], function (require, exports, ramda_16, jetpack, filesystem_utils_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Gets a list of fully qualified directories from the user's home directory.
     *
     * @param  {string} brand The brand controls the subdirectory off of $HOME
     * @return {string[]}     A string list of directories.
     */
    function default_1(brand) {
        // load plugins from the $HOME/.<brand>/plugins
        const isWindows = /^win/.test(process.platform);
        const homeDir = process.env[isWindows ? 'USERPROFILE' : 'HOME'];
        const homePluginsDir = `${homeDir}/.${brand}/plugins`;
        // jet if we don't have that directory
        if (!filesystem_utils_9.isDirectory(homePluginsDir))
            return [];
        // grab the directories right under
        const relativeDirs = jetpack
            .cwd(homePluginsDir)
            .find({ matching: '*', directories: true, recursive: false, files: false });
        return ramda_16.map(dir => `${homePluginsDir}/${dir}`, relativeDirs);
    }
    exports.default = default_1;
});
define("loaders/module-loader.test", ["require", "exports", "ava", "loaders/module-loader", "ramda"], function (require, exports, ava_18, module_loader_3, ramda_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava_18.default('handles weird input', t => {
        t.throws(() => module_loader_3.default(''));
        t.throws(() => module_loader_3.default(1));
        t.throws(() => module_loader_3.default(1.1));
        t.throws(() => module_loader_3.default(true));
        t.throws(() => module_loader_3.default(false));
        t.throws(() => module_loader_3.default([]));
        t.throws(() => module_loader_3.default({}));
        t.throws(() => module_loader_3.default(() => { }));
    });
    ava_18.default('detects missing file', t => {
        t.throws(() => module_loader_3.default(`${__dirname}/../fixtures/bad-modules/missing.js`));
    });
    ava_18.default('detects directory', t => {
        t.throws(() => module_loader_3.default(`${__dirname}/../fixtures/bad-modules`));
    });
    ava_18.default('handles blank files', t => {
        const m = module_loader_3.default(`${__dirname}/../fixtures/bad-modules/blank.js`);
        t.is(typeof m, 'object');
        t.deepEqual(ramda_17.keys(m), []);
    });
    ava_18.default('handles files with just a number', t => {
        const m = module_loader_3.default(`${__dirname}/../fixtures/bad-modules/number.js`);
        t.is(typeof m, 'number');
        t.deepEqual(ramda_17.keys(m), []);
    });
    ava_18.default('handles files with just text', t => {
        t.throws(() => module_loader_3.default(`${__dirname}/../fixtures/bad-modules/text.js`));
    });
    ava_18.default('handles files with an object', t => {
        const m = module_loader_3.default(`${__dirname}/../fixtures/bad-modules/object.js`);
        t.is(typeof m, 'object');
        t.deepEqual(ramda_17.keys(m), []);
    });
    ava_18.default('export default function', t => {
        const m = module_loader_3.default(`${__dirname}/../fixtures/good-modules/module-exports-function.js`);
        t.is(typeof m, 'function');
        t.is(m(), 'hi');
    });
    ava_18.default('export default {}', (t) => __awaiter(this, void 0, void 0, function* () {
        const m = module_loader_3.default(`${__dirname}/../fixtures/good-modules/module-exports-object.js`);
        t.is(typeof m, 'object');
        t.is(yield m.hi(), 'hi');
    }));
    ava_18.default('module.exports fat arrow function', t => {
        const m = module_loader_3.default(`${__dirname}/../fixtures/good-modules/module-exports-fat-arrow-fn.js`);
        t.is(typeof m.run, 'function');
        t.is(m.run(), 'hi');
    });
    ava_18.default('async function', (t) => __awaiter(this, void 0, void 0, function* () {
        const m = module_loader_3.default(`${__dirname}/../fixtures/good-modules/async-function.js`);
        t.is(typeof m, 'object');
        t.is(yield m.hi(), 'hi');
    }));
    ava_18.default('deals with dupes', (t) => __awaiter(this, void 0, void 0, function* () {
        const m = module_loader_3.default(`${__dirname}/../fixtures/good-modules/async-function.js`);
        const n = module_loader_3.default(`${__dirname}/../fixtures/good-modules/../good-modules/async-function.js`);
        t.is(m, n);
    }));
});
define("loaders/plugin-loader.test", ["require", "exports", "ava", "loaders/plugin-loader", "ramda", "domain/run-context"], function (require, exports, ava_19, plugin_loader_2, ramda_18, run_context_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava_19.default('deals with weird input', t => {
        t.throws(() => plugin_loader_2.loadPluginFromDirectory(''));
        t.throws(() => plugin_loader_2.loadPluginFromDirectory(`${__dirname}/gonebabygone`));
    });
    ava_19.default('missing config files is fine', t => {
        const plugin = plugin_loader_2.loadPluginFromDirectory(`${__dirname}/../fixtures/good-plugins/empty`);
        t.deepEqual(plugin.commands, []);
        t.deepEqual(plugin.extensions, []);
    });
    ava_19.default('default name', t => {
        const plugin = plugin_loader_2.loadPluginFromDirectory(`${__dirname}/../fixtures/good-plugins/missing-name`);
        t.is(plugin.name, 'missing-name');
    });
    ava_19.default('sane defaults', t => {
        const dir = `${__dirname}/../fixtures/good-plugins/simplest`;
        const plugin = plugin_loader_2.loadPluginFromDirectory(dir);
        t.is(plugin.name, 'simplest');
        t.is(plugin.directory, dir);
        t.deepEqual(plugin.extensions, []);
        t.deepEqual(plugin.commands, []);
        t.deepEqual(plugin.defaults, {});
    });
    ava_19.default('loads commands', (t) => __awaiter(this, void 0, void 0, function* () {
        const dir = `${__dirname}/../fixtures/good-plugins/threepack`;
        const plugin = plugin_loader_2.loadPluginFromDirectory(dir);
        t.is(plugin.name, '3pack');
        t.is(plugin.directory, dir);
        t.is(plugin.commands.length, 3);
        t.deepEqual(plugin.defaults, { numbers: 3 });
        const two = ramda_18.find(ramda_18.propEq('name', 'two'), plugin.commands);
        t.is(two.name, 'two');
        t.is(two.file, `${dir}/commands/two.js`);
        t.is(typeof two.run, 'function');
        t.is(yield two.run(), 'two');
        t.falsy(plugin.commands[0].hidden);
        t.falsy(plugin.commands[1].hidden);
        t.falsy(plugin.commands[2].hidden);
    }));
    ava_19.default('load commands with front matter', (t) => __awaiter(this, void 0, void 0, function* () {
        const dir = `${__dirname}/../fixtures/good-plugins/front-matter`;
        const plugin = plugin_loader_2.loadPluginFromDirectory(dir);
        t.is(plugin.commands.length, 1);
        // test the command
        const full = ramda_18.find(ramda_18.propEq('name', 'full'), plugin.commands);
        t.is(full.name, 'full');
        t.is(full.file, `${dir}/commands/full.js`);
        t.is(typeof full.run, 'function');
        t.is(yield full.run(), 123);
    }));
    ava_19.default('loads extensions with front matter', (t) => __awaiter(this, void 0, void 0, function* () {
        const context = new run_context_12.default();
        const dir = `${__dirname}/../fixtures/good-plugins/front-matter`;
        const plugin = plugin_loader_2.loadPluginFromDirectory(dir);
        // test the extension
        t.is(plugin.extensions.length, 1);
        const ext = plugin.extensions[0];
        t.is(ext.name, 'hello');
        t.is(typeof ext.setup, 'function');
        ext.setup(context);
        t.truthy(context.hello);
        t.is(context.hello.very, 'little');
    }));
    ava_19.default('names default to the filename', (t) => __awaiter(this, void 0, void 0, function* () {
        const plugin = plugin_loader_2.loadPluginFromDirectory(`${__dirname}/../fixtures/good-plugins/auto-detect`);
        t.is(plugin.commands[0].name, 'detectCommand');
        t.is(plugin.extensions[0].name, 'detectExtension');
    }));
    ava_19.default('plugin names can be overridden', (t) => __awaiter(this, void 0, void 0, function* () {
        const plugin = plugin_loader_2.loadPluginFromDirectory(`${__dirname}/../fixtures/good-plugins/auto-detect`, {
            name: 'override',
        });
        t.is(plugin.name, 'override');
    }));
    ava_19.default('blank names fallback to directory name', t => {
        const plugin = plugin_loader_2.loadPluginFromDirectory(`${__dirname}/../fixtures/good-plugins/blank-name`);
        t.is(plugin.name, 'blank-name');
    });
    ava_19.default('supports hidden plugins & commands', t => {
        const dir = `${__dirname}/../fixtures/good-plugins/threepack`;
        const plugin = plugin_loader_2.loadPluginFromDirectory(dir, { hidden: true });
        t.true(plugin.hidden);
        t.true(plugin.commands[0].hidden);
        t.true(plugin.commands[1].hidden);
        t.true(plugin.commands[2].hidden);
    });
    ava_19.default('ignores test files', t => {
        const dir = `${__dirname}/../fixtures/good-plugins/excluded`;
        const plugin = plugin_loader_2.loadPluginFromDirectory(dir);
        t.is(plugin.commands.length, 2);
        t.is(plugin.commands[0].name, 'bar');
        t.is(plugin.commands[1].name, 'foo');
        t.is(plugin.extensions.length, 1);
    });
});
define("loaders/project-plugin-directories", ["require", "exports", "utils/filesystem-utils"], function (require, exports, filesystem_utils_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Gets a list of directories for the valid plugins found under
     * the users's project gluegun.
     *
     * @param  {string}   dir The path to the gluegun directory for the project.
     * @return {string[]}     A string list of directories.
     */
    function default_2(dir) {
        const localPlugins = filesystem_utils_10.subdirectories(`${dir}/plugins`);
        const remotePlugins = filesystem_utils_10.subdirectories(`${dir}/plugins-remote`);
        return [...localPlugins, ...remotePlugins];
    }
    exports.default = default_2;
});
define("runtime/runtime-config.test", ["require", "exports", "ava", "runtime/runtime"], function (require, exports, ava_20, runtime_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava_20.default('can read from config', (t) => __awaiter(this, void 0, void 0, function* () {
        const r = new runtime_3.default();
        const plugin = r.addPlugin(`${__dirname}/../fixtures/good-plugins/args`);
        const context = yield r.run('args config');
        t.truthy(plugin.defaults);
        t.is(plugin.defaults.color, 'blue');
        t.is(context.result, 'blue');
    }));
    ava_20.default('project config trumps plugin config', (t) => __awaiter(this, void 0, void 0, function* () {
        const r = new runtime_3.default();
        r.defaults = { args: { color: 'red' } };
        const plugin = r.addPlugin(`${__dirname}/../fixtures/good-plugins/args`);
        const context = yield r.run('args config');
        t.truthy(plugin.defaults);
        t.is(plugin.defaults.color, 'blue');
        t.is(context.result, 'red');
    }));
});
define("runtime/runtime-extensions.test", ["require", "exports", "ava", "runtime/runtime", "ramda"], function (require, exports, ava_21, runtime_4, ramda_19) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava_21.default('loads the core extensions in the right order', t => {
        const r = new runtime_4.default();
        const list = ramda_19.pipe(ramda_19.pluck('name'), ramda_19.join(', '))(r.extensions);
        t.is(list, 'meta, strings, print, template, filesystem, semver, system, http, prompt, patching');
    });
});
define("runtime/runtime-parameters.test", ["require", "exports", "ava", "runtime/runtime"], function (require, exports, ava_22, runtime_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava_22.default('can pass arguments', (t) => __awaiter(this, void 0, void 0, function* () {
        const r = new runtime_5.default();
        r.addPlugin(`${__dirname}/../fixtures/good-plugins/args`);
        const { command, parameters } = yield r.run('hello steve kellock', { caps: false });
        t.is(parameters.string, 'steve kellock');
        t.is(parameters.first, 'steve');
        t.is(parameters.second, 'kellock');
        t.is(parameters.command, 'hello');
        t.is(parameters.plugin, 'args');
        t.is(parameters.string, 'steve kellock');
        t.deepEqual(parameters.array, ['steve', 'kellock']);
        t.deepEqual(parameters.options, { caps: false });
        t.deepEqual(command.commandPath, ['hello']);
    }));
    ava_22.default('can pass arguments, even with nested alias', (t) => __awaiter(this, void 0, void 0, function* () {
        const r = new runtime_5.default();
        r.addPlugin(`${__dirname}/../fixtures/good-plugins/nested`);
        const { command, parameters } = yield r.run('t f jamon holmgren', { chocolate: true });
        t.is(parameters.string, 'jamon holmgren');
        t.is(parameters.first, 'jamon');
        t.is(parameters.second, 'holmgren');
        t.is(parameters.command, 'foo');
        t.is(parameters.plugin, 'nested');
        t.is(parameters.string, 'jamon holmgren');
        t.deepEqual(parameters.array, ['jamon', 'holmgren']);
        t.deepEqual(parameters.options, { chocolate: true });
        t.deepEqual(command.commandPath, ['thing', 'foo']);
    }));
    ava_22.default('can pass arguments with mixed options', (t) => __awaiter(this, void 0, void 0, function* () {
        const r = new runtime_5.default();
        r.addPlugin(`${__dirname}/../fixtures/good-plugins/args`);
        const { command, parameters } = yield r.run('--chocolate=true --foo -n 1 hello steve kellock');
        t.deepEqual(command.commandPath, ['hello']);
        t.is(parameters.string, 'steve kellock');
        t.is(parameters.first, 'steve');
        t.is(parameters.second, 'kellock');
        t.is(parameters.command, 'hello');
        t.is(parameters.options.foo, true);
        t.is(parameters.options.n, 1);
        t.is(parameters.options.chocolate, 'true');
    }));
});
define("runtime/runtime-plugin.test", ["require", "exports", "ava", "runtime/runtime"], function (require, exports, ava_23, runtime_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const BAD_PLUGIN_PATH = `${__dirname}/../fixtures/does-not-exist`;
    ava_23.default('load a directory', t => {
        const r = new runtime_6.default();
        r.addPlugin(`${__dirname}/../fixtures/good-plugins/simplest`);
        r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`);
        t.is(r.plugins.length, 2);
    });
    ava_23.default('hides commands', t => {
        const r = new runtime_6.default();
        r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`, { hidden: true });
        t.is(r.plugins.length, 1);
        t.true(r.plugins[0].commands[2].hidden);
    });
    ava_23.default('silently ignore plugins with broken dirs', (t) => __awaiter(this, void 0, void 0, function* () {
        const r = new runtime_6.default();
        const error = yield r.addPlugin(BAD_PLUGIN_PATH);
        t.is(undefined, error);
    }));
    ava_23.default("throws error if plugin doesn't exist and required: true", (t) => __awaiter(this, void 0, void 0, function* () {
        const r = new runtime_6.default();
        const error = yield t.throws(() => r.addPlugin(BAD_PLUGIN_PATH, { required: true }), Error);
        t.is(error.message, `Error: couldn't load plugin (not a directory): ${BAD_PLUGIN_PATH}`);
    }));
});
define("runtime/runtime-plugins.test", ["require", "exports", "ava", "runtime/runtime"], function (require, exports, ava_24, runtime_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava_24.default('loads all sub-directories', t => {
        const r = new runtime_7.default();
        r.addPlugins(`${__dirname}/../fixtures/good-plugins`);
        t.is(13, r.plugins.length);
    });
    ava_24.default('matches sub-directories', t => {
        const r = new runtime_7.default();
        r.addPlugins(`${__dirname}/../fixtures/good-plugins`, { matching: 'blank-*' });
        t.is(1, r.plugins.length);
    });
    ava_24.default('hides commands', t => {
        const r = new runtime_7.default();
        r.addPlugins(`${__dirname}/../fixtures/good-plugins`, {
            matching: 'threepack',
            hidden: true,
        });
        t.is(r.plugins.length, 1);
        t.true(r.plugins[0].commands[2].hidden);
    });
    ava_24.default('loadAll ignores bad directories', t => {
        const r = new runtime_7.default();
        r.addPlugins(__filename);
        r.addPlugins(null);
        r.addPlugins(undefined);
        r.addPlugins('');
        t.is(0, r.plugins.length);
    });
});
define("runtime/runtime-run-bad.test", ["require", "exports", "ava", "runtime/runtime"], function (require, exports, ava_25, runtime_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava_25.default('cannot find a command', (t) => __awaiter(this, void 0, void 0, function* () {
        const r = new runtime_8.default();
        const context = yield r.run('bloo blah');
        t.falsy(context.result);
    }));
    ava_25.default('is fatally wounded by exceptions', (t) => __awaiter(this, void 0, void 0, function* () {
        const r = new runtime_8.default();
        r.addPlugin(`${__dirname}/../fixtures/good-plugins/throws`);
        // for some reason, t.throws doesn't work on this one ...
        try {
            yield r.run('throws throw');
        }
        catch (e) {
            t.is(e.message, `thrown an error!`);
        }
    }));
});
define("runtime/runtime-run-good.test", ["require", "exports", "ava", "runtime/runtime"], function (require, exports, ava_26, runtime_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava_26.default('runs a command', (t) => __awaiter(this, void 0, void 0, function* () {
        const r = new runtime_9.default();
        r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`);
        const context = yield r.run('3pack three');
        t.deepEqual(context.result, [1, 2, 3]);
    }));
    ava_26.default('runs an aliased command', (t) => __awaiter(this, void 0, void 0, function* () {
        const r = new runtime_9.default();
        r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`);
        const context = yield r.run('3pack o');
        t.is(context.result, 1);
    }));
    ava_26.default('runs a nested command', (t) => __awaiter(this, void 0, void 0, function* () {
        const r = new runtime_9.default();
        r.addPlugin(`${__dirname}/../fixtures/good-plugins/nested`);
        const context = yield r.run('thing foo');
        t.truthy(context.command);
        t.is(context.command.name, 'foo');
        t.deepEqual(context.command.commandPath, ['thing', 'foo']);
        t.is(context.result, 'nested thing foo has run');
    }));
    ava_26.default('runs a command with no name prop', (t) => __awaiter(this, void 0, void 0, function* () {
        const r = new runtime_9.default();
        r.addPlugin(`${__dirname}/../fixtures/good-plugins/missing-name`);
        const context = yield r.run('missing-name foo');
        t.truthy(context.command);
        t.is(context.command.name, 'foo');
    }));
});
define("runtime/runtime-src.test", ["require", "exports", "ava", "runtime/runtime"], function (require, exports, ava_27, runtime_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava_27.default('runs a command explicitly', (t) => __awaiter(this, void 0, void 0, function* () {
        const r = new runtime_10.default();
        t.falsy(r.defaultPlugin);
        r.addDefaultPlugin(`${__dirname}/../fixtures/good-plugins/threepack`);
        t.truthy(r.defaultPlugin);
        const context = yield r.run('3pack three');
        t.truthy(context.plugin);
        t.truthy(context.command);
        t.is(context.plugin.name, '3pack');
        t.is(context.command.name, 'three');
        t.deepEqual(context.result, [1, 2, 3]);
    }));
    ava_27.default('runs a command via passed in args', (t) => __awaiter(this, void 0, void 0, function* () {
        const r = new runtime_10.default();
        t.falsy(r.defaultPlugin);
        r.addDefaultPlugin(`${__dirname}/../fixtures/good-plugins/threepack`);
        t.truthy(r.defaultPlugin);
        const context = yield r.run('3pack three');
        t.truthy(context.plugin);
        t.truthy(context.command);
        t.is(context.plugin.name, '3pack');
        t.is(context.command.name, 'three');
        t.deepEqual(context.result, [1, 2, 3]);
    }));
});
define("utils/async-await-check", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * When we require this file, it'll blow up if we don't support async/await
     */
    function default_3() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => resolve());
        });
    }
    exports.default = default_3;
});
define("utils/command-info.test", ["require", "exports", "ava", "utils/command-info", "domain/run-context", "runtime/runtime", "domain/plugin", "domain/command"], function (require, exports, ava_28, command_info_3, run_context_13, runtime_11, plugin_3, command_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava_28.default('commandInfo', t => {
        const fakeContext = new run_context_13.default();
        fakeContext.runtime = new runtime_11.default();
        const fakeCommand = new command_3.default();
        fakeCommand.name = 'foo';
        fakeCommand.description = 'foo is a command';
        fakeCommand.commandPath = ['foo'];
        fakeCommand.alias = ['f'];
        const fakePlugin = new plugin_3.default();
        fakePlugin.commands = [fakeCommand];
        fakeContext.runtime.plugins = [fakePlugin];
        const info = command_info_3.commandInfo(fakeContext);
        t.deepEqual(info, [['foo (f)', 'foo is a command']]);
    });
});
define("utils/filesystem-utils.test", ["require", "exports", "ava", "utils/filesystem-utils", "ramda"], function (require, exports, ava_29, filesystem_utils_11, ramda_20) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava_29.default('isFile', t => {
        t.true(filesystem_utils_11.isFile(__filename));
        t.false(filesystem_utils_11.isFile(__dirname));
    });
    ava_29.default('isNotFile', t => {
        t.false(filesystem_utils_11.isNotFile(__filename));
        t.true(filesystem_utils_11.isNotFile(__dirname));
    });
    ava_29.default('isDirectory', t => {
        t.true(filesystem_utils_11.isDirectory(__dirname));
        t.false(filesystem_utils_11.isDirectory(__filename));
    });
    ava_29.default('isNotDirectory', t => {
        t.false(filesystem_utils_11.isNotDirectory(__dirname));
        t.true(filesystem_utils_11.isNotDirectory(__filename));
    });
    ava_29.default('subdirectories', t => {
        const dirs = filesystem_utils_11.subdirectories(`${__dirname}/..`);
        t.is(dirs.length, 8);
        t.true(ramda_20.contains(`${__dirname}/../utils`, dirs));
    });
    ava_29.default('blank subdirectories', t => {
        t.deepEqual(filesystem_utils_11.subdirectories(''), []);
        t.deepEqual(filesystem_utils_11.subdirectories(__filename), []);
    });
    ava_29.default('relative subdirectories', t => {
        const dirs = filesystem_utils_11.subdirectories(`${__dirname}/..`, true);
        t.is(dirs.length, 8);
        t.true(ramda_20.contains(`utils`, dirs));
    });
    ava_29.default('filtered subdirectories', t => {
        const dirs = filesystem_utils_11.subdirectories(`${__dirname}/..`, true, 'ut*');
        t.is(1, dirs.length);
        t.true(ramda_20.contains(`utils`, dirs));
    });
});
define("utils/print.test", ["require", "exports", "ava", "sinon"], function (require, exports, ava_30, sinon) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const stripAnsi = require('strip-ansi');
    // couldn't figure out a way to reset the spy on console.log
    // for each run... switched to .serial and incrementing.  sorry.  :(
    let i = 0;
    // hijack the console
    console.log = x => x;
    // then spy on it
    const spyLog = sinon.spy(console, 'log');
    // finally require the print
    const print = require('./print');
    ava_30.default.before(() => { });
    ava_30.default.after.always(() => {
        spyLog.reset();
    });
    ava_30.default.serial('info', t => {
        print.info('hi');
        t.is(spyLog.args[i++][0], print.colors.reset('hi'));
    });
    ava_30.default.serial('warning', t => {
        print.warning('hi');
        t.is(spyLog.args[i++][0], print.colors.yellow('hi'));
    });
    ava_30.default.serial('success', t => {
        print.success('hi');
        t.is(spyLog.args[i++][0], print.colors.green('hi'));
    });
    ava_30.default.serial('error', t => {
        print.error('hi');
        t.is(spyLog.args[i++][0], print.colors.error('hi'));
    });
    ava_30.default.serial('debug with default', t => {
        const topLine = `vvv -----[ DEBUG ]----- vvv`;
        const botLine = `^^^ -----[ DEBUG ]----- ^^^`;
        print.debug('hi');
        t.is(spyLog.args[i++][0], print.colors.rainbow(topLine));
        t.is(spyLog.args[i++][0], 'hi');
        t.is(spyLog.args[i++][0], print.colors.rainbow(botLine));
    });
    ava_30.default.serial('debug with title', t => {
        const title = 'there';
        const topLine = `vvv -----[ ${title} ]----- vvv`;
        const botLine = `^^^ -----[ ${title} ]----- ^^^`;
        print.debug('hi', title);
        t.is(spyLog.args[i++][0], print.colors.rainbow(topLine));
        t.is(spyLog.args[i++][0], 'hi');
        t.is(spyLog.args[i++][0], print.colors.rainbow(botLine));
    });
    ava_30.default.serial('fancy', t => {
        print.fancy('hi');
        t.is(spyLog.args[i++][0], 'hi');
    });
    ava_30.default.serial('divider', t => {
        const line = '---------------------------------------------------------------';
        print.divider();
        t.is(spyLog.args[i++][0], print.colors.line(line));
    });
    ava_30.default.serial('newline', t => {
        print.newline();
        t.is(spyLog.args[i++][0], '');
    });
    ava_30.default.serial('table', t => {
        const data = [['liam', '5'], ['matthew', '2']];
        print.table(data);
        t.is(stripAnsi(spyLog.args[i++][0]), '  liam      5 \n  matthew   2 ');
    });
    ava_30.default.serial('markdown table', t => {
        const data = [['liam', '5'], ['matthew', '2']];
        print.table(data, { format: 'markdown' });
        t.is(stripAnsi(spyLog.args[i++][0]), '| liam    | 5 |\n| ------- | - |\n| matthew | 2 |');
    });
    ava_30.default.serial('spin', t => {
        t.is(typeof print.spin, 'function');
        const spinner = print.spin();
        t.is(typeof spinner.stop, 'function');
    });
    ava_30.default.serial('colors', t => {
        t.is(typeof print.colors.highlight, 'function');
        t.is(typeof print.colors.info, 'function');
        t.is(typeof print.colors.warning, 'function');
        t.is(typeof print.colors.success, 'function');
        t.is(typeof print.colors.error, 'function');
        t.is(typeof print.colors.line, 'function');
        t.is(typeof print.colors.muted, 'function');
    });
});
define("utils/string-utils.test", ["require", "exports", "ava", "utils/string-utils"], function (require, exports, ava_31, stringUtils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const { identity, isBlank, isNotString, camelCase, kebabCase, snakeCase, upperCase, lowerCase, startCase, upperFirst, lowerFirst, pascalCase, pad, padStart, padEnd, trim, trimStart, trimEnd, repeat, pluralize, plural, singular, addPluralRule, addSingularRule, addIrregularRule, addUncountableRule, isPlural, isSingular, } = stringUtils;
    ava_31.default('isBlank', t => {
        t.true(isBlank(1));
        t.true(isBlank(true));
        t.true(isBlank(false));
        t.true(isBlank(null));
        t.true(isBlank(''));
        t.true(isBlank(' '));
        t.true(isBlank({}));
        t.true(isBlank([]));
        t.false(isBlank('s'));
    });
    ava_31.default('isNotString', t => {
        t.false(isNotString(''));
        t.true(isNotString(2));
        t.true(isNotString(null));
        t.true(isNotString(undefined));
        t.true(isNotString([]));
        t.true(isNotString({}));
    });
    ava_31.default('camelCase', t => {
        t.is(camelCase('this here'), 'thisHere');
    });
    ava_31.default('kebabCase', t => {
        t.is(kebabCase('fun times'), 'fun-times');
        t.is(kebabCase('FunTimes'), 'fun-times');
    });
    ava_31.default('snakeCase', t => {
        t.is(snakeCase('a b c'), 'a_b_c');
        t.is(snakeCase('AlwaysBeClosing'), 'always_be_closing');
    });
    ava_31.default('upperCase', t => {
        t.is(upperCase('lol'), 'LOL');
    });
    ava_31.default('lowerCase', t => {
        t.is(lowerCase('ROFL'), 'rofl');
    });
    ava_31.default('startCase', t => {
        t.is(startCase('hello there'), 'Hello There');
    });
    ava_31.default('upperFirst', t => {
        t.is(upperFirst('hello world'), 'Hello world');
    });
    ava_31.default('lowerFirst', t => {
        t.is(lowerFirst('BOOM'), 'bOOM');
    });
    ava_31.default('pascalCase', t => {
        t.is(pascalCase('check it out'), 'CheckItOut');
        t.is(pascalCase('checkIt-out'), 'CheckItOut');
    });
    ava_31.default('pad', t => {
        t.is(pad('a', 3), ' a ');
    });
    ava_31.default('padStart', t => {
        t.is(padStart('a', 3), '  a');
    });
    ava_31.default('padEnd', t => {
        t.is(padEnd('a', 3), 'a  ');
    });
    ava_31.default('trim', t => {
        t.is(trim('   sloppy   '), 'sloppy');
    });
    ava_31.default('trimStart', t => {
        t.is(trimStart('   ! '), '! ');
    });
    ava_31.default('trimEnd', t => {
        t.is(trimEnd('  !  '), '  !');
    });
    ava_31.default('repeat', t => {
        t.is(repeat('a', 4), 'aaaa');
    });
    ava_31.default('identity', t => {
        t.is(identity('x'), 'x');
    });
    ava_31.default('pluralize', t => {
        t.is(pluralize('test', 1, true), '1 test');
        t.is(pluralize('test', 5, true), '5 tests');
    });
    ava_31.default('plural', t => {
        t.is(plural('bug'), 'bugs');
    });
    ava_31.default('singular', t => {
        t.is(singular('bugs'), 'bug');
    });
    ava_31.default('addPluralRule', t => {
        addPluralRule(/gex$/i, 'gexii');
        t.is(plural('regex'), 'regexii');
    });
    ava_31.default('addSingularRule', t => {
        addSingularRule(/bugs$/i, 'bugger');
        t.is(singular('bugs'), 'bugger');
    });
    ava_31.default('addIrregularRule', t => {
        addIrregularRule('octopus', 'octopodes');
        t.is(plural('octopus'), 'octopodes');
    });
    ava_31.default('addUncountableRule', t => {
        addUncountableRule('paper');
        t.is(plural('paper'), 'paper');
    });
    ava_31.default('isPlural', t => {
        t.is(isPlural('bug'), false);
        t.is(isPlural('bugs'), true);
    });
    ava_31.default('isSingular', t => {
        t.is(isSingular('bug'), true);
        t.is(isSingular('bugs'), false);
    });
});
define("utils/throw-when.test", ["require", "exports", "ramda", "ava", "utils/throw-when"], function (require, exports, ramda_21, ava_32, throw_when_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava_32.default('it throws', t => {
        t.throws(() => throw_when_2.throwWhen('lulz', ramda_21.T, 1));
    });
    ava_32.default("it doesn't throws", t => {
        throw_when_2.throwWhen('lulz', ramda_21.F, 1);
        t.pass();
    });
});
//# sourceMappingURL=gluegun.js.map