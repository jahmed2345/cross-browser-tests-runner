'use strict';

var
  expect = require('chai').expect,
  Platform = require('./../../../../../lib/platforms/interfaces/platform').Platform

describe('Platform', function() {

  describe('open', function() {
    it('should throw an error', function() {
      var tester = function() { (new Platform()).open() }
      expect(tester).to.throw(Error)
    })
  })

  describe('run', function() {
    it('should throw an error', function() {
      var tester = function() { (new Platform()).run() }
      expect(tester).to.throw(Error)
    })
  })

  describe('runMultiple', function() {
    it('should throw an error', function() {
      var tester = function() { (new Platform()).runMultiple() }
      expect(tester).to.throw(Error)
    })
  })

  describe('runScript', function() {
    it('should throw an error', function() {
      var tester = function() { (new Platform()).runScript() }
      expect(tester).to.throw(Error)
    })
  })

  describe('runScriptMultiple', function() {
    it('should throw an error', function() {
      var tester = function() { (new Platform()).runScriptMultiple() }
      expect(tester).to.throw(Error)
    })
  })

  describe('stop', function() {
    it('should throw an error', function() {
      var tester = function() { (new Platform()).stop() }
      expect(tester).to.throw(Error)
    })
  })

  describe('status', function() {
    it('should throw an error', function() {
      var tester = function() { (new Platform()).status() }
      expect(tester).to.throw(Error)
    })
  })

  describe('close', function() {
    it('should throw an error', function() {
      var tester = function() { (new Platform()).close() }
      expect(tester).to.throw(Error)
    })
  })

})
