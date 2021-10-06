var stageWidth = stage.width();
var stageHeight = stage.height();

function redrawLayers() {
	itemLayerBack.draw();
	itemLayerFront.draw();
}
function resetEquips() {
	itemLayerFront.find(".item").remove();
	itemLayerBack.find(".item").remove();
}

//EVENT LISTENERS
for(var i=0; i < items.length; i++) {
	items[i].addEventListener("click", loadItem);
}
unicornselector.addEventListener("change", changeUnicorn);
layerDown.addEventListener("click", shiftLayerDown);
layerUp.addEventListener("click", shiftLayerUp);
moveDown.addEventListener("click", moveItemDown);
moveUp.addEventListener("click", moveItemUp);
unscale.addEventListener("click", unscaleItem);
remove.addEventListener("click", removeItem);

//METHODS
function changeUnicorn(event) {
	let unicornObject = unicornLayer.find("#unicorn");
	var chosenUnicorn = event.target.selectedOptions[0];
	yourUnicorns.forEach(function(unicorn){
		if(unicorn._id === chosenUnicorn.value) {
			unicornObject[0].attrs.image.src = chosenUnicorn.dataset.url;
			if(unicorn.canvasposition) {
				unicornObject[0].absolutePosition({
				  x: unicorn.canvasposition.x.valueOf(),
				  y: unicorn.canvasposition.y.valueOf()
				});
			}
			Unicorn = unicorn;
			//clear item layers of any existing equips from previous unicorns
			resetEquips();
			redrawLayers();
			loadEquips();
		}
	});
}

function loadEquips() {
	let equips = Unicorn.equips;
	if(equips.length === 0) {
		return;
	} else {
		equips.forEach(function(equip){
			Konva.Image.fromURL(equip.image, function (itemNode) {
				itemNode.setAttrs(equip.data);
				if(equip.layer === "front") {
					itemLayerFront.add(itemNode);
					tr.nodes([itemNode]);
					itemLayerFront.batchDraw();
				} else if(equip.layer === "back") {
					itemLayerBack.add(itemNode);
					tr.nodes([itemNode]);
					itemLayerBack.batchDraw();
				}
				itemNode.zIndex(equip.index);
			});
		})
		tr.moveToTop();
	}
}

//item functionality: set selection on click. let selected item be resized, moved up or down, or deleted (layer child is removed)
function loadItem(event) {
	if(unicornselector.value === "") {
		alert("Please pick a unicorn first!");
	} else {
		let itemPick = event.target;
		Konva.Image.fromURL(itemPick.src, function (itemNode) {
			itemNode.setAttrs({
				x: 0,
				y: 0,
				id: itemPick.dataset.bsName,
				draggable: true,
				name: "item"
			});
			itemLayerFront.add(itemNode);
			tr.nodes([itemNode]);
			tr.moveToTop();
			itemLayerFront.batchDraw();
		});
	}
}

//stop upscaling
tr.on('transform', function () {
	tr.boundBoxFunc(function(oldBox, newBox) {
	  	if (tr.getActiveAnchor() !=="rotater" && Math.abs(newBox.width) >= tr.node().width()) {
			unscaleItem();
        }
		return newBox;
	});
});

//act upon active node
function shiftLayerDown() {
	tr.node().moveTo(itemLayerBack);
	tr.moveToTop();
	redrawLayers();
}
function shiftLayerUp() {
	tr.node().moveTo(itemLayerFront);
	tr.moveToTop();
	redrawLayers();
}
function moveItemDown() {
	tr.node().moveDown();
	tr.moveToTop();
	redrawLayers();
}
function moveItemUp() {
	tr.node().moveUp();
	tr.moveToTop();
	redrawLayers();
}
function unscaleItem() {
	activeNode = tr.node();
	let children = itemLayerFront.getChildren();
	children.forEach(function(child){
		if(child.attrs.id === activeNode.attrs.id){
			activeNode.remove();
			Konva.Image.fromURL(child.attrs.image.src, function (itemNode) {
				itemNode.setAttrs({
					x: child.attrs.x,
					y: child.attrs.y,
					rotation: child.attrs.rotation,
					id: child.attrs.id,
					draggable: true,
					name: "item"
				});
				itemLayerFront.add(itemNode);
				tr.nodes([itemNode]);
				tr.moveToTop();
				redrawLayers();
			});
		}
	});
}
function removeItem() {
	tr.node().destroy();
	tr.nodes([]);
	tr.moveToTop();
	redrawLayers();
}

