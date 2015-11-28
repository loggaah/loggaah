"use strict";

var Logger = require('./Logger.class');

class Loggers {
    constructor() {
        this.__rules = {};
        this.__instances = {};
    }

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

    __get(name) {
        return this.__instances[name];
    }

    __configure(nameOrRegex, configuration) {
        // TODO
    }

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