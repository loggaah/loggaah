/* global describe, it, beforeEach, afterEach */
const expect = require('chai').expect;
const moment = require('moment');

const Event = require('../lib/Event.class');
const Level = require("../").Level;
const MDC = require("../").MDC;

describe("Event", () => {
    it("should create an event with properties set in the constructor", () => {
        let mdc = new MDC();
        let error = new Error();
        let event = new Event("test/class", Level.info, "this %s a test", mdc, error, ["is"]);
        expect(event.getLevel()).to.equal(Level.info);
        expect(event.getMetadata()).to.deep.equal(mdc);
        expect(event.getError()).to.deep.equal(error);
        expect(event.getTime().valueOf()).to.be.lte(moment().valueOf());
        expect(event.message).to.equal('this is a test');
    });

    it("should create an event using flow setter", () => {
        let mdc = new MDC();
        let error = new Error();
        let event = new Event("test/class");
        event.pattern("this %s a test").param('is').mdc(mdc).error(error).level(Level.WARN);
        expect(event.getLevel()).to.equal(Level.warn);
        expect(event.getMetadata()).to.deep.equal(mdc);
        expect(event.getError()).to.deep.equal(error);
        expect(event.getTime().valueOf()).to.be.lte(moment().valueOf());
        expect(event.message).to.equal('this is a test');
    });
});
