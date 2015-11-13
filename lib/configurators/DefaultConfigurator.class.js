"use strict";

var Configurations = require('../Configurations.class');
var Configurator = Configurations.interface;

class DefaultConfigurator extends Configurator {
    // TODO loggaah has to be able to pass in a user specified configuration here before JsonConfigurator is loaded
    constructor() {
        super();
        Configurations.configuration = {
            todo: "default configuration"
        };
    }
}

module.exports = DefaultConfigurator;
Configurations.add(DefaultConfigurator);