'use strict';

var expect = require('chai').expect;

var Formatter = require('../../lib/processors/Formatter.class');
var Event = require('../../lib/Event.class');
var Level = require('../../lib/Level.class');
var MDC = require('../../lib/MDC.class');


describe("Formatter", () => {
    it("should format a message with a shorter log level", (done) => {
        var formatter = new Formatter();
        formatter.configuration = {
            pattern: '%level{length=3} %m'
        };

        var event = new Event("test/source", Level.INFO, "This is a test");
        formatter.process([event], (events) => {
            expect(events[0].message).to.equal("INF This is a test");
            done();
        });
    });

    it("should format a message using url encoding", (done) => {
        var formatter = new Formatter();
        formatter.configuration = {
            pattern: '%enc{%m}'
        };

        var event = new Event("test/source", Level.INFO, "<test>");
        formatter.process([event], (events) => {
            expect(events[0].message).to.equal("%3Ctest%3E");
            done();
        });
    });

    it("should format including an mdc key", (done) => {
        var formatter = new Formatter();
        formatter.configuration = {
            pattern: '%m %X{test}'
        };

        var mdc = new MDC();
        mdc.set('test', 123);
        var event = new Event("test/source", Level.INFO, "This is a test message", mdc);
        formatter.process([event], (events) => {
            expect(events[0].message).to.equal("This is a test message test=123");
            done();
        });
    });

    it("should format all mdc", (done) => {
        var formatter = new Formatter();
        formatter.configuration = {
            pattern: '%m %X'
        };

        var mdc = new MDC();
        mdc.set('test1', 123);
        mdc.set('test2', 'foo');
        var event = new Event("test/source", Level.INFO, "This is a test message", mdc);
        formatter.process([event], (events) => {
            expect(events[0].message).to.equal("This is a test message test1=123, test2=foo");
            done();
        });
    });

    it("should print out the entire event in a default format", (done) => {
        var formatter = new Formatter();
        formatter.configuration = {
            pattern: '%evt'
        };

        var mdc = new MDC();
        mdc.set('test1', 123);
        var event = new Event("test/source", Level.INFO, "This is a test message", mdc);
        formatter.process([event], (events) => {
            expect(events[0].message).to.equal(event.time.toISOString() + " [INFO] This is a test message test1=123");
            done();
        });
    });

    it("should print out an exception stack", (done) => {
        var formatter = new Formatter();
        formatter.configuration = {
            pattern: '%ex'
        };

        var event = new Event("test/source", Level.INFO, "This is a test message", null, new Error('This is a test'));
        formatter.process([event], (events) => {
            expect(events[0].message).to.include("This is a test")
                .and.to.include("at Context")
                .and.to.include(__filename);
            done();
        });
    });

    it("should print out only the exception message", (done) => {
        var formatter = new Formatter();
        formatter.configuration = {
            pattern: '%ex{short}'
        };

        var event = new Event("test/source", Level.INFO, "This is a test message", null, new Error('This is a test'));
        formatter.process([event], (events) => {
            expect(events[0].message).to.equal("This is a test");
            done();
        });
    });

    it("should print out 1 stack deep", (done) => {
        var formatter = new Formatter();
        formatter.configuration = {
            pattern: '%ex{1}'
        };

        var event = new Event("test/source", Level.INFO, "This is a test message", null, new Error('This is a test'));
        formatter.process([event], (events) => {
            expect(events[0].message).to.include("This is a test");
            expect(events[0].message.match('\n').length).to.equal(1);
            done();
        });
    });

    it("should print how many ms this program has been running", (done) => {
        var formatter = new Formatter();
        formatter.configuration = {
            pattern: '%r'
        };

        var event = new Event("test/source", Level.INFO, "test");
        formatter.process([event], (events) => {
            expect(events[0].message).to.be.within(1, 100000);
            done();
        });
    });

    it("should print a valid uuid", (done) => {
        var formatter = new Formatter();
        formatter.configuration = {
            pattern: '%uuid'
        };

        var event = new Event("test/source", Level.INFO, "test");
        formatter.process([event], (events) => {
            expect(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(events[0].message)).to.be.true;
            done();
        });
    });

    it("should print a message sequence number", (done) => {
        var formatter = new Formatter();
        formatter.configuration = {
            pattern: '%sn'
        };

        var event = new Event("test/source", Level.INFO, "test");
        formatter.process([event], (events) => {
            expect(events[0].message).to.equal('1');
        });
        formatter.process([event], (events) => {
            expect(events[0].message).to.equal('2');
            done();
        });
    });

    it("should print the current process id", (done) => {
        var formatter = new Formatter();
        formatter.configuration = {
            pattern: '%process'
        };

        var event = new Event("test/source", Level.INFO, "test");
        formatter.process([event], (events) => {
            expect(events[0].message).to.equal('' + process.pid);
            done();
        });
    });

    it("should print a %", (done) => {
        var formatter = new Formatter();
        formatter.configuration = {
            pattern: '%%'
        };

        var event = new Event("test/source", Level.INFO, "test");
        formatter.process([event], (events) => {
            expect(events[0].message).to.equal('%');
            done();
        });
    });
});