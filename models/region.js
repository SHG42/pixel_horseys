var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

var regionSchema = new mongoose.Schema({
    name: String,
    modalBG: String,
    homeBG: String,
	description: String
});
regionSchema.plugin(AutoIncrement, {inc_field: 'regid'});

module.exports = mongoose.model("Region", regionSchema);