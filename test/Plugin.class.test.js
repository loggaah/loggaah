/* global describe, it, beforeEach, afterEach */
'use strict';

var expect = require('chai').expect;

var Plugins = require('../lib/Plugins.class');

describe('Plugin', () => {
    describe('Interface', () => {
        it('should return the type of the plugin if no id was given', () => {
            class TestPlugin extends Plugins.interfaces.Configurator {
                constructor() {
                    super();
                }
            }

            var instance = new TestPlugin();
            expect(instance.id).to.equal('TestPlugin')
        });
    });
});
