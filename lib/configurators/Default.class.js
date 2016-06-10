'use strict';

var _ = require('lodash');

var Plugins = require('../Plugins.class');

/**
 * This is the very first {@link Configurator} that is loaded into the system. It does nothing more then to return a
 * default configuration that is used if no other configuration could be found.
 * @extends Configurator
 */
class Default extends Plugins.interfaces.Configurator {
    /**
     * @inheritDoc
     */
    scan(config, next) {
        if (config && Object.keys(config).length) {
            next(config);
        }
        else {
            next({
                configurators: {},
                processors: {
                    default: {
                        type: 'Formatter',
                        format: '[%d] %m%n'
                    }
                },
                appenders: {
                    default: {
                        type: 'ConsoleAppender',
                        processor: 'default',
                        color: true
                    }
                },
                loggers: {
                    root: {
                        level: 'info',
                        match: '.*',
                        appenders: 'default'
                    }
                }
            });
        }
    }
}

Plugins.register(Default);
module.exports = Default;
