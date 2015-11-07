"use strict";

class Level {
    constructor(severity) {
        this._severity = severity;
    }

    valueOf() {
        return this._severity;
    }

    toString() {
        switch (this._severity) {
            case 1:
                return "TRACE";
            case 2:
                return "DEBUG";
            case 3:
                return "INFO";
            case 4:
                return "WARN";
            case 5:
                return "ERROR";
            default:
                return "UNKNOWN";
        }
    }

    parse(obj) {
        if (obj instanceof Level) {
            return obj;
        }
        if (obj === parseInt(obj)) {
            return levels[obj];
        }
        return this[obj];
    }

    get OFF() {
        return this.off;
    }

    get off() {
        return levels[6];
    }

    get ERR() {
        return this.error;
    }

    get ERROR() {
        return this.error;
    }

    get err() {
        return this.error;
    }

    get error() {
        return levels[5];
    }

    get WARNING() {
        return this.warn;
    }

    get WARN() {
        return this.warn;
    }

    get warning() {
        return this.warn;
    }

    get warn() {
        return levels[4];
    }

    get INFO() {
        return this.info;
    }

    get info() {
        return levels[3];
    }

    get DEBUG() {
        return this.debug;
    }

    get debug() {
        return levels[2];
    }

    get TRACE() {
        return this.trace;
    }

    get trace() {
        return levels[1];
    }

    get ALL() {
        return this.all;
    }

    get all() {
        return levels[0];
    }

}

var levels = [];
for (let i of [0,1,2,3,4,5,6]) {
    levels[i] = new Level(i);
}

module.exports = new Level();