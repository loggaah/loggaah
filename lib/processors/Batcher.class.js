"use strict";

var Configuration = require('../Configuration.class');
var Processors = require('../Processors.class');
var Processor = Processors.interface;

class Batcher extends Processor {
    get type() {
        return 'batcher';
    }

    set configuration(configuration) {

    }

    process(message) {

    }
}

module.exports = Batcher;
Configuration.processors.registry.add(module.exports);