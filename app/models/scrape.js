
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ScrapeSchema   = new Schema({
	scrape: Schema.Types.Mixed,
  created_at: Date,
  report_id: Number,
  team_id: String,
  customer_id: String
});

ScrapeSchema.index({ report_id: 1 })

module.exports = mongoose.model('Scrape', ScrapeSchema);
