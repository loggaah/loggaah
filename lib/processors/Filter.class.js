'use strict';

var _ = require('lodash');

var Plugins = require('../Plugins.class');


/**
 * A processor that will filter messages based on a number of criteria.
 * @extends Processor
 */
class Filter extends Plugins.interfaces.Processor {
    constructor() {
        super();
    }

    /**
     * @inheritDoc
     */
    set configuration(configuration) {

    }

    /**
     * @inheritDoc
     */
    process(events, done) {
        done(_.filter(events, this._filter));
    }

    /**
     *
     * @param {Event} event
     * @returns {boolean} Whether to keep this event (true) or not (false).
     * @private
     */
    _filter(event) {
        // TODO support different modes of filtering on various properties using e.g. RegExp
        return true;
    }
}

Plugins.register(Constants);
module.exports = Constants;
