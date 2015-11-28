"use strict";

var util = require('util');

var _ = require('lodash');

var Level = require('./Level.class');
var Event = require('./Event.class');
var MDC = require('./MDC.class');
var Appenders = require('./Appenders.class');
var Processors = require('./Processors.class');
var Loggers = require('./Logger.class');

var defaultConfig = {
    level: Level.INFO,
    capture: false
};

module.exports = class Logger {
    constructor(name) {
        this._config = {};
        this._name = name;
        this._process = process.pid;
        this._buffer = [];
        this._appenders = new Set();
        this.config = defaultConfig;
        for (let value in Level.configuration) {
            ((level) => {
                this[value] = function() {
                    this.log(level, ...arguments);
                }
            })(Level.parse(Level.configuration[value]))
        }
    }

    addAppender(name) {
        this._appenders.add(require('./Appenders.class').__instances[name]);
    }

    removeAppender(name) {
        for (let appender of this._appenders) {
            if (appender.name == name) {
                this._appenders.delete(appender);
                return;
            }
        }
    }

    hasAppender(name) {
        for (let appender of this._appenders) {
            if (appender.name == name) {
                return appender;
            }
        }
        return false;
    }

    get appenders() {
        return [...this._appenders];
    }

    set config(config) {
        Object.assign(this._config, config);
        this.level = config.level;
        this._capture = config.capture;
    }

    set level(level) {
        if (level) {
            this._level = Level.parse(level);
        }
    }

    get level() {
        return this._level;
    }

    get process() {
        return this._process;
    }

    set capture(capture) {
        this._capture = capture;
    }

    get capture() {
        return this._capture;
    }

    /**
     * If captured has been enabled then this will clear all captured messages and return them.
     * @deprecated("Implemented with MemoryAppender")
     * @returns {Array.<Message>}
     */
    get captured() {
        return this._buffer.splice(0, this._buffer.length);
    }

    enabled(level) {
        return Level.parse(level) >= this._level;
    }

    get name() {
        return this._name;
    }

    log() {
        var level, pattern, error, mdc, params = [];
        for (let arg of arguments) {
            if (arg instanceof Level.constructor) {
                level = arg;
                if (!this.enabled(level)) {
                    return;
                }
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

        var message = pattern ? util.format(pattern, ...params) : util.format(...params);
        var event = new Event(level, message, mdc, error);
        if (this._capture) {
            this._buffer.push(event);
        } else {
            for (let appender of this._appenders) {
                appender.process(event);
            }
        }
    }
};