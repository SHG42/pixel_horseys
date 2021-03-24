var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

var unicornSchema = new mongoose.Schema({
	name: String,
	owner: { 
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
    },
	created: 
        {
            type: Date, 
            default: Date.now
        },
	founder: Boolean,
	breedid: String,
	lore: String,
	equips: [],
	canvasposition: {
		x: String,
		y: String
	},
	imgs: {
		img: { 
			type: mongoose.Schema.Types.ObjectId,
			ref: "Image"
		},
		baseImg: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Image"
		},
		equipFront: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Image"
		},
		equipBack: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Image"
		}
	},
	genes: 
	{
		bodyGene: {
			geneId: String,
			colorable: String,
			geneName: String,
			baseImg: String
		},
		hairGene: {
			geneId: String,
			colorable: String,
			geneName: String,
			baseImg: String
		},
		tertiaryGene: {
			geneId: String,
			colorable: String,
			geneName: String,
			baseImg: String
		},
		eyeGene: {
			geneId: String,
			colorable: String,
			geneName: String,
			baseImg: String
		},
		hornGene: {
			geneId: String,
			colorable: String,
			geneName: String,
			baseImg: String
		},
		hoofGene: {
			geneId: String,
			colorable: String,
			geneName: String,
			baseImg: String
		}
	},
	colors: [
		{
			colorId: String,
			colorString: String,
			colorData: String
		}
	]
});
unicornSchema.plugin(AutoIncrement, {inc_field: 'uniid'});


module.exports = mongoose.model("Unicorn", unicornSchema);