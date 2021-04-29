var common = require("../common");
var express = require("express");
var router 	= express.Router({mergeParams: true});

var mstorage = common.multer.memoryStorage();
var upload = common.multer({ storage: mstorage });

//STARTER ROUTES
//NEW route, displays new user form
router.route("/register")
.get(function(req, res){
	res.render("register"); 
})
.post(function(req, res){
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

router.route("/firstlogin")
.get(function(req, res){
  res.render("firstlogin"); 
})
.post(passport.authenticate("local", {
        successRedirect: "/founder",
        failureRedirect: "/firstlogin"
    }), function(req, res) {
});

router.route("/founder")
.get(isLoggedIn, function(req, res) {
	Breed.find({}, function(err, foundAllBreeds){
		if (err) return console.error('Uhoh, there was an error (/founder Breed.find GET)', err)
		Gene.find({}, function(err, foundAllGenes){
			if (err) return console.error('Uhoh, there was an error (/founder Gene.find GET)', err)
			res.render("founder", {currentUser: req.user, Breeds: foundAllBreeds, Genes: foundAllGenes}); 
		});
	});
})
.post([isLoggedIn, upload.any()], function(req, res) {
	res.redirect("/region");
});


router.route("/region")
.get(isLoggedIn, function(req, res) {
	Region.find({}, function(err, foundAllRegions){
		if (err) return console.error('Uhoh, there was an error (/region Region.find GET)', err)
		res.render("region", {currentUser: req.user, Regions: foundAllRegions}); 
	})
})
.put(isLoggedIn, function(req, res) {
   	//find user by id and update
	Region.findOne({name: req.body.selectedName}, function(err, foundRegion){
		if (err) return console.error('Uhoh, there was an error (/region Region.findOne PUT)', err)
		var foundARegion = foundRegion;
		User.findByIdAndUpdate(req.user._id, {region: foundARegion}, function(err, foundUser){
		    if (err) return console.error('Uhoh, there was an error (/region User.findByIdAndUpdate PUT)', err)
			// console.log("req.user from findByIdAndUpdate in region PUT route: ");
			// console.log(req.user);
			res.redirect("/index");
	   });
	});
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/firstlogin");
}

export default router;
