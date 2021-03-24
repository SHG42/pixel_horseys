//stop upscaling
tr.on('transform', function () {
	tr.boundBoxFunc(function(oldBox, newBox) {
	  	if (Math.abs(newBox.width) > tr.node().width()) {
            return oldBox;
        }
		return newBox;
	});
	// var scale = tr.node().scale();
	// if(scale.x >= 1 && scale.y >= 1) {
	// 	tr.stopTransform();
	// 	unscaleItem();
	// }
});



function updateContent(origin) {
		if(origin === "bio"){
			var titletext = "Help: Bio Editor";
			var bodytext = [`<p>To activate the Bio Editor, click inside the double-bordered box (the element labeled 'lore-form' for users assisted by screen readers). To close the Bio Editor without saving any changes, click the Cancel button, or click outside the double-bordered box.</p>`];
			setContent(titletext, bodytext);
		} else if(origin === "build"){
			var titletext = "Help: Genetic Builder";
			var bodytext = [`<p>How to use the genetic builder:</p>`, `<p>To create a new Unicorn, select one of the base sprites from the Breeds dropdown list (labeled 'choose a base sprite' for users with screen readers). To customize an existing Unicorn, choose its name from the Unicorns dropdown menu (labeled 'choose a unicorn'). Existing Unicorns will load to the builder display automatically. For new Unicorns, please click 'Preview' to see the breed's base sprite in the builder display.</p>`,
`<p>Choose genes (markings for the body, mane, tail, etc) from the gene dropdown menus, which are labeled with the name of the gene slot. Click 'Preview' to see your gene choices in the builder display. To clear a gene selection from a slot, set the menu dropdown to the 'Clear Slot' option and click Preview to update your selections in the display.</p>`,
`<p>Change the base colors and gene colors with the color selector buttons, which are labeled with the name of each color slot. Select the slot you you want to change by clicking the button for that slot, and then use the color wheel and hue slider to set a color. The color wheel will update the selected slot's color automatically without needing to click 'Preview' again. Some genes are not colorable; for these, the gene color will not change in the builder display if you use the color wheel on that gene slot. If you do not set a color for a base color slot, it will default to black(#000000). If you select a colorable gene but do not set a color on it, the gene color will default to black as well. You may fill as many or as few gene slots and color slots as you wish; none of them are required. (But you do need to choose a breed, please!)</p>`,
`<p>When you're satisfied with your selections, click 'Create New Unicorn' or 'Customize Unicorn' at the bottom of the page. TIP: It's advisable to click Preview one more time before submitting, just to make sure all your selections are accounted for!</p>`];
			setContent(titletext, bodytext);
		} else if(origin === "equip"){
			var titletext = "Help: Equipper";
			var bodytext = [`<p>How to use the Equipper:</p>`, 
`<p>Select one of your Unicorns from the dropdown menu (labeled 'choose a unicorn' for users with screen readers).`, 
`In the inventory menu, click an item thumbnail to load it to the equipper display. All items and your Unicorns are draggable; place them wherever you want! (TIP: do not drag items entirely out of the display window, as you will not be able to bring them back! In the event that your item or Unicorn is dragged off the display, please refresh the page to start again.)</p>`, 
`<p>Use the tool buttons to adjust the items to your liking. You can put them behind or in front of the Unicorn, and you can change the layering of items over or behind each other as well. If you resize or rotate an item and want to undo it, the reset button will return it to its original size and rotation.", "TIP: For items placed behind the Unicorn, changes to item size or rotation will not show up automatically. Please click on or next to the item after resizing to update the image.</p>`, 
`<p>Click the Save button anytime to save your progress.</p>`];
			setContent(titletext, bodytext);
		} else if(origin === "explore"){
			var titletext = "Help: Explore";
			var bodytext = [`<p>How to Play:</p>`, 
`<p>Use your keyboard to navigate around the game world.</p>`, 
`<p>LEFT ARROW: Go Left</p>`,
`<p>RIGHT ARROW: Go Right", "JUMP: Up Arrow</p>`, 
`<p>LEDGE GRAB: Up Arrow + 'G'</p>`, 
`<p>LEDGE CLIMB: 'C'</p>`, 
`<p>TIP: Having trouble with a ledge? Get as close to the bottom of it as you can and hit 'G' while jumping! Let go of ledges while grabbing with the Left or Right arrows. Hit 'C' to climb up when you're grabbing a ledge.</p>`, 
`<p>TIP: Hit LEFT + UP or RIGHT + UP to jump forward!</p>`];
			setContent(titletext, bodytext);
		}
	}
	



