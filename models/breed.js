var mongoose = require("mongoose");

var breedSchema = new mongoose.Schema({
	name: String,
	id: String,
	lineart: {
		baseImg: String
	},
	basecolors: {
		body: {
			baseImg: String,
			colorClass: String
		},
		hair: {
			baseImg: String,
			colorClass: String
		},
		eyes: {
			baseImg: String,
			colorClass: String
		},
		hoof: {
			baseImg: String,
			colorClass: String
		},
		horn: {
			baseImg: String,
			colorClass: String
		}
	},
	genes: [
		{
			geneClass: String,
			baseImg: String,
			name: String,
			id: String,
			colorable: String
		}
	]
});


module.exports = mongoose.model("Breed", breedSchema);