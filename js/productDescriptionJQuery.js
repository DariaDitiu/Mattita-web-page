$(document).ready(function(){

	readProductInformation();
	
});

function fillAllInformation(productID, products){

	var product;
	for (var i = 0; i < products.length; i++) {
		if(products[i].id === productID){
			product = products[i];
			break;
		}
	}

	type = product.type.toLowerCase().replace(/\b[a-z]/g, function(letter) {
		return letter.toUpperCase();
	});

	
	$('<span/>',{
		'class': 'gray-color menu-container font-16 no-text-decoration',
		text: ' '+ type +''
	}).appendTo('#productLocation');
	
	$('<p/>',{
		'class': 'gray-color line-height-1 font-16 no-margin demi-bold padding-top-bottom-10',
		text: ' '+ product.name +''
	}).appendTo('#productName');

	fillProductImages(product);
	fillProductDetails(product);

}

function readProductInformation() {
	var products = [];
	var choseProductID = getID();

	$.getJSON("./products/products.json", function(result){})
	.done(function(result){
		$.each(result, function(index, val){
			products.push(val);
		});
		fillAllInformation(choseProductID, products);
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

function getID(){

	var choseProduct = localStorage.getItem('choseProductID');
	var regex = /([^\^x]+)/;
	var choseProductID = regex.exec(choseProduct)[0];

	return choseProductID;
}

function fillProductImages(product){
	
	$('<img/>',{
		'class': 'width-100 no-padding',
		'src': ''+product.image+''
	}).appendTo('#productImage');

	var images =  product.imageDetailed;
	var i;
	for( i = 0; i < images.length; i++){
		var id1 = product.id + "x" + i;
		$('<div/>',{
			'class': 'flex-33 padding-5 table-cell',
			'id': id1
		}).appendTo('#productImages');
		$('<img/>',{
			'class': 'width-100 no-padding',
			'src': ''+images[i]+''
		}).appendTo('#'+id1+'');	
	}
}

function fillProductDetails(product){

	$('<p/>',{
		'class': 'align-justify no-margin',
		text: '' + product.description + ''
	}).appendTo('#productDescription');
	$('<p/>',{
		'class': 'demi-bold align-justify no-margin padding-top-bottom-10',
		text: 'Product details'
	}).appendTo('#productDescription');
	$('<ul/>',{
		'class': 'no-margin padding-left-15',
		id:'productDetails'
	}).appendTo('#productDescription');
	for (var i = 0; i < product.details.length; i++) {
		$('<li/>',{
			'class': 'align-justify no-margin',
			text: '' + product.details[i] + ''
		}).appendTo('#productDetails');
	}
	$('<p/>',{
		'class': 'demi-bold align-justify no-margin padding-top-bottom-10',
		text: 'Dimensions'
	}).appendTo('#productDescription');
	
	$('<p/>',{
		'class': 'inline-block width-50 align-left no-margin',
		text: '' + product.dimensions + ''
	}).appendTo('#productDescription');
	$('<p/>',{
		'class': 'inline-block width-50 align-right no-margin demi-bold',
		text: '' + product.price + ''
	}).appendTo('#productDescription');

}