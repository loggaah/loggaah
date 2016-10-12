'use strict';

var Plugins = require('../Plugins.class');

/**
 * This is the very first {@link Configurator} that is loaded into the system. It does nothing more then to return a
 * default configuration that is used if no other configuration could be found.
 * @extends Configurator
 */
class Arguments extends Plugins.interfaces.Configurator {
    /**
     * @inheritDoc
     */
    scan(config, next) {
        // TODO look for program arguments and override configuration accordingly
        next(config);
    }
}

Plugins.register(Arguments);
module.exports = Arguments;
