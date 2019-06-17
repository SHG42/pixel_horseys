var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    methodOverride          = require("method-override"),
    mongoose                = require("mongoose"),
    expressSanitizer        = require("express-sanitizer"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    User                    = require("./models/user"),
    Unicorn                 = require("./models/unicorn"),
    Region                  = require("./models/region");
    
    //ROUTE REQUIRES
    var newPlayerRoutes = require("./routes/newplayer"),
        gameRoutes      = require("./routes/game"),
        indexRoutes     = require("./routes/index");


mongoose.connect("mongodb://localhost:27017/sunflame_mountain", { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });

app.use(require("express-session")({
    secret: "honk if u love pixel pets",
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());

//FIGURE OUT how to use this instead of passing currentUser to each route
// app.use(function(req, res, next){
//   res.locals.currentUser = req.user;
//   next();
// });

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(newPlayerRoutes);
app.use(gameRoutes);
app.use(indexRoutes);

//dbReset();

//RESET FUNCTION
// function dbReset(){
//     User.deleteMany({}, function(err){
//       if(err) {
//           console.log(err);
//       } else {
//           console.log("removed users");
//           User.counterReset('userid', function(err) {
//                 if(err) {
//                     console.log(err);
//                 } else{
//                     console.log("user id reset");
//                      Unicorn.deleteMany({}, function(err){
//                           if(err){
//                               console.log(err);
//                           } else{
//                               console.log("removed unicorns");
//                               Unicorn.counterReset('uniid', function(err) {
//                                     if(err) {
//                                         console.log(err);
//                                     } else {
//                                         console.log("unicorn id reset");
//                                     }
//                                 });
//                           }
//                       });
//                 }
//             });
//       }
//     });
// }

app.listen(3000, () => {
	console.log("Welcome to unicorn hell");
});

