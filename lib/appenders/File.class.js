'use strict';

var fs = require('fs');
var path = require('path');

var Plugins = require('../Plugins.class');


/**
 * The most populare {@link Appender} of them all... probably. This appender will store logging events to file. It
 * supports rolling files over based on either size or time.
 * @extends Appender
 */
class File extends Plugins.interfaces.Appender {
    /**
     * @inheritDoc
     */
    set configuration(configuration) {
        this._rollover = configuration.rollover;
    }

    /**
     * @inheritDoc
     */
    append(events) {
        var content = '';
        for (let event of events) {
            content += '\n' + event.message;
        }
        fs.appendFile(this.getFilename(), content, {encoding: 'utf8'}, callback);
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

Plugins.register(File);
module.exports = File;
