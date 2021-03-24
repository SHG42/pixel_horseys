var mongoose = require("mongoose");

var colorSchema = new mongoose.Schema({
    baseImg: String,
	id: String,
	colorClass: String,
	name: String,
	breed: String
});


module.exports = mongoose.model("Color", colorSchema);