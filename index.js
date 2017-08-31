const elm = require('node-elm-compiler')
const File = require('vinyl')
const through = require('through2')
const path = require('path')

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

    elm
      .compileToString(file.path, {
        cwd: opts.cwd,
        debug: opts.debug,
        verbose: opts.verbose,
        yes: true,
      })
      .then(function(contents) {
        _this.push(
          new File({
            path: path.basename(file.path).replace('.elm', '.js'),
            contents: Buffer(contents),
          })
        )

        callback()
      })
      .catch(function(e) {
        _this.emit('error', new Error(`${PLUGIN}: error`))
        callback()
      })
  }

  return through.obj(transform)
}
