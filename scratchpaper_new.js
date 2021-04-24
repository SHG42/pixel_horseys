//CORRECT ANIMS BUT NO FORWARD LEAP
this.hero.body.velocity.x = 0;
		
		var isOnGround = (this.hero.body.blocked.down || this.hero.body.touching.down);
		var isJumping = (!isOnGround && !this.hero.isGrabbing);
    
		//Running anims
		if (this.controls.left.isDown && this.controls.right.isUp && this.controls.up.isUp) {
			this.hero.body.velocity.x = -150;
			this.hero.animations.play('run-left');
		} else if (this.controls.right.isDown && this.controls.left.isUp && this.controls.up.isUp) {
			this.hero.body.velocity.x = 150;
			this.hero.animations.play('run-right');
		} 
		
		if(this.runRight.isPlaying && this.controls.up.isDown || isJumping) {
		   this.runRight.stop(false, true);
		} else if(this.runLeft.isPlaying && this.controls.up.isDown || isJumping) {
		   this.runLeft.stop(false, true);
		}
    
        //Jumping
        if (this.controls.up.isDown && this.controls.up.justDown && isOnGround) {
            this.hero.body.velocity.y = -400;
        }
		
		if (isJumping && this.hero.whichDirection == "left" && this.controls.left.isUp && this.controls.right.isUp) {
		this.hero.animations.play('up-left');
		} else if (isJumping && this.hero.whichDirection == "right" && this.controls.left.isUp && this.controls.right.isUp) {
		this.hero.animations.play('up-right');
		}
		
		if(this.upRight.isPlaying && isOnGround) {
		   this.upRight.stop(false, true);
		} else if(this.upLeft.isPlaying && isOnGround) {
		   this.upLeft.stop(false, true);
		}
		
		if(isJumping && this.hero.whichDirection == "left" && this.controls.left.justDown && this.controls.right.isUp) {
			this.hero.body.velocity.x -= 250;
			console.log(this.hero.body);
			this.hero.animations.play('jump-left');
		} else if(isJumping && this.hero.whichDirection == "right" && this.controls.right.justDown && this.controls.left.isUp) {
			this.hero.body.velocity.x += 250;
			this.hero.animations.play('jump-right');
		}


//v2
this.hero.isJumpingUP = false;
        this.hero.isJumpingFWD = false;
this.controls.up.onUp.add(function() { this.hero.isJumpingUP = false; }, this);
		this.controls.up.onDown.add(function() { this.hero.isJumpingUP = true; }, this);
		
		this.controls.down.onUp.add(function() { this.hero.isJumpingFWD = false; }, this);
		this.controls.down.onDown.add(function() { this.hero.isJumpingFWD = true; }, this);
		
 //Running anims
