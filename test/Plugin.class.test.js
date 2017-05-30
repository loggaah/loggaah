/* global describe, it, beforeEach, afterEach */
const expect = require('chai').expect;

const Plugins = require('../lib/Plugins.class');


describe('Plugin', () => {
    describe('Interface', () => {
        it('should return the type of the plugin if no id was given', () => {
            class TestPlugin extends Plugins.interfaces.Configurator {
                constructor() {
                    super();
                }
            }

            let instance = new TestPlugin();
            expect(instance.id).to.equal('TestPlugin');
        });
    });
});
