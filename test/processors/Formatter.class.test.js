"use strict";

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
        formatter.process(event, (event) => {
            expect(event.message).to.equal("INF This is a test");
            done();
        });
    });

    it("should format a message using url encoding", (done) => {
        var formatter = new Formatter();
        formatter.configuration = {
            pattern: '%enc{%m}'
        };

        var event = new Event("test/source", Level.INFO, "<test>");
        formatter.process(event, (event) => {
            expect(event.message).to.equal("%3Ctest%3E");
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
        formatter.process(event, (event) => {
            expect(event.message).to.equal("This is a test message test=123");
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
        formatter.process(event, (event) => {
            expect(event.message).to.equal("This is a test message test1=123, test2=foo");
            done();
        });
    });
});