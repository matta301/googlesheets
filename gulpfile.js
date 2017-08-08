var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

//var htmlmin 	= require('gulp-htmlmin');

// Static Server + watching scss/html files
gulp.task('serve', function() {

    browserSync.init({
        proxy: "http://localhost:301/googlesheets"
    });


    gulp.watch("main2/*.php").on('change', browserSync.reload);
});


gulp.task('default', ['serve']);