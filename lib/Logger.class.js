"use strict";

var _ = require('lodash');

var Level = require('./Level.class');
var Message = require('./Message.class');

var defaultConfig = {
    level: Level.INFO,
    capture: false
};

module.exports = class Logger {
    constructor(name) {
        this._config = {};
        this._name = name;
        this._buffer = [];
        this.config = defaultConfig;
    }

    set config(config) {
        Object.assign(this._config, config);
        this.level = config.level;
        this.capture = config.capture;
    }

    set level(level) {
        this._level = Level.parse(level);
    }

    get level() {
        return this._level;
    }

    set capture(capture) {
        this._capture = capture;
    }

    get capture() {
        return this._capture;
    }

    /**
     * If captured has been enabled then this will clear all captured messages and return them.
     *
     * @returns {Array.<Message>}
     */
    get captured() {
        var messages = this._buffer.splice(0, this._buffer.length);
        return messages;
    }

    enabled(level) {
        return Level.parse(level) >= this._level;
    }

    get name() {
        return this._name;
    }

    ERROR() {
        this.log(Level.error, arguments);
    }

    ERR() {
        this.log(Level.error, arguments);
    }

    error() {
        this.log(Level.error, arguments);
    }

    err() {
        this.log(Level.error, arguments);
    }

    WARN() {
        this.log(Level.warn, arguments);
    }

    WARNING() {
        this.log(Level.warn, arguments);
    }

    warn() {
        this.log(Level.warn, arguments);
    }

    warning() {
        this.log(Level.warn, arguments);
    }

    INFO() {
        this.log(Level.info, arguments);
    }

    info() {
        this.log(Level.info, arguments);
    }

    DEBUG() {
        this.log(Level.debug, arguments);
    }

    debug() {
        this.log(Level.debug, arguments);
    }

    TRACE() {
        this.log(Level.trace, arguments);
    }

    trace() {
        this.log(Level.trace, arguments);
    }

    log() {
        var level, pattern, error, mdc, params = [];
        for (let arg of arguments) {
            if (arg instanceof Level) {
                level = arg;
            }
            else if (arg instanceof Error) {
                error = arg;
            }
            else if (arg instanceof MDC) {
                mdc = arg;
            }
            else if (_.isString(arg) && !pattern) {
                pattern = arg;
            }
            else {
                params.push(arg);
            }
        }
    }
};