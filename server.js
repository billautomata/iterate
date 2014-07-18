var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var moment = require('moment')
var express_json = require('express-json')
var json = require('json')
var request = require('request')
var fs = require('fs')
var GitHubApi = require("github");

var github = new GitHubApi({ version: "3.0.0" });

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

router.route('/gist_raw/:db_id').get(function(req,res){

  console.log('get called')
  console.log('gist id ' + req.params.db_id)

  request({
  		url: 'https://api.github.com/gists/' + req.params.db_id,
  		method: 'GET',
  		json: true,
	    headers: {
	        'User-Agent': 'request'
	    }  		
  }, function(err, inc, body){
  	//console.log(body)
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
    console.log(body)
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
	        'User-Agent': 'request'
	    }  		
  }, function(err, inc, body){
  	console.log(body)

  	
  	
  })
  
})

router.route('/gist_local/:db_id').get(function(req,res){

  console.log('local gist called')
  console.log('gist id ' + req.params.db_id)

  fs.readFile(__dirname +'/html/' + req.params.db_id + '/test.js', function(err,data){
    res.send(data)
  })

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

