"use strict";

var expect = require('chai').expect;

var loggaah = require('../');
var Level = require('../').Level;
var MDC = require('../').MDC;
var Event = require('../lib/Event.class');

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
            expect(testLog.process).to.be.equal(process.pid);

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

    describe("#level()", () => {
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

    describe("#log()", () => {
        it('should log multiple levels', () => {
            function checkEvents(events, level, message) {
                expect(events.length).to.be.equal(1);
                expect(events[0]).to.be.instanceof(Event);
                expect(events[0].level).to.be.equal(level);
                expect(events[0].message).to.be.equal(message);
                return events[0];
            }

            var testLog = loggaah.getLogger({ capture: true });
            var error = new Error();
            var mdc = new MDC();
            var event;

            testLog.error("1");
            checkEvents(testLog.captured, Level.error, "1");
            testLog.err(2);
            checkEvents(testLog.captured, Level.error, "2");
            testLog.ERROR("%s", 3);
            checkEvents(testLog.captured, Level.error, "3");
            testLog.ERR(4, 5);
            checkEvents(testLog.captured, Level.error, "4 5");

            testLog.warn(6);
            checkEvents(testLog.captured, Level.warn, "6");
            testLog.warning(7);
            checkEvents(testLog.captured, Level.warn, "7");
            testLog.WARN({ test: 8 });
            checkEvents(testLog.captured, Level.warn, "{ test: 8 }");
            testLog.WARNING(9);
            checkEvents(testLog.captured, Level.warn, "9");

            testLog.info(10, error);
            expect(checkEvents(testLog.captured, Level.info, "10").error).to.be.equal(error);
            testLog.INFO(11, mdc);
            expect(checkEvents(testLog.captured, Level.info, "11").mdc).to.be.deep.equal(mdc);

            testLog.debug(12, error, mdc);
            event = checkEvents(testLog.captured, Level.debug, "12");
            expect(event.error).to.be.equal(error);
            expect(event.mdc).to.be.equal(mdc);
            testLog.DEBUG(13, mdc, error);
            event = checkEvents(testLog.captured, Level.debug, "13");
            expect(event.error).to.be.equal(error);
            expect(event.mdc).to.be.equal(mdc);

            testLog.trace(14);
            expect(testLog.captured).to.be.empty;
            testLog.level = Level.trace;
            testLog.trace(15);
            checkEvents(testLog.captured, Level.trace, "15");
            testLog.TRACE(16);
            checkEvents(testLog.captured, Level.trace, "16");
        });

        it("should format correctly", () => {
            var testLog = loggaah.getLogger();
            testLog.capture = true;
            testLog.log("%s test rendering json: %j", "first", { test: "value" });
            expect(testLog.captured[0].message).to.be.equal('first test rendering json: {"test":"value"}');
            expect(testLog.capture).to.be.true;
        });
    });
});