// this.hero.body.velocity.y -= 400;
			// this.hero.body.velocity.x -= 200;
			// this.hero.body.velocity.x += 200;

        if (this.controls.left.isDown && this.controls.right.isUp && this.controls.down.isUp && this.controls.up.isUp) {
            this.hero.body.velocity.x -= 150;
            this.hero.animations.play('run-left');
        } else if (this.controls.right.isDown && this.controls.left.isUp && this.controls.down.isUp && this.controls.up.isUp) {
            this.hero.body.velocity.x += 150;
            this.hero.animations.play('run-right');
        } 
		
		if(this.runRight.isPlaying && (this.controls.down.isDown || this.controls.up.isDown)) {
		   this.runRight.stop(false, true);
		} else if(this.runLeft.isPlaying && (this.controls.down.isDown || this.controls.up.isDown)) {
		   this.runLeft.stop(false, true);
		}
    
        //Jumping
        //timer prevents rapid jumping
        if(this.hero.whichDirection == "left" && this.hero.isJumpingUP && (this.hero.body.blocked.down || this.hero.body.touching.down) && this.controls.left.isUp && this.game.time.now > this.jumpTimer) {
			this.hero.animations.play('up-left');
			this.hero.body.velocity.y -= 400;
			this.jumpTimer = this.game.time.now + 1000;
		} else if(this.hero.whichDirection == "right" && this.hero.isJumpingUP && (this.hero.body.blocked.down || this.hero.body.touching.down) && this.controls.right.isUp && this.game.time.now > this.jumpTimer) {
			this.hero.animations.play('up-right');
			this.hero.body.velocity.y -= 400;
			this.jumpTimer = this.game.time.now + 1000;
		}
		
		if((this.upRight.isPlaying && this.controls.up.isUp) || (this.upRight.isPlaying && (this.hero.body.blocked.down || this.hero.body.touching.down))) {
		   this.upRight.stop(false, true);
		} else if((this.upLeft.isPlaying && this.controls.up.isUp) || (this.upLeft.isPlaying && (this.hero.body.blocked.down || this.hero.body.touching.down))) {
		   this.upLeft.stop(false, true);
		}
		
    	//leaping (run/jump)
        if(this.hero.whichDirection == "left" && this.hero.isJumpingFWD && (this.hero.body.blocked.down || this.hero.body.touching.down) && this.controls.left.isDown && this.game.time.now > this.jumpTimer) {
			this.hero.animations.play('jump-left');	
			this.hero.body.velocity.y -= 400;
			this.jumpTimer = this.game.time.now + 1500;
		} else if(this.hero.whichDirection == "right" && this.hero.isJumpingFWD && (this.hero.body.blocked.down || this.hero.body.touching.down) && this.controls.right.isDown && this.game.time.now > this.jumpTimer) {
			this.hero.animations.play('jump-right');	
			this.hero.body.velocity.y -= 400;
			this.jumpTimer = this.game.time.now + 1500;
		}

//Jumping NEW v1
// this.controls.up.onUp.add(function() { this.hero.isJumpingUP = false; }, this);
		// this.controls.up.onDown.add(function() { this.hero.isJumpingUP = true; }, this);
		
		// this.controls.down.onUp.add(function() { this.hero.isJumpingFWD = false; }, this);
		// this.controls.down.onDown.add(function() { this.hero.isJumpingFWD = true; }, this);
    
        //timer prevents rapid jumping
        if(this.hero.isJumpingUP && this.hero.whichDirection == "left" && this.game.time.now > this.jumpTimer) {
			this.hero.animations.play('up-left');
			this.hero.body.velocity.y -= 400;
			this.jumpTimer = this.game.time.now + 1000;
		} else if(this.hero.isJumpingUP && this.hero.whichDirection == "right" && this.game.time.now > this.jumpTimer) {
			this.hero.animations.play('up-right');
			this.hero.body.velocity.y -= 400;
			this.jumpTimer = this.game.time.now + 1000;
		}
		
		if(this.upRight.isPlaying && !this.hero.isJumpingUP) {
		   this.upRight.stop(false, true);
		} else if(this.upLeft.isPlaying && !this.hero.isJumpingUP) {
		   this.upLeft.stop(false, true);
		}
//leaping (run/jump)
        if(this.hero.isJumpingFWD && this.hero.whichDirection == "left" && this.controls.left.isDown && this.game.time.now > this.jumpTimer) {
			this.hero.animations.play('jump-left');	
			this.hero.body.velocity.x -= 200;
			this.hero.body.velocity.y -= 400;
			this.jumpTimer = this.game.time.now + 1000;
		} else if(this.hero.isJumpingFWD && this.hero.whichDirection == "right" && this.controls.right.isDown && this.game.time.now > this.jumpTimer) {
			this.hero.animations.play('jump-right');	
			this.hero.body.velocity.x += 200;
			this.hero.body.velocity.y -= 400;
			this.jumpTimer = this.game.time.now + 1000;
		}

