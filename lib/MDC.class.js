'use strict';

var _ = require('lodash');

/**
 * A helper function used to merge to data sets.
 * @private
 * @param {Object} target
 * @param {Objec} source
 * @returns {Object}
 */
function mergeValue(target, source) {
    if (!_.isObject(target) && !_.isArray(target)) {
        target = [target];
    }
    if (!_.isObject(source)) {
        target.push(source);
        return target;
    }
    if (_.isArray(source)) {
        return target.concat(source);
    }
    for (var prop in source) {
        if (!target[prop]) {
            target[prop] = source[prop];
        }
        else {
            if (_.isObject(target[prop]) || _.isObject(source[prop])) {
                target[prop] = mergeValue(target[prop], source[prop]);
                return target;
            }
            if (!_.isArray(target[prop])) {
                target[prop] = [target[prop]];
            }
            if (!_.isArray(source[prop])) {
                target[prop].push(source[prop]);
            }
            else {
                target[prop] = [...target[prop], ...source[prop]];
            }
        }
    }
    return target;
}

/**
 * The Meta Data Container is a special class that can be used to transport additional structure data along a log
 * message. Data in the mdc has special logging format that can be defined separately from the standard log message.
 */
class MDC {
    /**
     * @param {Object} [data] Data that should be stored in the mdc. Each property will be it's own field.
     */
    constructor(data) {
        this._data = {};
        if (data) {
            this.merge(data);
        }
    }

    /**
     *
     * @returns {number}
     */
    get size() {
        return this.length;
    }

    /**
     *
     * @returns {number}
     */
    get length() {
        return Object.keys(this._data).length;
    }

    /**
     *
     * @returns {boolean}
     */
    get empty() {
        return this.length === 0;
    }

    /**
     *
     * @param name
     * @returns {string}
     */
    get(name) {
        if (name) {
            return this._data[name];
        }
        return this._data;
    }

    /**
     *
     * @param {string} name
     * @param {Object} value
     * @returns {MDC}
     */
    set(name, value) {
        if (!value && _.isObject(name)) {
            this._data = name;
            return this;
        }
        this._data[name] = value;
        return this;
    }

    /**
     *
     * @param {string} name
     */
    delete(name) {
        delete this._data[name];
    }

    /**
     * Returns wether any metadata has been set.
     */
    isEmpty() {
        return Object.keys(this._data).length == 0;
    }

    /**
     *
     * @returns {Object}
     */
    clear() {
        let data = this._data;
        this._data = {};
        return data;
    }

    /**
     *
     * @param {string|Object} name
     * @param {Object} [value]
     */
    merge(name, value) {
        if (!value) {
            if (_.isObject(name)) {
                this._data = mergeValue(this._data, name);
            }
        }
        if (name && value) {
            if (!this._data[name]) {
                this._data[name] = value;
            } else {
                this._data[name] = mergeValue(this._data[name], value);
            }
        }
    }

    /**
     * Prints a string of all parameters recorded so far.
     * @returns {string}
     */
    toString() {
        var mdc = "";
        for (let property in this._data) {
            mdc += ", " + property + "=" + this._data[property];
        }
        return mdc.substr(2);
    }
}

module.exports = MDC;