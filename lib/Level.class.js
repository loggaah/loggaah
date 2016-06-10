'use strict';

var _ = require('lodash');

/**
 * A simulated enum for the logging levels (as far as you can emulate such a thing in javascript)
 */
class Level {
    /**
     *
     * @param {number} severity
     */
    constructor(severity) {
        this._severity = severity;
        this._default = 3;
    }

    get default() {
        return this.parse(this._default);
    }

    /**
     *
     * @returns {number}
     */
    valueOf() {
        return this._severity;
    }

    /**
     *
     * @param {Level|string|number} obj
     * @returns {Level}
     */
    parse(obj) {
        if (obj instanceof Level) {
            return obj;
        }
        if (obj == parseInt(obj)) {
            return Level.instances[obj];
        }
        if (!this[obj]) {
            throw new Error("Can't find level " + obj);
        }
        return this[obj];
    }

    /**
     *
     * @param {string[]} levels
     */
    static configure(levels) {
        Level.instances = [];
        var stringMapping = {};
        for (let i in levels) {
            Level.instances.push(new Level(i));
        }
        Level.instances[0].configuration = {};

        for (let level of Level.instances) {
            for (let i in levels) {
                for (let word of _.words(levels[i])) {
                    level.__defineGetter__(word, () => {
                        return Level.instances[i];
                    });
                    level.__defineGetter__(word.toUpperCase(), () => {
                        return Level.instances[i];
                    });
                    if (!stringMapping[i]) {
                        stringMapping[i] = word;
                    }
                    if (level != 0 && level != levels[levels.length - 1]) {
                        Level.instances[0].configuration[word] = i;
                        Level.instances[0].configuration[word.toUpperCase()] = i;
                    }
                }
            }
        }
        for (let k in stringMapping) {
            Level.instances[k].toString = () => stringMapping[k].toUpperCase();
        }
    }
}

Level.configure(['all','trace', 'debug', 'info','warn/warning','error/err', 'off']);
module.exports = Level.instances[0];
