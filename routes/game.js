//SEE: ROUTE DECLARATION REFACTORING LATER, LECTURE 345 YELPCAMP: REFACTORING ROUTES

var express = require("express");
var router = express.Router({mergeParams: true});
var User = require("../models/user");
//INDEX: THIS ROUTE SHOULD FETCH THE USER'S HOMEPAGE
//NEEDS MIDDLEWARE
router.get("home/user/:userid", isLoggedIn, function(req, res){
    res.send("YOUR HOMEPAGE");
});

//SHOW: THIS ROUTE SHOULD DISPLAY SPECIFIC UNICORN
//NEEDS MIDDLEWARE
router.get("home/user/:userid/unicorn/:uniid", isLoggedIn, function(req, res) {
    res.send("PRETTY UNICORN GOES HERE");
    //find specific unicorn with uniid from user data
    
    
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;