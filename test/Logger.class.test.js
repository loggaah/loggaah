'use strict';

var path = require('path');

var expect = require('chai').expect;

var Level = require('../lib/Level.class');
var Logger = require('../lib/Logger.class');


describe('Logger', () => {
    describe('#appenders', () => {
        it('should be able to have multiple appenders assigned', () => {
            var testLog = new Logger('1');
            testLog.setAppender('mem1', {type: 'MemoryAppender'});
            testLog.setAppender('mem2', {type: 'MemoryAppender'});
            expect(testLog.listAppenders().length).to.be.equal(2);
            expect(testLog.listAppenders()).contains('mem1');
            expect(testLog.listAppenders()).contains('mem2');
        });

        it('should be able to have an appender removed', () => {
            var testLog = new Logger('2');
            testLog.setAppender('mem1', {type: 'MemoryAppender'});
            expect(testLog.listAppenders().length).to.be.equal(1);
            testLog.removeAppender('mem1');
            expect(testLog.listAppenders().length).to.be.equal(0);
        });

        it('should get an appender assigned when changing configuration', () => {
            var testLog = new Logger('testLog');
            testLog.setAppender('app1', {type: 'MemoryAppender'});
            expect(testLog.listAppenders().length).to.equal(1);
            testLog.setAppender('app1', {type: 'ConsoleAppender'});
            expect(testLog.setAppender('app1').constructor.name).to.equal('ConsoleAppender');
        });

        it("should return a default logger instance", () => {
            var testLog = new Logger("testDefault");

            expect(testLog).to.be.an.object;
            expect(testLog.error).to.be.a('function');
            expect(testLog.warn).to.be.a('function');
            expect(testLog.info).to.be.a('function');
            expect(testLog.debug).to.be.a('function');
            expect(testLog.trace).to.be.a('function');
            expect(testLog.log).to.be.a('function');
            expect(testLog.process).to.be.equal(process.pid);

            expect(testLog.level).to.be.equal(Level.info);
            expect(testLog.enabled).to.be.a('function');
            expect(testLog.enabled(Level.error)).to.be.true;
            expect(testLog.enabled(Level.warn)).to.be.true;
            expect(testLog.enabled(Level.info)).to.be.true;
            expect(testLog.enabled(Level.debug)).to.be.false;
            expect(testLog.enabled(Level.trace)).to.be.false;

            expect(testLog.name).to.equal('testDefault');
        });

        it("should throw an exception if you're trying to create the same logger twice", () => {
            new Logger("test1");
            try {
                new Logger("test1");
                expect.fail('Expected to see error thrown');
            } catch (e) {
                expect(e).to.be.instanceof(Error)
            }
        });

        it("should return a logger with the path of this file", () => {
            var testLog = new Logger();

            expect(testLog).to.be.an.object;
            expect(testLog.name).to.be.equal(path.basename(__filename));
        });
    });

    describe('#level', () => {
        it("should get the default logger with a configuration parameter", () => {
            var testLog = new Logger('test2', {
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

        it("should change the log level dynamically directly on the logger", () => {
            var testLog = new Logger('test3');

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
});
