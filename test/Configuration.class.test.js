"use strict";

var expect = require('chai').expect;

var Configuration = require('../lib/Configuration.class');

describe("Configuration", () => {
    it("should be a configuration object that can have settable properties", () => {
        Configuration.configurators.default = {};
        expect(Configuration.configurators.default).to.be.deep.equal({});
        Configuration.configurators.default = { debug: true };
        expect(Configuration.configurators.default).to.be.deep.equal({ debug: true });

        Configuration.appenders.console = {
            type: 'console',
            color: true,
            processors: 'formatter'
        };
        expect(Configuration.appenders.console).to.be.deep.equal({
            type: 'console',
            color: true,
            processors: 'formatter'
        });
    })
});