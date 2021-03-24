var colorSelectors = document.getElementsByClassName("colorSelector");
for(var i = 0; i < colorSelectors.length; i++) {
	colorSelectors[i].addEventListener("click", setActiveColor);
}

var submitButton = document.getElementById("builderSubmit");
var submitButton2 = document.getElementById("customizerSubmit");

previewButton.addEventListener("click", function(event){
	let pick = lineartMenu.selectedOptions[0];
	dbBreeds.forEach(function(breed){
		if(pick.dataset.lineartid === breed.id) {
			breedGenes = breed.genes;
			breedBaseColors = breed.basecolors;
			lineart.src = breed.lineart.baseImg;
			lineart.id = breed.id;
		}
	});
	showLineart();
	setGenes();
	if(builderSubmit.disabled === true && unicornSelector.value === "") {
		builderSubmit.toggleAttribute("disabled");
	} else if(customizerSubmit.disabled === true && unicornSelector.value !== "") {
		customizerSubmit.toggleAttribute("disabled");
	}
});

//SHARED METHODS
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

//LOAD EXISTING UNICORN METHODS
unicornSelector.addEventListener("change", setUnicornSelection);
//get selected unicorn from dropdown and get data associated with unicorn
function setUnicornSelection(event) {
	var chosenUnicorn = event.target.value;
	yourUnicorns.forEach(function(unicorn){
		//store data of selected existing unicorn
		if(unicorn._id === chosenUnicorn) {
			colors = unicorn.colors;
			currentGenes = unicorn.genes;
			currentId = unicorn.breedid;
			// console.log(unicorn);
		}
	});
	//get breed that matches currently selected existing unicorn and store associated data
	dbBreeds.forEach(function(breed){
		if(breed.id === currentId) {
			breedGenes = breed.genes;
			breedBaseColors = breed.basecolors;
			breedLineart = breed.lineart.baseImg;
		}
	});

	//set selected to option slot in lineartMenu
	for(var i=0; i < lineartMenu.options.length; i++) {
		if(currentId === lineartMenu.options[i].dataset.lineartid) {
			lineartMenu.options[i].selected = true;
		}
	}

	//set gene menus per each one
	bodyGeneMenu.value = currentGenes.bodyGene.geneName;
	hairGeneMenu.value = currentGenes.hairGene.geneName;
	tertiaryGeneMenu.value = currentGenes.tertiaryGene.geneName;
	eyeGeneMenu.value = currentGenes.eyeGene.geneName;
	hornGeneMenu.value = currentGenes.hornGene.geneName;
	hoofGeneMenu.value = currentGenes.hoofGene.geneName;

	//set colorSelector background colors per slot: match colorSelector value to color.colorId
	colors.forEach(function(color){
		if(color.colorId.includes("Gene")) {
			for(var i=0; i < geneColorSelectors.length; i++) {
				if(color.colorId === geneColorSelectors[i].value) {
					geneColorSelectors[i].style.background = color.colorString;
					geneColorSelectors[i].setAttribute("data-colordata", color.colorData);
					geneColorSelectors[i].setAttribute("data-hexstring", color.colorString);
				}
			}
		} else if(!color.colorId.includes("Gene")) {
			for(var i=0; i < baseColorSelectors.length; i++) {
				if(color.colorId === baseColorSelectors[i].value) {
					baseColorSelectors[i].style.background = color.colorString;
					baseColorSelectors[i].setAttribute("data-colordata", color.colorData);
					baseColorSelectors[i].setAttribute("data-hexstring", color.colorString);
				}
			}
		}
	});
	//render preset lineart to lineartLayer
	let lineartObject = lineartLayer.children[0].attrs;
	lineartObject.image.src = breedLineart;
	lineart.src = breedLineart;
	//show baseColors
	showBaseColors();

	//render preset genes to geneLayer
	var existingGeneChildren = genesLayer.getChildren();
	existingGeneChildren.forEach(function(child){
		if(child.attrs.id === "bodyGene") {
			if(currentGenes.bodyGene.baseImg !== "") {
				child.attrs.image.src = currentGenes.bodyGene.baseImg;
			} else if (currentGenes.bodyGene.baseImg === "") {
				child.attrs.image.src = "../../assets/site_imgs/placeholder.png";
			}
			Gene = currentGenes.bodyGene;
			Child = child;
			setColorable();
			// console.log(Child);
			setPresetColor();
		} else if(child.attrs.id === "hairGene") {
			if(currentGenes.hairGene.baseImg !== "") {
				child.attrs.image.src = currentGenes.hairGene.baseImg;
			} else if (currentGenes.hairGene.baseImg === "") {
				child.attrs.image.src = "../../assets/site_imgs/placeholder.png";
			}
			Gene = currentGenes.hairGene;
			Child = child;
			setColorable();
			setPresetColor();
		} else if(child.attrs.id === "tertiaryGene") {
			if(currentGenes.tertiaryGene.baseImg !== "") {
				child.attrs.image.src = currentGenes.tertiaryGene.baseImg;
			} else if (currentGenes.tertiaryGene.baseImg === "") {
				child.attrs.image.src = "../../assets/site_imgs/placeholder.png";
			}
			Gene = currentGenes.tertiaryGene;
			Child = child;
			setColorable();
			setPresetColor();
		} else if(child.attrs.id === "eyeGene") {
			if(currentGenes.eyeGene.baseImg !== "") {
				child.attrs.image.src = currentGenes.eyeGene.baseImg;
			} else if (currentGenes.eyeGene.baseImg === "") {
				child.attrs.image.src = "../../assets/site_imgs/placeholder.png";
			}
			Gene = currentGenes.eyeGene;
			Child = child;
			setColorable();
			setPresetColor();
		} else if(child.attrs.id === "hoofGene") {
			if(currentGenes.hoofGene.baseImg !== "") {
				child.attrs.image.src = currentGenes.hoofGene.baseImg;
			} else if (currentGenes.hoofGene.baseImg === "") {
				child.attrs.image.src = "../../assets/site_imgs/placeholder.png";
			}
			Gene = currentGenes.hoofGene;
			Child = child;
			setColorable();
			setPresetColor();
		} else if(child.attrs.id === "hornGene") {
			if(currentGenes.hornGene.baseImg !== "") {
				child.attrs.image.src = currentGenes.hornGene.baseImg;
			} else if (currentGenes.hornGene.baseImg === "") {
				child.attrs.image.src = "../../assets/site_imgs/placeholder.png";
			}
			Gene = currentGenes.hornGene;
			Child = child;
			setColorable();
			setPresetColor();
		} 
	});

	//iterate over baseColor layers and find each that matches color class, run setPresetColor function
	var existingBaseColorChildren = baseColorsLayer.getChildren();
	existingBaseColorChildren.forEach(function(child, i){
		BaseChild = child;
		setPresetColor();
	});

	
	function parseColorData() {
		colors.forEach(function(color, i){//replace undefined values in color data
			let colorId = color.colorId;
			if(typeof(color.colorData) === "string") {
				var colorData = color.colorData.split(',');
				const index = colorData.indexOf("undefined");
				colorData[index] = "";
				color.colorData = colorData;
			} 
		});
	}
	function setPresetColor() {
		parseColorData();
		if(BaseChild) {
			colors.forEach(function(color, i){
				if(color.colorId === BaseChild.attrs.name) {
					BaseChild.hue(parseFloat(color.colorData[0]));
					BaseChild.saturation(parseFloat(color.colorData[1]));
					BaseChild.luminance(parseFloat(color.colorData[2]));
					BaseChild.value(parseFloat(color.colorData[3]));
					BaseChild.red(parseFloat(color.colorData[4]));
					BaseChild.green(parseFloat(color.colorData[5]));
					BaseChild.blue(parseFloat(color.colorData[6]));
				}
			});
		}
		if(Child && Gene.colorable === "true") {
			colors.forEach(function(color, i){
				if(color.colorId === Child.attrs.id) {
					Child.hue(parseFloat(color.colorData[0]));
					Child.saturation(parseFloat(color.colorData[1]));
					Child.luminance(parseFloat(color.colorData[2]));
					Child.value(parseFloat(color.colorData[3]));
					Child.red(parseFloat(color.colorData[4]));
					Child.green(parseFloat(color.colorData[5]));
					Child.blue(parseFloat(color.colorData[6]));
				}
			});
		}
	}
}
////////////////////////////////////////////
//=========================================
////////////////////////////////////////////
//NEW BUILD METHODS
function showLineart() {
	let lineartObject = lineartLayer.children[0].attrs;
	lineartObject.id = lineart.id;
	lineartObject.image.src = lineart.src;
	showBaseColors();
}

function setGenes() {
	//double-check lineart selection from menu: use currently selected lineart even if no change in dropdown value
	var picked = lineartMenu.selectedOptions[0].dataset;
	var currentLineartId = picked.lineartid;
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
	
