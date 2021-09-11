var
dotenv = require('dotenv').config(),
express = require("express"),
app = express(),
common = require('./common'),
flash = require('connect-flash');
// //ROUTE REQUIRES
var newPlayerRoutes = require("./routes/newplayer"),
	  homeRoutes    = require("./routes/homepages"),
	  indexRoutes   = require("./routes/index");

common.mongoose.connect(process.env.DB_CONN, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

app.use(common.bodyParser.json());
app.use(common.bodyParser.urlencoded({extended: true}));
app.use(common.expressSanitizer());
app.use(express.static("public"));
app.use(common.methodOverride("_method"));
app.set("view engine", "ejs");

app.use(common.session({
    secret: process.env.EXPRESS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
    },
	  store: common.MongoStore.create({
      mongoUrl: process.env.DB_CONN,
      secret: process.env.EXPRESS_SECRET,
      touchAfter: 24 * 60 * 60
	  })
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.req = req;
  res.locals.res = res;

  if (typeof (process.env.CLOUDINARY_URL) === 'undefined') {
    throw new Error('Missing CLOUDINARY_URL environment variable');
  } else {
    // Expose cloudinary package to view
    res.locals.cloudinary = common.cloudinary;
    res.locals.cloudname = process.env.CLOUDNAME;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
  }
});

app.use(common.passport.initialize());
app.use(common.passport.session());
common.passport.use(new common.LocalStrategy(common.User.authenticate()));
common.passport.serializeUser(common.User.serializeUser());
common.passport.deserializeUser(common.User.deserializeUser());

app.use(newPlayerRoutes);
app.use(homeRoutes);
app.use(indexRoutes);

//LOGOUT
app.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "See you later!");
  res.redirect("/login");
});

app.listen(process.env.PORT, () => {
	console.log("Welcome to unicorn hell");
});
