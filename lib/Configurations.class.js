"use strict";

var _ = require('lodash');

class Configurator {
    /**
     * A configuration will be triggered through this method.
     *
     * @param currentConfiguration object                               the configuration as known by the Configurations singleton.
     * @param changeCallback function(config[object], merge[boolean])   callback to call when a configuration has changed
     */
    scan(currentConfiguration, changeCallback) {
        throw new Error("Not implemented!");
    }

    /**
     * Returns the unique type name with which the configurator can be referenced with.
     */
    get name() {
        throw new Error("Not implemented!");
    }
}

class Configurations {
    constructor() {
        this._configuratorOrder = [];
        this._configurators = {};
        this._currentConfiguration = {
            configurators: {},
            processors: {},
            appenders: {},
            loggers: {}
        };
    }

    setConfigurator(configurator, configuration) {
        configurator = this.getConfigurator(configurator);
        if (!configurator && this._currentConfiguration.debug) {
            console.warn("Trying to set a non existent configurator:" + configurator);
        }
        this._currentConfiguration.configurators[configurator.name] = configuration;
        configurator.scan(this._currentConfiguration, this.update.bind(this));
    }

    getConfigurator(configurator) {
        if (configurator instanceof Configurator) {
            if (this._configurators[configurator.name]) {
                return this._configurators[configurator.name];
            }
            this._configurators[configurator.name] = configurator;
            this._configuratorOrder.push(configurator);
            return configurator;
        }
        return this._configurators[configurator];
    }

    update(configuration, merge) {
        var changedConfigurators = new Set();
        for (var configurator in configuration.configurators) {
            if (_.isEqual(configuration.configurators[configurator], this._currentConfiguration.configurators[configurator])) {
                changedConfigurators.add(configurator);
            }
        }
        if (merge) {
            Object.assign(this._currentConfiguration, configuration);
        } else {
            this._currentConfiguration = configuration;
        }

        for (let configurator of this._configuratorOrder) {
            if (changedConfigurators.has(configurator.name)) {
                configurator.scan(this._currentConfiguration.configurators[configurator.name], this.update.bind(this));
            }
        }
        // TODO process configurations for Appender, Processor, Logger and Root
        console.log();
    }

    get configuration() {
        return this._currentConfiguration
    }
}

module.exports = new Configurations();
module.exports.interface = Configurator;

require('./configurators/DefaultConfigurator.class');
require('./configurators/JsonConfigurator.class');