//TRANSFORM SELECTOR LOGIC
var selectionRectangle = new Konva.Rect({
    fill: 'rgba(0,0,255,0.5)',
	visible: false
});
itemLayerFront.add(selectionRectangle);
itemLayerBack.add(selectionRectangle);

var x1, y1, x2, y2;
stage.on('mousedown touchstart', (e) => {
	// do nothing if we mousedown on eny shape
	if (e.target !== stage) {
	  return;
	}
	x1 = stage.getPointerPosition().x;
	y1 = stage.getPointerPosition().y;
	x2 = stage.getPointerPosition().x;
	y2 = stage.getPointerPosition().y;

	selectionRectangle.visible(true);
	selectionRectangle.width(0);
	selectionRectangle.height(0);
	redrawLayers();
});

stage.on('mousemove touchmove', () => {
	// no nothing if we didn't start selection
	if (!selectionRectangle.visible()) {
	  return;
	}
	x2 = stage.getPointerPosition().x;
	y2 = stage.getPointerPosition().y;

	selectionRectangle.setAttrs({
	  x: Math.min(x1, x2),
	  y: Math.min(y1, y2),
	  width: Math.abs(x2 - x1),
	  height: Math.abs(y2 - y1),
	});
	itemLayerFront.batchDraw();
	itemLayerBack.batchDraw();
});

stage.on('mouseup touchend', () => {
	// no nothing if we didn't start selection
	if (!selectionRectangle.visible()) {
	  return;
	}
	// update visibility in timeout, so we can check it in click event
	setTimeout(() => {
	  selectionRectangle.visible(false);
	  itemLayerFront.batchDraw();
	  itemLayerBack.batchDraw();
	});

	var shapes = stage.find('.item').toArray();
	var box = selectionRectangle.getClientRect();
	var selected = shapes.filter((shape) =>
	  Konva.Util.haveIntersection(box, shape.getClientRect())
	);
	tr.nodes(selected);
	itemLayerFront.batchDraw();
	itemLayerBack.batchDraw();
});

// clicks should select/deselect shapes
stage.on('click tap', function (e) {
	// if we are selecting with rect, do nothing
	if (selectionRectangle.visible()) {
	  return;
	}

	// if click on empty area - remove all selections
	if (e.target === stage) {
	  tr.nodes([]);
	  redrawLayers();
	  return;
	}

	// do nothing if clicked NOT on our rectangles
	if (!e.target.hasName('item')) {
	  return;
	}

	// do we pressed shift or ctrl?
	const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
	const isSelected = tr.nodes().indexOf(e.target) >= 0;

	if (!metaPressed && !isSelected) {
	  // if no key pressed and the node is not selected
	  // select just one
	  tr.nodes([e.target]);
	} else if (metaPressed && isSelected) {
	  // if we pressed keys and node was selected
	  // we need to remove it from selection:
	  const nodes = tr.nodes().slice(); // use slice to have new copy of array
	  // remove node from array
	  nodes.splice(nodes.indexOf(e.target), 1);
	  tr.nodes(nodes);
	} else if (metaPressed && !isSelected) {
	  // add the node into selection
	  const nodes = tr.nodes().concat([e.target]);
	  tr.nodes(nodes);
	}
	redrawLayers();
});
