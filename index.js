'use strict';

var Core = require('./lib/Core.class');
var Level = require('./lib/Level.class');
var MDC = require('./lib/MDC.class');
var Plugins = require('./lib/Plugins.class');
var Logger = require('./lib/Logger.class');

/**
 * Entry point for external systems that want to use this library.
 */
class Main extends Logger {
    constructor() {
        super('root');
        this.Level = Level;
        this.MDC = MDC;
        this.Plugins = Plugins;
    }


}

module.exports = new Main();

// Plugins
require('./lib/configurators/Default.class.js');
require('./lib/configurators/Json.class.js');
require('./lib/appenders/Console.class.js');
require('./lib/appenders/File.class.js');
require('./lib/appenders/Memory.class.js');
require('./lib/processors/Formatter.class');
require('./lib/processors/Batcher.class');
