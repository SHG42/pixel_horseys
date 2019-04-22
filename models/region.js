var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

var regionSchema = new mongoose.Schema({
   regid: Number,
   location: String,
   modalBG: String,
   homeBG: String,
   defaultBG: String
});
regionSchema.plugin(AutoIncrement, {inc_field: 'regid'});

module.exports = mongoose.model("Region", regionSchema);