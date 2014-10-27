/* jshint undef: true, asi: true, browser: true, devel: true, node: true */

var express = require('express')
var bodyParser = require('body-parser')
var moment = require('moment')
var request = require('request')
var fs = require('fs')
var marked = require('marked')

var app = express()
app.use(bodyParser())

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

var port = process.env.PORT || 8000;


// routes
require('./routes.js')(app)
app.use('/', express.static(__dirname+'/www'))

// START THE SERVER
// =============================================================================
app.listen(port, function(){
    console.log('up and running on port ' + port);
})

