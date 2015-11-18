"use strict";

class Plugin {
    get type() {
        throw new Error('Not implemented!');
    }

    destroy() {
        throw new Error('Not implemented!');
    }
}

module.exports = Plugin;