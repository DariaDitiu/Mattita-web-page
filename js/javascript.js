function clearCheckBoxes() {
	var inputs = document.getElementsByTagName("input");
	for (var i = 0; i < inputs.length; i++){
		if (inputs[i].type === 'checkbox'){
			inputs[i].checked = false;
		}
		if(inputs[i].type === "text"){
			inputs[i].value = '';
		}
	}
}

