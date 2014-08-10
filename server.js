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
app.use('/', express.static(__dirname+'/html'))

// START THE SERVER
// =============================================================================
app.listen(port, function(){
    console.log('up and running on port ' + port);
})

/*
router.route('/gist_raw/:db_id').get(function(req,res){

  console.log('get called')
  console.log('gist id ' + req.params.db_id)

  request({
      url: 'https://api.github.com/gists/' + req.params.db_id,
      method: 'GET',
      json: true,
      headers: {
          'User-Agent': 'request',
          Authorization: 'token f6fe8043155da64063e3aed8005e44439a8ce29d'
      }
  }, function(err, inc, body){
    res.json(body);
  })

})

router.route('/gist_rawurl/').post(function(req,res){

  console.log('POST called')
  console.log('req bod' )
  console.log(req.body)

  request({
      url: req.body.url,
      method: 'GET',
      json: false,
      headers: {
          'User-Agent': 'request'
      }
  }, function(err, inc, body){
    res.send(body);
  })

})

router.route('/gist/:db_id').get(function(req,res){

  console.log('get called')
  console.log('gist id ' + req.params.db_id)

  request({
      url: 'https://api.github.com/gists/' + req.params.db_id,
      method: 'GET',
      json: true,
      headers: {
          'User-Agent': 'request',

      }
  }, function(err, inc, body){
    res.json(body)
  })

})

router.route('/gist/data/:db_id').get(function(req,res){

  console.log('get data called')
  console.log('gist id ' + req.params.db_id)

  request({
      url: 'https://api.github.com/gists/' + req.params.db_id,
      method: 'GET',
      json: true,
      headers: {
          'User-Agent': 'request',
          Authorization: 'token f6fe8043155da64063e3aed8005e44439a8ce29d'
      }
  }, function(err, inc, body){
    res.json(body)
  })



})
*/
