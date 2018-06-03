$(document).ready(function () {

    createDynamicSections();

    $("#new-collection").click(function () {
        localStorage.setItem("newCollection", "true");
    });

    if ($("#allProductsType").length) {
        createHorizontalScrolling();
    }

    treatImageGalleryEvents();

});

function createDynamicSections() {
    var products = readProductsInformation();

    $.when(products).done(function (products) {

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

        var choseProductID = localStorage.getItem("choseProductID");
        if ($("#productInformation").length && choseProductID != '') {
            var allProducts = products.get("allProducts")
            for (var i = 0; i <= allProducts.length; i++) {
                var productID = getID(choseProductID);
                if (allProducts[i].id === productID) {
                    createProductPresentation(allProducts[i]);
                    break;
                }
            }
        }
    });
}

function changeProductsPhoto(id, image) {
    $(id).attr("src", image);
};

function resetContainer(element) {
    $(element).empty();
};

function createNewCollectionSection(newCollection) {

    var index = Math.floor(Math.random() * newCollection.length);
    changeProductsPhoto("#products-image", newCollection[index].image);

    localStorage.setItem("categoryType", newCollection[index].type);
    $("#" + newCollection[index].type).focus();

    fillProductInformation(newCollection, newCollection[index].type, "allProductsType");
    localStorage.setItem("newCollection", "false");
}

function createProductByTypeSection(allProducts) {
    for (var i = 0; i < allProducts.length; i++) {
        if (allProducts[i].type === 'oil') {
            changeProductsPhoto("#products-image", allProducts[i].image);
        }
        break;
    }
    fillProductInformation(allProducts, 'oil', "allProductsType");
    $("#oil").focus();
    localStorage.setItem("categoryType", 'oil');
}

function changeProductInformationByType(allProducts) {
    var productType = '';
    $("#oil").click(function () {
        resetContainer('#allProductsType');
        productType = 'oil';
        localStorage.setItem("categoryType", productType);
        fillProductInformation(allProducts, productType, "allProductsType");
    });
    $("#scrub").click(function () {
        resetContainer('#allProductsType');
        productType = 'scrub';
        localStorage.setItem("categoryType", productType);
        fillProductInformation(allProducts, productType, "allProductsType");
    });
    $("#cosmetics").click(function () {
        resetContainer('#allProductsType');
        productType = 'cosmetics';
        localStorage.setItem("categoryType", productType);
        fillProductInformation(allProducts, productType, "allProductsType");
    });
    $("#food").click(function () {
        resetContainer('#allProductsType');
        productType = 'food';
        localStorage.setItem("categoryType", productType);
        fillProductInformation(allProducts, productType, "allProductsType");
    });
    $("#jewellery").click(function () {
        resetContainer('#allProductsType');
        productType = 'jewellery';
        localStorage.setItem("categoryType", productType);
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
                    "click": function (event) {
                        localStorage.setItem("choseProductID", '' + event.currentTarget.offsetParent.id + '');
                    }
                }
            }).appendTo('#' + id2 + '').click();
            $('<img/>', {
                'class': 'width-100 no-padding height-20vh img-cover',
                'src': '' + products[i].image + ''
            }).appendTo('#' + id3 + '');
            $('<div/>', {
                'class': 'align-center layout-column flex ruby-text-container padding-5',
                'id': id4
            }).appendTo('#' + id2 + '');
            $('<a/>', {
                'class': 'no-margin light-text no-text-decoration gray-color',
                text: '' + products[i].name + '',
                'href': 'products-description.html',
                "on": {
                    "click": function (event) {
                        localStorage.setItem('choseProductID', '' + event.currentTarget.offsetParent.id + '');
                    }
                }
            }).appendTo('#' + id4 + '');
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

    $.getJSON("./products/products.json", function (result) {})
        .done(function (result) {
            $.each(result, function (index, val) {
                allProducts.push(val);
                if (val.recommendedProduct === 'true') {
                    recommendedProducts.push(val);
                }
                if (val.newCollection === 'true') {
                    newCollection.push(val);
                }
            })
            products.set("allProducts", allProducts);
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

function createHorizontalScrolling() {
    var scrollBarWidths = 40;

    var widthOfList = function () {
        var itemsWidth = 0;
        $('.category').each(function () {
            var itemWidth = $(this).outerWidth();
            itemsWidth += itemWidth;
        });
        return itemsWidth;
    };

    var widthOfHidden = function () {
        var outer = $('.cat-wrapper').outerWidth();
        return (outer - widthOfList() - getLeftPosi()) - scrollBarWidths;
    };

    var getLeftPosi = function () {
        var position = $('.cat-list').position();
        return position.left;
    };

    var reAdjust = function () {
        $('.cat-list').removeClass('no-slider');

        if ($('.cat-wrapper').outerWidth() >= widthOfList() && getLeftPosi() >= 0) {
            $('.cat-list').addClass('no-slider');
            $("#" + localStorage.getItem("categoryType")).focus();
            $('.scroller-right').hide();
            $('.scroller-left').hide();
            return;
        }

        if (($('.cat-wrapper').outerWidth()) < widthOfList()) {
            $('.scroller-right').show();
        } else {
            $('.scroller-right').hide();
        }

        if (getLeftPosi() < 0) {
            $('.scroller-left').show();
        } else if (getLeftPosi() < 0 && $('.cat-wrapper').outerWidth() <= widthOfList()) {
            $('.category').animate({
                left: "-=" + getLeftPosi() + "px"
            }, 'slow');
            $('.scroller-left').hide();
        }
    }

    reAdjust();

    $(window).on('resize', function (e) {
        reAdjust();
    });

    $('.scroller-right').click(function () {
        $('.scroller-left').fadeIn('slow');
        $('.scroller-right').fadeOut('slow');

        $('.cat-list').animate({
            left: "+=" + widthOfHidden() + "px"
        }, 'slow', function () {});

        $("#" + localStorage.getItem("categoryType")).focus();
    });

    $('.scroller-left').click(function () {
        $('.scroller-right').fadeIn('slow');
        $('.scroller-left').fadeOut('slow');

        $('.cat-list').animate({
            left: "-=" + getLeftPosi() + "px"
        }, 'slow', function () {});

        $("#" + localStorage.getItem("categoryType")).focus();
    });
}

function createProductPresentation(product) {

    var productTYpe = product.type.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });
    $('<span/>', {
        'class': 'gray-color font-16 no-text-decoration padding-5',
        text: ' ' + productTYpe + ''
    }).appendTo('#productLocation');

    $('<p/>', {
        'class': 'font-16 no-margin demi-bold padding-top-10 padding-left-5',
        text: ' ' + product.name + ''
    }).appendTo('#productName');

    fillProductImages(product);
    fillProductDetails(product);

}

