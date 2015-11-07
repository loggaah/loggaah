"use strict";

var expect = require('chai').expect;

var Level = require('../lib/Level.class');

describe("Level.class", () => {
    it("should have the same level for different names", () => {
        expect(Level.ERROR).to.be.equal(Level.ERR);
        expect(Level.ERROR).to.be.equal(Level.err);
        expect(Level.ERROR).to.be.equal(Level.error);
        expect(Level.ERROR == 5).to.be.true;

        expect(Level.WARNING).to.be.equal(Level.WARN);
        expect(Level.WARNING).to.be.equal(Level.warning);
        expect(Level.WARNING).to.be.equal(Level.warn);
        expect(Level.WARNING == 4).to.be.true;

        expect(Level.INFO).to.be.equal(Level.info);
        expect(Level.INFO == 3).to.be.true;

        expect(Level.DEBUG).to.be.equal(Level.debug);
        expect(Level.DEBUG == 2).to.be.true;

        expect(Level.TRACE).to.be.equal(Level.trace);
        expect(Level.TRACE == 1).to.be.true;
    });

    it("should get the right log level for a string", () => {
        expect(Level.parse("ERROR")).to.be.equal(Level.error);
        expect(Level.parse("ERR")).to.be.equal(Level.error);
        expect(Level.parse("error")).to.be.equal(Level.error);
        expect(Level.parse("err")).to.be.equal(Level.error);

        expect(Level.parse("WARNING")).to.be.equal(Level.warn);
        expect(Level.parse("WARN")).to.be.equal(Level.warn);
        expect(Level.parse("warning")).to.be.equal(Level.warn);
        expect(Level.parse("warn")).to.be.equal(Level.warn);

        expect(Level.parse("info")).to.be.equal(Level.info);
        expect(Level.parse("INFO")).to.be.equal(Level.info);

        expect(Level.parse("debug")).to.be.equal(Level.debug);
        expect(Level.parse("DEBUG")).to.be.equal(Level.debug);

        expect(Level.parse("trace")).to.be.equal(Level.trace);
        expect(Level.parse("TRACE")).to.be.equal(Level.trace);
    });

    it("should prioritize levels correctly", () => {
        expect(Level.trace).to.be.lt(Level.debug);
        expect(Level.debug).to.be.lt(Level.info);
        expect(Level.info).to.be.lt(Level.warn);
        expect(Level.warn).to.be.lt(Level.error);
    });

    it("should print level names out properly", () => {
        expect(Level.error.toString()).to.be.equal("ERROR");
        expect(Level.warn.toString()).to.be.equal("WARN");
        expect(Level.info.toString()).to.be.equal("INFO");
        expect(Level.debug.toString()).to.be.equal("DEBUG");
        expect(Level.trace.toString()).to.be.equal("TRACE");
    });

    it("should parse various types as proper levels", () => {
        expect(Level.parse("info")).to.be.equal(Level.info);
        expect(Level.parse(3)).to.be.equal(Level.info);
        expect(Level.parse(Level.INFO)).to.be.equal(Level.info);
    })
});