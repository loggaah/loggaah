"use strict";

var loggaah = require('../../');
var Configuration = loggaah.configuration;
var Processor = loggaah.Processors.interface;

/**
 * A processor that will wait a certain time or number of {@link Event}s before sending them in bulk to the next
 * {@link Processor} or {@link Appender}.
 * @extends Processor
 */
class Batcher extends Processor {
    /**
     *
     */
    get type() {
        return 'batcher';
    }

    /**
     * @inheritDoc
     */
    set configuration(configuration) {

    }

    /**
     * @inheritDoc
     */
    process(event, done) {
        done(event);
    }
}

module.exports = Batcher;
Configuration.processors.registry.add(module.exports);