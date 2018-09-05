$(document).ready(function () {

    setNumberProducts();
    var language = localStorage.getItem('language');
    if (language === null || language === 'null') {
        language = 'en';
    }
    changeLanguage(language);

    handleLanguageEvents();
    handleShoppingCartEvents();
    handleNewCollectionEvents('newCollection');
    handleChangeQuantityEvent();
    handleLightboxEvents();
    handleHorizontalScrolling();
});

function setNumberProducts() {
    var numberOfProducts = localStorage.getItem('numberProducts');
    if (numberOfProducts === 'null' || numberOfProducts === null) {
        numberOfProducts = 0;
    }
    $('#number-products').text(numberOfProducts);
}

function createDynamicSections(language) {
    var productsByCategory = 'productsByCategory';
    var recommendedProducts = 'recommendedProducts';
    var newCollection = 'newCollection';

    var products = readProductsInformation(language);

    $.when(products).done(function (products) {
        var prodByCategory = products.get(productsByCategory);
        var newCollectionPrd = products.get(newCollection);
        var recPrd = products.get(recommendedProducts);

        if ($(creatElementId(recommendedProducts)).length) {
            fillProductInformation(recPrd, '', creatElementId(recommendedProducts), false);
        } else if ($(creatElementId(productsByCategory)).length) {
            if (localStorage.getItem(newCollection) === 'true') {
                createNewCollectionSection(newCollectionPrd);
            } else {
                var category = localStorage.getItem('categoryType');
                if(jQuery.isEmptyObject(category)){
                    category = 'jewellery';
                }
                createProductByCatSection(prodByCategory, category);
            }
        }
        handleCategoriesEvents(prodByCategory);
        handleSearchEvent();
        if ($('#productInformation').length) {
            createProductDescription(prodByCategory);
        }
        if ($('#results').length) {
            searchProducts(prodByCategory);
        }
        if ($('#productsInCart').length) {
            addProductsToBeBought(prodByCategory);
        }

        translate(language);
        objectFitForIE();
    });
}

function handleLanguageEvents() {
    $('#ro').click(function () {
        var language = 'ro';
        changeLanguage(language);
    });
    $('#en').click(function () {
        var language = 'en';
        changeLanguage(language);
    });
}

function handleNewCollectionEvents(element) {
    $(creatElementId(element)).click(function () {
        localStorage.setItem(element, 'true');
    });
}

function handleLightboxEvents() {
    $('#closeLightbox').click(function () {
        $('#lightboxContainer').hide();
        $('#lightbox').hide();
        resetContainer('#gallerySlides');
    });
    $('#prevImg').click(function () {
        showDesiredSlide('-');
    });
    $('#nextImg').click(function () {
        showDesiredSlide('+');
    });
}

function handleHorizontalScrolling() {
    if ($('#productsByCategory').length) {
        createHorizontalScrolling();
    }
}

function handleShoppingCartEvents() {
    $("#addToCart").click(function () {
        var nrProducts = localStorage.getItem('numberProducts');
        nrProducts++;
        localStorage.setItem('numberProducts', nrProducts);
        getChosenProductToBeBought();
        window.location.reload();
    });
    sendProductInCart();
}

function createNewCollectionSection(newCollection) {
    var index = Math.floor(Math.random() * newCollection.length);
    changeProductsPhoto('#products-image', newCollection[index].image);
    changeActiveButton('categoryType', newCollection[index].type, creatElementId(newCollection[index].type));

    fillProductInformation(newCollection, newCollection[index].type, '#productsByCategory', false);
    localStorage.setItem('newCollection', 'false');
}

function createProductByCatSection(prodByCategory, category) {
    var mainPhoto = getMainPhoto(prodByCategory, category);
    changeProductsPhoto('#products-image', mainPhoto);

    fillProductInformation(prodByCategory, category, '#productsByCategory', false);
    var categoryType = 'categoryType';
    changeActiveButton(categoryType, category, creatElementId(category));
}

