var common = require("../common");
var express = require("express");
var router 	= express.Router({mergeParams: true});

var mstorage = common.multer.memoryStorage();
var upload = common.multer({ storage: mstorage });


router.route("/home/:userid")
.get(isLoggedIn, function(req, res){
	// console.log("req.user._id and req.params.userid from home/:userid route: ");
	// console.log(req.user._id);
	// console.log(req.params.userid);
	//get LOGGEDINUSER
	User.findById(req.user._id, function(err, foundLoggedInUser){
		if (err) return console.error('Uhoh, there was an error', err);
		//get info and unicorns of PAGE-OWNER
		User.findOne({userid: req.params.userid}).populate({path: "region"}).populate({path: "unicorns", populate: { path: 'imgs.img', model: 'Image' }}).exec(function(err, foundPageOwner){
			if (err) return console.error('Uhoh, there was an error', err)
			res.render("home", {currentPageOwner: foundPageOwner, loggedInUser: foundLoggedInUser});
		});
	});
})
.put(isLoggedIn, function(req, res){
	req.body.newName = req.sanitize(req.body.newName);
	var newName = req.body.newName;
	Unicorn.findByIdAndUpdate(req.body.unicornid, {$set: {name: newName}}, {new: true}, function(err, foundUnicorn){
		if (err) return console.error('Uhoh, there was an error Unicorn.findByIdAndUpdate{$set: {name: newName}} PUT', err)
		res.redirect("/home/" + req.params.userid);
	});
});

// SHOW unicorn bio page
router.route("/home/:userid/unicorn/:uniid")
.get(isLoggedIn, function(req, res){
	User.findById(req.user._id, function(err, foundLoggedInUser){
		if (err) return console.error('Uhoh, there was an error', err);
		//get info and unicorns of PAGE-OWNER
		User.findOne({userid: req.params.userid}).populate("region").populate("unicorns").exec(function(err, foundPageOwner){
			if (err) return console.error('Uhoh, there was an error', err)
			Unicorn.findOne({uniid: req.params.uniid}).populate({path: "imgs.img", model: "Image"}).exec(function(err, foundUnicorn){
				if (err) return console.error('Uhoh, there was an error', err)
				console.log(foundUnicorn.imgs.img);
				res.render("bio", {currentPageOwner: foundPageOwner, loggedInUser: foundLoggedInUser, unicorn: foundUnicorn});
			});
		});
	});
})
.put(isLoggedIn, function(req,res){
	console.log(req.body);
	console.log(req.params);
	// var newLore = req.sanitize(req.body.unicorn.lore);
	var newLore = req.body.lore;
	Unicorn.findOneAndUpdate({uniid: req.params.uniid}, {$set: {lore: newLore}}, {new: true}, function(err, foundUnicorn){
	   	if (err) return console.error('Uhoh, there was an error', err) 
		res.redirect("/home/" + req.params.userid + "/unicorn/" + req.params.uniid);
	});
});

//////////////////////////////////
//check login middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//check page ownership middleware
// function isPageOwner(req, res, next){
// 	var isLoggedInNow = req.user._id;
// 	common.User.findOne({userid: req.params.userid}, function(err, foundPageOwner){
// 		if (err) return console.error('Uhoh, there was an error', err)
// 		var ownsPage = foundPageOwner._id;
// 		if(isLoggedInNow === ownsPage) {
// 			return next();
// 		} else {
// 			console.log("that's not yours!!!");
// 		}
// 	});
// }

//LOGOUT
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/login");
});

module.exports = router;