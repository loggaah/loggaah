"use strict";

var loggaah = require('../../');
var Configuration = loggaah.configuration;
var Appender = loggaah.Appenders.interface;

class FileAppender extends Appender {
    constructor() {
        super();
    }

    get type() {
        return 'console';
    }

    set configuration(configuration) {
        super.configuration = configuration;
    }

    append(message) {

    }
}

module.exports = FileAppender;
Configuration.appenders.registry.add(module.exports);