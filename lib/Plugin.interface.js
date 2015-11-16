"use strict";

module.exports = class Plugin {
    get name() {
        throw new Error('Not implemented!');
    }

    get type() {
        throw new Error('Not implemented!');
    }
};