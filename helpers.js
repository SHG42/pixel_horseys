var express 			= require("express"),
	mongoose    		= require("mongoose"),
	Sharp				= require('sharp'),
	cloudinary 			= require('cloudinary').v2,
	fs 					= require('fs'),
	path 				= require('path'),
	stream 				= require('stream');
var User        = require("./models/user"),
    Unicorn     = require("./models/unicorn"),
    Region      = require("./models/region"),
	BaseColor	= require("./models/baseColor"),
	Breed       = require("./models/breed"),
	Gene        = require("./models/gene"),
	Image		= require("./models/image"),
	Inventory	= require("./models/inventory.js");
Sharp.cache(false);
console.log("Hello from Helpers");

//IMAGE COMPOSITE
function runComposite(foundUnicorn) {
	console.log("data from equip function in Helpers: ");
	var backEquips = foundUnicorn.imgs.equipBack;
	var frontEquips = foundUnicorn.imgs.equipFront;
	var baseImg = foundUnicorn.imgs.baseImg;
	var filename = `${foundUnicorn._id}_cmp`
	var x = parseInt(foundUnicorn.canvasposition.x, 10);
	var y = parseInt(foundUnicorn.canvasposition.y, 10);
	
	function runUpload(foundImage, buffer, foundUnicorn) {
		var equipFolder = `Unicorns/${foundUnicorn._id}`;
		let options = {
			upload_preset: 'unicornBaseImgSave',
			resource_type: 'image',
			format: 'png',
			public_id: foundImage.filename,
			folder: equipFolder
		}
		var bufferStream = new stream.PassThrough();
		bufferStream.end(Buffer.from(buffer.buffer));
		bufferStream.pipe(cloudinary.uploader.upload_stream(options, function(error, result) {
			console.log("output from cloudinary upload: ");
			// console.log(error, result);
			foundImage.public_id = result.public_id;
			foundImage.etag = result.etag;
			foundImage.version = result.version;
			foundImage.save();
			return foundImage;
		}))
		foundUnicorn.set("imgs.img", foundImage);
		foundUnicorn.save();
		return {
			foundUnicorn: foundUnicorn
		}
	}
	
	//run sharp composite : image order- back->baseImg->front | dimensions from back/front | offset baseImg using unicornCoords
	var output = Sharp({
		create: {
			width: 900,
			height: 700,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 1 }
		}
	})
	.composite([
	{
		input: backEquips.img.data,
		top: 0,
		left: 0
	},
	{
		input: baseImg.img.data,
		top: 650,
		left: 850,
		// gravity: "northwest"
	}, 
	{
		input: frontEquips.img.data,
		top: 0,
		left: 0
	}
	])
	.withMetadata()
	.png()
	.toBuffer()
	.then((result) => Image.findOneAndUpdate({ "filename": filename}, { "$set": {"filename": filename, "img.data": result}}, {upsert: true, new: true}) )
	.then((result2) => runUpload(result2, result2.img.data, foundUnicorn))
	.then((result3) => {
		return result3
	})
	return output
}

//SET INCOMING USERCHOICES DATA
function setData(userChoices) {
	var data = {
		breedid: userChoices.breedPick.id,
		genes: 
		{
			bodyGene: {
				geneId: userChoices.genePicks.bodyGene.id,
				colorable: userChoices.genePicks.bodyGene.colorable,
				geneName: userChoices.genePicks.bodyGene.name,
				baseImg: userChoices.genePicks.bodyGene.src
			},
			hairGene: {
				geneId: userChoices.genePicks.hairGene.id,
				colorable: userChoices.genePicks.hairGene.colorable,
				geneName: userChoices.genePicks.hairGene.name,
				baseImg: userChoices.genePicks.hairGene.src
			},
			tertiaryGene: {
				geneId: userChoices.genePicks.tertiaryGene.id,
				colorable: userChoices.genePicks.tertiaryGene.colorable,
				geneName: userChoices.genePicks.tertiaryGene.name,
				baseImg: userChoices.genePicks.tertiaryGene.src
			},
			eyeGene: {
				geneId: userChoices.genePicks.eyeGene.id,
				colorable: userChoices.genePicks.eyeGene.colorable,
				geneName: userChoices.genePicks.eyeGene.name,
				baseImg: userChoices.genePicks.eyeGene.src
			},
			hornGene: {
				geneId: userChoices.genePicks.hornGene.id,
				colorable: userChoices.genePicks.hornGene.colorable,
				geneName: userChoices.genePicks.hornGene.name,
				baseImg: userChoices.genePicks.hornGene.src
			},
			hoofGene: {
				geneId: userChoices.genePicks.hoofGene.id,
				colorable: userChoices.genePicks.hoofGene.colorable,
				geneName: userChoices.genePicks.hoofGene.name,
				baseImg: userChoices.genePicks.hoofGene.src
			}
		},
		colors: userChoices.colors
	}
	// console.log("data in Helpers: ");
	// console.log(data);
	return data;
}

//RESET FUNCTION
function dbReset(){
	// Unicorn.find({}, function(err, unicorns){
	// 	if (err) return console.error('Uhoh, there was an error', err)
	// 	unicorns.forEach(function(unicorn){
	// 		for(var i=0; i <= unicorn.equips.length; i++) {
	// 			unicorn.equips.pop();
	// 		}
	// 		unicorn.save();
	// 		console.log("removed equips");
	// 	});
	// })
	
	// User.find({}).populate("unicorns").exec(function(err, users){
	// 	if (err) return console.error('Uhoh, there was an error', err)
	// 	users.forEach(function(user){
	// 		for(var i=0; i <= user.unicorns.length; i++) {
	// 			user.unicorns.pop();
	// 		}
	// 		user.save();
	// 		console.log("removed unicorns");
	// 	});
	// })
	
	// User.deleteMany({}, function(err){
	// 	if (err) return console.error('Uhoh, there was an error', err)
	// 	console.log("removed users");
	// });
	// User.counterReset('userid', function(err){
	// 	if (err) return console.error('Uhoh, there was an error', err)
	// 	console.log("reset incremented users ids");
	// });
	
	// Unicorn.deleteMany({}, function(err){
	// 	if (err) return console.error('Uhoh, there was an error', err)
	// 	console.log("removed unicorns");
	// });
	// Unicorn.counterReset('uniid', function(err){
	// 	if (err) return console.error('Uhoh, there was an error', err)
	// 	console.log("reset incremented unicorn ids");
	// });
	// Image.deleteMany({}, function(err){
	// 	if (err) return console.error('Uhoh, there was an error', err)	
	// 	console.log("removed images");
	// });
	// Inventory.counterReset('inventoryid', function(err){
	// 	if (err) return console.error('Uhoh, there was an error', err)
	// 	console.log("reset incremented inventory ids");
	// });
}


module.exports = {setData, dbReset, runComposite};