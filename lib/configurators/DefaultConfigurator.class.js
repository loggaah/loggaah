"use strict";

var Configuration = require('../Configuration.class');
var Configurators = require('../Configurators.class');
var Configurator = Configurators.interface;

class DefaultConfigurator extends Configurator {
    constructor() {
        super();
    }

    get name() {
        return 'default';
    }

    scan(pluginConfig) {
        Configuration.set({
            configurators: {},
            processors: {
                format: {
                    type: 'Formatter',
                    format: '[%d] %m%n'
                }
            },
            appenders: {
                console: {
                    type: 'console',
                    processor: 'format',
                    color: true
                }
            },
            root: {
                level: 'info',
                appenders: 'console'
            }
        });
    }
}

module.exports = DefaultConfigurator;
Configuration.configurators.registry.add(module.exports);
Configuration.configurators.add('default', {});