var common = require("../common");
var express = require("express");
var router 	= express.Router({mergeParams: true});
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var mstorage = common.multer.memoryStorage();
var upload = common.multer({ storage: mstorage });

router.get("/", function(req, res){
   res.render("landing"); 
});

router.route("/login")
.get(function(req, res){
  res.render("login"); 
})
.post(common.passport.authenticate("local", {
        successRedirect: "/index",
        failureRedirect: "/login"
    }), function(req, res) {
});

router.route("/accountrecovery")
.get(function(req, res){
	res.render("accountrecovery");
})

router.get("/credits", function(req, res){
   res.render("credits"); 
});

//INDEX, SITE HOMEPAGE
router.get("/index", [isLoggedIn, finishedRegistration], function(req, res) {
	common.User.findById(req.user._id).populate("region").exec(function(err, foundLoggedInUser){
		if (err) {
			req.flash('error', "Something's not right here... Can't find an Index page for that user...");
			console.error('Uhoh, there was an error (/index User.findById GET)', err);
			return res.redirect('/login');
		}
		res.render("index", {loggedInUser: foundLoggedInUser});
	});
});

// SHOW inventory
router.get("/inventory", isLoggedIn, function(req, res){
	common.User.findById(req.user._id, function(err, foundLoggedInUser){
		if (err) {
			req.flash('error', "Something's not right here... Error loading the inventory...");
			console.error('Uhoh, there was an error (/inventory User.findById GET)', err)
			return res.redirect('/index');
		}

		let sort = common.Helpers.sortInventory();
		sort.then((result)=>{
			res.render("inventory", {
				loggedInUser: foundLoggedInUser,
				inventoryBackdrops: result.inventoryBackdrops,
				inventoryCompanions: result.inventoryCompanions,
				inventoryDecorative: result.inventoryDecorative,
				inventoryEnvironment: result.inventoryEnvironment,
				inventoryGems: result.inventoryGems,
				inventoryTech: result.inventoryTech,
				inventoryTiles: result.inventoryTiles
			});
		})
	});
});

// SHOW directory
router.get("/directory", isLoggedIn, function(req, res){
	common.User.findById(req.user._id, function(err, foundLoggedInUser){
		if (err) {
			req.flash('error', "Something's not right here... Can't find that user...");
			console.error('Uhoh, there was an error (/directory User.findById GET)', err)
			return res.redirect('/index');
		}
		
		//retrieve all users from database
		common.User.find({}, function(err, foundUsers){
			if (err) {
				req.flash('error', "Something's not right here... Can't load user list...");
				console.error('Uhoh, there was an error (/directory User.find GET)', err)
				return res.redirect('/index');
			}
			res.render("directory", {loggedInUser: foundLoggedInUser, registeredUsers: foundUsers});
		});
	});
});

//SHOW game
router.route("/explore")
.get(isLoggedIn, function(req, res){
	common.User.findById(req.user._id, function(err, foundLoggedInUser){
		res.render("explore", {loggedInUser: foundLoggedInUser}); 
	});
})
.put(isLoggedIn, function(req, res){
	common.User.findById(req.user._id, function(err, foundLoggedInUser){
		if (err) {
			req.flash('error', "Something's not right here... Can't find that user...");
			console.error('Uhoh, there was an error (/explore User.findById PUT)', err)
			return res.redirect('/index');
		}
		
		foundLoggedInUser.tokens++;
		foundLoggedInUser.save();
		req.flash("success", "Quest completed successfully! Welcome home, explorer!");
		res.redirect(303, "/index");
	})
})

