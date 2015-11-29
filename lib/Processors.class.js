"use strict";

var Plugin = require('./Plugin.interface.js');
var ConfigurationElement = require('./ConfigurationElement.class');

class Processor extends Plugin {
    __proceed(event, processors, appender) {
        // TODO move this logic into the logger where all logic is combined
        this.process(event, (event) => {
            if (!processors.length) {
                require('./Configuration.class').appenders.__instances[appender].append(event.message);
                return;
            }
            var next = processors.shift();
            require('./Configuration.class').processors.__instances[next].__proceed(event, processors, appender);
        });
    }

    /**
     * Continues in the processor chain.
     * @param event       The event to be processed
     * @param done(event) Callback to use when event has been processed
     */
    process(event, done) {
        throw new Error("Not implemented!");
    }

    destroy() {}
}

class Processors extends ConfigurationElement {
    constructor() {
        super();
        this.__instances = {};
    }

    __update(name, configuration) {
        if (!this.__instances[name]) {
            this.__instances[name] = this.__registry.get(configuration.type);
            this.__instances[name].name = name;
        }
        this.__instances[name].configuration = configuration;
    }

    __parse(value) {
        if (value instanceof Processor) {
            return value;
        }
        return this.__instances[value];
    }
}

module.exports = new Processors();
module.exports.interface = Processor;