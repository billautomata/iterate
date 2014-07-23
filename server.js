var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment')
var express_json = require('express-json')
var json = require('json')
var request = require('request')
var fs = require('fs')
var GitHubApi = require("github")
var marked = require('marked')


var github = new GitHubApi({ version: "3.0.0" })

// configure app to use bodyParser()
// this will let us get the data from a POST

app.use(bodyParser())
//app.use(require('urlencode'))
//app.use(express.urlencoded())
//app.use(express.multipart())

var port = process.env.PORT || 8000;

//var mongoose   = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/scrape_dump'); // connect to our database
//var db = mongoose.connection
//var Scrape = require('./app/models/scrape')

// db.once('open', function(){
//   console.log('connected to mongodb.')
//   Scrape.findOne().exec(function(err,res){ console.log(res) })
// })

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

    for(filename in body.files){

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

router.route('/gist_local/:db_id').get(function(req,res){

  /*
    Go to the local directory, find all the .js files, and return them as a concatenated string.
  */

  console.log('local gist called')
  console.log('gist id ' + req.params.db_id)

  var output = ''



  fs.readdir(__dirname + '/html/' + req.params.db_id, function(err,data){

    var return_object = {}
    return_object.files = []
  
    data.forEach(function(file_name){


      if(fs.lstatSync(__dirname+'/html/'+req.params.db_id+'/'+file_name).isFile()){

        var output = fs.readFileSync(__dirname+'/html/'+req.params.db_id+'/'+file_name)
        output += '\n'

        if(file_name.split('.')[1] === 'md') {
          output = marked(output)
        }

        return_object.files.push({
          name: file_name,
          content: output
        })

      }

/*
      var split_string = file_name.split('.')
      if(split_string[split_string.length-1] === 'js'){
        output += fs.readFileSync(__dirname+'/html/'+req.params.db_id+'/'+file_name)
        output += '\n'
      }
*/

    })

    return_object.history = []

    res.json(return_object)

  })

  //fs.readFile(__dirname +'/html/' + req.params.db_id + '/test.js', function(err,data){
  //  res.send(data)
  //})

})

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);
app.use('/', express.static(__dirname+'/html'))

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('up and running.');

console.log(marked('I am using __markdown__.'))

