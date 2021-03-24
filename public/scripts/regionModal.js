var regionModal = document.getElementById('regionModal')
regionModal.addEventListener('show.bs.modal', function (event) {
	// Button that triggered the modal
	var button = event.relatedTarget;
	// // var modalTitle = button.data('bsTitle'); // Extract info from data-* attributes
	var dataTitle = button.dataset.bsTitle;

	parsedRegions.forEach((region)=>{
		if(region.name === dataTitle) {
			var modal = this;
			var modalTitle = modal.querySelector('.modal-title');
			modalTitle.innerText = `The ${dataTitle}`;
			var modalContent = modal.querySelector('.modal-content');
			modalContent.style.backgroundImage = "url('" + region.modalBG + "')";
			var modalText = modal.querySelector('#modal-text');
			modalText.innerText = region.description;
			modal.querySelector('#chooseThis').setAttribute("value", region.name);
		}
	});
});
