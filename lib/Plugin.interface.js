"use strict";

/**
 * All Plugins implement this interface transitively when they implement either {@link Configurator}s, {@link Appender}s
 * or {@link Processor}s.
 * @interface
 */
class Plugin {
    /**
     * The plugin needs to be identifiable by the type. This can bei either the class name or a short form type.
     * @abstract
     */
    get type() {
        throw new Error('Not implemented!');
    }

    /**
     * The plugin should take of clean up and the of doing whatever it does.
     * @abstract
     */
    destroy() {
        throw new Error('Not implemented!');
    }

    /**
     * Stores the configuration for this plugin.
     * @param {Object|Configuration} configuration
     */
    set configuration(configuration) {
        this._configuration = configuration;
    }

    /**
     * Returns the part of the configuration that is specific for this plugin.
     * @returns {Object|Configuration}
     */
    get configuration() {
        return this._configuration;
    }
}

module.exports = Plugin;