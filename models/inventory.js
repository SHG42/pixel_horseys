var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

var inventorySchema = new mongoose.Schema({
	img: String,
	name: String,
	category: String,
	publicName: String
});
inventorySchema.plugin(AutoIncrement, {inc_field: 'inventoryid'});

module.exports = mongoose.model("Inventory", inventorySchema);