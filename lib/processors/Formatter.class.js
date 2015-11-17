"use strict";

var Configuration = require('../Configuration.class');
var Processors = require('../Processors.class');

class Formatter extends Processors.interface {
    get type() {
        return 'formatter';
    }

    set configuration(configuration) {

    }

    process(message) {

    }
}

module.exports = Formatter;
Configuration.processors.registry.add(module.exports);