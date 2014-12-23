'use strict';

var APP_ID = "share.url.test";
var defaultAppId = APP_ID;
var ffos = require('node-firefoxos-cli');
var path = require('path');

module.exports = function(grunt) {
  [
    'grunt-contrib-compress',
    'grunt-contrib-copy',
    'grunt-firefoxos',
  ].forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    compress: {
      release: {
        options: {
          archive: 'release/application.zip',
        },
        files: [{
          cwd: 'build',
          expand: true,
          src: '**/*'
        }]
      }
    },
    
    copy: {
      build: {
        expand: true,
        cwd: 'app',
        src: ['**'],
        dest: 'build'
      }
    }
  });

  grunt.registerTask('configure', function() {
    // Generic tasks
    var manifest = grunt.file.readJSON("app/manifest.webapp");
    defaultAppId = manifest.origin || manifest.name || APP_ID;

    // Application specific tasks
    var config = grunt.file.readJSON("build/config.json");
    var url = grunt.option('url');
    if (url != null) {
      config.url = url;
    }
    grunt.file.write("build/config.json", JSON.stringify(config, null, 2));
  });

  grunt.registerTask('launchApp', function(myAppId){
    var appId = myAppId || defaultAppId;
    var done = this.async();
    ffos.appCommand("launch", appId, null, function (err, data) {
      if (err) {
        console.log('ERROR launching app'.red);
        console.log(err);
      } else {
        console.log('Application launched'.green);
      }
      done();
    });
    console.log("Accept the prompt in your device to launch the app".blue)
  });

  grunt.registerTask('installApp', function(myAppId){
    var appId = myAppId || defaultAppId;
    var done = this.async();

    var src = path.join(process.cwd(), 
                        grunt.config.get("compress.release.options.archive"));
                        //"application.zip");

    ffos.installPackagedApp(appId, src, function (err) {
        if (err) {
           console.log('ERROR installing app '.red);
           console.log(err);
         }
        else {
           console.log('App installed');
         }
        done();
    });
    console.log("Accept the prompt in your device to install the app".blue)
  }); 

  // Based on an App URL, it gets the App ID
  var getAppId = function getAppId(appUrl) {
    return (require('url').parse(appUrl).hostname);
  }

  var getApps = function getApps(running, onComplete) {
    var message = "listRunningApps";
    if (!running){
      message = "getAll";
    }
    ffos.appCommand(message, null, null, function (err, data) {
      if (err) {
        console.log('ERROR getting app list '.red);
        console.log(err);
        onComplete(err, null);
      }
      else {
        console.log('SUCCESSFULLY retrieved Apps '.green)
        onComplete(null, data);
      }
    });
  }

  // Gets the list of running applications, returned in the onComplete callback 
  var getRunningApps = function getRunningApps(onComplete) {
    getApps(true, onComplete);
  }

  var getAllApps = function getRunningApps(onComplete) {
    getApps(false, onComplete);
  }

  // Shows via console all the running apps
  grunt.registerTask('listRunningApps', function(){
    var done = this.async();
    getRunningApps(function onComplete(error, data){
      if (error == null){
        data.apps.forEach(function(appUrl){
          console.log("Application ID is " + getAppId(appUrl));
        });
      }
      done();
    });
  });

  // Shows via console all the running apps
  grunt.registerTask('listAllApps', function(){
    var done = this.async();
    getAllApps(function onComplete(error, data){
      if (error == null){
        data.apps.forEach(function(appUrl){
          console.log("Application ID is " + getAppId(appUrl));
        });
      }
      done();
    });
  });

  // Kills an application
  grunt.registerTask('killApp', function(myAppId){
    var appId = myAppId || defaultAppId;
    var done = this.async();
    getRunningApps(function onComplete(error, data){
      if (error == null){
        var appFound = false;
        data.apps.forEach(function(appUrl){
          if (getAppId(appUrl) == appId){
            appFound = true;
            ffos.appCommand("close", appId, null, function (err, data) {
              if (err) {
                console.log('ERROR killing app '.red);
                console.log(err);
              }
              else {
                console.log('Application ' + appId + ' killed '.green)
              }
              done();
            });
            console.log("Accept the prompt in your device to kill the app".blue)
          }
        });
        if (!appFound){
          console.log('App is not running - nothing to do'.green);
          done();
        }
      } else{
        console.log('Error getting running apps '.red);
        console.log(error);
        done();
      }
    });
    console.log("Accept the prompt in your device to get the list of running apps".blue)
  });

  // Build just creates the zip file with the right config in the
  // release folder
  grunt.registerTask('build', 'Build app for dev', [
    'copy:build',
    'configure',
    'compress:release'
  ]);

  // Builds, install the app in the connnected device and starts it
  grunt.registerTask('push', 'Build app for dev', [
    'build',
    'installApp',
    'launchApp'
  ]);

  // Builds, kill app if running, installs the new version and launches it
  grunt.registerTask('pushclean', 'Build app for dev', [
    'copy:build',
    'configure',
    'compress:release',
    'killApp',
    'installApp',
    'launchApp'
  ]);

  grunt.registerTask('default', ['build']);
};
