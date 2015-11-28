"use strict";

var loggaah = require('../../');
var Configuration = loggaah.configuration;
var Configurator = loggaah.Configurators.interface;

class DefaultConfigurator extends Configurator {
    constructor() {
        super();
    }

    get type() {
        return 'default';
    }

    scan(pluginConfig) {
        Configuration.set({
            configurators: {},
            processors: {
                default: {
                    type: 'formatter',
                    format: '[%d] %m%n'
                }
            },
            appenders: {
                default: {
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