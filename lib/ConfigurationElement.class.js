"use strict";

var _ = require('lodash');

var Plugin = require('./Plugin.interface.js');
var Configuration = require('./Configuration.class');

class Registry {
    constructor() {
        this._store = {};
    }

    add(constructor) {
        if (this._store[constructor]) {
            Configuration.debug && console.warn('Trying to add an element twice: ' + constructor);
            return;
        }
        if (!_.isFunction(constructor)) {
            Configuration.debug && console.warn('Trying to add an element that is not a constructor: ' + constructor);
            return;
        }

        if (!(constructor instanceof Plugin.constructor)) {
            Configuration.debug && console.warn('Trying to add an element that is not a Plugin: ' + constructor);
            return;
        }
        this._store[new constructor().type] = constructor;
    }

    get(element) {
        if (element instanceof Plugin) {
            return this._store[element.type];
        }
        if (_.isFunction(element)) {
            return new element();
        } else {
            return new this._store[element]();
        }
    }
}

class ConfigurationElement {
    constructor() {
        this.__registry = new Registry();
        this.__configurations = {};
    }

    get registry() {
        return this.__registry;
    }

    add(name, configuration) {
        var that = this;
        if (name.indexOf('__') !== 0 && !_.isFunction(name) && name != 'interface') {
            this.__configurations[name] = configuration;
            this.__defineGetter__(name, () => {
                return this.__configurations[name];
            });
            this.__defineSetter__(name, (configuration) => {
                // TODO check if type is the same and if not call destroy on current plugin
                if (!_.isEqual(this.__configurations[name], configuration)) {
                    this.__configurations[name] = configuration;
                    that.__update(name, configuration);
                }
            });
        }
    }

    __update(name, configuration) {
        throw new Error("Not implemented!");
    }
}

module.exports = ConfigurationElement;