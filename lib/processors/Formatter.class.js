"use strict";

var Configuration = require('../Configuration.class');
var Processors = require('../Processors.class');

var defaultSettings = {
    type: 'formatter'
};

class Formatter extends Processors.interface {
    get type() {
        return defaultSettings.type;
    }

    set configuration(configuration) {

    }

    process(message) {

    }
}

module.exports = Formatter;
Configuration.processors.registry.add(module.exports);
Configuration.processors.add('DefaultFormatter', defaultSettings);