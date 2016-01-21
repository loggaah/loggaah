'use strict';

var expect = require('chai').expect;

var Level = require('../').Level;


describe("Level.class", () => {
    it("should have the same level for different names", () => {
        expect(Level.ERROR).to.equal(Level.ERR);
        expect(Level.ERROR).to.equal(Level.err);
        expect(Level.ERROR).to.equal(Level.error);
        expect(Level.ERROR == 5).to.be.true;

        expect(Level.WARNING).to.equal(Level.WARN);
        expect(Level.WARNING).to.equal(Level.warning);
        expect(Level.WARNING).to.equal(Level.warn);
        expect(Level.WARNING == 4).to.be.true;

        expect(Level.INFO).to.equal(Level.info);
        expect(Level.INFO == 3).to.be.true;

        expect(Level.DEBUG).to.equal(Level.debug);
        expect(Level.DEBUG == 2).to.be.true;

        expect(Level.TRACE).to.equal(Level.trace);
        expect(Level.TRACE == 1).to.be.true;

        expect(Level.ALL).to.equal(Level.all);
        expect(Level.ALL == 0).to.be.true;

        expect(Level.OFF).to.equal(Level.off);
        expect(Level.OFF == 6).to.be.true;

        expect(Level.DEBUG).to.not.equal(Level.INFO);
    });

    it("should get the right log level for a string", () => {
        expect(Level.parse("ERROR")).to.equal(Level.error);
        expect(Level.parse("ERR")).to.equal(Level.error);
        expect(Level.parse("error")).to.equal(Level.error);
        expect(Level.parse("err")).to.equal(Level.error);

        expect(Level.parse("WARNING")).to.equal(Level.warn);
        expect(Level.parse("WARN")).to.equal(Level.warn);
        expect(Level.parse("warning")).to.equal(Level.warn);
        expect(Level.parse("warn")).to.equal(Level.warn);

        expect(Level.parse("info")).to.equal(Level.info);
        expect(Level.parse("INFO")).to.equal(Level.info);

        expect(Level.parse("debug")).to.equal(Level.debug);
        expect(Level.parse("DEBUG")).to.equal(Level.debug);

        expect(Level.parse("trace")).to.equal(Level.trace);
        expect(Level.parse("TRACE")).to.equal(Level.trace);
    });

    it("should prioritize levels correctly", () => {
        expect(Level.trace).to.be.lt(Level.debug);
        expect(Level.debug).to.be.lt(Level.info);
        expect(Level.info).to.be.lt(Level.warn);
        expect(Level.warn).to.be.lt(Level.error);
    });

    it("should print level names out properly", () => {
        expect(Level.error.toString()).to.equal("ERROR");
        expect(Level.warn.toString()).to.equal("WARN");
        expect(Level.info.toString()).to.equal("INFO");
        expect(Level.debug.toString()).to.equal("DEBUG");
        expect(Level.trace.toString()).to.equal("TRACE");
    });

    it("should parse various types as proper levels", () => {
        expect(Level.parse("info")).to.equal(Level.info);
        expect(Level.parse(3)).to.equal(Level.info);
        expect(Level.parse(Level.INFO)).to.equal(Level.info);
    });

    it("should allow to use custom logging levels before a logger instance has been created", () => {
        // TODO need to be able to clear current loggers
    });

    it("should throw an error if custom logging levels are set after loggers have been created", () => {
        // TODO need to implement warning, when loggers have been created
    });
});