function handleCategoriesEvents(prodByCategory) {
    var prodByCat = '#productsByCategory';
    $('#jewellery').click(function () {
        changeProductByType(prodByCategory, 'jewellery', prodByCat);
    });
    $('#furniture').click(function () {
        changeProductByType(prodByCategory, 'furniture', prodByCat);
    });
    $('#decorations').click(function () {
        changeProductByType(prodByCategory, 'decorations', prodByCat);
    });
    $('#toys').click(function () {
        changeProductByType(prodByCategory, 'toys', prodByCat);
    });
    $('#sales').click(function () {
        changeProductByType(prodByCategory, 'sales', prodByCat);
    });
};

function handleSearchEvent() {
    var searchElem = creatElementId('search');
    var searchValue = 'searchValue';

    $(creatElementId(searchValue)).keypress(function (event) {
        var key = event.which;
        if (key === 13) {
            $(searchElem)[0].click();
        }
    });
    $(searchElem).on('click', function () {
        setSearchValue(searchValue);
    });
}

function handleChangeQuantityEvent() {
    $('#productsInCart').on('change', function (event) {
        event.target.parentNode.childNodes[4].firstChild.data = calculatePrice(event.target.parentNode.childNodes[4].firstChild.data, event.target.value);
        var quantity = '';
        var numberProducts = 0;
        $('select').map(function () {
            numberProducts += parseInt($(this).val());
            return quantity += $(this).val() + ',';
        })
        localStorage.setItem('quantity', quantity);
        localStorage.setItem('numberProducts', numberProducts);
        window.location.reload();        
    });
}

function addProductsToBeBought(products) {
    resetContainer(creatElementId('productsInCart'));
    var nameProducts = [];
    var shoppingCart = localStorage.getItem('shoppingCart');
    var prodInCart = '';
    if(shoppingCart != null){
        prodInCart = shoppingCart.split(',');
    }
    var quantities = getQuantities();
    for (var i = 0; i < prodInCart.length; i++) {
        for (var j = 0; j < products.length; j++) {
            if (prodInCart[i] === products[j].id || prodInCart[i] === products[j].name) {
                nameProducts.push(products[j].name);
                if (quantities == null || jQuery.isEmptyObject(quantities[i])) {
                    quantity = 1;
                } else {
                    quantity = parseInt(quantities[i]);
                }
                var id = i;
                var id1 = id + '' + i;
                var id3 = id1 + '' + i;
                createDynamicLi('', id, '', '#productsInCart');
                createDynamicDiv('flex layout-row', id1, '', creatElementId(id));
                createDynamicImg('flex-x max-width-20 margin-bottom-10', '', products[j].image, "Product Image", creatElementId(id1));
                createDynamicDiv('flex-x max-width-40 layout-column', id3, '', creatElementId(id1));
                createDynamicP('padding-left-15 no-margin padding-top-10 demi-bold', products[j].name, creatElementId(id3));
                createDynamicP('padding-left-15 no-margin', products[j].dimensions, creatElementId(id3));
                $('<button/>', {
                    'class': 'category-button flex-x max-width-15',
                    text: 'Remove',
                    click: function (event) {
                        removeProdFromCart(event.currentTarget.parentElement.childNodes[1].childNodes["0"].firstChild.data, nameProducts);                        addProductsToBeBought(products);
                    }
                }).appendTo(creatElementId(id1));
                createDynamicSelect('flex-x form-control max-width-10 margin-10', id1, quantity);
                var price = calculatePrice(products[j].price, quantity);
                createDynamicP('flex-x max-width-10 demi-bold no-margin', price, creatElementId(id1));
            }
        }
    }
}

function createProductDescription(prodByCategory) {
    var chosenProduct = localStorage.getItem('chosenProduct');
    var productID = getID(chosenProduct);
    if (chosenProduct != '') {
        for (var i = 0; i <= prodByCategory.length; i++) {
            if (prodByCategory[i].id === productID) {
                createProductPresentation(prodByCategory[i]);
                break;
            }
        }
    }
}

function changeProductByType(prodByCategory, productType, idDIV) {
    var category = 'categoryType';
    resetContainer(idDIV);
    changeActiveButton(category, productType, creatElementId(productType));
    var mainPhoto = getMainPhoto(prodByCategory, productType);
    changeProductsPhoto('#products-image', mainPhoto);
    fillProductInformation(prodByCategory, productType, idDIV, false);
}

