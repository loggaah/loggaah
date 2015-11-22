"use strict";

var Configuration = require('../Configuration.class');
var Appenders = require('../Appenders.class');
var Appender = Appenders.interface;

var defaultSettings = {
    type: 'memory',
    bufferSize: 100
};

class MemoryAppender extends Appender {
    constructor() {
        this.buffer = [];
        this.bufferSize = defaultSettings.bufferSize;
        super();
    }

    get type() {
        return defaultSettings.type;
    }

    set configuration(configuration) {
        var config = {};
        Object.assign(config, defaultSettings, pluginConfig);
        if (config.bufferSize) {
            this.bufferSize = config.bufferSize;
        }
        super.configuration = config;
    }

    append(message) {
        this.buffer.push(message);
        if (this.buffer.length > this.bufferSize) {
            this.buffer.shift();
        }
    }

    get message() {
        return this.buffer.shift();
    }

    get messages() {
        var messages = this.buffer;
        this.clear();
        return messages;
    }

    clear() {
        this.buffer = [];
    }
}

module.exports = MemoryAppender;
Configuration.appenders.registry.add(module.exports);