//old jumping
//vertical jumping
        if (this.controls.up.isDown && this.hero.whichDirection == 'left' && this.game.time.now > this.jumpTimer && (this.hero.body.blocked.down || this.hero.body.touching.down)) {
            this.hero.animations.play('jump-left');
            this.hero.body.velocity.y -= 400;
            this.jumpTimer = this.game.time.now + 1000;
        } else if (this.controls.up.isDown && this.hero.whichDirection == 'right' && this.game.time.now > this.jumpTimer && (this.hero.body.blocked.down || this.hero.body.touching.down)) {
            this.hero.animations.play('jump-right');
            this.hero.body.velocity.y -= 400;
            this.jumpTimer = this.game.time.now + 1000;
        }
    	//leaping (run/jump)
        if (this.hero.isJumping && this.controls.left.isDown && this.controls.up.isDown) {
            this.hero.body.velocity.x -= 200;
        } else if (this.hero.isJumping && this.controls.right.isDown && this.controls.up.isDown) {
            this.hero.body.velocity.x += 200;
        }



common.Inventory.find({}, function(err, foundAllItems){
			let sorted = common.Helpers.sortInventory(foundAllItems);
		});

//sort v1:
function sortInventory() {
	Inventory.find({category: 'backdrops'}, function(err, foundBackdrops){
		if (err) return console.error('Uhoh, there was an error(inventory sort: backdrops)', err)
		let inventoryBackdrops = foundBackdrops;
		return inventoryBackdrops;
	});
	Inventory.find({category: 'companions'}, function(err, foundCompanions){
		if (err) return console.error('Uhoh, there was an error(inventory sort: companions)', err)
		let inventoryCompanions = foundCompanions;
		return inventoryCompanions;
	});
	Inventory.find({category: 'decorative'}, function(err, foundDecorative){
		if (err) return console.error('Uhoh, there was an error(inventory sort: decorative)', err)
		let inventoryDecorative = foundDecorative;
		return inventoryDecorative;
	});
	Inventory.find({category: 'environment'}, function(err, foundEnvironment){
		if (err) return console.error('Uhoh, there was an error(inventory sort: environment)', err)
		let inventoryEnvironment = foundEnvironment;
		return inventoryEnvironment;
	});
	Inventory.find({category: 'gems'}, function(err, foundGems){
		if (err) return console.error('Uhoh, there was an error(inventory sort: gems)', err)
		let inventoryGems = foundGems;
		return inventoryGems;
	});
	Inventory.find({category: 'tech'}, function(err, foundTech){
		if (err) return console.error('Uhoh, there was an error(inventory sort: tech)', err)
		let inventoryTech = foundTech;
		return inventoryTech;
	});
	Inventory.find({category: 'tiles'}, function(err, foundTiles){
		if (err) return console.error('Uhoh, there was an error(inventory sort: tiles)', err)
		let inventoryTiles = foundTiles;
		return inventoryTiles;
	});
	return {
		inventoryBackdrops: inventoryBackdrops,
		inventoryCompanions: inventoryCompanions,
		inventoryDecorative: inventoryDecorative,
		inventoryEnvironment: inventoryEnvironment,
		inventoryGems: inventoryGems,
		inventoryTech: inventoryTech,
		inventoryTiles: inventoryTiles
	}
}



<script>
	var submitButton = document.getElementById("exploreSubmit");
	submitButton.addEventListener("click", submitData);
	async function submitData() {
		let response = await fetch('/explore', {
			method: 'PUT',
			redirect: "follow",
			body: "win"
		});
		let result = await response;
		console.log(result);
		if(result.ok) {
			window.location = "/index";
		}
	}
</script>