// SHOW customize
router.route("/build")
.get(isLoggedIn, function(req, res){
	common.Breed.find({}, function(err, foundAllBreeds){
		if (err) {
			req.flash('error', "Something's not right here... Can't load Breeds list...");
			console.error('Uhoh, there was an error (/build Breed.find GET)', err)
			return res.redirect('/index');
		}
		
		common.Gene.find({}, function(err, foundAllGenes){
			if (err) {
				req.flash('error', "Something's not right here... Can't load Genes list...");
				console.error('Uhoh, there was an error (/build Gene.find GET)', err)
				return res.redirect('/index');
			}

			common.User.findById(req.user._id).populate("unicorns").exec(function(err, foundLoggedInUser){
				if (err) {
					req.flash('error', "Something's not right here... Can't find that user...");
					console.error('Uhoh, there was an error (/build User.findById GET)', err)
					return res.redirect('/index');
				}
				res.render("build", {loggedInUser: foundLoggedInUser, Breeds: foundAllBreeds, Genes: foundAllGenes}); 
			});
		});
	});
})
.post([isLoggedIn, upload.any()], function(req, res){
	console.log("Incoming POST user data in /build route: ");
	let userChoices = JSON.parse(req.body.userChoices);
	let unicornData = common.Helpers.setData(userChoices);
	let loggedInUser = req.user._id;
	let buffer = req.files[0].buffer;

	function runUpload(newImage, buffer, newUnicorn) {
		var path = newImage.filename;
		var folder = `Unicorns/${newUnicorn._id}/baseImg`;
		let options = {
			upload_preset: 'unicornBaseImgSave',
			resource_type: 'image',
			format: 'png',
			public_id: newImage.filename,
			folder: folder
		}
		var bufferStream = new common.stream.PassThrough();
		bufferStream.end(Buffer.from(buffer));
		bufferStream.pipe(common.cloudinary.uploader.upload_stream(options, function(error, result) {
			console.log("output from newUnicorn cloudinary upload: ");
			console.log(error, result);
			newImage.public_id = result.public_id;
			newImage.etag = result.etag;
			newImage.version = result.version;
			newImage.img.data = buffer;
			newUnicorn.imgs.baseImg = newImage;
			newUnicorn.imgs.img = newImage;
			newImage.save();
			newUnicorn.save();
			return {
				newImage: newImage,
				newUnicorn: newUnicorn
			}
		}))
		return {
			newUnicorn: newUnicorn
		}
	}
	
	async function createImage(newUnicorn) {
		const newImage = await common.Image.create(buffer);
		newImage.filename = newUnicorn._id.valueOf();
		return {
			newUnicorn: newUnicorn,
			newImage: newImage
		};
	}
	
	var unicornCreate = common.Unicorn.create(unicornData)
	.then((newUnicorn)=> {
		var hasUnicorns = common.User.findById(loggedInUser).populate("unicorns").exec()
		hasUnicorns.then((res)=>{
			if(res.unicorns.length === 0) {
				newUnicorn.founder = true;
			} else {
				newUnicorn.founder = false;
				res.tokens--;
				res.save();
			}
			return res;
		})
		newUnicorn.owner = loggedInUser;
		return newUnicorn
	})
	.then((newUnicorn)=> createImage(newUnicorn))
	.then((res1)=> runUpload(res1.newImage, buffer, res1.newUnicorn))
	.catch((err)=>{
		if (err) {
			req.flash('error', "Something's not right here... Something went wrong creating this Unicorn...");
			console.error('Uhoh, there was an error (/build POST)', err);
			return res.redirect('/index');
		}
	})
	
	unicornCreate.then(()=>{
		if(req.headers.referer.includes("/founder")){
			req.flash("success", "Unicorn successfully created! You may proceed to region selection.");
			res.redirect(303, "/region");
		} else if (req.headers.referer.includes("/build")){
			req.flash("success", "Unicorn successfully created!");
			res.redirect(303, "/index");
		}
	})
	.catch((err)=>{
		if (err) {
			req.flash('error', "Something's not right here...");
			console.error('Uhoh, there was an error (/build POST)', err);
			return res.redirect('/index');
		}
	})
})
.put([isLoggedIn, upload.any()], function(req, res){
	console.log("Incoming PUT user data in /build route: ");
	let userChoices = JSON.parse(req.body.userChoices);
	let unicornData = common.Helpers.setData(userChoices);
	let buffer = req.files[0].buffer;
	
	async function runUpload(foundImage, buffer, foundUnicorn) {
		console.log("running upload from /build .put");
		var path = foundImage.filename;
		var folder = `Unicorns/${foundUnicorn._id}/baseImg`;
		let options = {
			upload_preset: 'unicornBaseImgSave',
			resource_type: 'image',
			format: 'png',
			public_id: path,
			folder: folder
		}
		var bufferStream = new common.stream.PassThrough();
		bufferStream.end(Buffer.from(buffer));
		var upload = bufferStream.pipe(common.cloudinary.uploader.upload_stream(options, function (error, result) {
			console.log("cloudinary output in /build .put");
			console.log(error, result);
			foundImage.version = result.version;
			foundImage.save();
			return foundImage;
		}))
		foundUnicorn.set("imgs.baseImg", foundImage);
		return {
			foundUnicorn: foundUnicorn
		}
	}
	
	async function findImage(foundUnicorn) {
		console.log("finding and updating image document");
		const foundImage = await common.Image.findByIdAndUpdate(foundUnicorn.imgs.baseImg._id, {"$set": {"img.data": buffer}}, {new: true});
		return {
			foundUnicorn: foundUnicorn,
			foundImage: foundImage
		};
	}
	
	var unicornUpdate = common.Unicorn.findByIdAndUpdate(req.body.unicornId, { "$set": { "genes": unicornData.genes, "colors": unicornData.colors, "breedid": unicornData.breedid}}, {new: true})
	.populate({path: "imgs.baseImg imgs.equipBack imgs.equipFront", model: "Image"})
	.exec()
	.then((foundUnicorn) => findImage(foundUnicorn))
	.then((res1) => runUpload(res1.foundImage, buffer, res1.foundUnicorn))
	.then((res2) => {
		if(res2.foundUnicorn.equips.length !== 0){
			console.log("about to run composite from /build .put");
			common.Helpers.runComposite(res2.foundUnicorn)
		} else {
			return res2;
		}
	})
	.then((res3) => {
		return res3
	})
	.catch((err)=>{
		if (err) {
			req.flash('error', "Something's not right here... Something went wrong updating this Unicorn...");
			console.error('Uhoh, there was an error (/build PUT)', err)
			return res.redirect('/index');
		}
	})
	
	unicornUpdate.then(()=>{
		req.flash("success", "Unicorn successfully updated!");
		res.redirect(303, "/index");
	})
	.catch((err)=>{
		if (err) {
			req.flash('error', "Something's not right here...");
			console.error('Uhoh, there was an error (/build PUT)', err)
			return res.redirect('/index');
		}
	})
})

