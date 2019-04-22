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
        successRedirect: "/home",
        failureRedirect: "/login"
    }), function(req, res) {
});

//INDEX
router.get("/home", isLoggedIn, function(req, res){
    //display unicorns belonging to logged in user
    User.findById(req.user.id).populate("unicorns").exec(function(err, foundUser){
        //the id is stored in the request object, inside the params object
       if(err) {
           console.log(err);
       } else {
           console.log(foundUser);
           //Retrieve all owned unicorns
           var yourUnicorns = foundUser.unicorns;
           //find region data
           var thisRegion = foundUser.region;
           Region.findOne({location: thisRegion}, function(err, foundRegion){
              if(err) {
                  console.log(err);
              } else {
                  //render show template with that users data
                  res.render("index", {currentUser: foundUser, yourUnicorns: yourUnicorns, yourRegion: foundRegion});
              }
           });
       }
    });
});

//UPDATE name
router.put("/home", isLoggedIn, function(req, res){
  req.body.newName = req.sanitize(req.body.newName);
  var newName = req.body.newName;
  var nameThisId = req.body.namedId;
  console.log(nameThisId + " " + newName);
  Unicorn.findByIdAndUpdate(nameThisId, {name: newName}, function(err, foundUnicorn){
      if(err) {
          console.log(err);
          res.send("error");
      } else {
          res.redirect("/home");
      }
  });
   //res.send("name");
});

//SHOW
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




////////////////////////
//TEMP ROUTES, TESTING ONLY

router.get("/inventory", function(req, res){
  res.render("inventory");
});

router.get("/equip", function(req, res){
  res.render("equip"); 
});

router.get("/customize", function(req, res){
  res.render("customize"); 
});
/////////////////////////////////

//MIDDLEWARE FOR CHECKING LOGIN STATUS
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//MIDDLEWARE TO CHECK UNICORN OWNERSHIP and only display edit buttons if on your own page

//LOGOUT
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/login");
});

module.exports = router;