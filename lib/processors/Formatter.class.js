'use strict';

var crypto = require('crypto');

var _ = require('lodash');
var moment = require('moment');

var Plugins = require('../Plugins.class');


var patterns = [];

/**
 * Processes the message of an {@link Event} by applying a given format to it.
 * @extends Processor
 */
class Formatter extends Plugins.interfaces.Processor {
    constructor() {
        super();
    }

    /**
     * Add a placeholder to a set of patterns that's available for the formatter. Patterns are processed either in
     * order of their pattern length (longer > shorter) or using the priority parameter, if set.
     * @param {string} pattern              The pattern to match (without the "%" prefix)
     * @param {processorFunction} processor The function that will process the message
     * @param {number} [priority=1]         An optional priority for a processor. If none is set, patterns will be
     *                                      matched from longest to shortest.
     */
    static addPattern(pattern, processor, priority) {
        var patternList = pattern.split(/[ ,|;]/);
        for (let i of patternList) {
            if (i.length) {
                patterns.push({
                    matcher: "%" + i,
                    processor,
                    priority: _.isNumber(priority) ? priority : 1
                });
            }
        }
        patterns.sort((a,b) => {
            let diff = b.priority - a.priority;
            if (diff != 0) {
                return diff;
            }
            return b.matcher.length - a.matcher.length;
        });
    }
    /**
     * Signals processing is done and next processor/appender can continue.
     * @callback processorFunction
     * @param {Event} event         The event to be processed
     * @param {string} parameters   Parameters that were set along with the placeholder. It is up to the processor to
     *                              decide what to do with the content between "{}".
     */

    /**
     * @inheritDoc
     */
    set configuration(configuration) {
        this.pattern = configuration.pattern;
    }

    /**
     * @inheritDoc
     */
    process(events, done) {
        for (let event of events) {
            var message = this.pattern;
            for (let pattern of patterns) {
                var patternStart = message.indexOf(pattern.matcher);
                if (patternStart != -1) {
                    patternStart += pattern.matcher.length;
                    var parameter;
                    if (message.charAt(patternStart) == '{') {
                        var patternEnd = message.indexOf("}", patternStart);
                        parameter = message.substring(patternStart + 1, patternEnd);
                        var token = pattern.matcher + "{" + parameter + "}";
                    } else {
                        token = pattern.matcher;
                    }
                    message = message.replace(token, pattern.processor(event, parameter));
                }
            }
            event.message = _.trim(message);
        }
        done(events);
    }
}

Plugins.register(Formatter);
module.exports = Formatter;


/**
 * Insert the entire event in a default format.
 */
Formatter.addPattern("event evt", () => "%d [%p] %m %X %ex", 100);

/**
 * Inserts the standard message.
 */
Formatter.addPattern("message msg m", (event) => event.message ? event.message : '');

/**
 * Insert the log level.
 * @param {number} length   Limits the length of the level
 */
Formatter.addPattern("level lvl p", (event, parameter) => {
    var length = event.getLevel().length;
    try {
        length = parameter.match(/length=([0-9]+)/)[1];
    } catch (e) {}
    return event.getLevel().toString().substr(0, length);
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
        return event.getTime().format(parameter);
    }
    return event.getTime().toISOString();
});

/**
 * Prints a sequence number.
 */
var sequence = 1;
Formatter.addPattern("sequenceNumber sn", () => sequence++);

/**
 * Prints the number of milliseconds since the start of the program.
 */
var start = moment().valueOf();
Formatter.addPattern("relative r", (event) => event.getTime().valueOf() - start);

/**
 * Prints mdc data.
 * @param {string|string[]} [*] A comma separated list of keys to print. If the paramter is not set, the whole MDC is
 *                              printed.
 */
Formatter.addPattern("MDC mdc X", (event, parameter) => {
    if (!event.getMetadata() || !event.getMetadata().size) {
        return '';
    }
    if (!parameter) {
        return event.getMetadata().toString();
    }
    var keys = parameter.split(/[ ,|;]/);
    var mdc = "";
    for (let key of keys) {
        if (key.length && event.getMetadata().get(key)) {
            mdc += ", " + key + "=" + event.getMetadata().get(key);
        }
    }
    return mdc.substr(2);
});

/**
 * Print the process ID under which this message was generated.
 */
Formatter.addPattern("process proc thread t", (event) => event.processId );

/**
 * Print an error/exception if any came with the event.
 * @param {string|number} * Format the exceptions using either "short" for just the message, "full" (default) for the
 *                          entire stack trace or a number to determine how many stacks should be printed.
 */
Formatter.addPattern("exception ex error er throwable", (event, parameter) => {
    if (!event.getError()) {
        return '';
    }
    if (parameter == 'short') {
        return event.getError().message;
    }
    if (!isNaN(parameter)) {
        let outEnd = 0;
        let stacks = 0;
        while (stacks <= parameter) {
            stacks++;
            outEnd = event.getError().stack.indexOf('\n', outEnd + 1);
            if (outEnd == -1) {
                return event.getError().stack;
            }
        }
        return event.getError().stack.substr(0, outEnd);
    }
    return event.getError().stack;
});

/**
 * Generates a uuid based on random numbers from the crypto module.
 */
Formatter.addPattern("uuid", () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = crypto.randomBytes(1)[0] % 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
}));

/**
 * Prints the hash of an event to identify a message.
 */
Formatter.addPattern("id hash", (event) => {
    return event.getId();
});

/**
 * Prints a "%" for every "%%".
 */
Formatter.addPattern("%", (event) => '%');

/**
 * Url encodes the passed in parameter.
 * @param {string} *    Any string
 */
Formatter.addPattern("encode enc", (event, parameter) => encodeURIComponent(parameter), 0);
