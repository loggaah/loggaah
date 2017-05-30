/* global describe, it, beforeEach, afterEach */
const expect = require('chai').expect;

const loggaah = require('../');


describe("loggaah", () => {
    beforeEach(loggaah.reset);

    describe('Setup', () => {
        it('should have all types of plugins loaded', () => {
            let plugins = loggaah.Plugins.registered;
            let interfaces = loggaah.Plugins.interfaces;
            expect(plugins.appenders.Console.prototype).to.be.instanceof(interfaces.Appender);
            expect(plugins.appenders.File.prototype).to.be.instanceof(interfaces.Appender);
            expect(plugins.appenders.Memory.prototype).to.be.instanceof(interfaces.Appender);
            expect(plugins.configurators.Arguments.prototype).to.be.instanceof(interfaces.Configurator);
            expect(plugins.configurators.Default.prototype).to.be.instanceof(interfaces.Configurator);
            expect(plugins.configurators.Json.prototype).to.be.instanceof(interfaces.Configurator);
            expect(plugins.processors.Batcher.prototype).to.be.instanceof(interfaces.Processor);
            expect(plugins.processors.Constants.prototype).to.be.instanceof(interfaces.Processor);
            expect(plugins.processors.Filter.prototype).to.be.instanceof(interfaces.Processor);
            expect(plugins.processors.Formatter.prototype).to.be.instanceof(interfaces.Processor);
        });

        it('should have a default configuration loaded', () => {
            expect(Object.keys(loggaah.Plugins.instances.appenders).length).to.equal(1);
            expect(Object.keys(loggaah.Plugins.instances.processors).length).to.equal(1);
            expect(Object.keys(loggaah.Plugins.instances.configurators).length).to.be.gte(3);
        });
    });

    describe('Examples', () => {
        it('should create a simple logger with reasonable default values', () => {
            let log = loggaah.getLogger();
            expect(log.name).to.equal('loggaah.test.js');
            expect(log.info).to.be.a('function');
            let event = log.info('Hello World!');
            expect(event.message).to.equal('Hello World!');
            expect(event.getLevel().toString()).to.equal('INFO');
            // TODO logging doesn't occur because no rules on the Core module have been found that apply a config
        });
    });
});
