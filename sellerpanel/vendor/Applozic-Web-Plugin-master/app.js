const http = require("http");
const fs = require('fs');
const express = require('express');
const path = require('path');
const compressor = require('node-minify');
const app = express();
const argv = require('yargs').argv
const conf = require('config');
const port = conf.get('port');
const baseUrl = conf.get('baseUrl');
const replace = require("replace");

console.log(baseUrl);

compressor.minify({
  compressor: 'yui-js',
  input: ['./public/plugin/js/app/modules/videocall/applozic.calling.js', './public/plugin/js/applozic.socket.min.js',
    './public/plugin/js/app/applozic.common.js', './public/plugin/js/app/modules/applozic.chat.js',
    './public/plugin/js/app/modules/storage/applozic.storage.js', './public/plugin/js/app/modules/api/applozic.api.js',
    './public/plugin/js/app/modules/socket/applozic.socket.js', './public/plugin/js/app/modules/notification/applozic.notification.js',
    './public/plugin/js/app/modules/group/applozic.group.js', './public/plugin/js/app/modules/user/applozic.user.js',
    './public/plugin/js/app/modules/file/applozic.file.js','./public/plugin/js/app/modules/customFunctions/applozic.custom.js' ,'./public/plugin/js/app/modules/message/applozic.message.js'
  ],
  output: './public/applozic.chat.min.js',
  callback: function(err, min) {}
});

// Define the port to run on
app.set('port', port); //

//app.use('/nodejs-web-plugin',express.static(path.join(__dirname,'')));
app.use(express.static(path.join(__dirname, '/public')));
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

//Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  fs.readFile(path.join(__dirname, "./public/plugin/sample/temp/sideboxtest.html"), 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(":getBaseurl", baseUrl);

    fs.writeFile("./public/plugin/sample/sidebox.html", result, 'utf8', function(err) {
      if (err) return console.log(err);
    });
  });
  fs.readFile(path.join(__dirname, "./public/plugin/sample/temp/fullviewtest.html"), 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(":getBaseurl", baseUrl);

    fs.writeFile("./public/plugin/sample/fullview.html", result, 'utf8', function(err) {
      if (err) return console.log(err);
    });
  });
  fs.readFile(path.join(__dirname, "./public/plugin/sample/temp/coretest.html"), 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(":getBaseurl", baseUrl);

    fs.writeFile("./public/plugin/sample/core.html", result, 'utf8', function(err) {
      if (err) return console.log(err);
    });
  });

  fs.readFile(path.join(__dirname, "./public/demo/root/temp/indextest.js"), 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(":getBaseurl", baseUrl);

    fs.writeFile("./public/demo/index.js", result, 'utf8', function(err) {
      if (err) return console.log(err);
    });
  });

  console.log('Open localhost using port ' + port); //
});
