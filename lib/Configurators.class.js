"use strict";

var _ = require('lodash');

var Plugin = require('./Plugin.interface');
var ConfigurationElement = require('./ConfigurationElement.class');


class Configurator extends Plugin {
    /**
     * A configuration will be triggered through this method.
     *
     * @param currentConfiguration object                               the configuration as known by the Configurations singleton.
     * @param changeCallback function(config[object], merge[boolean])   callback to call when a configuration has changed
     */
    scan(currentConfiguration) {
        throw new Error("Not implemented!");
    }

    get type() {
        return this.name;
    }
}

class Configurators extends ConfigurationElement {
    __update(name, configuration) {
        var element = this.__registry.get(name);
        // TODO this needs to be stored
        new element().scan(configuration);
    }
}

module.exports = new Configurators();
module.exports.interface = Configurator;