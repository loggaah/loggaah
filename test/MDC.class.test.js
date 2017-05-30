/* global describe, it, beforeEach, afterEach */
const expect = require('chai').expect;

const MDC = require('../').MDC;


describe("MDC", () => {
    it("should store properties", () => {
        let mdc = new MDC();
        mdc.set("test", "value");
        expect(mdc.get("test")).to.be.equal("value");
    });

    it("should remove properties", () => {
        let mdc = new MDC();
        mdc.set("test", "value");
        mdc.delete("test");
        expect(mdc.get("test")).to.be.not.ok;
    });

    it("should clear MDC", () => {
        let mdc = new MDC();
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
            let mdc = new MDC();
            mdc.set("test", { value1: "val1" });
            mdc.merge({ test: { value2: "val2" } });
            expect(mdc.get("test")).to.be.deep.equal({
                value1: "val1",
                value2: "val2"
            });
        });

        it("should merge two object values", () => {
            let mdc = new MDC();
            mdc.set("test", {value1: "val1"});
            mdc.merge("test", {value2: "val2"});
            expect(mdc.get("test")).to.be.deep.equal({
                value1: "val1",
                value2: "val2"
            });
        });

        it("should merge two array properties", () => {
            let mdc = new MDC();
            mdc.set("test", [ "value1" ]);
            mdc.merge({test: [ "value2" ]});
            expect(mdc.get("test")).to.be.deep.equal([ "value1", "value2" ]);
        });

        it("should merge two array values", () => {
            let mdc = new MDC();
            mdc.set("test", [ "value1" ]);
            mdc.merge("test", [ "value2" ]);
            expect(mdc.get("test")).to.be.deep.equal([ "value1", "value2" ]);
        });

        it("should merge two array properties", () => {
            let mdc = new MDC();
            mdc.set("test", ["value1"]);
            mdc.merge({test: ["value2"]});
            expect(mdc.get("test")).to.be.deep.equal(["value1", "value2"]);
        });

        it("should merge a string with an array value", () => {
            let mdc = new MDC();
            mdc.set("test", ["value1"]);
            mdc.merge("test", "value2");
            expect(mdc.get("test")).to.be.deep.equal(["value1", "value2"]);
        });

        it("should merge a primitive with an array property", () => {
            let mdc = new MDC();
            mdc.set("test", ["value1"]);
            mdc.merge({test: "value2"});
            expect(mdc.get("test")).to.be.deep.equal(["value1", "value2"]);
        });

        it("should throw an error if the previous value is not an object or array", () => {
            let mdc = new MDC();
            mdc.set("test", "value1");
            mdc.merge({test: ["value2"]});
            expect(mdc.get("test")).to.be.deep.equal(["value1", "value2"]);
        });

        it("should do nothing with an empty value", () => {
            let mdc = new MDC();
            mdc.set("test", ["value1"]);
            mdc.merge("test");
            expect(mdc.get("test")).to.be.deep.equal(["value1"]);
        });

        it("should do nothing with an empty property", () => {
            let mdc = new MDC();
            mdc.set("test", ["value1"]);
            mdc.merge({test2: "value2"});
            expect(mdc.get("test")).to.be.deep.equal(["value1"]);
        });

        it("should append complex objects", () => {
            let mdc = new MDC();
            mdc.merge("test", { value1: { subval: "val1" }});
            mdc.merge("test", { value2: { subval: "val2" }});
            expect(mdc.get("test")).to.be.deep.equal({
                value1: { subval: "val1"},
                value2: { subval: "val2"}
            });
        });

        it("should append nested objects", () => {
            let mdc = new MDC();
            mdc.merge("test", {value1: {subval: "val1"}});
            mdc.merge("test", {value1: {subval: "val2"}});
            expect(mdc.get("test")).to.be.deep.equal({
                value1: {subval: ["val1", "val2"]}
            });
        });
    });
});
