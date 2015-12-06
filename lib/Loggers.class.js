"use strict";

var Logger = require('./Logger.class');

/**
 * Class managing configuration and instances of Loggers.
 */
class Loggers {
    constructor() {
        this.__rules = {};
        this.__instances = {};
    }

    /**
     *
     * @param {String} name
     * @param {Object|Configuration} configuration
     * @returns {Logger}
     * @private
     */
    __create(name, configuration) {
        if (!this.__instances[name]) {
            this.__instances[name] = new Logger(name);
        }
        // TODO Check for patterns in rules that match this logger and apply level and appenders
        if (configuration) {
            this.__instances[name].config = configuration;
        }
        return this.__instances[name];
    }

    /**
     *
     * @param {String} name
     * @returns {Logger}
     * @private
     */
    __get(name) {
        return this.__instances[name];
    }

    /**
     *
     * @param {String|RegExp} nameOrRegex
     * @param {Object|Configuration} configuration
     * @private
     */
    __configure(nameOrRegex, configuration) {
        // TODO
    }

    /**
     *
     * @param {String} name
     * @private
     */
    __updateAppender(name) {
        for (let instance in this.__instances) {
            if (this.__instances[instance].hasAppender(name)) {
                this.__instances[instance].removeAppender(name);
                this.__instances[instance].addAppender(name);
            }

        }
    }
}

module.exports = new Loggers();