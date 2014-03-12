'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var shell = require('shelljs');

//used later
var git_user,
    git_email;

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
      if(this.options['format']) this.format = this.options['format'];
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

  getUserName:function(){
    var done = this.async();

    //pull some stuff from local git
    git_user = shell.exec('git config --get user.name', { silent: true }).output.trim();
    git_email = shell.exec('git config --get user.email', { silent: true }).output.trim();

    var prompts = [{
      name: 'userName',
      message: 'Github user name?',
      default:git_user
    }];
    this.prompt(prompts, function (props) {
      this.user = props.userName;
      this.site = "https://github.com/" + this.user;

      done();
    }.bind(this));
  },

  getUserEmail:function(){

    if(this.user === git_user){
      this.email = git_email;//if the username matches git, we can use the git email
    }else{
      var done = this.async();
      var prompts = [{
          name: 'email',
          message: 'Email address?',
          default:"n/a"
        }];
        this.prompt(prompts, function (props) {
          this.email = props.email;

          done();
        }.bind(this));
    }

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

    // TODO using LESS temporarily.. will go back and make sure others work
    this.format = 'less';
    return;

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

  getLibs:function(){
    var done = this.async();

    var prompts = [{
      type:'checkbox',
      name:'libs',
      message:'Which libs do you want?',
      choices:[
        {
          name:'jQuery',
          value:'includeJquery',
          checked:true
        },
        {
          name:'Modernizr',
          value:'includeModernizr'

        },
        {
          name:'Underscore',
          value:'includeUnderscore'
        },
        {
          name:'Path',
          value:'includePath'
        }
      ]
    }];

    this.prompt(prompts, function (answers) {
      var libs = answers.libs;

      function includeLibrary(lib) { return libs.indexOf(lib) !== -1; }

      // manually deal with the response, get back and store the results.
      this.includeJquery = includeLibrary('includeJquery');
      this.includeModernizr = includeLibrary('includeModernizr');
      this.includeUnderscore = includeLibrary('includeUnderscore');
      this.includePath = includeLibrary('includePath');

      done();
    }.bind(this));

  },

  app: function () {
    //set any last variables we need from info above
    this.author = this.user + " <" + this.email + ">";

    this.mkdir('source');
    this.mkdir('source/img');
    this.mkdir('source/js');

    if(this.format){
      this.mkdir('source/'+this.format);
    }

    this.template('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    this.template('_server.js', 'server.js');
    this.template('_gulpfile.js', 'gulpfile.js');
    this.template('_index.html', 'source/index.html');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy('.bowerrc', '.bowerrc');
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
  bowerInstann:function(){
    if(this.includeJquery){
      this.bowerInstall('jquery', { save: true });
    }
    if(this.includePath){
      this.bowerInstall('pathjs', { save: true });
    }
    if(this.includeUnderscore){
      this.bowerInstall('underscore', { save: true });
    }
    if(this.includeModernizr){
      this.bowerInstall('modernizr', {save:true});
    }
  }


});

module.exports = MartinlabStaticGenerator;
