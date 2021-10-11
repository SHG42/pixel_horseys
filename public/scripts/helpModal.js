var json = JSON.parse(document.getElementById("instructionsManifest").text);

var helpModal = document.getElementById('helpModal');
var modalTitle = document.querySelector(".modal-title");
var modalBody = document.querySelector(".modal-body");
var h6 = document.querySelector("h6");
var instructiontabs = document.querySelector("#instructiontabs");
var instructiontabsContent = document.querySelector("#instructiontabs-content");

helpModal.addEventListener('hide.bs.modal', (event)=>{
	if(document.URL.includes("/explore")){
		instructiontabs.classList.replace("d-flex", "d-none");
		instructiontabsContent.classList.replace("d-flex", "d-none");
		h6.textContent = "";
		modalTitle.textContent = "";
	} else {
		modalBody.replaceChildren();
	}
})

helpModal.addEventListener('show.bs.modal', (event)=> {
	// Button that triggered the modal
	var button = event.relatedTarget;
	// Extract info from data-bs-* attributes
	var origin = button.getAttribute('data-bs-origin');
	// Update the modal's content.
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
})

function setContent(titletext, bodytext, origin) {
	modalTitle.textContent = titletext;
	if(origin === "explore") {
		h6.textContent = bodytext;
		instructiontabs.classList.replace("d-none", "d-flex");
		instructiontabsContent.classList.replace("d-none", "d-flex");
	} else {
		var ul = document.createElement("ul");
		modalBody.append(ul);
		bodytext.forEach((entry, i)=>{
			let li = document.createElement("li");
			li.textContent = entry;
			ul.append(li);
		})
	}
}

