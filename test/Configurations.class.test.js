"use strict";

var expect = require('chai').expect;

var Configurations = require('../').Configurations;
var DefaultConfigurator = require('../lib/configurators/DefaultConfigurator.class');
var JsonConfigurator = require('../lib/configurators/JsonConfigurator.class');

describe('Configurations.class', function() {
    it("Should check if any Configurators are registered", function() {
        expect(Configurations.getConfigurator('default')).to.be.deep.equal(DefaultConfigurator);
        expect(Configurations.getConfigurator('json')).to.be.deep.equal(JsonConfigurator);
    });
});