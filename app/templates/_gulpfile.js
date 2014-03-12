var gulp = require('gulp');
var path = require('path');
var gulpLoadPlugins = require("gulp-load-plugins");
var $ = gulpLoadPlugins();//for easy gulp-plugin loading

var port = <%= runningPortNumber %>;

var livereload = require('gulp-livereload');

var paths = {
  scripts: [<%if(includeUnderscore){ %>'source/bower_components/underscore/underscore.js',<%}%><%if(includePath){ %>'source/bower_components/pathjs/path.min.js',<%}%>'source/js/**/*.js'],
  <%if(format === 'less'){%>styles:   ['source/bower_components/bootstrap/less/bootstrap.less', 'source/less/**/*.less'],<%}%>
  <%if(format === 'sass'){%>styles:   'source/sass/**/*.sass',<%}%>
  <%if(format === 'stylus'){%>styles:   'source/stylus/**/*.stylus',<%}%>
  html:   'source/*.html',
  img:    'source/img/**/*'
};

//to fully clean out the build folder
gulp.task('clean', function(){
  return gulp.src('build/*', {read:false})
      .pipe($.clean());
});

gulp.task('html', function() {
  return gulp.src(paths.html)
      .pipe(gulp.dest('build/'));
});

<%if(includeJquery){ %>
//just moving over the failsafe
gulp.task('copyJquery', function(){
  return gulp.src('source/bower_components/jquery/dist/jquery.min.js')
             .pipe(gulp.dest('build/public/bower_components/'));
});
<% } %>

<%if(includeModernizr){ %>
//just moving over the failsafe
gulp.task('copyModernizr', function(){
  return gulp.src('source/bower_components/modernizr/modernizr.js')
             .pipe(gulp.dest('build/public/bower_components/'));
});
<% } %>


<%if(format === 'less'){%>
gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe($.less({
      paths: [ path.join(__dirname, 'source/public/less/')]
    }))
    .pipe($.concat('main.css'))
    .pipe(gulp.dest('build/public/css'));
});
<% }else if(format === 'sass'){ %>
gulp.task('styles', function () {
  return gulp.src(paths.less)
    .pipe($.less({
      paths: [ path.join(__dirname, 'source/public/less/')]
    }))
    .pipe(gulp.dest('build/public/css'));
});
<%}else if(format === 'stylus'){%>
gulp.task('styles', function () {
  return gulp.src(paths.less)
    .pipe($.less({
      paths: [ path.join(__dirname, 'source/public/less/')]
    }))
    .pipe(gulp.dest('build/public/css'));
});
<% } %>


gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(paths.scripts)
    .pipe($.uglify())
    .pipe($.concat('app.min.js'))
    .pipe(gulp.dest('build/public/js'));
});

gulp.task('img', function(){
  gulp.src(paths.img)
        .pipe($.imagemin())
        .pipe(gulp.dest('build/public/img'));
});

gulp.task("url", function(){
  var options = {
    url: "http://localhost:" + port
  };
  gulp.src("build/index.html")
      .pipe($.open("", options));
});

gulp.task('server', function () {
  $.nodemon({ script: 'server.js', watch:['server.js'], ignore: ['source/**/*', 'build/**/*'], env:{ 'NODE_ENV': 'development', 'PORT_NUMBER':port }})
});

gulp.task('livereload', function(){
  gulp.src('build/index.html')
      .pipe(livereload());
});

gulp.task('watch', function(){
  gulp.watch(paths.styles, ['styles', 'livereload']);
  gulp.watch(paths.html, ['html', 'livereload']);
  gulp.watch(paths.scripts, ['scripts', 'livereload']);
  gulp.watch(path.img, ['img', 'livereload']);
});

gulp.task('default', ['html', <%if(includeJquery){ %>'copyJquery',<%}%><%if(includeModernizr){ %>'copyModernizr',<%}%>'styles', 'scripts', 'img', 'watch', 'server', 'url']);
