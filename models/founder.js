var mongoose = require("mongoose");

var founderSchema = new mongoose.Schema({
    founderid: Number,
    founderName: String,
    founderCode: String,
    founderPic: String,
});


module.exports = mongoose.model("Founder", founderSchema);