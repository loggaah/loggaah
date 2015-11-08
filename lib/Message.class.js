"use strict";

module.exports = class Message {
    constructor(level, message, mdc, error) {
        this._time = Date.now();
        this._level = level;
        this._message = message;
        this._mdc = mdc;
        this._error = error;
        this._entry = process.mainModule;
        this._process = process.pid;
    }

    /**
     * The level of this message.
     * @returns {Level}
     */
    get level() {
        return this._level;
    }

    /**
     * The rendered message.
     * @returns {string}
     */
    get message() {
        return this._message;
    }

    /**
     * The mete data container with contextual information (if any).
     * @returns {object|unknown}
     */
    get mdc() {
        return this._mdc;
    }

    /**
     * Returns the error passed in with the message (if any)
     * @returns {Error|unknown}
     */
    get error() {
        return this._error;
    }

    /**
     * Returns the time this message was generated.
     * @returns {number|*}
     */
    get time() {
        return this._time;
    }

    /**
     * Returns the entry point of this script / process.
     * @returns {string|*}
     */
    get entry() {
        return this._entry;
    }

    /**
     * Returns the process id in which this messages has been generated.
     * @returns {boolean|Number|*}
     */
    get process() {
        return this._process;
    }
};