function runComposite(foundUnicorn) {
	var backEquips = foundUnicorn.imgs.equipBack;
	var frontEquips = foundUnicorn.imgs.equipFront;
	var baseImg = foundUnicorn.imgs.baseImg;
	var x = parseInt(foundUnicorn.compositecoordinates.x, 10);
	var y = parseInt(foundUnicorn.compositecoordinates.y, 10);
	
	//{...}

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
	//{...}
	.then((result3) => {
		return result3
	})
	return output
}





submitButton.addEventListener("click", sendData);
async function sendData() {
	tr.destroy();
	var layers = stage.getLayers();
	layers.forEach((layer)=>{
		layer.clip({
			x: 0,
			y: 0,
			width: 900,
			height: 700
		});
	})
	
	if(layers[0].attrs.id === "back") {
		var backLayer = layers[0];
		let imageData1 = backLayer.toDataURL();
		let base64Response1 = await fetch(imageData1);
		var blob1 = await base64Response1.blob();
	}
	if(layers[2].attrs.id === "front") {
		var frontLayer = layers[2];
		let imageData2 = frontLayer.toDataURL();
		let base64Response2 = await fetch(imageData2);
		var blob2 = await base64Response2.blob();
	}
	
	var uniBounds = uniNode.getClientRect({skipStroke: true});
	
	var getContainer = document.querySelector("canvas");
	var bounds = getContainer.getBoundingClientRect();
	
	//{...}
	
	let chosenUnicorn = unicornselector.value;
	let uniPos = uniNode.absolutePosition();
	let x = uniPos.x.valueOf();
	let y = uniPos.y.valueOf();
	let absPos = {x: x, y: y};
	let absPosString = JSON.stringify(absPos);
	
	let coords = {x: x, y: y}; //for now, same as absPos; if necessary, will send adjusted coords to server too
	let coordsString = JSON.stringify(coords);

	let formData = new FormData();
	formData.append("image", blob1, "imageBack.png");
	formData.append("image", blob2, "imageFront.png");
	formData.append("userChoices", dataString);
	formData.append("unicornId", chosenUnicorn);
	formData.append("unicornCoords", coordsString);
	formData.append("unicornPos", absPosString);
	let response = await fetch('/equip', {
		method: 'PUT',
		redirect: "follow",
		body: formData
	});
	let result = await response;
	console.log(result);
	if(result.ok) {
		console.log(result);
		window.location = "/index";
	}
}



// if the CSS dimensions of our canvas are 320 X 320 and we created a 16 X 16 pixel image, then each pixel will be about 320/16 = 20 pixels. So if the coordinates found using JavaScript are (40, 60), then the pixel coordinates will be (40*16/320, 60*16/320) which is (2,3).
// 900w x 700h canvas 
// 500x500px image
// coordinates are 
// x: 270 (width axis)
// y: 218 (height axis)
//(270*500/900, 218*500/700)
// (150, 155.714)
let mathedX = (x*500)/900;
let mathedY = (y*500)/700;	


// var getContainer = document.querySelectorAll("canvas");
	// console.log("canvases bounds: ")
	// getContainer.forEach((container)=>{
	// 	var bounds = container.getBoundingClientRect();
	// 	console.log(bounds)
	// })

var uniBounds = uniNode.getClientRect({skipStroke: true});
	console.log("base sprite node bounds (smaller than layer): ");
	console.log(uniBounds)
	var layerBoundsBack = itemLayerBack.getClientRect({skipStroke: true});
	console.log("back layer bounds: ");
	console.log(layerBoundsBack)
	var layerBoundsFront = itemLayerFront.getClientRect({skipStroke: true});
	console.log("front layer bounds: ");
	console.log(layerBoundsFront)


