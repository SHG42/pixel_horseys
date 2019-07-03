//SEE: ROUTE DECLARATION REFACTORING LATER, LECTURE 345 YELPCAMP: REFACTORING ROUTES
//Use this for routes pertaining to repeatable gameplay features

var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../models/user");
var Unicorn = require("../models/unicorn"),
    Region  = require("../models/region");


//SHOW unicorn bio page
//ADD AUTH MIDDLEWARE
router.get("/home/:userid/unicorn/:uniid", isLoggedIn, function(req, res){
    //FIND UNICORN BY ID AND DISPLAY DATA
    Unicorn.findOne({uniid: req.params.uniid}, function(err, foundUnicorn){
        if(err) {
            console.log(err);
        } else {
            //render show page with unicorn and info
            res.render("showunicorn", {currentUser: req.user, unicorn: foundUnicorn}); 
        }
    });
});

//EDIT show lore form
//ADD AUTH MIDDLEWARE
router.get("/home/:userid/unicorn/:uniid/edit", isLoggedIn, function(req, res) {
    Unicorn.findOne({uniid: req.params.uniid}, function(err, foundUnicorn){
       if(err) {
            res.redirect("/home");
       } else {
            res.render("editlore", {currentUser: req.user, unicorn: foundUnicorn});
       }
    });
});

//UPDATE send lore form and update unicorn data
//ADD AUTH MIDDLEWARE
router.put("/home/:userid/unicorn/:uniid", isLoggedIn, function(req, res){
    User.findOne({userid: req.params.userid}, function(err, foundOwner){
		if(err) {
			console.log(err);
		} else {
			req.body.unicorn.lore = req.sanitize(req.body.unicorn.lore);
			var newLore = req.body.unicorn.lore;
			Unicorn.findOneAndUpdate({uniid: req.params.uniid}, {$set: {lore: newLore}}, function(err, foundUnicorn){
			   if(err) {
				   console.log(err);
				   res.send("error");
			   } else {
				   //console.log(foundUnicorn);
				   res.redirect("/home/" + foundOwner.userid + "/unicorn/" + req.params.uniid);
			   }
			});
		}
	});
});

//SHOW inventory
//AUTH NOTE: ONLY LET USER VIEW THEIR OWN
router.get("/home/:userid/inventory", isLoggedIn, function(req, res){
	console.log(req.user);
	User.findOne({userid: req.params.userid}, function(err, foundOwner){
		if(err) {
            console.log(err);
       } else {
            //console.log(foundUser);
		    //render show template with that users data
		    res.render("inventory", {currentUser: foundUser});
       }
	});
});

//SHOW equip
//AUTH NOTE: ONLY LET USER VIEW THEIR OWN
router.get("/home/:userid/equip", isLoggedIn, function(req, res){
	//console.log(req.user);
	User.findOne({userid: req.params.userid}, function(err, foundOwner){
		if (err) {
			console.log(err);
		} else {
			//console.log(foundUser);
			res.render("equip", {currentUser: foundUser});
		}
	});
});

//SHOW customize
//AUTH NOTE: ONLY LET USER VIEW THEIR OWN
router.get("/home/:userid/customize", isLoggedIn, function(req, res){
	User.findOne({userid: req.params.userid}, function(err, foundOwner){
		if(err) {
			console.log(err);
		} else {
			res.render("customize", {currentUser: foundUser});
		}
	});
});

//SHOW directory
router.get("/home/:userid/directory", isLoggedIn, function(req, res){
	User.findOne({userid: req.params.userid}, function(err, foundOwner){
		if(err) {
			console.log(err);
		} else {
			//retrieve all users from database
			User.find({}, function(err, foundUsers){
				if(err) {
					console.log(err);
				} else {
					res.render("directory", {currentUser: foundUser, registeredUsers: foundUsers});
				}
			});
		}
	});
});

//////////////////////////////////
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//LOGOUT
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/login");
});

module.exports = router;