common.Unicorn.findById({_id: req.body.unicornId}, function(err, foundUnicorn){
		if (err) return console.error('Uhoh, there was an error (/equip Unicorn.findOne PUT)', err)
		userChoices.forEach(function(choice){
			foundUnicorn.equips.push(choice);
		});
	
		common.Image.findOneAndUpdate({"img.data": bufferBack}, { "$set": { "img.data": bufferBack}}, {upsert: true, new: true}, function(err, foundImage){
			if (err) return console.error('Uhoh, there was an error (/equip Image.findOneAndUpdate Back PUT)', err)
			foundImage.filename = foundUnicorn._id.valueOf() + "back";
			if(foundUnicorn.equipImgBack === undefined) {
				foundUnicorn.equipImgBack = foundImage;
			}
			////Save image to Cloudinary HERE
			var path = foundImage.filename;
			var equipFolder = `equips/${foundUnicorn._id}`
			let options = {
				upload_preset: 'equipSave',
				resource_type: 'image',
				format: 'png',
				public_id: foundImage.filename,
				folder: equipFolder
			}
			var bufferStream = new common.stream.PassThrough();
			bufferStream.end(Buffer.from(bufferBack));
			bufferStream.pipe(common.cloudinary.uploader.upload_stream(options, function(error, result) {
				console.log("output from cloudinary upload: ");
				console.log(error, result);
				//get returned data and push to newUnicorn and newImage
				foundImage.public_id = result.public_id;
				foundImage.etag = result.etag;
				foundImage.version = result.version; 
				foundImage.save();
			}))
		})
		common.Image.findOneAndUpdate({"img.data": bufferFront}, { "$set": { "img.data": bufferFront}}, {upsert: true, new: true}, function(err, foundImage){
			if (err) return console.error('Uhoh, there was an error (/equip Image.findOneAndUpdate Front PUT)', err)
			foundImage.filename = foundUnicorn._id.valueOf() + "front";
			if(foundUnicorn.equipImgFront === undefined) {
				foundUnicorn.equipImgFront = foundImage;
			}
			////Save image to Cloudinary HERE
			var path = foundImage.filename;
			var equipFolder = `equips/${foundUnicorn._id}`
			let options = {
				upload_preset: 'equipSave',
				resource_type: 'image',
				format: 'png',
				public_id: foundImage.filename,
				folder: equipFolder
			}
			var bufferStream = new common.stream.PassThrough();
			bufferStream.end(Buffer.from(bufferFront));
			bufferStream.pipe(common.cloudinary.uploader.upload_stream(options, function(error, result) {
				console.log("output from cloudinary upload: ");
				console.log(error, result);
				//get returned data and push to newUnicorn and newImage
				foundImage.public_id = result.public_id;
				foundImage.etag = result.etag;
				foundImage.version = result.version;
				foundImage.save();
			}))
		});
		foundUnicorn.save();
		res.redirect(303, "/index");
	});



, populate: { path: 'equipImgBack', model: 'Image' }, populate: { path: 'equipImgFront', model: 'Image' }

img: [
		{ 
			type: mongoose.Schema.Types.ObjectId,
			ref: "Image",
			imgId: String,
		}
	]


equipImgs: {
		equipImgFront: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Image"
		},
		equipImgBack: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Image"
		}
	},


function setGenes() {
	//double-check lineart selection from menu: use currently selected lineart even if no change in dropdown value
	var picked = lineartMenu.selectedOptions[0].dataset;
	var currentLineartId = picked.lineartid;
	lineart.id = currentLineartId;
	for(var i=0; i < geneMenus.length; i++) {
		var selectedOption = geneMenus[i].selectedOptions[0].dataset;
		console.log(geneMenus[i].selectedOptions[0]);
		let chosenGeneBaseId = selectedOption.geneid;
		let chosenGeneClass = selectedOption.geneclass;
		let fullGeneId = `${chosenGeneBaseId}_${currentLineartId}`;
		// console.log(chosenGeneBaseId, chosenGeneClass, fullGeneId);
		////ierate over breedGenes and find matches to selections
		breedGenes.forEach(function(gene){
			if(chosenGeneClass === undefined) {
				// console.log("No gene chosen in this slot");	
			} else if(chosenGeneClass.includes("body") && gene.id === fullGeneId) {
				selectedGenes.bodyGene.colorable = gene.colorable;
				selectedGenes.bodyGene.id = fullGeneId;
				selectedGenes.bodyGene.src = gene.baseImg;
				selectedGenes.bodyGene.name = gene.name;
			} else if(chosenGeneClass.includes("hair") && gene.id === fullGeneId) {
				selectedGenes.hairGene.colorable = gene.colorable;
				selectedGenes.hairGene.id = fullGeneId;
				selectedGenes.hairGene.src = gene.baseImg;
				selectedGenes.hairGene.name = gene.name;
			} else if(chosenGeneClass.includes("tert") && gene.id === fullGeneId) {
				selectedGenes.tertiaryGene.colorable = gene.colorable;
				selectedGenes.tertiaryGene.id = fullGeneId;
				selectedGenes.tertiaryGene.src = gene.baseImg;
				selectedGenes.tertiaryGene.name = gene.name;
			} else if(chosenGeneClass.includes("eye") && gene.id === fullGeneId) {
				selectedGenes.eyeGene.colorable = gene.colorable;
				selectedGenes.eyeGene.id = fullGeneId;
				selectedGenes.eyeGene.src = gene.baseImg;
				selectedGenes.eyeGene.name = gene.name;
			} else if(chosenGeneClass.includes("horn") && gene.id === fullGeneId) {
				selectedGenes.hornGene.colorable = gene.colorable;
				selectedGenes.hornGene.id = fullGeneId;
				selectedGenes.hornGene.src = gene.baseImg;
				selectedGenes.hornGene.name = gene.name;
			} else if(chosenGeneClass.includes("hoof") && gene.id === fullGeneId) {
				selectedGenes.hoofGene.colorable = gene.colorable;
				selectedGenes.hoofGene.id = fullGeneId;
				selectedGenes.hoofGene.src = gene.baseImg;
				selectedGenes.hoofGene.name = gene.name;
			} 
		});
	}
	showGenes();
}





