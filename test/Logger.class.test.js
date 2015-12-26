"use strict";

var expect = require('chai').expect;

var Logger = require('../lib/Logger.class');
var Loggers = require('../lib/Loggers.class');
var Configuration = require('../').configuration;

describe('Logger', () => {
    describe('#appenders', () => {
        it('should not have any appenders starting out', () => {
            var testLog = new Logger();
            expect(testLog.appenders.length).to.be.equal(0);
        });

        it('should be able to have multiple appenders assigned', () => {
            var testLog = new Logger();
            Configuration.appenders.add('mem1', { type: 'memory' });
            Configuration.appenders.add('mem2', {type: 'memory'});
            testLog.addAppender('mem1');
            testLog.addAppender('mem2');
            expect(testLog.appenders.length).to.be.equal(2);
            expect(testLog.hasAppender('mem1'));
            expect(testLog.hasAppender('mem2'));
        });

        it('should be able to have an appender removed', () => {
            var testLog = new Logger();
            Configuration.appenders.add('mem1', {type: 'memory'});
            testLog.addAppender('mem1');
            expect(testLog.appenders.length).to.be.equal(1);
            testLog.removeAppender('mem1');
            expect(testLog.appenders.length).to.be.equal(0);
        });

        it('should get an appender assigned when changing configuration', () => {
            var testLog = Loggers.__get('testLog');
            Configuration.appenders.add('mem1', { type: 'memory' });
            testLog.addAppender('mem1');
            expect(testLog.appenders.length).to.be.equal(1);
            expect(testLog.hasAppender('mem1').type).to.be.equal('memory');
            Configuration.appenders.mem1 = { type: 'console' };
            expect(testLog.hasAppender('mem1').type).to.be.equal('console');
        });
    });
});
