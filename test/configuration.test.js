var configuration = require('../lib/Configuration.class');
var expect = require('chai').expect;

describe("Configuration", function() {
    describe("#get()", function() {
        it("should return the default configuration", function() {
            var configurationObject = configuration.get();
            expect(configurationObject).to.be.deep.equal(require('./data/default.config.json'));
        });
    });

    describe("Appenders", function () {
        describe("#list()", function () {

        });

        describe("#get()", function () {

        });

        describe("#set()", function () {

        });
    });

    describe("Processors", function () {
        describe("#list()", function () {

        });

        describe("#get()", function () {

        });

        describe("#set()", function () {

        });
    });
});