var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

const AutoIncrement = require('mongoose-sequence')(mongoose);

var userSchema = new mongoose.Schema({
   userid: Number,
   username: String,
   password: String,
   email: String,
   join: 
        {
            type: Date, 
            default: Date.now
        },
   unicorns: 
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Unicorn"
            }
       ],
   region: String
});
userSchema.plugin(AutoIncrement, {inc_field: 'userid'});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

