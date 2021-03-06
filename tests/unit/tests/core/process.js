'use strict';

var
  path = require('path'),
  ps = require('ps-node'),
  chai = require('chai'),
  chaiAsPromised = require('chai-as-promised'),
  Process = require('./../../../../lib/core/process').Process,
  utils = require('./utils')

chai.use(chaiAsPromised)

var
  expect = chai.expect,
  should = chai.should()

function procExit(code, signal) {
  expect(code).to.equal(0)
  expect(signal).to.be.undefined
}

describe('Process', function() {

  describe('create', function() {

    var proc
    this.timeout(0)

    it('should throw an error while using a non-existent executable', function() {
      proc = new Process()
      return proc.create('abc', [ ])
      .catch(error => {
        expect(error.code).to.not.be.undefined
        expect(error.code).to.equal('ENOENT')
        expect(error.syscall).to.not.be.undefined
        expect(error.syscall).to.equal('spawn abc')
      })
      .should.be.fulfilled
    })

    it('should throw an error when executable does not have execute permissions', function() {
      proc = new Process()
      var exe = path.resolve(process.cwd(), 'tests', 'unit', 'utils', 'sample.js')
      return proc.create(exe, [ ])
      .catch(error => {
        expect(error.code).to.not.be.undefined
        expect(error.code).to.be.oneOf(['EACCES', 'UNKNOWN'])
        expect(error.syscall).to.not.be.undefined
        expect(error.syscall).to.equal('spawn')
      })
      .should.be.fulfilled
    })

    it('should create a process with a valid executable with execute permissions', function() {
      var args = [ path.resolve(process.cwd(), 'tests', 'unit', 'utils', 'sample.js') ]
      proc = new Process()
      return proc.create('node', args, {
        onstdout: stdout => {
          expect(stdout).to.contain('sample process')
        }
      })
      .then((code, signal) => {
        expect(proc.pid).to.not.be.undefined
        procExit(code, signal)
      })
      .should.be.fulfilled
    })

    it('should work without providing "onstdout" handler while using a valid executable with execute permissions', function() {
      var args = [ path.resolve(process.cwd(), 'tests', 'unit', 'utils', 'sample.js') ]
      proc = new Process()
      return proc.create('node', args)
      .then((code, signal) => {
        expect(proc.pid).to.not.be.undefined
        procExit(code, signal)
      })
      .should.be.fulfilled
    })

    it('should execute "onstderr" handler and receive expected stderr output while using a valid executable with execute permissions', function() {
      var args = [ path.resolve(process.cwd(), 'tests', 'unit', 'utils', 'sample-stderr.js') ]
      proc = new Process()
      return proc.create('node', args, {
        onstderr: stderr => {
          expect(stderr).to.contain('sample process stderr')
        }
      })
      .then((code, signal) => {
        expect(proc.pid).to.not.be.undefined
        procExit(code, signal)
      })
      .should.be.fulfilled
    })

    it('should work without providing "onstderr" handler while using a valid executable with execute permissions', function() {
      var args = [ path.resolve(process.cwd(), 'tests', 'unit', 'utils', 'sample-stderr.js') ]
      proc = new Process()
      return proc.create('node', args)
      .then((code, signal) => {
        expect(proc.pid).to.not.be.undefined
        procExit(code, signal)
      })
      .should.be.fulfilled
    })

  })

  describe('status', function() {

    var proc
    this.timeout(0)

    it('should fail when no pid is associated with the Process object which happens when the process is not created yet', function() {
      proc = new Process()
      function tester() {
        proc.status()
      }
      expect(tester).to.throw(Error)
    })

    it('should say "running" for a running process', function() {
      return utils.procsByCmd('node')
      .then(list => {
        expect(list.length).to.be.at.least(1)
        proc = new Process(list[0].pid)
        expect(proc.status()).to.equal('running')
      })
      .should.be.fulfilled
    })

    it('should say "stopped" for a process that ran and stopped', function() {
      proc = new Process()
      var args = [ path.resolve(process.cwd(), 'tests', 'unit', 'utils', 'sample.js') ]
      return proc.create('node', args, {
        onstdout: stdout => {
          expect(stdout).to.contain('sample process')
        }
      })
      .then((code, signal) => {
        expect(proc.pid).to.not.be.undefined
        expect(proc.status()).to.equal('stopped')
        procExit(code, signal)
      })
      .should.be.fulfilled
    })

  })

  describe('stop', function() {

    var proc
    this.timeout(0)

    it('should fail when no pid is associated which happens when the process is not created yet', function() {
      proc = new Process()
      return proc.stop()
      .should.be.rejectedWith('Process: no pid associated to stop')
    })

    it('should fail to stop a stopped process again with the error "already stopped"', function() {
      var args = [ path.resolve(process.cwd(), 'tests', 'unit', 'utils', 'sample.js') ]
      proc = new Process()
      return proc.create('node', args, {
        onstdout: stdout => {
          expect(stdout).to.contain('sample process')
        }
      })
      .then((code, signal) => {
        expect(proc.pid).to.not.be.undefined
        procExit(code, signal)
        return proc.stop()
      })
      .should.be.rejectedWith('Process: already stopped')
    })

    it('should fail to stop an externally created process as per design where we stay safe from touching processes on the system not created by cross-browser-tests-runner', function() {
      return utils.procsByCmd('node')
      .then(list => {
        for(var i = 0; i < list.length; ++i) {
          var p = list[i]
          if(p.arguments.toString().match(/wait.js/)) {
            proc = new Process(p)
            expect(proc.pid).to.not.be.undefined
            return proc.stop()
          }
        }
        throw new Error('Process: cannot kill external process')
      })
      .should.be.rejectedWith('Process: cannot kill external process')
    })

    it('should stop a process created', function() {
      proc = new Process()
      var args = [ path.resolve(process.cwd(), 'tests', 'unit', 'utils', 'wait.js') ]
      proc.create('node', args)
      .then((code, signal) => {
        expect(proc.pid).to.not.be.undefined
      })
      return proc.stop().should.be.fulfilled
    })

  })
})
