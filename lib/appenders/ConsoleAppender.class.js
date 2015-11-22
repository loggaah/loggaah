"use strict";

var Configuration = require('../Configuration.class');
var Appenders = require('../Appenders.class');
var Appender = Appenders.interface;

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
Configuration.appenders.add('Console', defaultSettings);