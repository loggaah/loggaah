"use strict";

var Configurations = require('../Configurations.class');
var Configurator = Configurations.interface;

class DefaultConfigurator extends Configurator {
    constructor() {
        super();
    }

    get name() {
        return 'default';
    }

    scan(currentConfig, changeCallback) {
        changeCallback({
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

module.exports = new DefaultConfigurator();
Configurations.setConfigurator(module.exports);