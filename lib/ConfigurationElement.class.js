"use strict";

var _ = require('lodash');

var Plugin = require('./Plugin.interface.js');
var Configuration = require('./Configuration.class');

/**
 * A helper class that stores and manages all individual types of elements, used to create instances from.
 */
class Registry {
    constructor() {
        this._store = {};
    }

    /**
     *
     * @param {Object|Constructor|Plugin} constructor
     */
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

    /**
     *
     * @param element
     * @returns {Plugin}
     */
    get(element) {
        if (element instanceof Plugin) {
            return this._store[element.type];
        }
        if (_.isFunction(element)) {
            return new element();
        } else {
            if (!this._store) {
                throw new Error('The given element name could not be found: ' + element);
            }
            return new this._store[element]();
        }
    }
}

/**
 * Parent class for {@link Configurators}, {@link Appenders} and {@link Processors}. A once added element is then
 * accessible through a getter and setter with the elements name.
 */
class ConfigurationElement {
    constructor() {
        this.__registry = new Registry();
        this.__configurations = {};
    }

    /**
     *
     * @returns {Registry}
     */
    get registry() {
        return this.__registry;
    }

    /**
     *
     * @param {String} name
     * @param {Object|Configuration} configuration
     */
    add(name, configuration) {
        // TODO if name is a regex cast to string
        if (name.indexOf('__') !== 0 && !_.isFunction(name) && name != 'interface') {
            this.__configurations[name] = configuration;
            this.__defineGetter__(name, () => {
                return this.__configurations[name];
            });
            this.__defineSetter__(name, (configuration) => {
                if (!_.isEqual(this.__configurations[name], configuration)) {
                    if (configuration.type && this.__configurations[name] && this.__configurations[name].type != configuration.type) {
                        this.remove(name);
                    }
                    if (!this.__configurations[name]) {
                        if (!configuration.type) {
                            throw new Error('Unable to initialize element: missing type property');
                        }
                        this.__configurations[name] = this.registry.get(configuration.type);
                    }
                    this.__configurations[name] = configuration;
                    this.__update(name, configuration);
                }
            });
            this.__update(name, configuration);
        }
    }

    /**
     *
     * @param {String} name
     */
    remove(name) {
        if (this.__configurations[name]) {
            // TODO this.__instanecs needs to go into ConfigurationElement
            this.__instances[name].destroy();
            delete this.__instances[name];
            delete this.__configurations[name];
        }
    }

    /**
     *
     */
    clear() {
        for (var name in this.__configurations) {
            this.remove(name);
        }
    }

    /**
     *
     * @param {String} name
     * @param {Object|Configuration} configuration
     * @private
     */
    __update(name, configuration) {
        throw new Error("Not implemented!");
    }
}

module.exports = ConfigurationElement;