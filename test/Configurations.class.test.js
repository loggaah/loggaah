"use strict";

var expect = require('chai').expect;

var Configurations = require('../').Configurations;
var DefaultConfigurator = require('../lib/configurators/DefaultConfigurator.class');
var JsonConfigurator = require('../lib/configurators/JsonConfigurator.class');

describe('Configurations.class', function() {
    it("Should check if any Configurators are registered", function() {
        var configurationList = Configurations.list();
        expect(configurationList.length).to.be.equal(2);
        expect(configurationList[0]).to.be.equal(DefaultConfigurator);
        expect(configurationList[1]).to.be.equal(JsonConfigurator);
    });
});