function getID(choseProduct) {
    var regex = /([^\^x]+)/;
    var choseProductID = regex.exec(choseProduct)[0];
    return choseProductID;
}

function fillProductImages(product) {

    $('<a/>', {
        id: "mainImageLink",
        "on": {
            "click": function (event) {
                fillImageGallary(event.currentTarget.childNodes["0"].attributes[1].nodeValue, product.image, product.imageDetailed);
            }
        }
    }).appendTo("#productImage");
    $('<img/>', {
        'class': 'width-100 padding-5 img-cover height-40vh',
        'src': '' + product.image + '',
        id: "mainImage"
    }).appendTo('#mainImageLink');

    var images = product.imageDetailed;
    var i;
    for (i = 0; i < images.length; i++) {
        var id1 = product.id + "x" + i;
        var id2 = id1 + "X";
        $('<div/>', {
            'class': 'flex-33 padding-5 table-cell',
            'id': id1
        }).appendTo('#productImages');
        $('<a/>', {
            'id': id2,
            "on": {
                "click": function (event) {
                    changeProductsPhoto("#mainImage", event.currentTarget.childNodes["0"].src);
                }
            }
        }).appendTo("#" + id1 + "");
        $('<img/>', {
            'class': 'width-100 no-padding height-20vh img-cover',
            'src': '' + images[i] + ''
        }).appendTo('#' + id2 + '');
    }
}

