"use strict";

class Configuration {
    set ownConfiguration(configuration) {}
}

class Configurations {
    constructor(loggaah) {
        this._loggaah = loggaah;
        this._currentConfiguration = {};
        this._configurations = [];
    }

    add(configuration) {
        this._configurations.push(configuration);
    }

    set configuration(configuration) {
        // TODO process configuration json by sending to _loggaah isntance
        // TODO update confiurators own configuration
        console.log(new configuration(this._currentConfiguration));
    }

    list() {
        return this._configurations;
    }

    get currentConfiguration() {
        return this._currentConfiguration
    }
}

module.exports = new Configurations();
module.exports.interface = Configuration;

require('./configurators/DefaultConfigurator.class');
require('./configurators/JsonConfigurator.class');