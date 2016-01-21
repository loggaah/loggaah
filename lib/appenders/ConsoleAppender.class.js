'use strict';

var Plugins = require('../Plugins.class');

/**
 * The default appender if nothing else is specified. Sends the events to the console output.
 * @extends Appender
 */
class ConsoleAppender extends Plugins.interfaces.Appender {
    /**
     * @inheritDoc
     */
    set configuration(configuration) {}

    /**
     * @inheritDoc
     */
    append(events) {
        for (let event of events) {
            console.log(event.message);
        }
    }
}

Plugins.register(ConsoleAppender);
module.exports = ConsoleAppender;