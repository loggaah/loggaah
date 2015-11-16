"use strict";

var ConfigurationElement = require('./ConfigurationElement.class');

class Processor {
}

class Processors extends ConfigurationElement {
    add(processor) {

    }
}

module.exports = new Processors();
module.exports.interface = Processor;

require('./processors/Batcher.class');
require('./processors/Formatter.class');