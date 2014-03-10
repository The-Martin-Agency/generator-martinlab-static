'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var MartinlabStaticGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.option('format', {
      desc: 'Select one of `css`, `sass`, `less`, `stylus` for the bootstrap format.',
      type: String
    });

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
      this.format = options.format;
    });
  },

  info: function () {
    var done = this.async();
    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.white('You\'re about to run headstrong into some mad static-web action courtesy of MartinLab.'));

    var prompts = [{
      name: 'projectName',
      message: 'What do you want to call this project?',
      default:path.basename(process.cwd())
    },{
      name:'projectDescription',
      message:'Write a brief description.'
    },{
      name:'runningPortNumber',
      message:'What port number would you like to run on?',
      default:1337,
      validate: function( value ) {
        if (Number(value) !== NaN) {
          return true;
        } else {
          return 'Please enter a valid port number.';
        }
      }
    }];

    this.prompt(prompts, function (props) {
      this.projectName = props.projectName;
      this.projectDescription = props.projectDescription;
      this.runningPortNumber = props.runningPortNumber;

      this.log(this.projectName + ((this.projectDescription.length)? (" - " + this.projectDescription):''));
      this.log('to run on port - ' + chalk.red(this.runningPortNumber));

      done();
    }.bind(this));
  },

  useBootstrap: function () {
    if (this.format) {
      // Skip if already set.
      return;
    }
    var done = this.async();
    var prompts = [{
      type: 'confirm',
      name: 'shouldUseBootstrap',
      message: 'Do you want to use Bootstrap?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.shouldUseBootstrap = props.shouldUseBootstrap;

      done();
    }.bind(this));
  },

  bootstrapFormat:function(){
    if (this.format || !this.shouldUseBootstrap) {
      // Skip if already set.
      return;
    }
    var done = this.async();

    var formats = ['css', 'sass', 'less', 'stylus'];
    var prompts = [{
      type: 'list',
      name: 'format',
      message: 'In what format would you like the Bootstrap stylesheets?',
      choices: formats
    }];

    this.prompt(prompts, function (props) {
      this.format = props.format;

      done();
    }.bind(this));

  },

  useJquery:function(){
    var done = this.async();

    var prompts = [{
      type: 'confirm',
      name: 'shouldUseJQuery',
      message: 'Do you want to use JQuery?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.shouldUseJQuery = props.shouldUseJQuery;

      done();
    }.bind(this));

  },

  app: function () {
    this.mkdir('source');
    this.mkdir('source/img');
    this.mkdir('source/js');

    if(this.format){
      this.mkdir('source/'+this.format);
    }

    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    this.copy('_server.js', 'server.js');
    this.template('_gulpfile.js', 'gulpfile.js');
    this.template('views/_index.html', 'build/index.html');
  },

  bootstrapFiles:function(){
    if(!this.shouldUseBootstrap && !this.format){
      //move on if we shouldn't use bootstrap
      return;
    }

    // map format -> package name
    var packages = {
      css: 'bootstrap.css',
      sass: 'sass-bootstrap',
      less: 'bootstrap',
      stylus: 'bootstrap-stylus'
    };

    this.bowerInstall(packages[this.format], { save: true });
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = MartinlabStaticGenerator;
