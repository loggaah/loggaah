"use strict";

var Processors = require('../Processors.class');

module.exports = class Batcher extends Processors.interface {
    process(pid, message) {

    }
};

Processors.add(module.exports);