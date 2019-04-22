var mongoose = require("mongoose");

const AutoIncrement = require('mongoose-sequence')(mongoose);

var unicornSchema = new mongoose.Schema({
    uniid: Number,
    uniName: String,
    uniPic: String,
    owner: String,
    name: String,
    created: 
        {
            type: Date, 
            default: Date.now
        },
    lore: String,
    parent1: String,
    parent2: String,
    lvl: Number,
    energy: Number,
    hunger: Number,
});
unicornSchema.plugin(AutoIncrement, {inc_field: 'uniid'});


module.exports = mongoose.model("Unicorn", unicornSchema);