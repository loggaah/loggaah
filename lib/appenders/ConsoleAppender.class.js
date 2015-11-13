"use strict";

var Appenders = require('../Appenders.class');

class ConsoleAppender extends Appenders.interface {

}

module.exports = new ConsoleAppender();
Appenders.add(module.exports);
