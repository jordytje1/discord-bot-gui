var gulp = require('gulp');
var ts = require('gulp-typescript');
var runSequence = require('run-sequence');
var tsProject = ts.createProject('tsconfig.json');
var del = require('del');
var less = require('gulp-less');
var path = require('path');

gulp.task('clean', function () {
    return del([
        'dist/'
    ]);
});

gulp.task('style', function () {
    return gulp.src('./styles/less/**/*.less')
      .pipe(less({
        paths: [ path.join(__dirname, 'less', 'includes') ]
      }))
      .pipe(gulp.dest('./dist/styles/'));
  });

gulp.task('ts', function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist'));
});

gulp.task('merge', function() {
    gulp.src('src/*.json')
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', gulp.series('clean', 'ts', 'style', function (done) {
    done();
})); 