// var getContainer = document.querySelector("canvas:nth-child(2)");

var imageDataBack = itemLayerBack.canvas.context.getImageData(0, 0, itemLayerBack.canvas.width, itemLayerBack.canvas.height)
	console.log(imageDataBack)
	
	var imageDataFront = itemLayerFront.canvas.context.getImageData(0, 0, itemLayerFront.canvas.width, itemLayerFront.canvas.height)
	console.log(imageDataFront)
	
	var imageDataUnicorn = unicornLayer.canvas.context.getImageData(0, 0, unicornLayer.canvas.width, unicornLayer.canvas.height)
	console.log(imageDataUnicorn)


var itemBounds = itemNode.getClientRect({skipStroke: true});
				console.log(`itemBounds: `);
				console.log(itemBounds)
				var layerBackBounds = itemLayerBack.getClientRect({skipStroke: true});
				console.log(`layerBackBounds: `);
				console.log(layerBackBounds)
				var layerFrontBounds = itemLayerFront.getClientRect({skipStroke: true});
				console.log(`layerFrontBounds: `);
				console.log(layerFrontBounds);


const composited = await sharp({
  create: {
    width: 600,
    height: 600,
    channels: 4,
    background: "rgba(255, 255, 255, 0)"
  }
})
  .composite([{ input: inputImage }])
  .png()
  .toBuffer();



var unicornLayer = {
		buffer: req.files[2].buffer,
		filename: unicornId + "layer"
	}
.then((foundUnicorn)=>{
		common.Image.findByIdAndUpdate({_id: foundUnicorn.imgs.baseImg._id}, { $set: { "secondary.data": unicornLayer.buffer }}, {new: true})
		.then((out)=>{
			return out
		})
		console.log(foundUnicorn.imgs.baseImg);
		return foundUnicorn
	})
if(layers[1].attrs.id === "unicornlayer") {
		var unicornlayer = layers[1];
		let imageData3 = unicornlayer.toDataURL();
		let base64Response3 = await fetch(imageData3);
		var blob3 = await base64Response3.blob();
	}
formData.append("image", blob3, "unicornLayer.png");


{ path: 'imgs', select: 'baseImg equipBack equipFront' }
select: 'baseImg equipBack equipFront', 

//get matching imgs from cloudinary
	// cloudinary.api.resources({ type: 'upload', prefix: `Unicorns/${foundUnicorn._id}`})
	// .then((result) => {
	// 	return result.resources
	// })
	// .then((resources)=>{
		
	// })

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
	
	function saveEquipImgBack(foundUnicorn) {
		return common.Image.findOneAndUpdate({ "filename": bufferBack.filename}, { "$set": {"filename": bufferBack.filename, "img.data": bufferBack.buffer}}, {upsert: true, new: true})
		.then(foundImage =>{
			foundUnicorn.updateOne({_id: unicornId}).set("imgs.equipBack", foundImage);
			return runUpload(foundImage, bufferBack);
		})
	}
	function saveEquipImgFront(foundUnicorn) {
		return common.Image.findOneAndUpdate({ "filename": bufferFront.filename}, { "$set": {"filename": bufferFront.filename, "img.data": bufferFront.buffer}}, {upsert: true, new: true}, (err, foundImage)=>{
			if (err) return console.error('Uhoh, there was an error (/equip Image.findOneAndUpdate PUT)', err)
			foundUnicorn.updateOne({_id: unicornId}).set("imgs.equipFront", foundImage);
			runUpload(foundImage, bufferFront);
		})
	}
	
	function runUpload(foundImage, buffer) {
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
		}))
	}
	
	common.Unicorn.findByIdAndUpdate({_id: unicornId}, { "$set": { "equips": userChoices}}, {new: true}, function(err, foundUnicorn){
		if (err) return console.error('Uhoh, there was an error (/equip Unicorn.findOne PUT)', err)
		saveEquipImgs(foundUnicorn);
		// common.Helpers.runComposite(foundUnicorn, unicornCoords);
		res.redirect(303, "/index");
	});
})


