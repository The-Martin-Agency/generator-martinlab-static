var gulp = require('gulp');
var path = require('path');
var gulpLoadPlugins = require("gulp-load-plugins");
var $ = gulpLoadPlugins();//for easy gulp-plugin loading

var port = <%= runningPortNumber %>;

var livereload = require('gulp-livereload');

var paths = {
  scripts: ['source/js/**/*.js'],
  <%if(format === 'less'){%>less:   'source/less/**/*.less',<%}%>
  <%if(format === 'sass'){%>less:   'source/sass/**/*.sass',<%}%>
  <%if(format === 'stylus'){%>less:   'source/stylus/**/*.stylus',<%}%>
  html:   'source/*.html',
  img:    'source/img/**/*'
};

//to fully clean out the build folder
gulp.task('clean', function(){
  return gulp.src('build/*', {read:false})
      .pipe(plugins.clean())
      .pipe(plugins.notify("Gulp Cleaned!"));
});

gulp.task('html', function() {
  return gulp.src(paths.html)
      .pipe(gulp.dest('build/'))
      .pipe(plugins.notify("Copied HTML"));
});

<%if(includeJquery){ %>
//just moving over the failsafe
gulp.task('copyJquery', function(){
  return gulp.src('source/public/bower_components/jquery/dist/jquery.min.js')
             .pipe(gulp.dest('build/public/js'));
});
<% } %>

// TODO add other 'includes' here for other libs.. make it more dynamic


<%if(format === 'less'){%>
gulp.task('styles', function () {
  return gulp.src(paths.less)
    .pipe(plugins.less({
      paths: [ path.join(__dirname, 'source/public/less/')]
    }))
    .pipe(gulp.dest('build/public/css'));
});
<% }else if(format === 'sass'){ %>
gulp.task('styles', function () {
  return gulp.src(paths.less)
    .pipe(plugins.less({
      paths: [ path.join(__dirname, 'source/public/less/')]
    }))
    .pipe(gulp.dest('build/public/css'));
});
<%}else if(format === 'stylus'){%>
gulp.task('styles', function () {
  return gulp.src(paths.less)
    .pipe(plugins.less({
      paths: [ path.join(__dirname, 'source/public/less/')]
    }))
    .pipe(gulp.dest('build/public/css'));
});
<% } %>


gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(paths.scripts)
    .pipe(plugins.uglify())
    .pipe(plugins.concat('app.min.js'))
    .pipe(gulp.dest('build/public/js'));
});

gulp.task('img', function(){
  gulp.src(paths.img)
        .pipe(plugins.imagemin())
        .pipe(gulp.dest('build/public/img'));
});

gulp.task("url", function(){
  var options = {
    url: "http://localhost:1337"
  };
  gulp.src("build/index.html")
      .pipe(plugins.open("", options));
});

gulp.task('server', function () {
  plugins.nodemon({ script: 'server.js', watch:['server.js'], ignore: ['source/**/*', 'build/**/*'], env:{ 'NODE_ENV': 'development', 'PORT_NUMBER':1337 }})
});

gulp.task('livereload', function(){
  gulp.src('build/index.html')
      .pipe(livereload())
      .pipe(plugins.notify("Reloaded"));//notify action
});

gulp.task('watch', function(){
  gulp.watch(paths.less, ['less', 'livereload']);
  gulp.watch(paths.html, ['html', 'livereload']);
  gulp.watch(paths.scripts, ['scripts', 'livereload']);
  gulp.watch(path.img, ['img', 'livereload']);
});

gulp.task('default', ['html','copyJquery', 'styles', 'scripts', 'img', 'watch', 'server', 'url']);
