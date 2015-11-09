"use strict";

var loggaah = require('..');

module.exports = class Formatter extends Processor {
    process(pid, message) {

    }
};

loggaah.processors.add(new Formatter());