function fillProductInformation(products, productType, idDIV, isPagination) {
    var alt = 'Product image';
    resetContainer(idDIV);
    if (!isPagination) {
        resetContainer('#pagination');
    }

    var productsByType = [];
    for (var i = 0; i < products.length; i++) {
        if (products[i].type === productType || productType === '') {
            productsByType.push(products[i]);
            if (productsByType.length <= 6) {
                var id1 = products[i].id;
                var id2 = id1 + "id" + i;
                var id3 = id2 + i;
                var id4 = id3 + i;
                var id5 = id4 + i;

                createDynamicDiv('flex-x max-width-33 padding-5 table-cell align-flex-start', id1, "", idDIV);
                createDynamicDiv('flex relative-position', id2, "", creatElementId(id1));
                $('<a/>', {
                    'href': 'products-description.html',
                    'id': id3,
                    "on": {
                        "click": function (event) {
                            localStorage.setItem("chosenProduct", '' + event.currentTarget.offsetParent.id + '');
                        }
                    }
                }).appendTo(creatElementId(id2));
                createDynamicDiv('image-container-columns', id5, "", creatElementId(id3));
                createDynamicImg('no-padding featured-image-columns', '', '' + products[i].image + '', alt, creatElementId(id5));
                createDynamicDiv('align-center layout-column flex ruby-text-container padding-5', id4, "", creatElementId(id2));
                $('<a/>', {
                    'class': 'no-margin light-text no-text-decoration gray-color',
                    text: '' + products[i].name + '',
                    'href': 'products-description.html',
                    "on": {
                        "click": function (event) {
                            localStorage.setItem('chosenProduct', '' + event.currentTarget.offsetParent.id + '');
                        }
                    }
                }).appendTo('#' + id4 + '');
                createDynamicP('demi-bold no-margin', '' + products[i].price + '', creatElementId(id4));
            }
        }
    }

    objectFitForIE();
    var pag = productsByType.length / 6;
    if (productsByType.length % 6 != 0) {
        pag++;
    }
    if (pag >= 2) {
        createPagination(pag, productsByType, productType, idDIV);
    }
};

function createPagination(pag, productsByType, productType, idDIV) {
    for (i = 1; i <= pag; i++) {
        var id = i;
        createDynamicLi('page-item', id, '', '#pagination');
        $('<button/>', {
            'class': 'page-button',
            text: "" + i + "",
            click: function (event) {
                handleClickEventForPag(event, productsByType, productType, idDIV);
            }
        }).appendTo(creatElementId(id));
    }
    changeActiveButton("paginationActive", 1, creatElementId(1));
}

function handleClickEventForPag(event, productsByType, productType, idDIV) {
    resetContainer(idDIV);
    var j = parseInt(event.currentTarget.textContent);
    changeActiveButton("paginationActive", j, creatElementId(j));
    var prods;
    if(j == 1){
        prods = productsByType.slice((j - 1) * 6, j * 6);
    }else{
        prods = productsByType.slice((j - 1) * 6 + 1, j * 6);
    }
    fillProductInformation(prods, productType, idDIV, true);
}

function createProductPresentation(product) {
    $('#productLocation').children().remove();
    resetContainer('#productName');
    var productType = product.type.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });

    $('<span/>', {
        'class': 'gray-color font-16 no-text-decoration padding-5',
        text: '' + productType + '',
        id: "prod-cat"
    }).appendTo('#productLocation');
    createDynamicP('font-16 no-margin demi-bold padding-top-10 padding-left-5', ' ' + product.name + '', '#productName');

    fillProductImages(product);
    fillProductDetails(product);
}

