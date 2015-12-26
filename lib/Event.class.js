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
     */
    constructor(source, level, message, mdc, error) {
        this._processId = process.pid;
        this._source = source;
        this._time = moment();
        this._level = level;
        this._message = message;
        this._mdc = mdc;
        this._error = error;
    }

    /**
     * Returns the id of the process in which this message was generated.
     * @returns {number}
     */
    get processId() {
        return this._processId;
    }

    /**
     * Sets the id of the process in which this message was generated.
     * @param {number} processId
     */
    set processId(processId) {
        this._processId = processId;
    }

    /**
     * Returns the name of the logger from which this event originated.
     * @returns {string}
     */
    get source() {
        return this._source;
    }

    /**
     * Sets the name of the logger from which this event originated.
     * @param {string} source
     */
    set source(source) {
        this._source = source;
    }

    /**
     * The level of this message.
     * @returns {Level}
     */
    get level() {
        return this._level;
    }

    /**
     * Used by processors to overwrite the level.
     * @param {Level} level
     */
    set level(level) {
        this._level = level;
    }

    /**
     * The rendered message.
     * @returns {string}
     */
    get message() {
        return this._message;
    }

    /**
     * Used by processors to overwrite the message.
     * @param {string} message
     */
    set message(message) {
        this._message = message;
    }

    /**
     * The mete data container with contextual information (if any).
     * @returns {MDC}
     */
    get mdc() {
        return this._mdc;
    }

    /**
     * Used by processors to replace the existing MDC.
     * @param {MDC} mdc
     */
    set mdc(mdc) {
        this._mdc = mdc;
    }

    /**
     * Returns the error passed in with the message (if any)
     * @returns {Error}
     */
    get error() {
        return this._error;
    }

    /**
     * Used by processors to overwrite the error that was thrown.
     * @param {Error} error
     */
    set error(error) {
        this._error = error;
    }

    /**
     * Returns the time this message was generated.
     * @returns {number}
     */
    get time() {
        return this._time;
    }

    /**
     *
     * @param {number} time
     */
    set time(time) {
        this._time = time;
    }
}

module.exports = Event;