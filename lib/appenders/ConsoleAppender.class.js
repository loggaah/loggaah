"use strict";

var loggaah = require('../../');
var Configuration = loggaah.configuration;
var Appender = loggaah.Appenders.interface;

var defaultSettings = {
    type: 'console'
};

class ConsoleAppender extends Appender {
    constructor() {
        super();
    }

    get type() {
        return defaultSettings.type;
    }

    set configuration(configuration) {
        super.configuration = configuration;
    }

    append(message) {
        console.log(message);
    }
}

module.exports = ConsoleAppender;
Configuration.appenders.registry.add(module.exports);
Configuration.appenders.add('default', defaultSettings);