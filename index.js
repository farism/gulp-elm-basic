const elm = require('node-elm-compiler')
const File = require('vinyl')
const fs = require('fs')
const through = require('through2')
const path = require('path')
const tmp = require('tmp')

const PLUGIN = 'gulp-elm-basic'

var defaults = {
  cwd: process.cwd(),
  debug: false,
  verbose: false,
}

module.exports = function(options) {
  const transform = function(file, encode, callback) {
    if (file.isNull()) {
      return callback()
    }

    if (file.isStream()) {
      this.emit('error', new Error(`${PLUGIN}: Streaming not supported`))
      return callback()
    }

    const opts = Object.assign({}, defaults, options || {})
    const _this = this

    tmp.file({ postfix: '.js' }, function(err, tmpFile) {
      elm
        .compile(file.path, {
          output: tmpFile,
          cwd: opts.cwd,
          debug: opts.debug,
          verbose: opts.verbose,
          yes: true,
          processOpts: {
            stdio: 'inherit',
          },
        })
        .on('close', function(exitCode) {
          if (exitCode === 0) {
            fs.readFile(tmpFile, function(err, contents) {
              _this.push(
                new File({
                  path: path.basename(file.path).replace('.elm', '.js'),
                  contents: contents,
                })
              )
              callback()
            })
          } else {
            _this.emit(
              'error',
              new Error(`${PLUGIN}: node-elm-compiler Errored with exit code 1`)
            )
            callback()
          }
        })
    })
  }

  return through.obj(transform)
}