function fillProductImages(product) {
    var alt = 'Product image';
    resetContainer("#productImage");
    resetContainer("#productImages");

    $('<a/>', {
        id: "mainImageLink",
        "on": {
            "click": function (event) {
                fillImageGallary(event.currentTarget.childNodes["0"].attributes[1].nodeValue, product.image, product.imageDetailed);
            }
        }
    }).appendTo("#productImage");
    createDynamicImg('width-100 padding-5 img-cover height-40vh', 'mainImage', '' + product.image + '', alt, creatElementId('mainImageLink'));

    var images = product.imageDetailed;
    var i;
    for (i = 0; i < images.length; i++) {
        var id1 = product.id + 'id' + i;
        var id2 = id1 + 'x';
        var id3 = id2 + 'x';
        createDynamicDiv('flex-x max-width-33 padding-5 table-cell', id1, '', '#productImages');
        $('<a/>', {
            'id': id2,
            "on": {
                "click": function (event) {
                    changeProductsPhoto("#mainImage", event.currentTarget.childNodes["0"].src);
                }
            }
        }).appendTo(creatElementId(id1));
        createDynamicDiv('image-container-columns', id3, "", creatElementId(id2));
        createDynamicImg('no-padding featured-image-columns', '', '' + images[i] + '', alt, creatElementId(id3));
    }
}

function fillProductDetails(product) {
    resetContainer("#productDescription");

    createDynamicP('align-justify no-margin', '' + product.description + '', '#productDescription');
    createDynamicP('demi-bold align-justify no-margin padding-top-bottom-10', 'Product details', '#productDescription');

    $('<ul/>', {
        'class': 'no-margin padding-left-15',
        id: 'productDetails'
    }).appendTo('#productDescription');
    for (var i = 0; i < product.details.length; i++) {
        createDynamicLi('align-justify no-margin', '', '' + product.details[i] + '', '#productDetails');
    }
    createDynamicDiv('margin-top-10 flex relative-position layout-row', 'dimensionPrice', '', '#productDescription');
    createDynamicDiv('flex-x max-width-50 layout-column', 'dimensions', '', '#dimensionPrice');
    createDynamicP('demi-bold no-margin padding-5', 'Dimensions', '#dimensions');
    createDynamicP('no-margin padding-5', '' + product.dimensions + '', '#dimensions');
    createDynamicDiv('flex-x max-width-50 layout-column', 'price', '', '#dimensionPrice');
    createDynamicP('demi-bold no-margin padding-5', 'Price', '#price');
    createDynamicP('no-margin demi-bold padding-5', '' + product.price + '', '#price');
}

function fillImageGallary(imageSelected, mainImage, imageDetailed) {
    $("#lightboxContainer").show();
    $("#lightbox").show();

    var alt = 'Product image';
    var currentImg = decodeSrcPath(imageSelected);
    var j = 0;
    var imagesDetLength = imageDetailed.length;
    var totalImages = imagesDetLength + 1;
    var imageSlidesIDs = 'image-slides' + j + '';

    createDynamicDiv('image-slides display-none', imageSlidesIDs, '', '#gallerySlides');
    createDynamicDiv('number-text absolute-position', '', '' + (j + 1) + '/' + totalImages + '', creatElementId(imageSlidesIDs));
    createDynamicImg('height-70vh img-contain', '', '' + currentImg + '', alt, creatElementId(imageSlidesIDs));
    localStorage.setItem("curentImage", j);

    var slidesIDs = [];
    j++;
    slidesIDs.push(imageSlidesIDs);

    if (currentImg != mainImage) {
        imageSlidesIDs = 'image-slides' + j + '';
        createDynamicDiv('image-slides display-none', imageSlidesIDs, '', '#gallerySlides');
        createDynamicDiv('number-text absolute-position', '', '' + (j + 1) + '/' + totalImages + '', creatElementId(imageSlidesIDs));
        createDynamicImg('height-70vh img-contain', '', '' + mainImage + '', alt, creatElementId(imageSlidesIDs));
        j++;
        slidesIDs.push(imageSlidesIDs);
    }

    for (var i = 0; i < imagesDetLength; i++) {
        imageSlidesIDs = 'image-slides' + j + '';
        if (currentImg != imageDetailed[i]) {
            createDynamicDiv('image-slides display-none', imageSlidesIDs, '', '#gallerySlides');
            createDynamicDiv('number-text absolute-position', '', '' + (j + 1) + '/' + totalImages + '', creatElementId(imageSlidesIDs));
            createDynamicImg('height-70vh img-contain', '', '' + imageDetailed[i] + '', alt, creatElementId(imageSlidesIDs));
            j++;
            slidesIDs.push(imageSlidesIDs);
        }
    }
    localStorage.setItem('imageSlideIds', slidesIDs);
    showDesiredSlide('');
}

