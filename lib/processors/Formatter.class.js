"use strict";

var loggaah = require('../../');
var Configuration = loggaah.configuration;
var Processor = loggaah.Processors.interface;

var defaultSettings = {
    type: 'formatter'
};

/**
 * Processes the message of an {@link Event} by applying a given format to it.
 * @extends Processor
 */
class Formatter extends Processor {
    /**
     *
     */
    get type() {
        return defaultSettings.type;
    }

    /**
     * @inheritDoc
     */
    set configuration(configuration) {
        this.pattern = configuration.pattern;
    }

    /**
     * @inheritDoc
     */
    process(event, done) {
        event.message = this.pattern.replace('%m', event.message);
        // TODO: add more patterns (and make them easily extensible)
        done(event);
    }
}

module.exports = Formatter;
Configuration.processors.registry.add(module.exports);
Configuration.processors.add('default', defaultSettings);