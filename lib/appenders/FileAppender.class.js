"use strict";

var Configuration = require('../Configuration.class');
var Appenders = require('../Appenders.class');
var Appender = Appenders.interface;

class FileAppender extends Appender {
    constructor() {
        super();
    }

    get type() {
        return 'console';
    }

    set configuration(configuration) {

    }

    append(message) {

    }
}

module.exports = FileAppender;
Configuration.appenders.registry.add(module.exports);