function createHorizontalScrolling() {
    var scroller = ".scroller-right, .scroller-left";
    var category = ".category";
    var categoryWrapper = ".category-wrapper";
    var categoryList = ".category-list";
    var scrollerRight = ".scroller-right";
    var scrollerLeft = ".scroller-left";

    var scrollBarWidths = 40;
    var widthOfList = function () {
        var itemsWidth = 0;
        $(category).each(function () {
            var itemWidth = $(this).outerWidth();
            itemsWidth += itemWidth;
        });
        return itemsWidth;
    };
    var widthOfHidden = function () {
        var outer = $(categoryWrapper).outerWidth();
        return (outer - widthOfList() - getLeftPosi()) - scrollBarWidths;
    };
    var getLeftPosi = function () {
        return $(categoryList).position().left;
    };
    var reAdjust = function () {
        var isRight = false;
        var isLeft = false;
        $(categoryList).removeClass('no-slider');

        if (($(categoryWrapper).outerWidth()) < widthOfList()) {
            $(scrollerRight).removeClass('hidden-arrow');
            isRight = true;
        } else {
            $(scrollerRight).addClass('hidden-arrow');
        }
        if (getLeftPosi() < 0) {
            $(scrollerLeft).removeClass('hidden-arrow');
            isLeft = true;
        } else if (getLeftPosi() < 0 && $(categoryWrapper).outerWidth() <= widthOfList()) {
            $(category).animate({
                left: "-=" + getLeftPosi() + "px"
            }, 'slow');
            $(scrollerLeft).addClass('hidden-arrow');
        }
        if (!isRight && !isLeft) {
            $(categoryList).addClass('no-slider');
            $(scroller).addClass('hidden-arrow');
            return;
        }
    }
    reAdjust();

    $(window).on('resize', function (e) {
        reAdjust();
    });

    $(scrollerRight).click(function () {
        changeArrowVizibility(scrollerRight, scrollerLeft);
        $(categoryList).animate({
            left: "+=" + widthOfHidden() + "px"
        }, 'slow', function () {});
    });
    $(scrollerLeft).click(function () {
        changeArrowVizibility(scrollerLeft, scrollerRight);
        $(categoryList).animate({
            left: "-=" + getLeftPosi() + "px"
        }, 'slow', function () {});
    });
}

function changeArrowVizibility(addArrow, removeArrow) {
    $(addArrow).addClass('hidden-arrow');
    $(removeArrow).removeClass('hidden-arrow');
}

function showDesiredSlide(location) {
    var ids = [];
    ids = localStorage.getItem("imageSlideIds").split(",");
    var pozition = localStorage.getItem("curentImage");
    $(creatElementId(ids[pozition])).hide();
    switch (location) {
        case "+":
            pozition++;
            break;
        case "-":
            pozition--;
            break;
        default:
            break;
    }
    if (pozition == ids.length) {
        pozition = 0;
    } else if (pozition < 0) {
        pozition = ids.length - 1;
    }
    $(creatElementId(ids[pozition])).show();
    localStorage.setItem("curentImage", pozition);
}

function readProductsInformation(language) {
    var dfr = $.Deferred();
    var products = new Map();
    var prodByCategory = [];
    var recommendedProducts = [];
    var newCollection = [];

    var path = '';
    if (language === 'ro') {
        path = './products/products-ro.json';
    } else if (language === 'en') {
        path = './products/products-en.json';
    }

    $.getJSON(path, function (result) {})
        .done(function (result) {
            $.each(result, function (index, val) {
                prodByCategory.push(val);
                if (val.recommendedProduct === 'true') {
                    recommendedProducts.push(val);
                }
                if (val.newCollection === 'true') {
                    newCollection.push(val);
                }
            })
            products.set("productsByCategory", prodByCategory);
            products.set("recommendedProducts", recommendedProducts);
            products.set("newCollection", newCollection);
            dfr.resolve(products);
            return products;
        })
        .fail(function (textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
        })
        .always(function () {
            if (products.length === 0) {
                callback(result);
            }
        });
    return dfr.promise();
};

function changeLanguage(language) {
    localStorage.setItem('language', language);
    createDynamicSections(language);
}