function fillProductDetails(product) {

    $('<p/>', {
        'class': 'align-justify no-margin',
        text: '' + product.description + ''
    }).appendTo('#productDescription');
    $('<p/>', {
        'class': 'demi-bold align-justify no-margin padding-top-bottom-10',
        text: 'Product details'
    }).appendTo('#productDescription');
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
    $('<div>', {
        'class': 'margin-top-30 flex relative-position layout-row',
        id: 'dimensionPrice'
    }).appendTo('#productDescription');
    $('<div>', {
        'class': 'flex-50 layout-column',
        id: 'dimensions'
    }).appendTo('#dimensionPrice');
    $('<p/>', {
        'class': 'demi-bold no-margin padding-5 ',
        text: 'Dimensions'
    }).appendTo('#dimensions');
    $('<p/>', {
        'class': 'no-margin padding-5 ',
        text: '' + product.dimensions + ''
    }).appendTo('#dimensions');
    $('<div>', {
        'class': 'flex-50 layout-column',
        id: 'price'
    }).appendTo('#dimensionPrice');
    $('<p/>', {
        'class': 'demi-bold no-margin padding-5 ',
        text: 'Price'
    }).appendTo('#price');
    $('<p/>', {
        'class': 'no-margin demi-bold padding-5 ',
        text: '' + product.price + ''
    }).appendTo('#price');
}

function fillImageGallary(imageSelected, mainImage, imageDetailed) {
    $("#img-gallery-container").show();
    $("#image-gallery").show();

    var currentImg = decodeSrcPath(imageSelected);
    var j = 0;
    var imagesDetLength = imageDetailed.length;
    var totalImages = imagesDetLength + 1;
    var imageSlidesIDs = 'image-slides' + j + '';
    $('<div>', {
        'class': 'image-slides display-none',
        id: imageSlidesIDs
    }).appendTo('#image-slides');
    $('<div>', {
        'class': 'number-text absolute-position',
        text: "" + (j + 1) + "/" + totalImages + ""
    }).appendTo('#' + imageSlidesIDs + '');
    $('<img/>', {
        'class': 'height-70vh img-contain',
        'src': '' + currentImg + ''
    }).appendTo('#' + imageSlidesIDs + '');
    localStorage.setItem("curentImage", j);
    var slidesIDs = [];
    slidesIDs.push(imageSlidesIDs);

    j++;

    if (currentImg != mainImage) {
        imageSlidesIDs = 'image-slides' + j + '';
        $('<div>', {
            'class': 'image-slides display-none',
            id: imageSlidesIDs
        }).appendTo('#image-slides');
        $('<div>', {
            'class': 'number-text absolute-position',
            text: "" + (j + 1) + "/" + totalImages + ""
        }).appendTo('#' + imageSlidesIDs + '');
        $('<img/>', {
            'class': 'height-70vh img-contain',
            'src': '' + mainImage + ''
        }).appendTo('#' + imageSlidesIDs + '');
        j++;
        slidesIDs.push(imageSlidesIDs);
    }

    for (var i = 0; i < imagesDetLength; i++) {
        imageSlidesIDs = 'image-slides' + j + '';
        if (currentImg != imageDetailed[i]) {
            $('<div>', {
                'class': 'image-slides display-none',
                id: imageSlidesIDs
            }).appendTo('#image-slides');
            $('<div>', {
                'class': 'number-text absolute-position',
                id: 'number-text',
                text: "" + (j + 1) + "/" + totalImages + ""
            }).appendTo('#' + imageSlidesIDs + '');
            $('<img/>', {
                'class': 'height-70vh img-contain',
                'src': '' + imageDetailed[i] + ''
            }).appendTo('#' + imageSlidesIDs + '');
            j++;
            slidesIDs.push(imageSlidesIDs);
        }
    }
    localStorage.setItem("imageSlideIds", slidesIDs);
    showDesiredSlide("");
}

function treatImageGalleryEvents() {
    $("#close-gallery").click(function () {
        $("#img-gallery-container").hide();
        $("#image-gallery").hide();
        resetContainer("#image-slides");
    });

    $("#prev-img").click(function () {
        showDesiredSlide("-");
    });
    $("#next-img").click(function () {
        showDesiredSlide("+");
    });
}

function showDesiredSlide(loc) {
    var ids = [];
    ids = localStorage.getItem("imageSlideIds").split(",");
    var j = localStorage.getItem("curentImage");
    $("#" + ids[j] + "").hide();
    switch (loc) {
        case "+":
            j++;
            break;
        case "-":
            j--;
            break;
        default:
            break;
    }

    if (j == ids.length) {
        j = 0;
    }else if(j < 0){
        j = ids.length-1;
    }

    $("#" + ids[j] + "").show();
    localStorage.setItem("curentImage", j);
}

function decodeSrcPath(path){
    var regex = /((?<=\images).*$)/;
    var srcPath = decodeURI(regex.exec(path)[0]);
    return "./images" + srcPath;
}