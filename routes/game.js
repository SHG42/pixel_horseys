//SEE: ROUTE DECLARATION REFACTORING LATER, LECTURE 345 YELPCAMP: REFACTORING ROUTES
//Use this for routes pertaining to repeatable gameplay features

var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../models/user");
var Unicorn = require("../models/unicorn"),
    Region  = require("../models/region");


//SHOW unicorn bio page
router.get("/home/unicorn/:id", isLoggedIn, function(req, res){
    //FIND UNICORN BY ID AND DISPLAY DATA
    Unicorn.findById(req.params.id, function(err, foundUnicorn){
        if(err) {
            console.log(err);
        } else {
            //render show page with unicorn and info
            res.render("showunicorn", {currentUser: req.user, unicorn: foundUnicorn}); 
        }
    });
});

//EDIT show lore form
router.get("/home/unicorn/:id/edit", isLoggedIn, function(req, res) {
    Unicorn.findById(req.params.id, function(err, foundUnicorn){
       if(err) {
            res.redirect("/home");
       } else {
            res.render("editlore", {currentUser: req.user, unicorn: foundUnicorn});
       }
    });
});

//UPDATE send lore form and update unicorn data
router.put("/home/unicorn/:id", isLoggedIn, function(req, res){
    req.body.unicorn.lore = req.sanitize(req.body.unicorn.lore);
    var newLore = req.body.unicorn.lore;
    Unicorn.findByIdAndUpdate(req.params.id, {lore: newLore}, function(err, foundUnicorn){
       if(err) {
           console.log(err);
           res.send("error");
       } else {
           res.redirect("/home/unicorn/" + req.params.id);
       }
    });
});

//SHOW inventory
router.get("/inventory", isLoggedIn, function(req, res){
	console.log(req.user);
	User.findById(req.user.id, function(err, foundUser){
		if(err) {
            console.log(err);
       } else {
            console.log(foundUser);
		    //render show template with that users data
		    res.render("inventory", {currentUser: foundUser});
       }
	});
});

//SHOW equip
router.get("/equip", isLoggedIn, function(req, res){
	console.log(req.user);
	User.findById(req.user.id, function(err, foundUser){
		if (err) {
			console.log(err);
		} else {
			console.log(foundUser);
			res.render("equip", {currentUser: foundUser});
		}
	});
});

//SHOW customize
router.get("/customize", isLoggedIn, function(req, res){
	User.findById(req.user.id, function(err, foundUser){
		if(err) {
			console.log(err);
		} else {
			res.render("customize", {currentUser: foundUser});
		}
	});
});

//SHOW directory
router.get("/directory", isLoggedIn, function(req, res){
	User.findById(req.user.id, function(err, foundUser){
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