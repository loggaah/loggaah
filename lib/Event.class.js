"use strict";

var moment = require('moment');

/**
 * Data transfer object that holds information about a logging event. The class doesn't actually do anything else than
 * store the given values.
 */
class Event {
    /**
     *
     * @param {string} source
     * @param {Level} level
     * @param {string} message
     * @param {MDC} [mdc]
     * @param {Error} [error]
     * @param {Object[]} params
     */
    constructor(source, level, message, mdc, error, params) {
        this.processId = process.pid;
        this.source = source;
        this.time = moment();
        this.level = level;
        this.message = message;
        this.mdc = mdc;
        this.error = error;
        this.params = params;
    }
}

module.exports = Event;