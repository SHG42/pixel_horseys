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
    common.User.register(new common.User({username: req.body.username, email: req.body.email}), req.body.password, function(err, createdUser){
		if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        common.passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/firstlogin"); 
        });
    });
});

router.route("/firstlogin")
.get(function(req, res){
  res.render("firstlogin"); 
})
.post(common.passport.authenticate("local", {
        successRedirect: "/founder",
		successFlash: true,
        failureRedirect: "/firstlogin",
		failureFlash: true
    }), function(req, res) {
});

router.route("/founder")
.get(isLoggedIn, function(req, res) {
	common.Breed.find({}, function(err, foundAllBreeds){
		if (err) {
			req.flash('error', "Something's not right here... Can't load Breeds list...");
			console.error('Uhoh, there was an error (/founder Breed.find GET)', err)
			return res.redirect('/index');
		}
		
		common.Gene.find({}, function(err, foundAllGenes){
			if (err) {
				req.flash('error', "Something's not right here... Can't load Genes list...");
				console.error('Uhoh, there was an error (/founder Gene.find GET)', err)
				return res.redirect('/index');
			}
			
			res.render("founder", {currentUser: req.user, Breeds: foundAllBreeds, Genes: foundAllGenes}); 
		});
	});
})
.post([isLoggedIn, upload.any()], function(req, res) {
	res.redirect("/region");
});


router.route("/region")
.get(isLoggedIn, function(req, res) {
	common.Region.find({}, function(err, foundAllRegions){
		if (err) {
			req.flash('error', "Something's not right here... Regions list not found...");
			console.error('Uhoh, there was an error (/region Region.find GET)', err)
			return res.redirect('/index');
		}
		
		res.render("region", {currentUser: req.user, Regions: foundAllRegions}); 
	})
})
.put(isLoggedIn, function(req, res) {
   	//find user by id and update
	common.Region.findOne({name: req.body.selectedName}, function(err, foundRegion){
		if (err) {
			req.flash('error', "Something's not right here... Region not found...");
			console.error('Uhoh, there was an error (/region Region.findOne PUT)', err)
			return res.redirect('/index');
		}
		var foundARegion = foundRegion;
		common.User.findByIdAndUpdate(req.user._id, {region: foundARegion}, function(err, foundUser){
			if (err) {
				req.flash('error', "Something's not right here... Can't find that user...");
				console.error('Uhoh, there was an error (/region User.findByIdAndUpdate PUT)', err)
				return res.redirect('/index');
			}
		    
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

module.exports = router;
