"use strict";

var Level = require("./Level.class");

var defaultConfig = {
    level: Level.INFO
};

module.exports = class Logger {
    constructor(name) {
        this._config = {};
        this._name = name;
        this.config = defaultConfig;
    }

    set config(config) {
        Object.assign(this._config, config);
        this.level = config.level;
    }

    set level(level) {
        this._level = Level.parse(level);
    }

    get level() {
        return this._level;
    }

    enabled(level) {
        return Level.parse(level) >= this._level;
    }

    get name() {
        return this._name;
    }
};