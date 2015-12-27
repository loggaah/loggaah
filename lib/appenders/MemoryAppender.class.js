"use strict";

var loggaah = require('../../');
var Configuration = loggaah.configuration;
var Appender = loggaah.Appenders.interface;

var defaultSettings = {
    type: 'memory',
    bufferSize: 100
};

/**
 * This appenders stores all {@link Event}s in memory up to a certain number. This appender is best used for debugging
 * or if the application wants to consume it's own logging messages. Careful to not build any endless loops with that
 * though.
 * @extends Appender
 */
class MemoryAppender extends Appender {
    /**
     *
     */
    constructor() {
        super();
        this.buffer = [];
        this.bufferSize = defaultSettings.bufferSize;
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
    set configuration(pluginConfig) {
        super.configuration = pluginConfig;
        var config = {};
        Object.assign(config, defaultSettings, pluginConfig);
        if (config.bufferSize) {
            this.bufferSize = config.bufferSize;
        }
        super.configuration = config;
    }

    /**
     * @inheritDoc
     */
    append(events) {
        for (let event of events) {
            this.buffer.push(event);
            if (this.buffer.length > this.bufferSize) {
                this.buffer.shift();
            }
        }
    }

    /**
     * Removes a message from the buffer of this appender.
     * @returns {Event}
     */
    get event() {
        return this.buffer.shift();
    }

    /**
     * Removes all events from the buffer of this appender.
     * @returns {Event[]}
     */
    get events() {
        var events = this.buffer;
        this.clear();
        return events;
    }

    /**
     * Clears the current message buffer.
     */
    clear() {
        this.buffer = [];
    }
}

module.exports = MemoryAppender;
Configuration.appenders.registry.add(module.exports);