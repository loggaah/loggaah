"use strict";

var _ = require('lodash');

class Level {
    constructor(severity) {
        this._severity = severity;
    }

    valueOf() {
        return this._severity;
    }

    parse(obj) {
        if (obj instanceof Level) {
            return obj;
        }
        if (obj === parseInt(obj)) {
            return Level.instances[obj];
        }
        return this[obj];
    }


    static configure(levels) {
        Level.instances = [];
        var stringMapping = {};
        for (let i in levels) {
            Level.instances.push(new Level(i));
        }

        for (let level of Level.instances) {
            for (let i in levels) {
                let firstWord;
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
                }
            }
        }
        for (let k in stringMapping) {
            Level.instances[k].toString  = () => {
                return stringMapping[k].toUpperCase();
            }
        }
    }
}

Level.configure(['all','trace', 'debug', 'info','warn/warning','error/err', 'off']);

module.exports = Level.instances[0];