var colorPicker = new iro.ColorPicker('#picker', {
	// Set the size of the color picker
	width: 300,
});

var baseColorSlots = ["body", "hair", "eyes", "hoof", "horn"];
var geneSlots = ["bodyGene", "hairGene", "tertiaryGene", "eyeGene", "hornGene", "hoofGene"];

//KONVA SETUP
let stage = new Konva.Stage({
	height: 500,
	width: 500,
	container: "container"
});

let baseColorsLayer = new Konva.Layer();
stage.add(baseColorsLayer);
let genesLayer = new Konva.Layer();
stage.add(genesLayer);
let lineartLayer = new Konva.Layer(); 
stage.add(lineartLayer);

//create default base img objects for each base color class
var keys1 = Object.keys(baseColorSlots);
var values1 = Object.values(baseColorSlots);
values1.forEach(function(value, i) {
	var baseColorImgObj = new Image();
	var baseColorImage = new Konva.Image({
		x: 0,
		y: 0,
		image: baseColorImgObj,
		name: value,
		id: value
	});
	baseColorImgObj.onload = function() {
		baseColorImage.cache();
		baseColorsLayer.add(baseColorImage);
		baseColorsLayer.batchDraw();
	};
	baseColorImgObj.src = "../../assets/site_imgs/fancyplaceholder.png";
});


//create ddefault img objects for each gene slot
var values2 = Object.values(geneSlots);
values2.forEach(function(key, i) {
	var geneImgObj = new Image();
	var geneImage = new Konva.Image({
		x: 0,
		y: 0,
		image: geneImgObj,
		id: key
	});
	geneImgObj.onload = function() {
		geneImage.cache();
		genesLayer.add(geneImage);
		genesLayer.batchDraw();
	};
	geneImgObj.src = "../../assets/site_imgs/placeholder.png";
});

//create base img for lineart
var lineartImgObj = new Image();
var lineartImage = new Konva.Image({
	x: 0,
	y: 0,
	image: lineartImgObj,
	id: ''
});

lineartImgObj.onload = function() {
	lineartImage.cache();
	lineartLayer.add(lineartImage);
	lineartLayer.batchDraw();
};
lineartImgObj.src = "../../assets/site_imgs/site_icons/rainbowicon_build.png";