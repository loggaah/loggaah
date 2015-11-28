"use strict";

class Plugin {
    get type() {
        throw new Error('Not implemented!');
    }

    destroy() {
        throw new Error('Not implemented!');
    }

    set configuration(configuration) {
        this._configuration = configuration;
    }

    get configuration() {
        return this._configuration;
    }
}

module.exports = Plugin;