"use strict";

var loggaah = require('../../');
var Configuration = loggaah.configuration;
var Processor = loggaah.Processors.interface;

var defaultSettings = {
    type: 'formatter'
};

class Formatter extends Processor {
    get type() {
        return defaultSettings.type;
    }

    set configuration(configuration) {
        this.pattern = configuration.pattern;
    }

    process(event, done) {
        event.message = this.pattern.replace('%m', event.message);
        // TODO: add more patterns (and make them easily extensible)
        done(event);
    }
}

module.exports = Formatter;
Configuration.processors.registry.add(module.exports);
Configuration.processors.add('default', defaultSettings);