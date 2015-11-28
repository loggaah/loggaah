"use strict";

var _ = require('lodash');

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

module.exports = class MDC {
    constructor(config) {
        this._data = {};
        if (config) {
            this.merge(config);
        }
    }

    get size() {
        return this.length;
    }

    get length() {
        return Object.keys(this._data).length;
    }

    get empty() {
        return this.length === 0;
    }

    get(name) {
        if (name) {
            return this._data[name];
        }
        return this._data;
    }

    set(name, value) {
        if (!value && _.isObject(name)) {
            this._data = name;
            return this;
        }
        this._data[name] = value;
        return this;
    }

    delete(name) {
        delete this._data[name];
    }

    clear() {
        let data = this._data;
        this._data = {};
        return data;
    }

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
};