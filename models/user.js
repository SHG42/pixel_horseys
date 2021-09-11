var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

var userSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  email: {type: String, unique: true, required: true},
  join: {type: Date, default: Date.now},
	region: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Region"
            },
	tokens: { type: Number, default: 0 }
});

userSchema.virtual('unicorns', {
  ref: 'Unicorn',
  localField: '_id',
  foreignField: 'owner'
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

userSchema.plugin(AutoIncrement, {inc_field: 'userid'});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);