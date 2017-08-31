# gulp-elm-basic [![Circle CI](https://circleci.com/gh/farism/gulp-elm-basic/tree/master.svg?style=svg)](https://circleci.com/gh/farism/gulp-elm-basic/tree/master)

Given an `*.elm` file, it will use [`node-elm-compiler`](https://github.com/rtfeldman/node-elm-compiler) to compile and produce vinyl objects.

#### Example

on the elm side

```elm
-- Main.elm

module Main exposing (..)

import Html exposing (Html, div, p)


main : Html a
main =
    div [] [ Html.text "hello world" ]

```

on the gulp side

```js
const elm = require('gulp-elm-basic')

gulp.task('compile-elm', () => {
  return gulp.src('Main.elm')
    .pipe(elmCss())
    .pipe(uglifyjs())
    .pipe(gulp.dest('build')) // output to /dist/Main.js
})
```
