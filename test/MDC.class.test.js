/* global describe, it, beforeEach, afterEach */
'use strict';

var expect = require('chai').expect;

var MDC = require('../').MDC;

describe("MDC", () => {
    it("should store properties", () => {
        var mdc = new MDC();
        mdc.set("test", "value");
        expect(mdc.get("test")).to.be.equal("value");
    });

    it("should remove properties", () => {
        var mdc = new MDC();
        mdc.set("test", "value");
        mdc.delete("test");
        expect(mdc.get("test")).to.be.not.ok;
    });

    it("should clear MDC", () => {
        var mdc = new MDC();
        mdc.set("test1", "value1");
        mdc.set("test2", "value2");
        expect(mdc.length).to.be.equal(2);
        expect(mdc.size).to.be.equal(2);
        mdc.clear();
        expect(mdc.length).to.be.equal(0);
        expect(mdc.size).to.be.equal(0);
        expect(mdc.empty).to.be.true;
    });

    describe("#merge()", () => {
        it("should merge two object properties", () => {
            var mdc = new MDC();
            mdc.set("test", { value1: "val1" });
            mdc.merge({ test: { value2: "val2" } });
            expect(mdc.get("test")).to.be.deep.equal({
                value1: "val1",
                value2: "val2"
            });
        });

        it("should merge two object values", () => {
            var mdc = new MDC();
            mdc.set("test", {value1: "val1"});
            mdc.merge("test", {value2: "val2"});
            expect(mdc.get("test")).to.be.deep.equal({
                value1: "val1",
                value2: "val2"
            });
        });

        it("should merge two array properties", () => {
            var mdc = new MDC();
            mdc.set("test", [ "value1" ]);
            mdc.merge({test: [ "value2" ]});
            expect(mdc.get("test")).to.be.deep.equal([ "value1", "value2" ]);
        });

        it("should merge two array values", () => {
            var mdc = new MDC();
            mdc.set("test", [ "value1" ]);
            mdc.merge("test", [ "value2" ]);
            expect(mdc.get("test")).to.be.deep.equal([ "value1", "value2" ]);
        });

        it("should merge two array properties", () => {
            var mdc = new MDC();
            mdc.set("test", ["value1"]);
            mdc.merge({test: ["value2"]});
            expect(mdc.get("test")).to.be.deep.equal(["value1", "value2"]);
        });

        it("should merge a string with an array value", () => {
            var mdc = new MDC();
            mdc.set("test", ["value1"]);
            mdc.merge("test", "value2");
            expect(mdc.get("test")).to.be.deep.equal(["value1", "value2"]);
        });

        it("should merge a primitive with an array property", () => {
            var mdc = new MDC();
            mdc.set("test", ["value1"]);
            mdc.merge({test: "value2"});
            expect(mdc.get("test")).to.be.deep.equal(["value1", "value2"]);
        });

        it("should throw an error if the previous value is not an object or array", () => {
            var mdc = new MDC();
            mdc.set("test", "value1");
            mdc.merge({test: ["value2"]});
            expect(mdc.get("test")).to.be.deep.equal(["value1", "value2"]);
        });

        it("should do nothing with an empty value", () => {
            var mdc = new MDC();
            mdc.set("test", ["value1"]);
            mdc.merge("test");
            expect(mdc.get("test")).to.be.deep.equal(["value1"]);
        });

        it("should do nothing with an empty property", () => {
            var mdc = new MDC();
            mdc.set("test", ["value1"]);
            mdc.merge({test2: "value2"});
            expect(mdc.get("test")).to.be.deep.equal(["value1"]);
        });

        it("should append complex objects", () => {
            var mdc = new MDC();
            mdc.merge("test", { value1: { subval: "val1" }});
            mdc.merge("test", { value2: { subval: "val2" }});
            expect(mdc.get("test")).to.be.deep.equal({
                value1: { subval: "val1"},
                value2: { subval: "val2"}
            });
        });

        it("should append nested objects", () => {
            var mdc = new MDC();
            mdc.merge("test", {value1: {subval: "val1"}});
            mdc.merge("test", {value1: {subval: "val2"}});
            expect(mdc.get("test")).to.be.deep.equal({
                value1: {subval: ["val1", "val2"]}
            });
        });
    });
});