<div class="getpretty col-12 col-lg-6 my-2">
			<form id="buildform" method="GET" action="/home/<%= loggedInUser.userid %>/build">
				<label for="unicornSelect" class="select-label bg-dark border border-light rounded-1 p-2">Choose a Unicorn to Customize:</label>
				<select name="yourUnicorns" class="custom-select text-center" id="unicornSelect">
					<option value="" selected>--Please choose an option--</option>
					<% loggedInUser.unicorns.forEach(function(unicorn){ %>
					<option value="<%= unicorn._id %>" class="unicorn" data-lineartid="<%= unicorn.breedid %>"><%= unicorn.name %></option>
					<!-- replace unicorn.id with unicorn.name after integration -->
					<% }); %>	
				</select>
			</form>
        </div>

<% loggedInUser.unicorns.forEach(function(unicorn){ %>
	<p class="textboxes"><%= unicorn %></p>
	<% }); %>	


var editbutton= document.getElementById("editbutton");
	var editform = document.querySelector("#lore");
	var sendlore = document.getElementById("sendlore");
	editbutton.addEventListener("click", showForm);
	
	function showForm(){
		tinymce.init({
			selector: '#lore',
			width: 600,
    		height: 300,
			toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent'
		});
	}
 
 style="background-image: url(../<%= loggedInUser.region.homeBG %>)"

//callback to promise attempt 1
var newUnicorn = new Unicorn({unicornData});
	files.forEach(function(file){
		var buffer = file.buffer;
		User.findById(req.user._id)
		.exec()
		.then((foundLoggedInUser)=>{
			newUnicorn
			.save()
			.then((unicorn)=>{
				
			})
		})
		.catch((err) => {
		  res.json(`Error ${err}`);
		});
	});


module.exports.express = express; 
	module.exports.app = app; 
	module.exports.bodyParser = bodyParser; 
	module.exports.methodOverride = methodOverride; 
	module.exports.mongoose = mongoose; 
	module.exports.expressSanitizer = expressSanitizer; 
	module.exports.passport = passport; 
	module.exports.LocalStrategy = LocalStrategy; 
	module.exports.passportLocalMongoose = passportLocalMongoose; 
	module.exports.fs = fs; 
	module.exports.path = path; 
	module.exports.stream = stream; 
	module.exports.multer = multer; 
	module.exports.cloudinary = cloudinary; 
	module.exports.Konva = Konva; 
	module.exports.mstorage = mstorage; 
	module.exports.upload = upload; 



