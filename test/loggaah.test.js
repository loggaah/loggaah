"use strict";

var expect = require('chai').expect;

var loggaah = require("..");
var Level = require("..").Level;

describe("loggaah", () => {
    describe("instance", () => {
        it("should return a default logger instance", () => {
            var testLog = loggaah.getLogger("test");

            expect(testLog).to.be.an.object;
            expect(testLog.error).to.be.a.function;
            expect(testLog.warn).to.be.a.function;
            expect(testLog.info).to.be.a.function;
            expect(testLog.debug).to.be.a.function;
            expect(testLog.trace).to.be.a.function;
            expect(testLog.log).to.be.a.function;

            expect(testLog.level).to.be.equal(Level.info);
            expect(testLog.enabled).to.be.a.function;
            expect(testLog.enabled(Level.error)).to.be.true;
            expect(testLog.enabled(Level.warn)).to.be.true;
            expect(testLog.enabled(Level.info)).to.be.true;
            expect(testLog.enabled(Level.debug)).to.be.false;
            expect(testLog.enabled(Level.trace)).to.be.false;

            expect(testLog.name).to.be.a.function;
            expect(testLog.config).to.be.a.function;
        });

        it("should return the same logger instance every time", () => {
            var test1Log = loggaah.getLogger("test1");
            var test2Log = loggaah.getLogger("test1");
            expect(test1Log).to.be.deep.equal(test2Log);
        });

        it("should return a logger with the path of this file", () => {
            var testLog = loggaah.getLogger();

            expect(testLog).to.be.an.object;
            expect(testLog.name).to.be.equal("loggaah.test.js");
        });
    });

    describe("level", () => {
        it("should get the default logger with a configuration parameter", () => {
            var testLog = loggaah.getLogger({
                level: 'debug'
            });

            expect(testLog).to.be.an.object;
            expect(testLog.enabled).to.be.an.object;
            expect(testLog.level).to.be.equal(Level.debug);
            expect(testLog.enabled(Level.error)).to.be.true;
            expect(testLog.enabled(Level.warn)).to.be.true;
            expect(testLog.enabled(Level.info)).to.be.true;
            expect(testLog.enabled(Level.debug)).to.be.true;
            expect(testLog.enabled(Level.trace)).to.be.false;
        });

        it("should change the log level dynamically on a global level", () => {
            var testLog = loggaah.getLogger("test2");

            expect(testLog).to.be.an.object;
            expect(testLog.enabled).to.be.an.object;
            expect(testLog.level).to.be.equal(Level.info);
            expect(testLog.enabled(Level.error)).to.be.true;
            expect(testLog.enabled(Level.warn)).to.be.true;
            expect(testLog.enabled(Level.info)).to.be.true;
            expect(testLog.enabled(Level.debug)).to.be.false;
            expect(testLog.enabled(Level.trace)).to.be.false;

            loggaah.setLogger('test2', {
                level: 'debug'
            });
            expect(testLog.level).to.be.equal(Level.debug);
            expect(testLog.enabled(Level.error)).to.be.true;
            expect(testLog.enabled(Level.warn)).to.be.true;
            expect(testLog.enabled(Level.info)).to.be.true;
            expect(testLog.enabled(Level.debug)).to.be.true;
            expect(testLog.enabled(Level.trace)).to.be.false;
        });

        it("should change the log level dynamically directly on the logger", () => {
            var testLog = loggaah.getLogger('test3');

            expect(testLog).to.be.an.object;
            expect(testLog.level).to.be.equal(Level.info);
            expect(testLog.enabled(Level.error)).to.be.true;
            expect(testLog.enabled(Level.warn)).to.be.true;
            expect(testLog.enabled(Level.info)).to.be.true;
            expect(testLog.enabled(Level.debug)).to.be.false;
            expect(testLog.enabled(Level.trace)).to.be.false;

            testLog.config = {
                level: 'debug'
            };
            expect(testLog.level).to.be.equal(Level.debug);
            expect(testLog.enabled(Level.error)).to.be.true;
            expect(testLog.enabled(Level.warn)).to.be.true;
            expect(testLog.enabled(Level.info)).to.be.true;
            expect(testLog.enabled(Level.debug)).to.be.true;
            expect(testLog.enabled(Level.trace)).to.be.false;
        });
    });
});