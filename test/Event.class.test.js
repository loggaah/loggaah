/* global describe, it, beforeEach, afterEach */
'use strict';

var expect = require('chai').expect;
var moment = require('moment');

var Event = require('../lib/Event.class');
var Level = require("../").Level;
var MDC = require("../").MDC;

describe("Event", () => {
    it("should create an event with properties set in the constructor", () => {
        var mdc = new MDC();
        var error = new Error();
        var event = new Event("test/class", Level.info, "this %s a test", mdc, error, ["is"]);
        expect(event.getLevel()).to.equal(Level.info);
        expect(event.getMetadata()).to.deep.equal(mdc);
        expect(event.getError()).to.deep.equal(error);
        expect(event.getTime()).to.be.lte(moment());
        expect(event.message).to.equal('this is a test');
    });

    it("should create an event using flow setter", () => {
        var mdc = new MDC();
        var error = new Error();
        var event = new Event("test/class");
        event.pattern("this %s a test").param('is').mdc(mdc).error(error).level(Level.WARN);
        expect(event.getLevel()).to.equal(Level.warn);
        expect(event.getMetadata()).to.deep.equal(mdc);
        expect(event.getError()).to.deep.equal(error);
        expect(event.getTime()).to.be.lte(moment());
        expect(event.message).to.equal('this is a test');
    });
});
