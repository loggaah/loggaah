"use strict";

var loggaah = require('../../');
var Configuration = loggaah.configuration;
var Configurator = loggaah.Configurators.interface;

/**
 * This is the very first {@link Configurator} that is loaded into the system. It does nothing more then to return a
 * default configuration that is used if no other configuration could be found.
 * @extends Configurator
 */
class DefaultConfigurator extends Configurator {
    /**
     * @inheritDoc
     */
    get type() {
        return 'default';
    }

    /**
     * @inheritDoc
     */
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