//THEN AGAIN
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
	
	function saveEquipImgs(foundUnicorn) {
		common.Image.findOneAndUpdate({ "filename": bufferBack.filename}, { "$set": {"filename": bufferBack.filename, "img.data": bufferBack.buffer}}, {upsert: true, new: true})
		.exec()
		.then(foundImage => {
			foundUnicorn.updateOne({_id: unicornId}).set("imgs.equipBack", foundImage);
			return runUpload(foundImage, bufferBack);
			console.log("foundUnicorn.imgs after first Image.findOneAndUpdate: ")
			console.log(foundUnicorn.imgs)
		})
		.then(result => {
			console.log("result after first findOneAndUpdate: ");
			console.log(result);
			common.Image.findOneAndUpdate({ "filename": bufferFront.filename}, { "$set": {"filename": bufferFront.filename, "img.data": bufferFront.buffer}}, {upsert: true, new: true})
			.exec()
			.then(foundImage => {
				foundUnicorn.updateOne({_id: unicornId}).set("imgs.equipFront", foundImage);
				return runUpload(foundImage, bufferFront);
				console.log("foundUnicorn.imgs after second Image.findOneAndUpdate: ")
				console.log(foundUnicorn.imgs)
			})
			// .then(result => {
			// 	console.log("result at end of chain: ");
			// 	console.log(result);
			// 	// common.Helpers.runComposite(foundUnicorn, unicornCoords);
			// })
		})
		.catch(err => {
		   console.log(err);
		   res.status(500).json({ error: err });
		});
	}
	
	function runUpload(foundImage, buffer) {
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
	}
	
	common.Unicorn.findByIdAndUpdate({_id: unicornId}, { "$set": { "equips": userChoices}}, {new: true}, function(err, foundUnicorn){
		if (err) return console.error('Uhoh, there was an error (/equip Unicorn.findOne PUT)', err)
		saveEquipImgs(foundUnicorn);
		res.redirect(303, "/index");
	});
})

//LATEST PUT 
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
	
	function saveEquipImgs(foundUnicorn) {
		common.Image.findOneAndUpdate({ "filename": bufferBack.filename}, { "$set": {"filename": bufferBack.filename, "img.data": bufferBack.buffer}}, {upsert: true, new: true}, (err, foundImage)=>{
			if (err) return console.error('Uhoh, there was an error (/equip Image.findOneAndUpdate PUT)', err)
			foundUnicorn.updateOne({_id: unicornId}).set("imgs.equipBack", foundImage);
			runUpload(foundImage, bufferBack);
		})
		common.Image.findOneAndUpdate({ "filename": bufferFront.filename}, { "$set": {"filename": bufferFront.filename, "img.data": bufferFront.buffer}}, {upsert: true, new: true}, (err, foundImage)=>{
			if (err) return console.error('Uhoh, there was an error (/equip Image.findOneAndUpdate PUT)', err)
			foundUnicorn.updateOne({_id: unicornId}).set("imgs.equipFront", foundImage);
			runUpload(foundImage, bufferFront);
		})
	}
	
	function runUpload(foundImage, buffer) {
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
		}))
	}
	
	common.Unicorn.findByIdAndUpdate({_id: unicornId}, { "$set": { "equips": userChoices}}, {new: true}, function(err, foundUnicorn){
		if (err) return console.error('Uhoh, there was an error (/equip Unicorn.findOne PUT)', err)
		saveEquipImgs(foundUnicorn);
		common.Helpers.runComposite(foundUnicorn, unicornCoords);
		res.redirect(303, "/index");
	});
})