var {
	express, 
	app, 
	bodyParser, 
	methodOverride, 
	mongoose, 
	expressSanitizer, 
	passport, 
	LocalStrategy, 
	passportLocalMongoose, 
	fs, 
	path, 
	stream, 
	multer, 
	cloudinary, 
	Konva, 
	mstorage, 
	upload
} = require("../app");
EXPRESS=("express")
APP=express()
BODYPARSER=("body-parser")
METHODOVERRIDE=("method-override")
MONGOOSE=("mongoose")
EXPRESSSANITIZER=("express-sanitizer")
PASSPORT=("passport")
LOCALSTRATEGY=("passport-local")
PASSPORTLOCALMONGOOSE=("passport-local-mongoose")
FS=('fs')
PATH=('path')
STREAM=('stream')
MULTER=('multer')
CLOUDINARY=('cloudinary').v2
KONVA=('konva')
module.exports = {express, app, bodyParser, methodOverride, mongoose, expressSanitizer, passport, LocalStrategy, passportLocalMongoose, fs, path, stream, multer, cloudinary, Konva, mstorage, upload}
//row-cols
gridRow row row-cols-1 row-cols-md-2 row-cols-lg-4

//looping each breed
<div class="gridRow row">
            <div class="col-12 col-sm-6 col-lg-3 mb-1 d-flex align-items-stretch">
			<% Breeds.forEach((breed)=>{ %>
				<div class="card align-content-center">
                    <img class="founders card-img-top" src="<%= breed.lineart.baseImg %>" id="<%= breed.id %>" alt="Card image">
                    <div class="uniCard card-body">
                        <h5 class="card-title">Breed Name</h5>
                        <p class="card-text">Breed Native Region</p>
                    </div>
                </div>
			<% }) %>
            </div>
        </div>


///////////////////////////////////////////////
<div class="uniSlot">
  <img class="uniSlot-img card-img-top" src="<%= unicorn.uniPic %>" alt="Card image cap">
  <div class="card m-3 p2">
	  <div class="petcard-body">
		  <h5 class="card-title"><%= unicorn.name %></h5>
		  <p class="card-text">Unicorn Stats go here</p>
		  <button class="btn btn-outline-dark btn-sm" data-toggle="modal" data-target="#nameModal" data-clickedid="<%= unicorn._id %>"><i class="fas fa-pencil-alt"></i> Name</button>
		  <a href="/home/unicorn/<%= unicorn._id %>" class="btn btn-outline-dark btn-sm"><i class="fas fa-pencil-alt"></i> Bio</a>
	  </div>
  </div>
</div>

///////////////////////////////////////////

style="background-image: url(../<%= yourRegion.homeBG %>)"

db.unicorns.updateMany({uniName: "Flaxen Sorrel Unicorn"}, {$set: {uniPic: "http://pixel-horseys-ygjlr.run.goorm.io/resources/unicons/flaxensorrel.png"}})

//////////////////////////////////////

<div class="unicorngroup d-flex justify-content-around flex-column flex-sm-row m-4">
	<% yourUnicorns.forEach(function(unicorn){ %>
	<div class="uniSlot">
		<img class="uniSlot-img card-img-top" src="<%= unicorn.uniPic %>" alt="Card image cap">
		<div class="card m-3 p2">
			<div class="petcard-body">
				<h5 class="card-title"><%= unicorn.name %></h5>
				<p class="card-text">Unicorn Stats go here</p>
				<button class="btn btn-outline-dark btn-sm" data-toggle="modal" data-target="#nameModal" data-clickedid="<%= unicorn._id %>"><i class="fas fa-pencil-alt"></i> Name</button>
				<a href="/home/unicorn/<%= unicorn._id %>" class="btn btn-outline-dark btn-sm"><i class="fas fa-pencil-alt"></i> Bio</a>
			</div>
		</div>
	</div>
	<% }); %>  
</div>

//////////////////////////////

