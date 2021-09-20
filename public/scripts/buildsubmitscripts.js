//SUBMIT FUNCTION
submitButton.addEventListener("click", submitData);
async function submitData() {
	if(yourTokens > 0 || document.URL.includes("/founder")){
		// convert stage to dataURL to condense canvases to single file, then to blob for server transfer
		let imageData = stage.toDataURL();
		let base64Response = await fetch(imageData);
		let blob = await base64Response.blob();

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
		let response = await fetch('/build', {
			method: 'POST',
			redirect: "follow",
			body: formData
		});
		let result = await response;
		if(result.ok) {
			if(document.URL.includes("/build")){
				window.location = "/index";
			} else if(document.URL.includes("/founder")){
				window.location = "/region";
			}
		}
	} else if(yourTokens === 0 && document.URL.includes("/build")) {
		alert("You're out of tokens!");
	}
	
}
// Headers: Referer: https://pixel-horseys-ygjlr.run.goorm.io/founder