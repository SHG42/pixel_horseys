var colorSelectors = document.getElementsByClassName("colorSelector");
for(var i = 0; i < colorSelectors.length; i++) {
	colorSelectors[i].addEventListener("click", setActiveColor);
}

var clickables = document.querySelectorAll(".founders");
for(var i = 0; i < clickables.length; i++) {
	clickables[i].addEventListener("click", setBaseSelection);
}

previewButton.addEventListener("click", function(event){
	showLineart();
	setGenes();
	if(founderSubmit.disabled === true && lineart.id !== "") {
		founderSubmit.toggleAttribute("disabled");
	} 
});

var submitButton = document.getElementById("founderSubmit");

function setBaseSelection(event) {
	let pick = event.target;
	parsedBreeds.forEach(function(breed){
	if(pick.id === breed.id) {
			breedGenes = breed.genes;
			breedBaseColors = breed.basecolors;
			lineart.src = breed.lineart.baseImg;
			lineart.id = breed.id;
		}
	});
}

function showLineart() {
	let lineartObject = lineartLayer.children[0].attrs;
	lineartObject.id = lineart.id;
	lineartObject.image.src = lineart.src;
	showBaseColors();
}

function showBaseColors() {
	let child1 = baseColorsLayer.findOne("#body")
	child1.attrs.image.src = breedBaseColors.body.baseImg;
	let child2 = baseColorsLayer.findOne("#hair")
	child2.attrs.image.src = breedBaseColors.hair.baseImg;
	let child3 = baseColorsLayer.findOne("#eyes")
	child3.attrs.image.src = breedBaseColors.eyes.baseImg;
	let child4 = baseColorsLayer.findOne("#hoof")
	child4.attrs.image.src = breedBaseColors.hoof.baseImg;
	let child5 = baseColorsLayer.findOne("#horn")
	child5.attrs.image.src = breedBaseColors.horn.baseImg;
	var existingChildren = baseColorsLayer.getChildren();
	existingChildren.forEach(function(child){
		child.filters([Konva.Filters.HSV, Konva.Filters.HSL, Konva.Filters.RGBA]);
	});
}

function setColorable() {//for setting color on newly picked genes
	if(Gene.colorable === "true") {
		Child.filters([Konva.Filters.HSV, Konva.Filters.HSL, Konva.Filters.RGBA]);
	} else if(Gene.colorable === "false") {
		Child.filters([]);
	}
}

