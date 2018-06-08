$(document).ready(function () {

    createDynamicSections();

    $("#new-collection").click(function () {
        localStorage.setItem("newCollection", "true");
    });

    if ($("#allProductsType").length) {
        createHorizontalScrolling();
    }

    handleImageGalleryEvents();

});

function createDynamicSections() {
    var products = readProductsInformation();

    var allProductsType = "allProductsType";
    var recommendedProducts = "recommendedProducts";

    $.when(products).done(function (products) {

        var allProducts = products.get("allProducts");
        var newCollection = products.get("newCollection");
        var recPrd = products.get(recommendedProducts);

        if ($("#" + recommendedProducts).length) {
            fillProductInformation(recPrd, '', recommendedProducts, false);
        }

        if ($("#" + allProductsType).length) {

            if (localStorage.getItem("newCollection") === 'true') {
                createNewCollectionSection(newCollection);
            } else {
                createProductByTypeSection(allProducts);
            }
        }
        handleCategoriesEvents(allProducts);

        if ($("#results").length) {
            searchProducts(allProducts);
        }

        var choseProductID = localStorage.getItem("choseProductID");
        if ($("#productInformation").length && choseProductID != '') {
            for (var i = 0; i <= allProducts.length; i++) {
                var productID = getID(choseProductID);
                if (allProducts[i].id === productID) {
                    createProductPresentation(allProducts[i]);
                    break;
                }
            }
        }

        $("#search-result").on("click", function () {
            openResultPage();
        });

        $("#search-text").keypress(function(event){
            var key = event.which;
            if(key === 13){
                $('#search-result')[0].click();
            }
        });
    });
}

function openResultPage(){
    var searchKey = $("#search-text").val();
    localStorage.setItem("searchKey", searchKey);
}
function searchProducts(products) {
    var key = localStorage.getItem('searchKey');
    var regex = new RegExp(key, "i");
    var searchResults = $.grep(products, function (item) {
        if (regex.test(item.name)) {
            return item;
        }
    });
    if (searchResults.length != 0) {
        fillProductInformation(searchResults, "", "results", false);
    } else {
        $('<h4/>', {
            'class': 'no-margin',
            text: 'Sorry, we couldn’t find any results.'
        }).appendTo('#results');
    }
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

    ("categoryType");
    setActiveButton("categoryType", newCollection[index].type, "#" + newCollection[index].type);

    fillProductInformation(newCollection, newCollection[index].type, "allProductsType", false);
    localStorage.setItem("newCollection", "false");
}

function createProductByTypeSection(allProducts) {
    for (var i = 0; i < allProducts.length; i++) {
        if (allProducts[i].type === 'oil') {
            changeProductsPhoto("#products-image", allProducts[i].image);
        }
        break;
    }
    fillProductInformation(allProducts, 'oil', "allProductsType", false);

    resetActiveButton("categoryType");
    setActiveButton("categoryType", 'oil', "#oil");
}

function resetActiveButton(key) {
    var type = localStorage.getItem(key);
    if (type != '') {
        $("#" + type).removeClass('active');
    }
}

function setActiveButton(key, value, item) {
    localStorage.setItem(key, value);
    $(item).addClass('active');
}

function changeProductByType(allProducts, productType, idDIV) {
    resetContainer('#allProductsType');
    resetActiveButton("categoryType");
    setActiveButton("categoryType", productType, "#" + productType);
    fillProductInformation(allProducts, productType, idDIV, false);
}

function handleCategoriesEvents(allProducts) {

    $("#oil").click(function () {
        changeProductByType(allProducts, 'oil', "allProductsType");
    });
    $("#scrub").click(function () {
        changeProductByType(allProducts, 'scrub', "allProductsType");
    });
    $("#cosmetics").click(function () {
        changeProductByType(allProducts, 'cosmetics', "allProductsType");
    });
    $("#food").click(function () {
        changeProductByType(allProducts, 'food', "allProductsType");
    });
    $("#jewellery").click(function () {
        changeProductByType(allProducts, 'jewellery', "allProductsType");
    });
};