// SHOW equip
router.route("/equip")
.get(isLoggedIn, function(req, res){
	common.User.findById(req.user._id).populate({ path: 'unicorns', populate: { path: 'imgs.baseImg', model: 'Image' }}).exec(function(err, foundLoggedInUser){
		if (err) {
			req.flash('error', "Something's not right here... Couldn't find that user...");
			console.error('Uhoh, there was an error (/equip User.findById GET)', err)
			return res.redirect('/index');
		}
		
		let sort = common.Helpers.sortInventory();
		sort.then((result)=>{
			res.render("equip", {
				loggedInUser: foundLoggedInUser,
				inventoryBackdrops: result.inventoryBackdrops,
				inventoryCompanions: result.inventoryCompanions,
				inventoryDecorative: result.inventoryDecorative,
				inventoryEnvironment: result.inventoryEnvironment,
				inventoryGems: result.inventoryGems,
				inventoryTech: result.inventoryTech,
				inventoryTiles: result.inventoryTiles
			});
		})
	});
})
.put([isLoggedIn, upload.any()], function(req, res){
	console.log("Incoming PUT user data in /equip route: ");
	let userChoices = JSON.parse(req.body.userChoices);
	let unicornId = req.body.unicornId;
	let unicornCoords = JSON.parse(req.body.unicornCoords);
	var bufferBack = {
			buffer: req.files[0].buffer,
			filename: unicornId + "back"
		} 
	var bufferFront = {
			buffer: req.files[1].buffer,
			filename: unicornId + "front"
		}
	
	function runUpload(foundImage, buffer, foundUnicorn) {
		var equipFolder = `Unicorns/${unicornId}/equips`;
		let options = {
			upload_preset: 'equipSave',
			resource_type: 'image',
			format: 'png',
			public_id: foundImage.filename,
			folder: equipFolder
		}
		var bufferStream = new common.stream.PassThrough();
		bufferStream.end(Buffer.from(buffer.buffer));
		bufferStream.pipe(common.cloudinary.uploader.upload_stream(options, function(error, result) {
			// console.log("output from cloudinary upload: ");
			// console.log(error, result);
			foundImage.public_id = result.public_id;
			foundImage.etag = result.etag;
			foundImage.version = result.version;
			foundImage.save();
			return foundImage;
		}))
		if(foundImage.filename.includes("back")){
			foundUnicorn.set("imgs.equipBack", foundImage);
		} else if(foundImage.filename.includes("front")){
			foundUnicorn.set("imgs.equipFront", foundImage);
		}
		return {
			foundUnicorn: foundUnicorn
		}
	}
	
	async function saveEquipImgBack(foundUnicorn) {
		const foundImage = await common.Image.findOneAndUpdate({ "filename": bufferBack.filename }, { "$set": { "filename": bufferBack.filename, "img.data": bufferBack.buffer } }, { upsert: true, new: true });
		return {
			foundImageBack: foundImage,
			foundUnicorn: foundUnicorn
		};
	}
	async function saveEquipImgFront(foundUnicorn) {
		const foundImage = await common.Image.findOneAndUpdate({ "filename": bufferFront.filename }, { "$set": { "filename": bufferFront.filename, "img.data": bufferFront.buffer } }, { upsert: true, new: true });
		return {
			foundImageFront: foundImage,
			foundUnicorn: foundUnicorn
		};
	}
	
	var unicornUpdate = common.Unicorn.findByIdAndUpdate({_id: unicornId}, { "$set": { "equips": userChoices, "canvasposition.x": unicornCoords.x, "canvasposition.y": unicornCoords.y}}, {new: true})
	.populate("imgs.baseImg")
	.exec()
	.then((foundUnicorn) => saveEquipImgBack(foundUnicorn))
	.then((res1) => runUpload(res1.foundImageBack, bufferBack, res1.foundUnicorn))
	.then((res2) => {
		return res2.foundUnicorn
	})
	.then((foundUnicorn) => saveEquipImgFront(foundUnicorn))
	.then((res3) => runUpload(res3.foundImageFront, bufferFront, res3.foundUnicorn))
	.then((res4) => common.Helpers.runComposite(res4.foundUnicorn))
	.then((res5) => {
		return res5
	})
	.catch((err)=>{
		if (err) {
			req.flash('error', "Something's not right here... Something went wrong updating this Unicorn's equips...");
			console.error('Uhoh, there was an error (/equip PUT)', err)
			return res.redirect('/index');
		}
	})
	unicornUpdate.then((output)=>{
		req.flash("success", "Equips successfully updated!");
		res.redirect(303, "/equip");
	})
})


//MIDDLEWARE FOR CHECKING LOGIN STATUS
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//middleware for checking if loggedIn user finished registration
function finishedRegistration(req, res, next) {
	common.User.findById(req.user._id).populate({path: "region"}).populate({path: "unicorns"}).exec(function(err, foundUser){
		if(!foundUser.region || foundUser.unicorns.length === 0) {
			req.flash("error", "You haven't finished registration yet! Please create your founder and then proceed to selecting your home region.");
			res.redirect("/founder");
		} else {
			return next();
		}
	});
}


module.exports = router;