function setGenes() {
	//double-check lineart selection from menu: use currently selected lineart even if no change in dropdown value
	var picked = lineart.id;
	var currentLineartId = picked;
	lineart.id = currentLineartId;
	
	var bodyGeneSelection = bodyGeneMenu.selectedOptions[0];
	if(bodyGeneSelection.value === "unset") {
		selectedGenes.bodyGene.colorable = "";
		selectedGenes.bodyGene.id = "";
		selectedGenes.bodyGene.src = "";
		selectedGenes.bodyGene.name = "";
	} else {
		let chosenGeneBaseId = bodyGeneSelection.dataset.geneid;
		let fullGeneId = `${chosenGeneBaseId}_${currentLineartId}`;
		breedGenes.forEach(function(gene){
			if(gene.id === fullGeneId) {
				selectedGenes.bodyGene.colorable = gene.colorable;
				selectedGenes.bodyGene.id = fullGeneId;
				selectedGenes.bodyGene.src = gene.baseImg;
				selectedGenes.bodyGene.name = gene.name;	
			}
		});
	}
	var hairGeneSelection = hairGeneMenu.selectedOptions[0];
	if(hairGeneSelection.value === "unset") {
		selectedGenes.hairGene.colorable = "";
		selectedGenes.hairGene.id = "";
		selectedGenes.hairGene.src = "";
		selectedGenes.hairGene.name = "";
	} else {
		let chosenGeneBaseId = hairGeneSelection.dataset.geneid;
		let fullGeneId = `${chosenGeneBaseId}_${currentLineartId}`;
		let chosenGeneClass = hairGeneSelection.geneclass;
		breedGenes.forEach(function(gene){
			if(gene.id === fullGeneId) {
				selectedGenes.hairGene.colorable = gene.colorable;
				selectedGenes.hairGene.id = fullGeneId;
				selectedGenes.hairGene.src = gene.baseImg;
				selectedGenes.hairGene.name = gene.name;	
			}
		});
	}
	
	var tertiaryGeneSelection = tertiaryGeneMenu.selectedOptions[0];
	if(tertiaryGeneSelection.value === "unset") {
		selectedGenes.tertiaryGene.colorable = "";
		selectedGenes.tertiaryGene.id = "";
		selectedGenes.tertiaryGene.src = "";
		selectedGenes.tertiaryGene.name = "";
	} else {
		let chosenGeneBaseId = tertiaryGeneSelection.dataset.geneid;
		let fullGeneId = `${chosenGeneBaseId}_${currentLineartId}`;
		breedGenes.forEach(function(gene){
			if(gene.id === fullGeneId) {
				selectedGenes.tertiaryGene.colorable = gene.colorable;
				selectedGenes.tertiaryGene.id = fullGeneId;
				selectedGenes.tertiaryGene.src = gene.baseImg;
				selectedGenes.tertiaryGene.name = gene.name;	
			}
		});
	}
	
	var eyeGeneSelection = eyeGeneMenu.selectedOptions[0];
	if(eyeGeneSelection.value === "unset") {
		selectedGenes.eyeGene.colorable = "";
		selectedGenes.eyeGene.id = "";
		selectedGenes.eyeGene.src = "";
		selectedGenes.eyeGene.name = "";
	} else {
		let chosenGeneBaseId = eyeGeneSelection.dataset.geneid;
		let fullGeneId = `${chosenGeneBaseId}_${currentLineartId}`;
		let chosenGeneClass = eyeGeneSelection.geneclass;
		breedGenes.forEach(function(gene){
			if(gene.id === fullGeneId) {
				selectedGenes.eyeGene.colorable = gene.colorable;
				selectedGenes.eyeGene.id = fullGeneId;
				selectedGenes.eyeGene.src = gene.baseImg;
				selectedGenes.eyeGene.name = gene.name;	
			}
		});
	}
	
	var hornGeneSelection = hornGeneMenu.selectedOptions[0];
	if(hornGeneSelection.value === "unset") {
		selectedGenes.hornGene.colorable = "";
		selectedGenes.hornGene.id = "";
		selectedGenes.hornGene.src = "";
		selectedGenes.hornGene.name = "";
	} else {
		let chosenGeneBaseId = hornGeneSelection.dataset.geneid;
		let fullGeneId = `${chosenGeneBaseId}_${currentLineartId}`;
		let chosenGeneClass = hornGeneSelection.geneclass;
		breedGenes.forEach(function(gene){
			if(gene.id === fullGeneId) {
				selectedGenes.hornGene.colorable = gene.colorable;
				selectedGenes.hornGene.id = fullGeneId;
				selectedGenes.hornGene.src = gene.baseImg;
				selectedGenes.hornGene.name = gene.name;	
			}
		});
	}
	
	var hoofGeneSelection = hoofGeneMenu.selectedOptions[0];
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
	showGenes();
}

