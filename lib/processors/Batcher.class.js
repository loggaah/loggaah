"use strict";

var loggaah = require('../../');
var Configuration = loggaah.configuration;
var Processor = loggaah.Processors.interface;

var defaultSettings = {
    type: 'batcher',
    size: 100
};

/**
 * A processor that will wait a certain time or number of {@link Event}s before sending them in bulk to the next
 * {@link Processor} or {@link Appender}.
 * @extends Processor
 */
class Batcher extends Processor {
    constructor() {
        super();
        this._buffer = [];
        this._size = defaultSettings.size;
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
        if (configuration.size) {
            this._size = configuration.size;
        }
        if (configuration.interval) {
            this._interval = configuration.interval;
        }
    }

    /**
     * @inheritDoc
     */
    process(events, done) {
        for (let event of events) {
            this._buffer.push(event);
            if (this._buffer.length >= this._size) {
                if (this._timeout) {
                    clearTimeout(this._timeout);
                    delete this._timeout;
                }
                done(this._buffer);
                this._buffer = [];
            }
        }
        if (this._interval && !this._timeout) {
            this._timeout = setTimeout(() => {
                done(this._buffer);
                this._buffer = [];
            }, this._interval);
        }
    }
}

module.exports = Batcher;
Configuration.processors.registry.add(module.exports);