//ASYNC 1
.put([isLoggedIn, upload.any()], async (req, res) => {
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
	
	try {
		var unicornUpdate = await common.Unicorn.findByIdAndUpdate({_id: unicornId}, { "$set": { "equips": userChoices}}, {new: true}).exec()
		var upsertImgback = await common.Image.findOneAndUpdate({ "filename": bufferBack.filename}, { "$set": {"filename": bufferBack.filename, "img.data": bufferBack.buffer}}, {upsert: true, new: true})
		unicornUpdate.updateOne({_id: unicornId}).set("imgs.equipBack", upsertImgback);
		var uploadBack = await runUpload(upsertImgback, bufferBack)
		
		var upsertImgFront = await common.Image.findOneAndUpdate({ "filename": bufferFront.filename}, { "$set": {"filename": bufferFront.filename, "img.data": bufferFront.buffer}}, {upsert: true, new: true})
		unicornUpdate.updateOne({_id: unicornId}).set("imgs.equipFront", upsertImgFront);
		var uploadFront = await runUpload(upsertImgFront, bufferFront)
		
	} catch (err) {
        return console.error(err)        
    }
	
	async function runUpload(foundImage, buffer) {
		var equipFolder = `Unicorns/${unicornId}/equips`;
		let options = {
			upload_preset: 'equipSave',
			resource_type: 'image',
			format: 'png',
			public_id: foundImage.filename,
			folder: equipFolder
		}
		var bufferStream = await new common.stream.PassThrough();
		await bufferStream.end(Buffer.from(buffer.buffer));
		var result = await bufferStream.pipe(common.cloudinary.uploader.upload_stream(options))
		// console.log("output from cloudinary upload: ");
		// console.log(result);
		foundImage.public_id = result.public_id;
		foundImage.etag = result.etag;
		foundImage.version = result.version;
		foundImage.save();
	}
	
	
})


//promises 3
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
	
	function saveEquipImgs(foundUnicorn) {
		common.Image.findOneAndUpdate({ "filename": bufferBack.filename}, { "$set": {"filename": bufferBack.filename, "img.data": bufferBack.buffer}}, {upsert: true, new: true}, (err, foundImage)=>{
			if (err) return console.error('Uhoh, there was an error (/equip Image.findOneAndUpdate PUT)', err)
			foundUnicorn.set("imgs.equipBack", foundImage);
			runUpload(foundImage, bufferBack);
		})
		common.Image.findOneAndUpdate({ "filename": bufferFront.filename}, { "$set": {"filename": bufferFront.filename, "img.data": bufferFront.buffer}}, {upsert: true, new: true}, (err, foundImage)=>{
			if (err) return console.error('Uhoh, there was an error (/equip Image.findOneAndUpdate PUT)', err)
			foundUnicorn.set("imgs.equipFront", foundImage);
			runUpload(foundImage, bufferFront);
		})
		return foundUnicorn.save();
	}
	
	function runUpload(foundImage, buffer) {
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
		}))
	}
	
	common.Unicorn.findByIdAndUpdate({_id: unicornId}, { "$set": { "equips": userChoices}}, {new: true}, function(err, foundUnicorn){
		return saveEquipImgs(foundUnicorn);
	})
	.then(foundUnicorn => {
		return common.Helpers.runComposite(foundUnicorn, unicornCoords);
		res.redirect(303, "/index");
	})
	.catch(err => {
		console.error('Uhoh, there was an error (/equip PUT)', err)
	})
})


//PROMISES ATTEMPT 2
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
	
	function runUpload(foundImage, buffer) {
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
		}))
	}
	
	common.Unicorn.findByIdAndUpdate({_id: unicornId}, { "$set": { "equips": userChoices}}, {new: true})
	.exec()
	.then(foundUnicorn => {
		return common.Image.findOneAndUpdate({ "filename": bufferBack.filename}, { "$set": {"filename": bufferBack.filename, "img.data": bufferBack.buffer}}, {upsert: true, new: true})
		.then(foundImage => {
			return runUpload(foundImage, bufferBack);
		})
		.then(result =>{
			console.log(result);
		})
	})
	.then(foundUnicorn => {
		common.Image.findOneAndUpdate({ "filename": bufferFront.filename}, { "$set": {"filename": bufferFront.filename, "img.data": bufferFront.buffer}}, {upsert: true, new: true})
		.then(foundImage => {
			return runUpload(foundImage, bufferFront);
		})
		.then(result =>{
			console.log(result);
		})
	})
	.then(foundUnicorn => {
		console.log(foundUnicorn);
	})
			
	
	

})




