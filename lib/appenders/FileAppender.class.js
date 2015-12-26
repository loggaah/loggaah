"use strict";

var loggaah = require('../../');
var Configuration = loggaah.configuration;
var Appender = loggaah.Appenders.interface;

/**
 * The most populare {@link Appender} of them all... probably. This appender will store logging events to file. It
 * supports rolling files over based on either size or time.
 * @extends Appender
 */
class FileAppender extends Appender {
    /**
     * @inheritDoc
     */
    get type() {
        return 'console';
    }

    /**
     * @inheritDoc
     */
    set configuration(configuration) {
        super.configuration = configuration;
    }

    /**
     * @inheritDoc
     */
    append(message) {

    }
}

module.exports = FileAppender;
Configuration.appenders.registry.add(module.exports);