<div class="homepage container-fluid" style="background-image: url(../<%= yourRegion.homeBG %>)">
	<% include ./partials/navbar %>
    <div class="my-5">
        <div class="unicorngroup d-flex justify-content-around flex-column flex-sm-row m-4">
        	<% yourUnicorns.forEach(function(unicorn){ %>
			<div class="uniSlot">
			  	<img class="uniSlot-img card-img-top" src="<%= unicorn.uniPic %>" alt="Card image cap">
			  	<div class="card m-3 p2">
				  	<div class="petcard-body">
					  	<h5 class="card-title"><%= unicorn.name %></h5>
					  	<p class="card-text">Unicorn Stats go here</p>
					  	<button class="btn btn-outline-dark btn-sm" data-toggle="modal" data-target="#nameModal" data-clickedid="<%= unicorn._id %>"><i class="fas fa-pencil-alt"></i> Name</button>
					  	<a href="/home/unicorn/<%= unicorn._id %>" class="btn btn-outline-dark btn-sm"><i class="fas fa-pencil-alt"></i> Bio</a>
				  	</div>
			  	</div>
			</div>
			<% }); %>  
        </div>
    </div>
</div>

//////////////////////////////////////////////

<div class="unicornPage jumbotron jumbotron-fluid text-center my-0">
    <div class="container">
        <div class="unicornHeader p-2 d-flex flex-column flex-lg-row justify-content-around">
            <div class="flex-column">
                <p class="mx-2"><%= unicorn.name %></p>
                <span class="stats">Level: <%= unicorn.lvl %></span>
            </div>
            <div class="stats mx-2">
                <div class="flex-column">
                    <span>Energy: <%= unicorn.energy %></span><br>
                    <span>Hunger: <%= unicorn.hunger %></span>
                </div>
                <div class="flex-column">
                    <span>Parents: <%= unicorn.parent1 %>, <%= unicorn.parent2 %></span><br>
                    <span>RTB: <%= unicorn.breedable %></span>
                </div>
            </div>
            <span class="backdrop-options mx-2">
                <div class="dropdown">
                  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Default Backdrops
                  </button>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="#">Arctic</a>
                    <a class="dropdown-item" href="#">Mountains</a>
                    <a class="dropdown-item" href="#">Forest</a>
                    <a class="dropdown-item" href="#">Swamp</a>
                    <a class="dropdown-item" href="#">Savannah</a>
                    <a class="dropdown-item" href="#">Desert</a>
                  </div>
                </div>
                <div class="dropdown d-inline">
                  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Your Backdrops
                  </button>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="#">Backdrops</a>
                    <a class="dropdown-item" href="#">Backdrops</a>
                    <a class="dropdown-item" href="#">Backdrops</a>
                  </div>
                </div>
            </span>
        </div>
        <div class="unicornSpace my-2">
            <img src="<%= unicorn.uniPic %>" class="img-fluid">
        </div>
        <div class="lore">
            <fieldset class="lorebox">
                <h2 class=""><%= unicorn.name %>'s Lore</h2>
                <div>
                    <%= unicorn.lore %>
                </div>
                <form action="/editlore" method="POST" name="editlore">
                    <a href="/home/unicorn/<%= unicorn._id %>/edit" class="btn btn-primary">Edit</a>
                </form>
            </fieldset>
        </div>
    </div>
</div>

//////////////////////////////////////////////////////

<div class="genepicker dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Dropdown button
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
                        <a class="dropdown-item" href="#">Something else here</a>
                    </div>
                    <input type="color" name="colorpicker" id="" class="customcolorpicker">
                </div>
                <div class="genepicker dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Dropdown button
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
                        <a class="dropdown-item" href="#">Something else here</a>
                    </div>
                    <input type="color" name="colorpicker" id="" class="customcolorpicker">
                </div>
                <div class="genepicker dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Dropdown button
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
                        <a class="dropdown-item" href="#">Something else here</a>
                    </div>
                    <input type="color" name="colorpicker" id="" class="customcolorpicker">
                </div>
                <div class="buttons">
                    <button class="btn btn-primary">Test</button>
                    <button class="submit btn btn-success">Confirm</button>
                </div>
				
				
======================================================

OLD EDIT ROUTE
User.findOne({userid: req.params.userid}, function(err, foundOwner){
			Unicorn.findOne({uniid: req.params.uniid}, function(err, foundUnicorn){
			   if(err) {
					res.redirect("/home");
			   } else {
				   	//if user logged in, does user own this unicorn? (does id of logged-in user match id of owner on unicorn)
					res.render("editlore", {currentOwner: foundOwner, unicorn: foundUnicorn});
			   }
			});
		});
