const Plugins = require('../Plugins.class');


/**
 * A processor that will wait a certain time or number of {@link Event}s before sending them in bulk to the next
 * {@link Processor} or {@link Appender}.
 * @extends Processor
 */
class Batcher extends Plugins.interfaces.Processor {
    constructor() {
        super();
        this._buffer = [];
        this._size = 100;
    }

    /**
     * @inheritDoc
     */
    set configuration(configuration) {
        this._size = configuration.size || 100;
        this._interval = configuration.interval || 0;
    }

    /**
     * @inheritDoc
     */
    process(events, done) {
        for (let event of events) {
            this._buffer.push(event);
            if (this._buffer.length >= this._size) {
                if (this._timeout) {
                    clearTimeout(this._timeout);
                    delete this._timeout;
                }
                done(this._buffer);
                this._buffer = [];
            }
        }
        if (this._interval && !this._timeout) {
            this._timeout = setTimeout(() => {
                done(this._buffer);
                this._buffer = [];
            }, this._interval);
        }
    }
}

Plugins.register(Batcher);
module.exports = Batcher;
