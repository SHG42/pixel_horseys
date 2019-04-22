var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../models/user");
var Unicorn = require("../models/unicorn"),
    Region  = require("../models/region");

//STARTER ROUTES
//NEW route, displays new user form
router.get("/register", function(req, res){
   res.render("register"); 
});

//CREATE route, creates new user in db
router.post("/register", function(req, res){
    //get data from reg form and store in user data
    var newUser = new User({username: req.body.username, email: req.body.email});
    User.register(newUser, req.body.password, function(err, createdUser){
       if(err) {
           console.log(err);
           return res.render("register");
       } 
       passport.authenticate("local")(req, res, function(){
           res.redirect("/firstlogin");
       });
    });
});

router.get("/firstlogin", function(req, res){
  res.render("firstlogin"); 
});

//handle login logic
router.post("/firstlogin", passport.authenticate("local", {
        successRedirect: "/choosefounder",
        failureRedirect: "/firstlogin"
    }), function(req, res) {
});

router.get("/choosefounder", isLoggedIn, function(req, res) {
    //req.user will contain credentials of loggedin user
    console.log(req.user);
    res.render("choosefounder", {currentUser: req.user}); 
    //pass currentUser through to all routes where user data needs to be available
});

// POST unicorn choice to database
    // USE CREATE TO ADD NEW INSTANCE OF FOUNDER UNICORN TO DATABASE UPON FORM SUBMISSION
    // USE JQUERY TO SEND ID OF CHOSEN UNICORN TO NAME ATTRIBUTE IN FORM AND RETRIEVE VIA REQ.BODY, SEE USER REG FOR EXAMPLE
//CREATE route, creates new founder unicorn in db    
router.post("/choosefounder", isLoggedIn, function(req, res) {
   //get unicorn data from modal form 
   //res.send("testing");
   var founder = req.body.selectedName;
   var founderPic = req.body.selectedPic;
   var ownerId = req.user._id;
   
   var newFounder = {
        uniName: founder,
        uniPic: founderPic,
        owner: ownerId,
   };
   
   console.log(founder + " " + founderPic + " " + ownerId);
   
   //lookup user by id
    User.findById(req.user.id, function(err, foundUser){
        if(err) {
            console.log(err);
            res.redirect("/choosefounder");
        } else {
            //create new Unicorn
            Unicorn.create(newFounder, function(err, newUnicorn){
                if(err) {
                    console.log(err);
                    res.redirect("/choosefounder");
                } else {
                    //push new unicorn to user data and save
                     foundUser.unicorns.push(newUnicorn);
                     foundUser.save();
                    //redirect to chooseregion
                    res.redirect("/chooseregion");
                }
            });
        }
    });
});

router.get("/chooseregion", isLoggedIn, function(req, res) {
    //req.user will contain credentials of loggedin user
    res.render("chooseregion", {currentUser: req.user}); 
    //pass currentUser through to all routes where user data needs to be available
});

//UPDATE existing user data with region info, nothing is being created
router.put("/chooseregion", isLoggedIn, function(req, res) {
   //get region name from form
   var region = req.body.selectedName;
   //find user by id and update
   User.findByIdAndUpdate(req.user.id, {region: region}, function(err, foundUser){
       if(err){
           console.log(err);
           res.redirect("/chooseregion");
       } else {
           console.log(req.user + " " + region);
           res.redirect("/home");
       }
   });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;