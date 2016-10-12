'use strict';

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
        if (!this._isEmpty(config)) {
            return next(config);
        }
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
                    type: 'Console',
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

     _isEmpty(config = {}) {
         for (let prop of ['configurators', 'processors', 'appenders', 'loggers']) {
             if (config[prop] && Object.keys(config[prop]).length) {
                 return false;
             }
         }
         return true;
    }
}

Plugins.register(Default);
module.exports = Default;
