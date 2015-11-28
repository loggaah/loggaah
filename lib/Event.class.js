"use strict";

module.exports = class Event {
    constructor(level, message, mdc, error) {
        this._time = Date.now();
        this._level = level;
        this._message = message;
        this._mdc = mdc;
        this._error = error;
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
};