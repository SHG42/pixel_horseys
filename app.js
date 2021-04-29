import express, { static } from "express";
var app = express();
import { mongoose, bodyParser, expressSanitizer, methodOverride, session, MongoStore, cloudinary, passport, LocalStrategy, User } from './common';	
// //ROUTE REQUIRES
import newPlayerRoutes from "./routes/newplayer";
import homeRoutes from "./routes/homepages";
import indexRoutes from "./routes/index";

const dbURL = process.env.DB_CONN || "mongodb://localhost:27017/sunflame_mountain";
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

app.use(session({
    secret: process.env.EXPRESS_SECRET,
    resave: false,
    saveUninitialized: false,
	store: MongoStore.create({
		mongoUrl: dbURL,
		secret: process.env.EXPRESS_SECRET,
		touchAfter: 24 * 60 * 60
	})
}));

app.use(function (req, res, next) {
    res.locals.req = req;
    res.locals.res = res;

    if (typeof (process.env.CLOUDINARY_URL) === 'undefined') {
      throw new Error('Missing CLOUDINARY_URL environment variable');
    } else {
		// Expose cloudinary package to view
		res.locals.cloudinary = cloudinary;
		res.locals.cloudname = process.env.CLOUDNAME;
      next();
    }
  });

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(newPlayerRoutes);
app.use(homeRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT, () => {
	console.log("Welcome to unicorn hell");
});
