'use strict'

let
  retry = require('p-retry'),
  utils = require('./../../core/utils'),
  ScriptJobBase = require('./../core/scriptjob').ScriptJob,
  Values = require('./values').Values

const VARS = {
  server: 'http://hub-cloud.browserstack.com/wd/hub',
  sessionApiUrl: 'https://www.browserstack.com/automate/sessions/{session}.json',
  username: process.env.BROWSERSTACK_USERNAME,
  accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
  status: {
    done: 'stopped',
    running: 'running',
    passed: 'stopped',
    failed: 'stopped'
  }
}

class ScriptJob extends ScriptJobBase {

  constructor(url, browser, capabilities) {
    capabilities = capabilities || { }
    utils.buildParams(capabilities)
    let vRet = Values.selenium(browser || { }, capabilities)
    vRet.capabilities['browserstack.user'] = VARS.username
    vRet.capabilities['browserstack.key'] = VARS.accessKey
    super(VARS.server, url, vRet.browser, vRet.capabilities)
  }

  create() {
    const iteration = () => {
      return ScriptJobBase.prototype.create.call(this)
      .catch(err => {
        if(err.message.match(/ETIMEDOUT/)) {
          throw err
        }
        throw new retry.AbortError(err.message)
      })
    }
    return retry(iteration, { retries: 5, minTimeout: 1000, factor: 2 })
  }

  markStatus(decider) {
    return ScriptJobBase.prototype.markStatus.apply(this, [
      decider,
      VARS.sessionApiUrl.replace(/{session}/, this.session),
      'PUT',
      markReqOptions
    ])
  }

  status() {
    return ScriptJobBase.prototype.status.apply(this, [
      VARS.sessionApiUrl.replace(/{session}/, this.session),
      getOptions,
      (response) => {
        return VARS.status[response.automation_session.status]
      }
    ])
  }

  hasScreenshotOption() {
    return ('browserstack.debug' in this.options)
  }

}

function markReqOptions(status) {
  return {
    json: true,
    resolveWithFullResponse: true,
    body: {
      status: status
    },
    auth: {
      user: VARS.username,
      pass: VARS.accessKey
    }
  }
}

function getOptions() {
  return {
    json: true,
    auth: {
      user: VARS.username,
      pass: VARS.accessKey
    }
  }
}

exports.ScriptJob = ScriptJob
exports.ScriptJobVars = VARS
