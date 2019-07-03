var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../models/user");
var Unicorn = require("../models/unicorn"),
    Region  = require("../models/region");

router.get("/", function(req, res){
   res.render("landing"); 
});

router.get("/login", function(req, res){
  res.render("login"); 
});

router.post("/login", passport.authenticate("local", {
        successRedirect: "/index",
        failureRedirect: "/login"
    }), function(req, res) {
});

//INDEX, SITE HOMEPAGE
router.get("/index", isLoggedIn, function(req, res) {
	//console.log(req.user);
	User.findById(req.user.id, function(err, foundUser){
		if(err) {
           console.log(err);
       } else {
           //console.log(foundUser);
           //find region data
           var thisRegion = foundUser.region;
           Region.findOne({location: thisRegion}, function(err, foundRegion){
              if(err) {
                  console.log(err);
              } else {
                  //render show template with that users data
                  res.render("index", {currentUser: foundUser, yourRegion: foundRegion});
              }
           });
       }
	});
});

//INDEX, USER HOMEPAGE (display user by id)
//ADD AUTH MIDDLEWARE
router.get("/home/:userid", isLoggedIn, function(req, res){
	//get loggedin user
    User.findById(req.user.id, function(err, foundUser){
		//display unicorns belonging to user with matching id
		User.findOne({userid: req.params.userid}).populate("unicorns").exec(function(err, foundOwner){
			if(err) {
				console.log(err);
			} else {
				console.log(req.params);
				//Retrieve all owned unicorns
				var yourUnicorns = foundOwner.unicorns;
				//find region data
				var thisRegion = foundOwner.region;
				Region.findOne({location: thisRegion}, function(err, foundRegion){
					if(err) {
						console.log(err);
					} else {
					  //render show template with that users data
					  res.render("home", {currentUser: foundUser, currentOwner: foundOwner, yourUnicorns: yourUnicorns, yourRegion: foundRegion});
					}
				});
			}
		});
	});
});

//UPDATE name
//ADD AUTH MIDDLEWARE
router.put("/home/:userid", isLoggedIn, function(req, res){
    User.findOne({userid: req.params.userid}, function(err, foundOwner){
		req.body.newName = req.sanitize(req.body.newName);
		var newName = req.body.newName;
		var nameThisId = req.body.namedId;
		console.log(nameThisId + " " + newName);
		Unicorn.findByIdAndUpdate(nameThisId, {name: newName}, function(err, foundUnicorn){
			if(err) {
				console.log(err);
				res.send("error");
			} else {
				res.redirect("/home/" + foundOwner.userid);
			}
		});
		//res.send("name");
	});
});


//MIDDLEWARE FOR CHECKING LOGIN STATUS
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//MIDDLEWARE TO CHECK HOMEPAGE OWNERSHIP and only display edit buttons if on your own page
// function checkOwnership(req, res, next) {
	
// }


//LOGOUT
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/login");
});

module.exports = router;