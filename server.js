var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var moment = require('moment')
var express_json = require('express-json')
var json = require('json')

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
	res.json({ message: 'ok' });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('up and running.');