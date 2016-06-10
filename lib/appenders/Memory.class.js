'use strict';

var Plugins = require('../Plugins.class');

/**
 * This appenders stores all {@link Event}s in memory up to a certain number. This appender is best used for debugging
 * or if the application wants to consume it's own logging messages. Careful to not build any endless loops with that
 * though.
 * @extends Appender
 */
class Memory extends Plugins.interfaces.Appender {
    /**
     * Construct the MemoryAppender.
     */
    constructor() {
        super();
        this.buffer = [];
    }

    /**
     * @inheritDoc
     */
    set configuration(config) {
        this.bufferSize = config.bufferSize || 100;
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

Plugins.register(Memory);
module.exports = Memory;
