"use strict";

var _ = require('lodash');

class Appender {

}

class Appenders {
    constructor() {
        this._known = new Map();
    }

    add(appender) {
        appender = this.parse(appender);
        this._known.set(typeof appender, appender);
    }

    parse(value) {
        if (value instanceof Appender) {
            return value;
        }
        if (_.isString(value)) {

        }
    }
}

module.exports = new Appenders();
module.exports.interface = Appender;

require('./appenders/ConsoleAppender.class');