//LATEST PUT
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
	
	function saveEquipImgs(foundUnicorn) {
		common.Image.findOneAndUpdate({ "filename": bufferBack.filename}, { "$set": {"filename": bufferBack.filename, "img.data": bufferBack.buffer}}, {upsert: true, new: true}, (err, foundImage)=>{
			if (err) return console.error('Uhoh, there was an error (/equip Image.findOneAndUpdate PUT)', err)
			foundUnicorn.set("imgs.equipBack", foundImage);
			runUpload(foundImage, bufferBack);
		})
		common.Image.findOneAndUpdate({ "filename": bufferFront.filename}, { "$set": {"filename": bufferFront.filename, "img.data": bufferFront.buffer}}, {upsert: true, new: true}, (err, foundImage)=>{
			if (err) return console.error('Uhoh, there was an error (/equip Image.findOneAndUpdate PUT)', err)
			foundUnicorn.set("imgs.equipFront", foundImage);
			runUpload(foundImage, bufferFront);
		})
		foundUnicorn.save();
	}
	
	function runUpload(foundImage, buffer) {
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
		}))
	}
	
	common.Unicorn.findByIdAndUpdate({_id: unicornId}, { "$set": { "equips": userChoices}}, {new: true}, function(err, foundUnicorn){
		if (err) return console.error('Uhoh, there was an error (/equip Unicorn.findOne PUT)', err)
		saveEquipImgs(foundUnicorn);
		common.Helpers.runComposite(foundUnicorn, unicornCoords);
		res.redirect(303, "/index");
	});
})



//promises attempt 2
.put([isLoggedIn, upload.any()], function(req, res){
	console.log("Incoming PUT user data in /equip route: ");
	let userChoices = JSON.parse(req.body.userChoices);
	let unicornId = req.body.unicornId;
	var buffers = [
		{
			buffer: req.files[0].buffer,
			filename: unicornId + "back"
		},
		{
			buffer: req.files[1].buffer,
			filename: unicornId + "front"
		}
	]
	var EquipBack;
	var EquipFront;
	
	buffers.map(buffer => {
		common.Image.findOneAndUpdate({ "filename": buffer.filename}, { "$set": {"filename": buffer.filename, "img.data": buffer.buffer}}, {upsert: true, new: true})
		.then(foundImage =>{
			console.log(foundImage.filename);
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
				if(foundImage.filename.includes("back")) {
					EquipBack = foundImage;
				} else if(foundImage.filename.includes("front")) {
					EquipFront = foundImage;
				}
				return (EquipBack, EquipBack);
			}))
		})
	})
	.then(res => {
		return common.Unicorn.findByIdAndUpdate({_id: unicornId}, { "$set": { "equips": userChoices, "imgs.equipBack": EquipBack, "imgs.equipFront": EquipFront}}, {new: true}, function(err, foundUnicorn){
			if (err) return console.error('Uhoh, there was an error (/equip Unicorn.findOne PUT)', err)
			common.Helpers.runComposite(foundUnicorn);
			console.log(foundUnicorn.equips);
			console.log(foundUnicorn.imgs);
		})
	})
	.then(res2 => {
		console.log(res2);
		res.redirect(303, "/index");
	})
	.catch(err => {
	   console.log(err);
	   res.status(500).json({ error: err });
	});
})


, populate: { path: 'imgs.equipFront', model: 'Image' }, populate: { path: 'imgs.equipBack', model: 'Image' }


common.Image.findOneAndUpdate({ "filename": { $in: buffers.filename }}, { "$set": {"filename":{ $in: buffers.filename }, "img.data":{ $in: buffers.buffer }}}, {upsert: true, new: true}, (err, foundImage)=>{
			if (err) return console.error('Uhoh, there was an error (/equip Image.findOneAndUpdate PUT)', err)
			console.log(foundImage);
		});

{ "$set": {"filename":{ $in: buffers.filename }, "img.data":{ $in: buffers.buffer }}}


