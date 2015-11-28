"use strict";

var loggaah = require('../../');
var Configuration = loggaah.configuration;
var Processor = loggaah.Processors.interface;

class Batcher extends Processor {
    get type() {
        return 'batcher';
    }

    set configuration(configuration) {

    }

    process(event, done) {
        done(event);
    }
}

module.exports = Batcher;
Configuration.processors.registry.add(module.exports);