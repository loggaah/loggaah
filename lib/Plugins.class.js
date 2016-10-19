'use strict';

var EventEmitter = require('events').EventEmitter;

var _ = require('lodash');

/**
 * A parent class for all plugins.
 */
class Plugin {
    /**
     * Creates a plugin with the given id.
     * @param {string} [id] The id for this plugin (defaults to the class name)
     */
    constructor(id = this.constructor.name) {
        this._id = id;
    }

    /**
     * Returns the unique id of this plugin.
     * @returns {string}
     */
    get id() {
        return this._id;
    }

    /**
     * Returns the current configuration of a plugin
     * @returns {Object}
     */
    get configuration() {
        return this._configuration;
    }

    /**
     * Sets the configuration of a plugin when it's changed.
     * @abstract
     * @param {Object} config
     */
    set configuration(config) {
        this._configuration = config;
    }

    /**
     * Is called when the plugin is no longer being used. Allows a plugin to shut down gracefully.
     * @todo this method is not yet being called anywhere, since plugins are not unregistered anywhere yet
     * @abstract
     */
    destroy() {}
}

/**
 * Appenders need to implement this interface to be usable by the system.
 */
class Appender extends Plugin {
    /**
     * Is called when an appender should process events and output them to whatever facility they connect with.
     * @abstract
     * @param {Event[]} events
     */
    append(events) {
        throw new Error('Append() must be implemented by all appenders');
    }
}

/**
 * Processors need to implement this interface to be usable by the system.
 */
class Processor extends Plugin {
    /**
     * Is called when a processor should process events. Once done the processed events need to be passed on by calling
     * the next(events) function.
     * @abstract
     * @param {Event[]} events
     * @param {ProcessorCallback} next
     */
    process(events, next) {
        throw new Error('Process() must be implemented by all appenders');
    }
    /**
     * Signals processing is done and next processor/appender can continue.
     * @callback ProcessorCallback
     * @private
     * @param {Event[]} events The processed events
     */
}

/**
 * Configurators need to implement this interface to be usable by the system.
 */
class Configurator extends Plugin {
    /**
     * Is called whenever the configuration is changed and needs to be refreshed. When configuration changes the plugin
     * should notify the system using the callback passing in the new configuration. The same function can be used if
     * the plugin needs to update configuration without being triggered through a scan event.
     * @abstract
     * @param {Object} config The current configuration
     * @param {ConfiguratorCallback} next
     */
    scan(config, next) {
        throw new Error('Scan() must be implemented by all configurators');
    }

    /**
     * Signals processing is done and next processor/appender can continue.
     * @callback ConfiguratorCallback
     * @private
     * @param {Object} configuration The processed event
     */

    /**
     * If the configurator wants to react to a changed global configuration it can do so here.
     * Note that if you call 'next()' with a changed configuration, you will get notified again, so you will have to
     * shield against endless loops in this case.
     * @param {Object} config The current configuration
     * @param {ConfiguratorCallback} next
     * @abstract
     */
    onChange(config, next) {}
}

/**
 * This class is a helper to manage all things related to plugins. The class extends an event emitter so that listeners
 * can react whenever a change is happening.
 *
 * @fires Plugins#register
 * @fires Plugins#create
 * @fires Plugins#remove
 */
class Plugins extends EventEmitter {
    /**
     * Event that is fired when a plugin was registered. The data that is passed on is the type of the plugin that can
     * be used to create new instances.
     * @event Plugins#register
     * @type {string}
     */

    /**
     * Event that is fired when an instance of a registered plugin is created.
     *
     * @event Plugins#create
     * @type {Plugin}
     */

    /**
     * Event that is fired when an instance of a plugin is removed.
     *
     * @event Plugins#remove
     * @type {Plugin}
     */

    /**
     * Set the interfaces defined above as properties of this class so they can be accessed by external plugins.
     */
    constructor() {
        super();
        this.interfaces = { Appender, Processor, Configurator };
        this.registered = { appenders: {}, processors: {}, configurators: {} };
        this.instances = { appenders: {}, processors: {}, configurators: {} };
    }

    /**
     * Make a plugin available to the system.
     * @param {Plugin} plugin
     */
    register(plugin) {
        if (!_.isFunction(plugin)) {
            throw new Error("To register plugins please pass in the constructor/class definition instead of an instance.");
        }
        if (plugin.prototype instanceof Appender) {
            this.registered.appenders[plugin.name] = plugin;
        }  else if (plugin.prototype instanceof Processor) {
            this.registered.processors[plugin.name] = plugin;
        } else if (plugin.prototype instanceof Configurator) {
            this.registered.configurators[plugin.name] = plugin;
        } else {
            throw new Error('To register plugins they must implement one of the plugin interfaces!');
        }
        this.emit('register', plugin.name);
    }

    /**
     * Returns the existing instance of a plugin. The function will look for all types of plugins if no type is given.
     * @param {string} name
     * @param {string} [type]
     * @returns {Appender|Configurator|{Processor}
     */
    getInstance(name, type) {
        if (this.instances.appenders[name] && (!type || type.toLowerCase() == "appender")) {
            return this.instances.appenders[name];
        }
        if (this.instances.processors[name] && (!type || type.toLowerCase() == "processor")) {
            return this.instances.processors[name];
        }
        if (this.instances.configurators[name] && (!type || type.toLowerCase() == "configurator")) {
            return this.instances.configurators[name];
        }
        throw new Error(`Instance with name ${name} doesn't exist.`);
    }

    /**
     * Creates an instance of the given type and stores it under the name.
     * @param {function|string} type    The name of the type of plugin to create.
     * @param {string} [id=config]      The id to assign to the plugin. Note that {@link Configurator}s ignore the value
     *                                  and instead assign the type as id.
     * @param {Object} config           The configuration for the plugin you want to create an instance of
     * @returns {Appender|Configurator|Processor} the instance just created.
     */
    createInstance(type, id, config) {
        if (_.isFunction(type)) {
            type = type.name;
        }
        if (_.isObject(id)) {
            config = id;
        }
        if (this.registered.appenders[type]) {
            this.instances.appenders[id] = new this.registered.appenders[type](id);
            this.instances.appenders[id].configuration = config;
            this.emit('create', this.instances.appenders[id]);
            return this.instances.appenders[id];
        }
        if (this.registered.processors[type]) {
            this.instances.processors[id] = new this.registered.processors[type](id);
            this.instances.processors[id].configuration = config;
            this.emit('create', this.instances.processors[id]);
            return this.instances.processors[id];
        }
        if (this.registered.configurators[type]) {
            this.instances.configurators[type] = new this.registered.configurators[type](type);
            this.instances.configurators[type].configuration = config;
            this.emit('create', this.instances.configurators[type]);
            return this.instances.configurators[type];
        }
        throw new Error(`Can't create instance of type ${type}`);
    }

    /**
     * Removes all plugin instances
     */
    reset() {
        // TODO call destroy on each instance
        this.instances = { appenders: {}, processors: {}, configurators: {} };
    }
}

module.exports = new Plugins();
