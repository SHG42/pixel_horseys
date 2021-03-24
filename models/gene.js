var mongoose = require("mongoose");

var geneSchema = new mongoose.Schema({
	id: String,
	geneClass: String,
	name: String,
	colorable: String
});


module.exports = mongoose.model("Gene", geneSchema);