"use strict";

var fs = require('fs');
var path = require('path');

var loggaah = require('../../');
var Configuration = loggaah.configuration;
var Appender = loggaah.Appenders.interface;

var defaultSettings = {
    type: 'file'

};

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
        return defaultSettings.type;
    }

    /**
     * @inheritDoc
     */
    set configuration(configuration) {
        super.configuration = configuration;
        this._rollover = configuration.rollover;

    }

    /**
     * @inheritDoc
     */
    append(events) {
        fs.appendFile(this.getFilename(), '\n' + data, {encoding: 'utf8'}, callback);
    }

    getFilename() {
        var updatedFilename = this.updateFilename();
        if (this.currentFilename == updatedFilename) {
            return this.currentFilename;
        }
        this.createParentDir(updatedFilename);

        this.currentFilename = updatedFilename;
    }

    updateFilename() {
        if (this._locked) {
            return this._cachedFilename;
        }
        this._locked = true;
        // TODO generate current filename based on rollover config
        this._cachedFilename = this._rollover.pattern;
        // TODO adjust this based on type of rollover config
        var timeout = 1000;
        setTimeout(() => this._locked = false, timeout);
        return this._cachedFilename;
    }

    createParentDir(location) {
        var dir = '';
        path.dirname(location).split(path.sep).forEach(function (dirPart) {
            dir += dirPart + path.sep;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        });
    }
}

module.exports = FileAppender;
Configuration.appenders.registry.add(module.exports);