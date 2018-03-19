function clearCheckBoxes() {
	var inputs = document.getElementsByTagName("input");
	for (var i = 0; i < inputs.length; i++){
		if (inputs[i].type === 'checkbox')
			inputs[i].checked = false;
	}
}

function changeProductsPhoto(image){
	document.getElementById("products-type").src = image;

	if(image=== "./images/main oil.jpg"){
		document.getElementById("oilProducts").style.color = "#c28f52";
		document.getElementById("oilProducts").style.fontWeight = "700";
		resetColor("scrubProducts", "cosmeticsProducts","foodProducts");
	}else if(image=== "./images/main scrub.jpg"){
		document.getElementById("scrubProducts").style.color = "#c28f52";
		document.getElementById("scrubProducts").style.fontWeight = "700";
		resetColor("oilProducts", "cosmeticsProducts","foodProducts");
	}else if(image=== "./images/main cosmetics.jpg"){
		document.getElementById("cosmeticsProducts").style.color = "#c28f52";
		document.getElementById("cosmeticsProducts").style.fontWeight = "700";
		resetColor("scrubProducts", "oilProducts","foodProducts");
	}else if(image=== "./images/main food.jpg"){
		document.getElementById("foodProducts").style.color = "#c28f52";
		document.getElementById("foodProducts").style.fontWeight = "700";
		resetColor("scrubProducts", "cosmeticsProducts","oilProducts");
	}
}

function resetColor(id1, id2, id3){
	document.getElementById(id1).style.color = "#030303";
	document.getElementById(id1).style.fontWeight = "normal";
	document.getElementById(id2).style.color = "#030303";
	document.getElementById(id2).style.fontWeight = "normal";
	document.getElementById(id3).style.color = "#030303";
	document.getElementById(id3).style.fontWeight = "normal";
}