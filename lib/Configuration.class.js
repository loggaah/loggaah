"use strict";

class Configuration {
    constructor() {
        this.appenders = new Appenders();
        this.processors = new Processors();
    }

    get() {
        return {
            processors: {
                formatter: {
                    format: "%m%n"
                }
            },
            appenders: {
                console: {
                    processor: "formatter",
                    type: "console",
                    color: true
                }
            },
            root: {
                appender: "console",
                level: "info"
            }
        };
    }
}

class Appenders {
    constructor() {
        this.availableProcessors = {};
    }

    /**
     * Allows registration of appender types.
     *
     * @param appender
     */
    register(appender) {

    }

    /**
     * Lists all known appender types.
     *
     * @returns {Array}
     */
    list() {
        var appenderNames = [];
        for (var appender in this.availableProcessors) {
            appenderNames.push(appender);
        }
        return appenderNames;
    }

    get(configName) {
        return this.availableProcessors[configName];
    }

    configure(configName, appender) {
        this.availableProcessors[configName] = appender;
    }
}

class Processors {
    constructor() {
        this.availableProcessors = {};
    }
}

module.exports = new Configuration();