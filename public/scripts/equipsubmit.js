submitButton.addEventListener("click", sendData);
async function sendData() {
	tr.destroy();
	// convert stage to dataURL to condense canvases to two images, front layer and back layer, then to two blobs for server transfer
	var layers = stage.getLayers();
	
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
	
	//get value of selected existing unicorn from dropdown
	let itemDataPackage = [];
	let children = stage.find(".item");
	children.forEach(function(child){
		if(!child.attrs.id) {
			return;
		} else {
			var itemData = {
				data: child.attrs,
				layer: child.parent.attrs.id,
				image: child.attrs.image.src,
				index: child.index,
				id: child.attrs.id.value
			}
			itemDataPackage.push(itemData);
		}
	});
	let dataString = JSON.stringify(itemDataPackage);
	
	let chosenUnicorn = unicornselector.value;
	let uniPos = uniNode.absolutePosition();
	let x = uniPos.x.valueOf();
	let y = uniPos.y.valueOf();
	let coords = {x: x, y: y};
	let coordsString = JSON.stringify(coords);

	let formData = new FormData();
	formData.append("image", blob1, "imageBack.png");
	formData.append("image", blob2, "imageFront.png");
	formData.append("userChoices", dataString);
	formData.append("unicornId", chosenUnicorn);
	formData.append("unicornCoords", coordsString);
	let response = await fetch('/equip', {
		method: 'PUT',
		redirect: "follow",
		body: formData
	});
	let result = await response;
	console.log(result);
	if(result.ok) {
		console.log(result);
		window.location = "/equip";
	}
}