//PROMISES ATTEMPT 1
return common.Image.findOneAndUpdate({"img.data": bufferBack}, { "$set": { "img.data": bufferBack}}, {upsert: true, new: true})
	.then(foundImageBack => {
		foundImageBack.filename = unicornId + "back";
		var path = foundImageBack.filename;
		var equipFolder = `equips/${unicornId}`
		let options = {
			upload_preset: 'equipSave',
			resource_type: 'image',
			format: 'png',
			public_id: foundImageBack.filename,
			folder: equipFolder
		}
		var bufferStream = new common.stream.PassThrough();
		bufferStream.end(Buffer.from(bufferBack));
		bufferStream.pipe(common.cloudinary.uploader.upload_stream(options, function(error, result) {
			console.log("output from cloudinary upload: ");
			console.log(error, result);
			//get returned data and push to newUnicorn and newImage
			foundImageBack.public_id = result.public_id;
			foundImageBack.etag = result.etag;
			foundImageBack.version = result.version; 
			foundImageBack.save();
			return foundImageBack;
		}))
	})
	.catch(err => {
        console.log(err);
    });

	return common.Image.findOneAndUpdate({"img.data": bufferBack}, { "$set": { "img.data": bufferBack}}, {upsert: true, new: true})
	.then(foundImageFront => {
		foundImageFront.filename = unicornId + "front";
		var path = foundImage.filename;
		var equipFolder = `equips/${unicornId}`
		let options = {
			upload_preset: 'equipSave',
			resource_type: 'image',
			format: 'png',
			public_id: foundImageFront.filename,
			folder: equipFolder
		}
		var bufferStream = new common.stream.PassThrough();
		bufferStream.end(Buffer.from(bufferFront));
		bufferStream.pipe(common.cloudinary.uploader.upload_stream(options, function(error, result) {
			console.log("output from cloudinary upload: ");
			console.log(error, result);
			//get returned data and push to newUnicorn and newImage
			foundImageFront.public_id = result.public_id;
			foundImageFront.etag = result.etag;
			foundImageFront.version = result.version;
			foundImageFront.save();
			return foundImageFront;
		}))
	})
	.catch(err => {
        console.log(err);
    });
	
	return common.Unicorn.findById({_id: req.body.unicornId})
	.then(foundUnicorn => {
		userChoices.forEach(function(choice){
			foundUnicorn.equips.push(choice);
		});
		if(foundUnicorn.equipImgBack === undefined) {
				foundUnicorn.equipImgBack = foundImageBack;
			}
		if(foundUnicorn.equipImgFront === undefined) {
				foundUnicorn.equipImgFront = foundImageFront;
			}
		foundUnicorn.save();
		res.redirect(303, "/index");
	})
	.catch(err => {
        console.log(err);
    });
	



common.Image.findOneAndUpdate({"img.data": bufferBack}, { "$set": { "img.data": bufferBack}}, {upsert: true, new: true}, function(err, foundImage){
			if (err) return console.error('Uhoh, there was an error (/equip Image.findOneAndUpdate Back PUT)', err)
			foundImage.filename = foundUnicorn._id.valueOf() + "back";
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
	
	common.Unicorn.findById({_id: req.body.unicornId}, function(err, foundUnicorn){
		if (err) return console.error('Uhoh, there was an error (/equip Unicorn.findOne PUT)', err)
		userChoices.forEach(function(choice){
			foundUnicorn.equips.push(choice);
		});
		if(foundUnicorn.equipImgBack === undefined) {
				foundUnicorn.equipImgBack = foundImage;
			}
		if(foundUnicorn.equipImgFront === undefined) {
				foundUnicorn.equipImgFront = foundImage;
			}
		
		foundUnicorn.save();
		res.redirect(303, "/index");
	});




if(hoofGeneSelection.value === "unset") {
			selectedGenes.hoofGene.colorable = "";
			selectedGenes.hoofGene.id = "";
			selectedGenes.hoofGene.src = "";
			selectedGenes.hoofGene.name = "";
	} else {
		let chosenGeneBaseId = hoofGeneSelection.dataset.geneid;
		let fullGeneId = `${chosenGeneBaseId}_${currentLineartId}`;
		let chosenGeneClass = hoofGeneSelection.geneclass;
		breedGenes.forEach(function(gene){
			if(gene.id === fullGeneId) {
				selectedGenes.hoofGene.colorable = gene.colorable;
				selectedGenes.hoofGene.id = fullGeneId;
				selectedGenes.hoofGene.src = gene.baseImg;
				selectedGenes.hoofGene.name = gene.name;	
			}
		});
	}