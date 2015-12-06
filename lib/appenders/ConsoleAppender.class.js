"use strict";

var loggaah = require('../../');
var Configuration = loggaah.configuration;
var Appender = loggaah.Appenders.interface;

var defaultSettings = {
    type: 'console'
};

/**
 * The default appender if nothing else is specified. Sends the events to the console output.
 * @extends Appender
 */
class ConsoleAppender extends Appender {
    /**
     *
     */
    constructor() {
        super();
    }

    /**
     * @inheritDoc
     */
    get type() {
        return defaultSettings.type;
    }

    /**
     * @inheritDoc
     */
    set configuration(configuration) {
        super.configuration = configuration;
    }

    /**
     * @inheritDoc
     */
    append(message) {
        console.log(message);
    }
}

module.exports = ConsoleAppender;
Configuration.appenders.registry.add(module.exports);
Configuration.appenders.add('default', defaultSettings);