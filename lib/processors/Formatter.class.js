"use strict";

var _ = require('lodash');
var loggaah = require('../../');
var Configuration = loggaah.configuration;
var Processor = loggaah.Processors.interface;

var defaultSettings = {
    type: 'formatter'
};

var patterns = {};

/**
 * Processes the message of an {@link Event} by applying a given format to it.
 * @extends Processor
 */
class Formatter extends Processor {
    constructor() {
        super();
    }

    /**
     * Add a processor to a set of patterns that's available for the formatter.
     * @param {string} pattern
     * @param {function} processor
     */
    static addPattern(pattern, processor) {
        var patternList = pattern.split(" ");
        for (let i of patternList) {
            if (patterns[i]) {
                throw new Error("The given pattern has already been registered by a different processor");
            }
            patterns["%" + i] = processor;
        }
    }

    /**
     *
     */
    get type() {
        return defaultSettings.type;
    }

    /**
     * @inheritDoc
     */
    set configuration(configuration) {
        this.pattern = configuration.pattern;
    }

    /**
     * @inheritDoc
     */
    process(event, done) {
        var message = this.pattern;
        for (let pattern in patterns) {
            var patternStart = message.indexOf(pattern);
            if (patternStart != -1) {
                patternStart += pattern.length;
                var parameter;
                if (message.charAt(patternStart) == '{') {
                    var patternEnd = message.indexOf("}", patternStart);
                    parameter = message.substring(patternStart + 1, patternEnd);
                    var token = pattern + "{" + parameter + "}";
                } else {
                    token = pattern;
                }
                message = message.replace(token, patterns[pattern](event, parameter));
            }
        }
        event.message = message;
        done(event);
    }
}

module.exports = Formatter;
Configuration.processors.registry.add(module.exports);
Configuration.processors.add('default', defaultSettings);


/**
 * Inserts the standard message.
 */
Formatter.addPattern("message msg m", (event) => event.message);

/**
 * Insert the log level.
 * @param {number} length   Limits the length of the level
 */
Formatter.addPattern("level lvl p", (event, parameter) => {
    var length = event.level.length;
    try {
        length = parameter.match(/length=([0-9]+)/)[1];
    } catch (e) {}
    return event.level.toString().substr(0, length);
});

/**
 * Prints the source of where the event originated from.
 */
Formatter.addPattern("logger class c", (event) => event.source);

/**
 * Prints the date the event was created.
 * @param {string} *    The date format to print. For details check {@link http://momentjs.com/docs/#/displaying/format/}
 */
Formatter.addPattern("date d", (event, parameter) => {
    if (parameter) {
        return event.time.format(parameter);
    }
    return event.time.toISOString();
});

/**
 * Url encodes the passed in parameter.
 * @param {string} *    Any string
 */
Formatter.addPattern("encode enc", (event, parameter) => encodeURIComponent(parameter));

/**
 * Prints a sequence number.
 */
var sequence = 1;
Formatter.addPattern("sequenceNumber sn", (event, parameter) => sequence++);

/**
 * Prints mdc data.
 * @param {string|string[]} [*] A comma separated list of keys to print. If the paramter is not set, the whole MDC is
 *                              printed.
 */
Formatter.addPattern("MDC mdc X", (event, parameter) => {
    if (!parameter) {
        return event.mdc.toString();
    }
    var keys = parameter.split(',');
    var mdc = "";
    for (let key of keys) {
        key = _.trim(key);
        mdc += ", " + key + "=" + event.mdc.get(key);
    }
    return mdc.substr(2);
});
