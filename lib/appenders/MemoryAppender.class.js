"use strict";

var loggaah = require('../../');
var Configuration = loggaah.configuration;
var Appender = loggaah.Appenders.interface;

var defaultSettings = {
    type: 'memory',
    bufferSize: 100
};

class MemoryAppender extends Appender {
    constructor() {
        super();
        this.buffer = [];
        this.bufferSize = defaultSettings.bufferSize;
    }

    get type() {
        return defaultSettings.type;
    }

    set configuration(pluginConfig) {
        super.configuration = pluginConfig;
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

    /**
     * Removes a message from the buffer of this appender.
     * @returns {Event}
     */
    get message() {
        return this.buffer.shift();
    }

    /**
     * Removes all messages from the buffer of this appender.
     * @returns {Event[]}
     */
    get messages() {
        var messages = this.buffer;
        this.clear();
        return messages;
    }

    /**
     * Clears the current message buffer.
     */
    clear() {
        this.buffer = [];
    }
}

module.exports = MemoryAppender;
Configuration.appenders.registry.add(module.exports);