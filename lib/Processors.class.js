"use strict";

var Plugin = require('./Plugin.interface.js');
var ConfigurationElement = require('./ConfigurationElement.class');

/**
 * Parent class for all appender implementation. If you want your appender to work with this logging system, you have
 * to implement the process method and call done() at completion.
 * @abstract
 * @implements Plugin
 */
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
     * @param {Event} event         The event to be processed
     * @param {chainFunction} done  Callback to use when event has been processed
     */
    process(event, done) {
        throw new Error("Not implemented!");
    }
    /**
     * Signals processing is done and next processor/appender can continue.
     * @callback chainFunction
     * @private
     * @param {Event} event The processed event
     */

    /**
     * Overrides {@link Plugin#destroy} as children will likely not have to do any clean up.
     * @override
     */
    destroy() {}
}

/**
 * Class managing configuration and instances of Processors.
 * @extends ConfigurationElement
 */
class Processors extends ConfigurationElement {
    constructor() {
        super();
        this.__instances = {};
    }

    /**
     *
     * @param {String} name
     * @param {Object|Configuration} configuration
     * @private
     */
    __update(name, configuration) {
        if (!this.__instances[name]) {
            this.__instances[name] = this.__registry.get(configuration.type);
            this.__instances[name].name = name;
        }
        this.__instances[name].configuration = configuration;
    }

    /**
     *
     * @param {*} value
     * @returns {Processor}
     * @private
     */
    __parse(value) {
        if (value instanceof Processor) {
            return value;
        }
        return this.__instances[value];
    }
}

module.exports = new Processors();
module.exports.interface = Processor;