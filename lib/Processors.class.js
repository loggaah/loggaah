"use strict";

var Plugin = require('./Plugin.interface.js');
var ConfigurationElement = require('./ConfigurationElement.class');

class Processor extends Plugin {
    set configuration(configuration) {
        throw new Error("Not implemented!");
    }

    __proceed(message, processors, appender) {
        // TODO move this logic into the logger where all logic is combined
        this.process(message, (message) => {
            if (!processors.length) {
                Configuration.appenders[appender].append(message);
                return;
            }
            var next = processors.shift();
            Configuration.processors[next].__proceed(message, processors, appender);
        });
    }

    /**
     * Continues in the processor chain.
     * @param message       The message to be processed
     * @param done(message) Callback to use when message has been processed
     */
    process(message, done) {
        throw new Error("Not implemented!");
    }
}

class Processors extends ConfigurationElement {
    constructor() {
        super();
        this.__instances = {};
    }

    __update(name, configuration) {
        if (!this.__instances[name]) {
            this.__instances[name] = this.__registry.get(configuration.type);
        }
        this.__instances[name].configuration = configuration;
    }
}

module.exports = new Processors();
module.exports.interface = Processor;