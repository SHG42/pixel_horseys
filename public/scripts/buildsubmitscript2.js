//loading progress popup
var modal = new bootstrap.Modal(document.querySelector('#progressPopup'))

submitButton2.addEventListener("click", submitData2);
async function submitData2() {
	// convert stage to dataURL to condense canvases to single file, then to blob for server transfer
	let imageData = stage.toDataURL();
	let base64Response = await fetch(imageData);
	let blob = await base64Response.blob();
	
	//get value of selected existing unicorn from dropdown
	let chosenUnicorn = unicornSelector.value;

	//iterate over colorSelectors and get id's and rgb strings from backgrounds and store in object or array
	let colorDataPackage = [];
	for(var i=0; i<colorSelectors.length; i++) {
		//create object where buttonId is key and buttonColor string is value
		var colorData = { 
							colorId: colorSelectors[i].value,
							colorString: colorSelectors[i].dataset.hexstring,
							colorData: colorSelectors[i].dataset.colordata
						};
		colorDataPackage.push(colorData);
	}
	
	let dataPackage = 	{
							breedPick: lineart,
							genePicks: selectedGenes,
							colors: colorDataPackage,
						};
	let dataString = JSON.stringify(dataPackage);

	let formData = new FormData();
	formData.append("image", blob, "image.png");
	formData.append("userChoices", dataString);
	formData.append("unicornId", chosenUnicorn);
	let response = await fetch('/build', {
		method: 'PUT',
		redirect: "follow",
		body: formData
	});
	let result = await response;
	if(result.ok) {
		modal.hide();
	}
}