function fillProductInformation(products, productType, idDIV, isPagination) {

    if (!isPagination) {
        resetContainer('#pagination');
    }

    var i;
    var productByType = [];
    for (i = 0; i < products.length; i++) {
        if (products[i].type === productType || productType === '') {
            productByType.push(products[i]);
            if (productByType.length <= 6) {
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
                }).appendTo('#' + id2 + '');
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
    }

    var pag = productByType.length / 6;
    if (productByType.length % 6 != 0) {
        pag++;
    }

    if (pag >= 2) {
        for (i = 1; i <= pag; i++) {
            var id = "pag" + i;
            var id1 = id + i;
            $('<li/>', {
                'class': 'page-item',
                'id': id
            }).appendTo('#pagination');
            $('<button/>', {
                'class': 'page-button',
                text: "" + i + "",
                'id': id1,
                click: function (event) {
                    resetContainer('#allProductsType');
                    resetContainer('#results');
                    var j = parseInt(event.currentTarget.textContent);
                    resetActiveButton("paginationActive");
                    setActiveButton("paginationActive", 'pag' + j + j, '#pag' + j + j);
                    var prods = productByType.slice((j - 1) * 6 + 1, j * 6 + 1);
                    fillProductInformation(prods, productType, idDIV, true);
                }
            }).appendTo('#' + id + '');
        }
        setActiveButton("paginationActive", 'pag' + 1 + 1, '#pag' + 1 + 1);
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
        var outer = $('.category-wrapper').outerWidth();
        return (outer - widthOfList() - getLeftPosi()) - scrollBarWidths;
    };

    var getLeftPosi = function () {
        var position = $('.category-list').position();
        return position.left;
    };

    var reAdjust = function () {
        $('.category-list').removeClass('no-slider');

        if ($('.category-wrapper').outerWidth() >= widthOfList() && getLeftPosi() >= 0) {
            $('.category-list').addClass('no-slider');
            $('.scroller-right').addClass('hidden-arrow');
            $('.scroller-left').addClass('hidden-arrow');
            return;
        }

        if (($('.category-wrapper').outerWidth()) < widthOfList()) {
            $('.scroller-right').removeClass('hidden-arrow');
        } else {
            $('.scroller-right').addClass('hidden-arrow');
        }

        if (getLeftPosi() < 0) {
            $('.scroller-left').removeClass('hidden-arrow');
        } else if (getLeftPosi() < 0 && $('.category-wrapper').outerWidth() <= widthOfList()) {
            $('.category').animate({
                left: "-=" + getLeftPosi() + "px"
            }, 'slow');
            $('.scroller-left').addClass('hidden-arrow');
        }
    }

    reAdjust();

    $(window).on('resize', function (e) {
        reAdjust();
    });

    $('.scroller-right').click(function () {
        $('.scroller-left').removeClass('hidden-arrow');
        $('.scroller-right').addClass('hidden-arrow');

        $('.category-list').animate({
            left: "+=" + widthOfHidden() + "px"
        }, 'slow', function () {});
    });

    $('.scroller-left').click(function () {
        $('.scroller-left').addClass('hidden-arrow');
        $('.scroller-right').removeClass('hidden-arrow');

        $('.category-list').animate({
            left: "-=" + getLeftPosi() + "px"
        }, 'slow', function () {});
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

function handleImageGalleryEvents() {
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

function showDesiredSlide(location) {
    var ids = [];
    ids = localStorage.getItem("imageSlideIds").split(",");
    var j = localStorage.getItem("curentImage");
    $("#" + ids[j] + "").hide();
    switch (location) {
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
    } else if (j < 0) {
        j = ids.length - 1;
    }

    $("#" + ids[j] + "").show();
    localStorage.setItem("curentImage", j);
}

function decodeSrcPath(path) {
    var regex = /((?<=\images).*$)/;
    var srcPath = decodeURI(regex.exec(path)[0]);
    return "./images" + srcPath;
}