
var products = [];

function readProductInformation() {

	$.getJSON("./products/products.json", function(result){})
	.done(function(result){
		$.each(result, function(index, val){
			products.push(val);
		});
		fillProductsInformation("oilProducts");
	})
	.fail(function(textStatus, error ){
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	})
	.always(function(){
		if(products=== ''){
			callback(result);
		}
	})
};

function fillProductsInformation(type){
	var i;
	for( i = 0; i < products.length; i++){
		if(products[i].type === type){

			var id1 = "id" + i;
			var id2 = id1 + i;
			var id3 = id2 + i;

			$('<div/>',{
				'class': 'flex-33 padding-5 table-cell',
				'id': id1
			}).appendTo('#allProductsType');
			$('<div/>',{
				'class': 'flex relative-position',
				'id': id2
			}).appendTo('#'+id1+'');
			$('<img/>',{
				'class': 'width-100 no-padding',
				'src': ''+products[i].image+''
			}).appendTo('#'+id2+'');
			$('<div/>',{
				'class': 'text-center layout-column flex ruby-text-container padding-5',
				'id': id3
			}).appendTo('#'+id2+'');
			$('<p/>',{
				'class': 'no-margin light-text font-13',
				text: ''+products[i].description+''
			}).appendTo('#'+id3+'');
			$('<p/>',{
				'class': 'demi-bold no-margin',
				text: ''+products[i].price+''
			}).appendTo('#'+id3+'');
		}
	}
}


function clearCheckBoxes() {
	var inputs = document.getElementsByTagName("input");
	for (var i = 0; i < inputs.length; i++){
		if (inputs[i].type === 'checkbox')
			inputs[i].checked = false;
	}
}

function changeProductsPhoto(image, productID){
	document.getElementById("products-type").src = image;

	if(productID=== "oilProducts"){
		document.getElementById("oilProducts").style.color = "#c28f52";
		document.getElementById("oilProducts").style.fontWeight = "700";
		resetColor("scrubProducts", "cosmeticsProducts","foodProducts");
	}else if(productID=== "scrubProducts"){
		document.getElementById("scrubProducts").style.color = "#c28f52";
		document.getElementById("scrubProducts").style.fontWeight = "700";
		resetColor("oilProducts", "cosmeticsProducts","foodProducts");
	}else if(productID=== "cosmeticsProducts"){
		document.getElementById("cosmeticsProducts").style.color = "#c28f52";
		document.getElementById("cosmeticsProducts").style.fontWeight = "700";
		resetColor("scrubProducts", "oilProducts","foodProducts");
	}else if(productID=== "foodProducts"){
		document.getElementById("foodProducts").style.color = "#c28f52";
		document.getElementById("foodProducts").style.fontWeight = "700";
		resetColor("scrubProducts", "cosmeticsProducts","oilProducts");
	}

	fillProductsInformation(productID);	
}

function resetColor(id1, id2, id3){
	document.getElementById(id1).style.color = "#030303";
	document.getElementById(id1).style.fontWeight = "normal";
	document.getElementById(id2).style.color = "#030303";
	document.getElementById(id2).style.fontWeight = "normal";
	document.getElementById(id3).style.color = "#030303";
	document.getElementById(id3).style.fontWeight = "normal";
}