var existingGeneChildren = genesLayer.getChildren();
function showGenes() { 
	existingGeneChildren.forEach(function(child){
		if(child.attrs.id.includes("body")) {
			if(selectedGenes.bodyGene.src!=="") {
				child.attrs.image.src = selectedGenes.bodyGene.src;
				Gene = selectedGenes.bodyGene;
				Child = child
				setColorable();
			} else if(selectedGenes.bodyGene.src==="") {
				child.attrs.image.src = "../../assets/site_imgs/placeholder.png";	  
			}
		}
			
		if(child.attrs.id.includes("hair")) {
			if(selectedGenes.hairGene.src!=="") {
				child.attrs.image.src = selectedGenes.hairGene.src;
				Gene = selectedGenes.hairGene;
				Child = child
				setColorable();
			} else if(selectedGenes.hairGene.src==="") {
				child.attrs.image.src = "../../assets/site_imgs/placeholder.png";	  
			}
		}
		
		if(child.attrs.id.includes("tert")) {
			if(selectedGenes.tertiaryGene.src!=="") {
				child.attrs.image.src = selectedGenes.tertiaryGene.src;
				Gene = selectedGenes.tertiaryGene;
				Child = child
				setColorable();
			} else if(selectedGenes.tertiaryGene.src==="") {
				child.attrs.image.src = "../../assets/site_imgs/placeholder.png";	  
			}
		}
			
		if(child.attrs.id.includes("eye")) {
			if(selectedGenes.eyeGene.src!=="") {
				child.attrs.image.src = selectedGenes.eyeGene.src;
				Gene = selectedGenes.eyeGene;
				Child = child
				setColorable();
			} else if(selectedGenes.eyeGene.src==="") {
				child.attrs.image.src = "../../assets/site_imgs/placeholder.png";	  
			}
		}
		
		if(child.attrs.id.includes("horn")) {
			if(selectedGenes.hornGene.src!=="") {
				child.attrs.image.src = selectedGenes.hornGene.src;
				Gene = selectedGenes.hornGene;
				Child = child
				setColorable();
			} else if(selectedGenes.hornGene.src==="") {
				child.attrs.image.src = "../../assets/site_imgs/placeholder.png";	  
			}
		}
			
		if(child.attrs.id.includes("hoof")) {
			if(selectedGenes.hoofGene.src!=="") {
				child.attrs.image.src = selectedGenes.hoofGene.src;
				Gene = selectedGenes.hoofGene;
				Child = child
				setColorable();
			} else if(selectedGenes.hoofGene.src==="") {
				child.attrs.image.src = "../../assets/site_imgs/placeholder.png";	  
			}
		}
	});
}

//Color Picker Stuff
var activeColor;
var colorSelectorButton;
function setActiveColor(event) { //determine if layer child is from baseColorsLayer or from genesLayer
	var existingBaseColorChildren = baseColorsLayer.getChildren();
	var existingGeneLayerChildren = genesLayer.getChildren();
	if(event.target.value.includes("Gene")) {
		existingGeneLayerChildren.forEach(function(child){
			if(child.attrs.id.includes(event.target.value)) {
				colorSelectorButton = event.target;
				activeColor = child;
				setColor();
			}
		});
	} else {
		existingBaseColorChildren.forEach(function(child){
			if(child.attrs.name.includes(event.target.value)) {
				colorSelectorButton = event.target;
				activeColor = child;
				setColor();
			}
		});
	}
}

function setColor() {
	if(colorSelectorButton.dataset.hexstring) {
	   colorPicker.color.hexString = colorSelectorButton.dataset.hexstring;
	} 
	colorPicker.on('color:change', function(color) {
		activeColor.hue(color.hue);
		activeColor.saturation(color.saturation);
		activeColor.luminance(color.luminance);
		activeColor.value(color.value);
		activeColor.red(color.red);
		activeColor.green(color.green);
		activeColor.blue(color.blue);
		//set data attribute with full color data
		if(activeColor.attrs.name){
			colorSelectorButton.style.backgroundColor = color.hexString;
			colorSelectorButton.setAttribute("data-colordata", `${color.hue},${color.saturation},${color.luminance},${color.value},${color.red},${color.green},${color.blue}`);
			colorSelectorButton.setAttribute("data-hexstring", `${color.hexString}`);
			baseColorsLayer.batchDraw();
		} else if(!activeColor.attrs.name) {
			colorSelectorButton.style.backgroundColor = color.hexString;
			colorSelectorButton.setAttribute("data-colordata", `${color.hue},${color.saturation},${color.luminance},${color.value},${color.red},${color.green},${color.blue}`);
			colorSelectorButton.setAttribute("data-hexstring", `${color.hexString}`);
			genesLayer.batchDraw();
		}
	});
}
	

