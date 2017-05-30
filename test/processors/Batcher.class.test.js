/* global describe, it, beforeEach, afterEach */
const expect = require('chai').expect;

const Batcher = require('../../lib/processors/Batcher.class');
const Event = require('../../lib/Event.class');
const Level = require('../../lib/Level.class');


describe('Batcher', () => {
    it('should batch 10 messages and then pass them on', (done) => {
        let batcher = new Batcher();
        batcher.configuration = {
            size: 10
        };

        for (let i = 0; i <= 10 ; i++) {
            batcher.process([new Event('test/source').level(1).param(i)], (events) => {
                expect(events.length).to.equal(10);
                expect(events[0].message).to.equal('0');
                expect(events[1].message).to.equal('1');
                done();
            });
        }
    });

    it('should send all batched messages in an interval', (done) => {
        let batcher = new Batcher();
        batcher.configuration = {
            interval: 10
        };

        for (let i = 0; i < 3; i++) {
            batcher.process([new Event('test/source', Level.INFO, i)], (events) => {
                expect(events.length).to.equal(3);
                done();
            });
        }
    });

    it("should send batched messages before the timeout hits", (done) => {
        let batcher = new Batcher();
        batcher.configuration = {
            size: 10,
            interval: 10
        };

        let calls = 0;
        for (let i = 0; i <= 10; i++) {
            batcher.process([new Event('test/source', Level.INFO, i)], (events) => {
                calls++;
                // Batch size reached call
                if (calls == 1) {
                    expect(events.length).to.equal(10);
                }
                // Timeout reached call
                if (calls == 2) {
                    expect(events.length).to.equal(1);
                    done();
                }
            });
        }
    });
});