function translate(language){
    var translations = getLanguage(language);
    $.when(translations).done(function (translations) {
        setLanguage(translations, language);
    });
}

function getLanguage(lang) {
    var dfr = $.Deferred();
    var translations = new Map();
    var path = "./products/" + lang + ".json"

    $.getJSON(path, function (result) {})
        .done(function (result) {
            $.each(result, function (index, val) {
                translations.set(index, val);
            });
            dfr.resolve(translations);
            return translations;
        })
        .fail(function (textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
        })
        .always(function () {
            if (translations.length === 0) {
                callback(result);
            }
        });
    return dfr.promise();
}

function setLanguage(translations, lang) {
    translations.forEach(function (val, key) {
        var regex = new RegExp('errorText');
        var regexCat = new RegExp(key, "i");
        var elem = $(creatElementId(key));
        if (elem.is('input#submit') || elem.is('input#submitOrder')) {
            elem.attr('value', val);
        } else if (regex.test(key) || key === 'successSend') {
            treatSendResponse(key, val, regex);
        } else if (elem.is('input') || elem.is('textarea')) {
            elem.attr('placeholder', val);
        }else if(regexCat.test($('#prod-cat').text())){
            var value = '';
            if(lang === 'ro'){
                value = 'Produse | ' + val;
            }else{
                value = 'Products | ' + val;
            }
            $('#prod-cat').text(value);
        }else{
            elem.text(val);
        }
    });
}

function treatSendResponse(key, val, regex) {
    var error = regex.exec(key);
    if (error != null) {
        key = error;
    }
    if ($(creatElementId(key)).text() != '') {
        $(creatElementId(key)).text(val);
    }
}

function getChosenProductToBeBought() {
    var prodInCart = localStorage.getItem('shoppingCart');
    var chosenProduct = getID(localStorage.getItem('chosenProduct'));
    if (prodInCart != null) {
        prodInCart = prodInCart + "," + chosenProduct;
    } else {
        prodInCart = chosenProduct;
    }
    localStorage.setItem('shoppingCart', prodInCart);
}

function sendProductInCart() {
    var errorMessage = $(creatElementId('errorText'));
    var numberProducts = 0;
    var prodInCart = '';
    var message = '';

    $('#submitOrder').click(function (event) {
        event.preventDefault();
        if (validateFields()) {
            var form = $(creatElementId('buy-form'));
            var formData = updateFormObject(form);
            var data = JSON.stringify(formData);
            $.ajax({
                url: $(form).attr('action'),
                type: 'POST',
                data: {
                    formData: data
                },
            }).done(function (response) {
                alert('Your order has beeen sent!');
                localStorage.setItem('shoppingCart', prodInCart);
                localStorage.setItem('numberProducts', numberProducts);
                window.location.reload();
            }).fail(function (response) {
                $(errorMessage).text(response.responseText);
            });
        }
    });
}

function updateFormObject(form) {
    var chosenProduct = localStorage.getItem('shoppingCart');
    var quantity = '';
    $('select').map(function () {
        return quantity += $(this).val() + ',';
    })
    var formData = $(form).serializeArray();
    formData.push({
        name: 'chosenProduct',
        value: chosenProduct
    });
    formData.push({
        name: 'quantity',
        value: quantity
    });
    return formData;
}

function validateFields() {
    var allInputs = $("#buy-form input");
    var passedValidation = true;
    allInputs.each(function () {
        if ($(this).val() === '' && $(this).attr('id') != 'comments') {
            $(this).attr('placeholder', 'Please fill out this field.').addClass('error');
            passedValidation = false;
        }
    });
    return passedValidation;
}

function setSearchValue(searchValue) {
    var searchKey = $(creatElementId(searchValue)).val();
    localStorage.setItem(searchValue, searchKey);
}

function searchProducts(products) {
    var key = localStorage.getItem('searchValue');
    var regex = new RegExp(key, 'i');
    var searchResults = $.grep(products, function (item) {
        if (regex.test(item.name)) {
            return item;
        }
    });
    var resultElem = '#results';
    if (searchResults.length != 0) {
        fillProductInformation(searchResults, '', resultElem, false);
    } else {
        $('<h4/>', {
            'class': 'no-margin',
            id:'no-results'
        }).appendTo(resultElem);
    }
}

