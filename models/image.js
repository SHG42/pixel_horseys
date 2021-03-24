var mongoose = require("mongoose");

var imageSchema = new mongoose.Schema({
	filename: String, 
	public_id: String,
	etag: String,
	version: String,
    img: 
    { 
        data: Buffer, 
        contentType: String 
    }
});


module.exports = mongoose.model("Image", imageSchema);