'use strict';

var util = require('util');
var crypto = require('crypto');

var _ = require('lodash');
var moment = require('moment');

var Level = require('./Level.class');
var MDC = require('./MDC.class');


var dict = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
/**
 * Generates a mostly unique id. This method is not used for anything security related but only to identify events.
 * @returns {string}
 */
function makeHash() {
    var hash = '#';
    for (var i = 0; i < 8; i++) {
        hash += dict.charAt(crypto.randomBytes(4) % dict.length);
    }
    return hash;
}

/**
 * Data transfer object that holds information about a logging event. The class doesn't actually do anything else than
 * store the given values.
 */
class Event {
    /**
     * Creates the event and stores the data in this instance.
     * @param {string} source
     * @param {Level} [level]
     * @param {string} [pattern]
     * @param {MDC} [mdc]
     * @param {Error} [error]
     * @param {Object[]} [params]
     */
    constructor(source, level, pattern, mdc, error, params) {
        this.processId = process.pid;
        this.source = source;
        this._pattern = pattern;
        this._time = moment();
        this._level = level;
        this._mdc = mdc;
        this._error = error;
        this._rawParams = params;
    }

    /**
     * Returns a unique id that can be used to identify a log message later.
     */
    getId() {
        if (!this._id) {
            this._id = makeHash();
        }
        return this._id;
    }

    /**
     * Set the pattern to be used to replace parameters into to create the message of this event.
     * @param {string} pattern
     * @returns {Event}
     */
    pattern(pattern) {
        this._pattern = pattern;
        delete this._message;
        return this;
    }

    /**
     * Get the pattern that is currently used to create the message of this event.
     * @returns {string}
     */
    getPattern() {
        return this._pattern;
    }

    /**
     * Update the time at which this event was generated. If no time is set, the current time is used by default.
     * @param {string|Date|number} [time]   Any value that can be parsed by the moment library
     * @returns {Event}
     */
    time(time) {
        this._time = moment(time);
        return this;
    }

    /**
     * Returns the time at which this event was first created.
     * @returns {*}
     */
    getTime() {
        return this._time;
    }

    /**
     * Sets the parameters for this event, replacing any previously set parameters.
     * @param {...Object} param Repeatable number of objects.
     * @returns {Event}
     */
    params(param) {
        this._rawParams = [...arguments];
        return this;
    }

    /**
     * Add a parameter to the existing list of paramters.
     * @param param
     */
    param(param) {
        if (!_.isArray(this._rawParams)) {
            this._rawParams = [];
        }
        this._rawParams.push(param);
        delete this._message;
        return this;
    }

    /**
     * Returns an array of parameters passed along with the message. If any of the parameters are functions that
     * will return a calculated value, they will be executed and memoized when fetched from here.
     * @returns {Array}
     */
    getParams() {
        if (!this._params) {
            this._params = [];
            if (_.isArray(this._rawParams)) {
                for (let i = 0; i < this._rawParams.length; i++) {
                    if (_.isFunction(this._rawParams[i])) {
                        this._params[i] = this._rawParams[i]();
                    } else {
                        this._params[i] = this._rawParams[i]
                    }
                }
            }
        }
        return this._params;
    }

    /**
     * Sets the level this event.
     * @param level
     * @returns {Event}
     */
    level(level) {
        this._level = Level.parse(level);
        return this;
    }

    /**
     * Returns the Level of this event.
     * @returns {Level}
     */
    getLevel() {
        return this._level;
    }

    /**
     * Set the metadata for this event. If there was metadata set before, it is merged with the new metadata.
     * @param mdc
     * @returns {Event}
     */
    mdc(mdc) {
        if (this._mdc) {
            this.mdc.merge(mdc);
        } else {
            if (mdc instanceof MDC) {
                this._mdc = mdc;
            } else {
                this._mdc = new MDC(mdc);
            }
        }
        return this;
    }

    /**
     * @see {@link mdc}
     * @param metadata
     * @returns {Event}
     */
    metadata(metadata) {
        return this.mdc(metadata);
    }

    /**
     * Returns the metadata of this event
     * @returns {MDC}
     */
    getMetadata() {
        if (!this._mdc) {
            this._mdc = new MDC();
        }
        return this._mdc;
    }

    /**
     * Set the error/exception that was thrown.
     * @param ex
     * @returns {Event}
     */
    exception(ex) {
        this._error = ex;
        return this;
    }

    /**
     * @see {@link exception}
     * @param err
     * @returns {Event}
     */
    error(err) {
        return this.exception(err);
    }

    /**
     * Returns the {@link Error} object that is associated with this event.
     * @returns {Error}
     */
    getError() {
        return this._error;
    }

    /**
     * Returns the formatted message based on the supplied pattern and parameters.
     * The processed data is memoized, so that subsequent calls will not recalculate the message.
     * This calls the params getter so that any params that are function are being executed.
     * @returns {string}
     */
    get message() {
        if (this._message) {
            return this._message;
        }
        this._message = this._pattern ? util.format(this._pattern, ...this.getParams()) : util.format(...this.getParams());
        return this._message;
    }

    /**
     * Sets the compiled message to a specific value. Note that this will be reset if the parameters of this event are
     * changed.
     * @param {string} message
     */
    set message(message) {
        this._message = message;
    }
}

module.exports = Event;