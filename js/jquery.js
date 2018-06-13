$(document).ready(function () {

    var language = localStorage.getItem('language');
    if(language === null || language === 'null'){
        language = 'en';
    }
    changeLanguage(language);

    handleLanguageEvent();
    handleNewCollectionEvents('newCollection');
    handleLightboxEvents();
    handleHorizontalScrolling();

});

function createDynamicSections(language) {
    var productsByCategory = 'productsByCategory';
    var recommendedProducts = 'recommendedProducts';
    var newCollection = 'newCollection';

    var products = readProductsInformation(language);

    $.when(products).done(function (products) {
        var prodByCategory = products.get(productsByCategory);
        var newCollection = products.get(newCollection);
        var recPrd = products.get(recommendedProducts);

        if ($(creatElementId(recommendedProducts)).length) {
            fillProductInformation(recPrd, '', creatElementId(recommendedProducts), false);
        } else if ($(creatElementId(productsByCategory)).length) {
            if (localStorage.getItem(newCollection) === 'true') {
                createNewCollectionSection(newCollection);
            } else {
                var defaultCat = 'oil';
                createProductByCatSection(prodByCategory, defaultCat);
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
    });
}

function handleLanguageEvent() {
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

function createNewCollectionSection(newCollection) {
    var index = Math.floor(Math.random() * newCollection.length);
    changeProductsPhoto('#products-image', newCollection[index].image);
    changeActiveButton('categoryType', newCollection[index].type, creatElementId(newCollection[index].type));

    fillProductInformation(newCollection, newCollection[index].type, '#productsByCategory', false);
    localStorage.setItem('newCollection', 'false');
}

function createProductByCatSection(prodByCategory, category) {
    for (var i = 0; i < prodByCategory.length; i++) {
        if (prodByCategory[i].type === category) {
            changeProductsPhoto('#products-image', prodByCategory[i].image);
        }
        break;
    }
    fillProductInformation(prodByCategory, category, '#productsByCategory', false);
    var categoryType = 'categoryType';
    changeActiveButton(categoryType, category, creatElementId(category));
}

function handleCategoriesEvents(prodByCategory) {
    var prodByCat = '#productsByCategory';
    $('#oil').click(function () {
        changeProductByType(prodByCategory, 'oil', prodByCat);
    });
    $('#scrub').click(function () {
        changeProductByType(prodByCategory, 'scrub', prodByCat);
    });
    $('#cosmetics').click(function () {
        changeProductByType(prodByCategory, 'cosmetics', prodByCat);
    });
    $('#food').click(function () {
        changeProductByType(prodByCategory, 'food', prodByCat);
    });
    $('#jewellery').click(function () {
        changeProductByType(prodByCategory, 'jewellery', prodByCat);
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
    fillProductInformation(prodByCategory, productType, idDIV, false);
}

function fillProductInformation(products, productType, idDIV, isPagination) {
    var alt = 'Product image';
    resetContainer(idDIV);
    if (!isPagination) {
        resetContainer('#pagination');
    }

    var productByType = [];
    for (var i = 0; i < products.length; i++) {
        if (products[i].type === productType || productType === '') {
            productByType.push(products[i]);
            if (productByType.length <= 6) {
                var id1 = products[i].id;
                var id2 = id1 + "x" + i;
                var id3 = id2 + i;
                var id4 = id3 + i;

                createDynamicDiv('flex-33 padding-5 table-cell align-flex-start', id1, "", idDIV);
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
                createDynamicImg('width-100 no-padding height-20vh img-cover', '', '' + products[i].image + '', alt, creatElementId(id3));
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
                createDynamicH4('demi-bold no-margin', '' + products[i].price + '', creatElementId(id4));
            }
        }
    }

    var pag = productByType.length / 6;
    if (productByType.length % 6 != 0) {
        pag++;
    }
    if (pag >= 2) {
        createPagination(pag, productByType, productType, idDIV);
    }
};

function createPagination(pag, productByType, productType, idDIV){
     for (i = 1; i <= pag; i++) {
            var id = i;
            $('<li/>', {
                'class': 'page-item',
                'id': id
            }).appendTo('#pagination');
            $('<button/>', {
                'class': 'page-button',
                text: "" + i + "",
                click: function (event) {
                   handleClickEventForPag(event, productByType, productType, idDIV);
                }
            }).appendTo(creatElementId(id));
        }
        changeActiveButton("paginationActive", 1, creatElementId(1));
}

function handleClickEventForPag(event, productByType, productType, idDIV){
    resetContainer(idDIV);
    var j = parseInt(event.currentTarget.textContent);
    changeActiveButton("paginationActive", j, creatElementId(j));
    var prods = productByType.slice((j - 1) * 6 + 1, j * 6 + 1);
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
        var id1 = product.id + "x" + i;
        var id2 = id1 + "X";
        createDynamicDiv('flex-33 padding-5 table-cell', id1, '', '#productImages');
        $('<a/>', {
            'id': id2,
            "on": {
                "click": function (event) {
                    changeProductsPhoto("#mainImage", event.currentTarget.childNodes["0"].src);
                }
            }
        }).appendTo(creatElementId(id1));
        createDynamicImg('width-100 no-padding height-20vh img-cover', '', ''+images[i]+'', alt, creatElementId(id2));
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
        $('<li/>', {
            'class': 'align-justify no-margin',
            text: '' + product.details[i] + ''
        }).appendTo('#productDetails');
    }
    createDynamicDiv('margin-top-30 flex relative-position layout-row', 'dimensionPrice', '', '#productDescription');
    createDynamicDiv('flex-50 layout-column', 'dimensions', '', '#dimensionPrice');
    createDynamicP('demi-bold no-margin padding-5', 'Dimensions', '#dimensions');
    createDynamicP('no-margin padding-5', '' + product.dimensions + '', '#dimensions');
    createDynamicDiv('flex-50 layout-column', 'price', '', '#dimensionPrice');
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
    createDynamicImg('height-70vh img-contain', '', ''+currentImg+'', alt, creatElementId(imageSlidesIDs));
    localStorage.setItem("curentImage", j);
    
    var slidesIDs = [];
    j++;
    slidesIDs.push(imageSlidesIDs);

    if (currentImg != mainImage) {
        imageSlidesIDs = 'image-slides' + j + '';
        createDynamicDiv('image-slides display-none', imageSlidesIDs, '', '#gallerySlides');
        createDynamicDiv('number-text absolute-position', '', '' + (j + 1) + '/' + totalImages + '', creatElementId(imageSlidesIDs));
        createDynamicImg('height-70vh img-contain', '', ''+mainImage+'', alt, creatElementId(imageSlidesIDs));
        j++;
        slidesIDs.push(imageSlidesIDs);
    }

    for (var i = 0; i < imagesDetLength; i++) {
        imageSlidesIDs = 'image-slides' + j + '';
        if (currentImg != imageDetailed[i]) {
            createDynamicDiv('image-slides display-none', imageSlidesIDs, '', '#gallerySlides');
            createDynamicDiv('number-text absolute-position', '', '' + (j + 1) + '/' + totalImages + '', creatElementId(imageSlidesIDs));
            createDynamicImg('height-70vh img-contain', '', ''+ imageDetailed[i]+'', alt, creatElementId(imageSlidesIDs));
            j++;
            slidesIDs.push(imageSlidesIDs);
        }
    }
    localStorage.setItem("imageSlideIds", slidesIDs);
    showDesiredSlide("");
}

function createHorizontalScrolling() {
    var scroller = ".scroller-right, .scroller-left";
    var category = ".category";
    var categoryWrapper = ".category-wrapper";
    var categoryList = ".category-list";
    var scrollerRight = ".scroller-right";
    var scrollerLeft= ".scroller-left";

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

function changeArrowVizibility(addArrow, removeArrow){
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
    var translations = getLanguage(language);
    $.when(translations).done(function (translations) {
        setLanguage(translations);
        localStorage.setItem("language", language);
        createDynamicSections(language);
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

function setLanguage(translations) {
    translations.forEach(function (val, key) {
        var regex = new RegExp('errorText');
        var elem = $(creatElementId(key));
        if(elem.is('input#submit')) {
            elem.attr('value', val);
        } else if(regex.test(key) || key === 'successSend'){
            treatSendResponse(key, val, regex);
        }else if (elem.is('input') || elem.is('textarea')){
            elem.attr('placeholder', val);
        }else {
            elem.text(val);
        }
    });
}

function treatSendResponse(key, val, regex){
    var error = regex.exec(key);
    if(error != null){
        key = error;
    }
    if($(creatElementId(key)).text() != ''){
        $(creatElementId(key)).text(val);
    }
}

function setSearchValue(searchValue) {
    var searchKey = $(creatElementId(searchValue)).val();
    localStorage.setItem(searchValue, searchKey);
}

function searchProducts(products) {
    var key = localStorage.getItem("searchValue");
    var regex = new RegExp(key, "i");
    var searchResults = $.grep(products, function (item) {
        if (regex.test(item.name)) {
            return item;
        }
    });
    var resultElem = "#results";
    if (searchResults.length != 0) {
        fillProductInformation(searchResults, "", resultElem, false);
    } else {
        $('<h4/>', {
            'class': 'no-margin',
            text: 'Sorry, we couldn’t find any results.'
        }).appendTo(resultElem);
    }
}

function creatElementId(id) {
    return "#" + id;
}

function changeActiveButton(key, value, element){
    var oldValue = localStorage.getItem(key);
    if (oldValue != '') {
        $(creatElementId(oldValue)).removeClass('active');
    }
    localStorage.setItem(key, value);
    $(element).addClass('active');
}

function changeProductsPhoto(element, image) {
    $(element).attr("src", image);
}

function resetContainer(element) {
    $(element).empty();
}

function getID(chosenProduct) {
    var regex = /([^\^x]+)/;
    var choseProductID = regex.exec(chosenProduct)[0];
    return choseProductID;
}

function decodeSrcPath(path) {
    var regex = /((?<=\images).*$)/;
    var srcPath = decodeURI(regex.exec(path)[0]);
    return "./images" + srcPath;
}

function createDynamicH4(classCSS, text, appendToElement){
    $('<div/>', {
        'class': classCSS,
        'text': text
    }).appendTo(appendToElement);
}

function createDynamicDiv(classCSS, id, text, appendToElement){
    $('<div/>', {
        'class': classCSS,
        'id': id,
        'text': text
    }).appendTo(appendToElement);
}

function createDynamicImg(classCSS, id, src, alt, appendToElement){
    $('<img/>', {
       'class': classCSS,
       'src': src,
       'alt': alt,
       'id' : id
    }).appendTo(appendToElement);
}

function createDynamicP(classCSS, text, appendToElement){
    $('<p/>', {
        'class': classCSS,
        'text': text
    }).appendTo(appendToElement);
}