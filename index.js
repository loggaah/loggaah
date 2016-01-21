'use strict';

var _ = require('lodash');

var Core = require('./lib/Core.class');
var Level = require('./lib/Level.class');
var MDC = require('./lib/MDC.class');
var Plugins = require('./lib/Plugins.class');

/**
 * Entry point for external systems that want to use this library.
 */
class Main {
    constructor() {
        this.Level = Level;
        this.MDC = MDC;
        this.Plugins = Plugins;
    }
}

module.exports = new Main();

// Plugins
require('./lib/configurators/DefaultConfigurator.class');
require('./lib/configurators/JsonConfigurator.class');
require('./lib/appenders/ConsoleAppender.class');
require('./lib/appenders/FileAppender.class');
require('./lib/appenders/MemoryAppender.class');
require('./lib/processors/Formatter.class');
require('./lib/processors/Batcher.class');
