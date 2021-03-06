'use strict'

const configPaths = require('../../config/paths.json')
const gulp = require('gulp')
const fs = require('fs')
const taskArguments = require('./task-arguments')
const gulpif = require('gulp-if')
const rename = require('gulp-rename')
const del = require('del')
const vinylPaths = require('vinyl-paths')

// check for the flag passed by the task

const isDist = taskArguments.destination === 'dist' || false

// Update assets' versions ----------
// Add all.package.json version
// ----------------------------------
gulp.task('update-assets-version', () => {
  let pkg = require('../../' + configPaths.packages + 'all/package.json')
  fs.writeFileSync(taskArguments.destination + '/VERSION.txt', pkg.version + '\r\n')
  return gulp.src([
    taskArguments.destination + '/css/govuk-frontend.min.css',
    taskArguments.destination + '/css/govuk-frontend-old-ie.min.css',
    taskArguments.destination + '/js/govuk-frontend.min.js'
  ])
  .pipe(vinylPaths(del))
  .pipe(gulpif(isDist,
    rename(obj => {
      obj.dirname += '/' + obj.extname.replace('.', '')
      obj.basename = obj.basename.replace(/(govuk.*)(?=\.min)/g, '$1-' + pkg.version)
      return obj
    })
  ))
  .pipe(gulp.dest(taskArguments.destination + '/'))
})
