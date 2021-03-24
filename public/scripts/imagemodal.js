var imageModal = document.getElementById('imageModal')
imageModal.addEventListener('show.bs.modal', function (event) {
	// Button that triggered the modal
	var button = event.relatedTarget;
	
	var dataName = button.dataset.bsName;
	var dataPublicName = button.dataset.bsPublicname;
	var dataSrc = button.attributes.src.value;

	var modal = this;
	var modalTitle = modal.querySelector('.modal-title');
	modalTitle.innerText = `${dataPublicName}`;
	var modalImage = modal.querySelector('#modal-image');
	modalImage.src = dataSrc;
});