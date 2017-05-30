const _ = require('lodash');

const Plugins = require('../Plugins.class');


/**
 * A processor that will add constant values to all the events passed on.
 * @extends Processor
 */
class Constants extends Plugins.interfaces.Processor {
    constructor() {
        super();
    }

    /**
     * @inheritDoc
     */
    set configuration(configuration) {
        if (configuration.mdc && !_.isObject(configuration.mdc)) {
            throw new Error('Constants have been misconfigured: "mdc" needs to be an object');
        }
        if (configuration.mdc && !_.isArray(configuration.mdc)) {
            throw new Error('Constants have been misconfigured: "params" needs to be an array');
        }
        this.mdc = configuration.mdc;
        this.params = configuration.params;
    }

    /**
     * @inheritDoc
     */
    process(events, done) {
        for(let event of events) {
            if (this.mdc) {
                for (let entry in this.mdc) {
                    event.mdc.set(entry, this.mdc[entry]);
                }
            }
            if (this.params) {
                for (let param of this.params) {
                    event.param(param);
                }
            }
        }
        done(events);
    }
}

Plugins.register(Constants);
module.exports = Constants;