function removeProdFromCart(prodName, prodInCart) {
    var quantities = getQuantities();
    var newProdInCart = '';
    var newQuantities = '';
    var numberProducts = 0;
    for (var i = 0; i < prodInCart.length; i++) {
        if (prodInCart[i] != prodName) {
            newProdInCart += prodInCart[i] + ',';
            newQuantities += quantities[i] + ',';
            numberProducts += parseInt(quantities[i]);
        }
    }
    localStorage.setItem('shoppingCart', newProdInCart);
    localStorage.setItem('quantity', newQuantities);
    localStorage.setItem('numberProducts', numberProducts);
    window.location.reload();
}

function calculatePrice(priceString, quantity) {
    var regex = /(\d+)/;
    var price = regex.exec(priceString)[0];
    var totalPrice = parseInt(price) * parseInt(quantity);
    return totalPrice + ' RON';
}

function getQuantities(){
    var quantityString = localStorage.getItem('quantity');
    if (quantityString != null) {
        return quantityString.split(',');
    }
}

function creatElementId(id) {
    return "#" + id;
}

function changeActiveButton(key, value, element) {
    var oldValue = localStorage.getItem(key);
    if (oldValue != '') {
        $(creatElementId(oldValue)).removeClass('active');
    }
    localStorage.setItem(key, value);
    $(element).addClass('active');
}

function getMainPhoto(prodByCategory, category){
    for (var i = 0; i < prodByCategory.length; i++) {
        if (prodByCategory[i].type === category) {
            return prodByCategory[i].image;
        }
    }
}

function changeProductsPhoto(element, image) {
    $(element).attr("src", image);
}

function resetContainer(element) {
    $(element).empty();
}

function getID(chosenProduct) {
    var choseProductID = chosenProduct.split('id')[0];
    return choseProductID;
}

function decodeSrcPath(path) {
    var srcPath = path.split('images');
    if(srcPath.length === 1){
        return "./images/" + srcPath[0];
    }else{
        return "./images" + srcPath[1];
    }
}

function createDynamicDiv(classCSS, id, text, appendToElement) {
    $('<div/>', {
        'class': classCSS,
        'id': id,
        'text': text
    }).appendTo(appendToElement);
}

function createDynamicImg(classCSS, id, src, alt, appendToElement) {
    $('<img/>', {
        'class': classCSS,
        'src': src,
        'alt': alt,
        'id': id
    }).appendTo(appendToElement);
}

function createDynamicP(classCSS, text, appendToElement) {
    $('<p/>', {
        'class': classCSS,
        'text': text
    }).appendTo(appendToElement);
}

function createDynamicLi(classCSS, id, text, appendToElement) {
    $('<li/>', {
        'class': classCSS,
        'id': id,
        'text': text
    }).appendTo(appendToElement);
}

function createDynamicSelect(classCSS, appendToElement, quantity) {
    var id = 'select' + appendToElement;
    $('<select/>', {
        'class': classCSS,
        'id': id
    }).appendTo(creatElementId(appendToElement));

    for (var i = 1; i <= 10; i++) {
        if (i == quantity) {
            $(creatElementId(id)).append($('<option/>', {
                'value': i,
                'text': i,
                'selected': 'selected'
            }));
        } else {
            $(creatElementId(id)).append($('<option/>', {
                'value': i,
                'text': i
            }));
        }
    }
}

function objectFitForIE(){
    var userAgent, ieReg, ie;
    userAgent = window.navigator.userAgent;
    ieReg = /msie|Trident.*rv[ :]*11\./gi;
    ie = ieReg.test(userAgent);

    if(ie) {
        $(".image-container").each(function () {
           setBackgroundImage($(this));
        });
        $(".image-container-columns").each(function () {
            setBackgroundImage($(this));
        });
        $(".featured-image").each(function () {
            $(this).css("opacity", 0);
        });
        $(".featured-image-columns").each(function () {
            $(this).css("opacity", 0);
        });
    }
}

function setBackgroundImage(container){
    imgUrl = container.find("img").prop("src");
    if (imgUrl) {
        container.css("backgroundImage", 'url(' + imgUrl + ')').addClass("custom-object-fit");
    }
}