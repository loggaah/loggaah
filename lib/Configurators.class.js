"use strict";

var Plugin = require('./Plugin.interface.js');
var ConfigurationElement = require('./ConfigurationElement.class');


class Configurator extends Plugin {
    /**
     * A configuration will be triggered through this method.
     *
     * @param currentConfiguration object   the configuration as known by the Configurations singleton.
     */
    scan(currentConfiguration) {
        throw new Error("Not implemented!");
    }

    destroy() {}
}

class Configurators extends ConfigurationElement {
    constructor() {
        super();
        this.__instances = {};
    }

    __update(name, configuration) {
        if (!this.__instances[name]) {
            this.__instances[name] = this.__registry.get(name);
        }
        this.__instances[name].scan(configuration);
    }
}

module.exports = new Configurators();
module.exports.interface = Configurator;