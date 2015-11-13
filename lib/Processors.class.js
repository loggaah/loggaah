"use strict";

class Processor {
}

class Processors {
    add(processor) {

    }
}

module.exports = new Processors();
module.exports.interface = Processor;

require('./processors/Batcher.class');
require('./processors/Formatter.class');