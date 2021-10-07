var items = document.getElementsByClassName("equippable");
var unicornselector = document.getElementById("unicornSelect");
var layerDown = document.getElementById("layerDown");
var layerUp = document.getElementById("layerUp");
var moveDown = document.getElementById("moveDown");
var moveUp = document.getElementById("moveUp");
var flipX = document.getElementById("flipleftright");
var flipY = document.getElementById("flipupdown");
var unscale = document.getElementById("unscale");
var remove = document.getElementById("remove");
var activeNode;
var Unicorn;
var Equip;
var submitButton = document.getElementById("equipperSubmit");

//KONVA SETUP
var containerDiv = document.getElementById("getfashionable");

var stage = new Konva.Stage({
	height: 700,
	width: 900,
	container: "container"
});

let itemLayerBack = new Konva.Layer({id: "back"});
stage.add(itemLayerBack);
itemLayerBack.canvas.setPixelRatio(1)
let unicornLayer = new Konva.Layer({id: "unicornlayer"});
stage.add(unicornLayer);
unicornLayer.canvas.setPixelRatio(1)
let itemLayerFront = new Konva.Layer({id: "front"});
stage.add(itemLayerFront);
itemLayerFront.canvas.setPixelRatio(1)
var tr = new Konva.Transformer();
itemLayerFront.add(tr);

//create base img for lineart
var unicornImgObj = new Image();
var uniNode = new Konva.Image({
	image: unicornImgObj,
	x: stage.width()/4,
    y: 0,
	id: 'unicorn',
	draggable: true,
	// stroke: 'red',
	// strokeWidth: 3,
});

unicornImgObj.onload = function() {
	uniNode.cache();
	unicornLayer.add(uniNode).batchDraw();
};
unicornImgObj.crossOrigin = 'Anonymous';
unicornImgObj.src = "../../assets/site_imgs/site_icons/rainbowicon_equip.png";