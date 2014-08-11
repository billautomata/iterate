/* jshint undef: true, asi: true, browser: true, devel: true, node: true */

var express = require('express');
var request = require('request')
var marked = require('marked')
var fs = require('fs')

var local_gists_path = 'gist_local/'

module.exports = function(app){

  // ROUTES FOR OUR API
  // =============================================================================
  var router = express.Router();

  router.use(function(req,res,next){
    console.log('router in use.')
    next()
  })

  // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
  router.get('/', function(req, res) {
    //res.json({ message: 'ok' });
    res.send('ok')
  });

  router.route('/gist_everything/:gist_id').get(function(req,res){

    console.log('get everything called.')
    console.log('gist id ' + req.params.gist_id)

    var return_object = {}
    return_object.history = []
    return_object.files = []

    request({
      url: 'https://api.github.com/gists/' + req.params.gist_id,
      method: 'GET',
      json: true,
      headers: {
          'User-Agent': 'request',
          Authorization: 'token f6fe8043155da64063e3aed8005e44439a8ce29d'
      }
    }, function(err, inc, body){

      return_object.raw = body
      console.log(body)

      for(var filename in body.files){

        return_object.files.push({
          content: body.files[filename].content,
          name: filename
        })

      }

      // convert markdown files to markdown
      return_object.files.forEach(function(file){
        if(file.name.split('.')[1] === 'md'){
          file.content = marked(file.content)
        }
      })

      body.history.forEach(function(element){
        return_object.history.push(element)
      })

      request({
        url: 'https://api.github.com/gists/' + req.params.gist_id + '/comments',
        method: 'GET',
        json: true,
        headers: {
            'User-Agent': 'request',
            Authorization: 'token f6fe8043155da64063e3aed8005e44439a8ce29d'
        }
      }, function(err,inc,body){

        body.forEach(function(element){

          return_object.history.push(element)

        })

        res.json(return_object)

      })

    })

  })

  router.route('/gist_local/:db_id').get(function(req,res){

    /*
      Go to the local directory, find all the files, and return them as a concatenated string.
    */

    console.log('local gist called')
    console.log('gist id ' + req.params.db_id)

    var output = ''

    fs.readdir(__dirname + local_gists_path + req.params.db_id, function(err,data){

      var return_object = {}
      return_object.files = []

      data.forEach(function(file_name){

        if(fs.lstatSync(__dirname+ local_gists_path +req.params.db_id+'/'+file_name).isFile()){

          var output = fs.readFileSync(__dirname + local_gists_path +req.params.db_id + '/' + file_name)
          output += '\n'

          // parse the .md files and conver to markdown using marked
          if(file_name.split('.')[1] === 'md') {
            output = marked(output)
          }

          return_object.files.push({
            name: file_name,
            content: output
          })

        }

      })

      return_object.history = []

      res.json(200, return_object)

    })

  })

  // more routes for our API will happen here

  // REGISTER OUR ROUTES -------------------------------
  // all of our routes will be prefixed with /api
  app.use('/api', router);

}
