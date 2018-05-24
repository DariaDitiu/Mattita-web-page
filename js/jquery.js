$(document).ready(function() {

	createDynamicSections();

    $("#new-collection").click(function() {
        localStorage.setItem("newCollection", "true");
    });

});

function createDynamicSections(){
	var products = readProductsInformation();

    $.when(products).done(function(products) {
        
        if ($("#recommendedProducts").length) {
            fillProductInformation(products.get("recommendedProducts"), '', "recommendedProducts");
        }

        if ($("#allProductsType").length) {
            if (localStorage.getItem("newCollection") === 'true') {
            	createNewCollectionSection(products.get("newCollection"));
            } else {
            	createProductByTypeSection(products.get("allProducts"));
            }
        }
        changeProductInformationByType(products.get("allProducts"));
    });
}

function changeProductsPhoto(image) {
    $("#products-image").attr("src", image);
};

function resetProducts() {
    $('#allProductsType').empty();
};

function createNewCollectionSection(newCollection){
    
    var index = Math.floor(Math.random()*newCollection.length);
    changeProductsPhoto(newCollection[index].image);
    $("#" + newCollection[index].type).focus();
    
    fillProductsInformation(newCollection, newCollection[index].type, "allProductsType");
    fillProductInformation(newCollection, newCollection[index].type, "allProductsType");
    localStorage.setItem("newCollection", "false");
} 

function createProductByTypeSection(allProducts){
	for (var i = 0; i < allProducts.length; i++) {
        if (allProducts[i].type === 'oil') {
            changeProductsPhoto(allProducts[i].image);
        }
        break;
    }
    fillProductInformation(allProducts, 'oil', "allProductsType");
    $("#oil").focus();
}

function changeProductInformationByType(allProducts) {
    $("#oil").click(function() {
    	resetProducts();
        productType = 'oil';
        fillProductInformation(allProducts, productType, "allProductsType");
    });
    $("#scrub").click(function() {
    	resetProducts();
        productType = 'scrub';
        fillProductInformation(allProducts, productType, "allProductsType");
    });
    $("#cosmetics").click(function() {
    	resetProducts();
        productType = 'cosmetics';
        fillProductInformation(allProducts, productType, "allProductsType");
    });
    $("#food").click(function() {
    	resetProducts();
        productType = 'food';
        fillProductInformation(allProducts, productType, "allProductsType");
    });
};

function fillProductInformation(products, productType, idDIV) {

    var i;
    for (i = 0; i < products.length; i++) {
        if (products[i].type === productType || productType === '') {

            var id1 = products[i].id;
            var id2 = id1 + "x" + i;
            var id3 = id2 + i;
            var id4 = id3 + i;

            $('<div/>', {
                'class': 'flex-33 padding-5 table-cell align-flex-start',
                'id': id1
            }).appendTo('#' + idDIV + '');
            $('<div/>', {
                'class': 'flex relative-position',
                'id': id2
            }).appendTo('#' + id1 + '');
            $('<a/>', {
                'href': 'products-description.html',
                'id': id3,
                "on": {
                    "click": function(event) {
                        localStorage.setItem("choseProductID", '' + event.currentTarget.id + '');
                    }
                }
            }).appendTo('#' + id2 + '').click();
            $('<img/>', {
                'class': 'width-100 no-padding',
                'src': '' + products[i].image + ''
            }).appendTo('#' + id3 + '');
            $('<div/>', {
                'class': 'text-center layout-column flex ruby-text-container padding-5',
                'class': 'align-center layout-column flex ruby-text-container padding-5',
                'id': id4
            }).appendTo('#' + id2 + '');
            $('<a/>', {
                'class': 'no-margin light-text no-text-decoration gray-color',
                text: '' + products[i].name + '',
                'href': 'products-description.html',
                "on": {
                    "click": function(event) {
                        localStorage.setItem('choseProductID', '' + event.currentTarget.id + '');
                    }
                }
            }).appendTo('#' + id4 + '');
            $('<p/>', {
            $('<h4/>', {
                'class': 'demi-bold no-margin',
                text: '' + products[i].price + ''
            }).appendTo('#' + id4 + '');
        }
    }
};

function readProductsInformation() {
	var dfr = $.Deferred();
    var products = new Map();
    var allProducts = [];
    var recommendedProducts = [];
     var newCollection = [];

    $.getJSON("./products/products.json", function(result) {})
        .done(function(result) {
            $.each(result, function(index, val) {
                allProducts.push(val);
                if (val.recommendedProduct === 'true') {
                    recommendedProducts.push(val);
                }
                if(val.newCollection === 'true'){
                	newCollection.push(val);
                }
            })
            products.set("allProducts", allProducts);
            products.set("recommendedProducts", recommendedProducts);
            products.set("newCollection", newCollection);
            dfr.resolve(products);
            return products;
        })
        .fail(function(textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
        })
        .always(function() {
            if (products.length === 0) {
                callback(result);
            }
        });
        return dfr.promise();
};