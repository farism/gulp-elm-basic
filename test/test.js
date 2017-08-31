/* global describe, it */

const expect = require('chai').expect
const assert = require('stream-assert')
const File = require('vinyl')
const fs = require('fs')
const path = require('path')

const elm = require('../')
const output = require('./fixture/Main')

const fixture = function(glob) {
  return path.join(__dirname, 'fixture', glob)
}

describe('gulp-elm-basic', function() {
  let stream

  beforeEach(function() {
    stream = elm({ cwd: path.join(__dirname, 'fixture') })
  })

  it('should work in buffer mode', function(done) {
    this.timeout(6000000)

    function assertContents(index, contents) {
      return assert.first(function(dep) {
        expect(dep.path).to.eql('Main.js')
      })
    }

    stream.pipe(assertContents(0, output)).pipe(assert.end(done))
    stream.write(
      new File({
        path: fixture('Main.elm'),
        contents: Buffer('Main.elm'),
      })
    )
    stream.on('error', e => {
      console.log(e)
    })
    stream.end()
  })

  it('should emit error on streamed file', done => {
    stream
      .once('error', function(err) {
        expect(err.message).to.eql('gulp-elm-basic: Streaming not supported')
      })
      .pipe(assert.end(done))
    stream.write({
      isNull: function() {
        return false
      },
      isStream: function() {
        return true
      },
    })
    stream.end()
  })

  it('should emit error if elm compile fails', function(done) {
    this.timeout(6000000)

    stream
      .once('error', function(err) {
        expect(err.message).to.equal('gulp-elm-basic: error')
      })
      .pipe(assert.end(done))
    stream.write(
      new File({
        path: fixture('MainBADPATH.elm'),
        contents: Buffer(''),
      })
    )
    stream.end()
  })

  it('should ignore null files', function(done) {
    stream.pipe(assert.length(0)).pipe(assert.end(done))
    stream.write(new File())
    stream.end()
  })
})
