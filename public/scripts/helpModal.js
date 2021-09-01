var json = JSON.parse(document.getElementById("instructionsManifest").text);
console.log(json);

var exampleModal = document.getElementById('helpModal');
var modalTitle = document.querySelector(".modal-title");
var modalBody = document.querySelector(".modal-body");
var instructiontabs = document.querySelector("#instructiontabs");
var tab1 = document.querySelector("#tab1");
var tab1Tab = document.querySelector("#tab1-tab");
var tab2 = document.querySelector("#tab2");
var tab2Tab = document.querySelector("#tab2-tab");

exampleModal.addEventListener('show.bs.modal', (event)=> {
	// Button that triggered the modal
	var button = event.relatedTarget;
	// Extract info from data-bs-* attributes
	var origin = button.getAttribute('data-bs-origin');
	// Update the modal's content.
	updateContent(origin);
})

exampleModal.addEventListener('hide.bs.modal', (event)=>{
	modalBody.replaceChildren();
})

function setContent(titletext, bodytext, origin) {
	modalTitle.textContent = titletext;
	if(origin === "explore") {
		let h6 = document.createElement("h6");
		h6.textContent = bodytext;
		modalBody.prepend(h6);

		instructiontabs.classList.replace("d-none", "d-flex");
		initTabs();
	} else {
		bodytext.forEach((entry, i)=>{
			let p = document.createElement("p");
			p.textContent = entry;
			modalBody.append(p);
		})
	}
	
}

function initTabs() {
	tab1Tab.innerText = json.explore.tabheader_keyboard;
	tab2Tab.innerText = json.explore.tabheader_pointer;

	json.explore.tabtext_keyboard.forEach((entry)=>{
		let p = document.createElement("p");
		p.textContent = entry;
		tab1.append(p);
	})

	json.explore.tabtext_pointer.forEach((entry)=>{
		let p = document.createElement("p");
		p.textContent = entry;
		tab2.append(p);
	})
}

function updateContent(origin, id) {
	if(origin === "bio"){
		var titletext = json.bioEditor.titletext;
		var bodytext = json.bioEditor.bodytext;
		setContent(titletext, bodytext, origin);
	} else if(origin === "build"){
		var titletext = json.geneticBuilder.titletext;
		var bodytext = json.geneticBuilder.bodytext;
		setContent(titletext, bodytext, origin);
	} else if(origin === "equip"){
		var titletext = json.equipper.titletext;
		var bodytext = json.equipper.bodytext;
		setContent(titletext, bodytext, origin);
	} else if(origin === "explore"){
		var titletext = json.explore.titletext;
		var bodytext = json.explore.bodytext;
		setContent(titletext, bodytext, origin);
	}
}

