(function($,window,document){
    $.restService = function(){}
    $.restService.host = "";

    // [Search]
    $.restService.searchCustomer = function(query, success, error){
        doRequest("/customers" + query, "GET", ({}), success, error)
    }

    $.restService.searchProduct = function(query, success, error){
        doRequest("/products" + query, "GET", ({}), success, error)
    }

    $.restService.searchOrder = function(query, success, error){
        doRequest("/orders" + query, "GET", ({}), success, error)
    }

    $.restService.searchCart = function(query, success, error){
        doRequest("/carts" + query, "GET", ({}), success, error)
    }

    // [Insert]
    $.restService.insertCustomer = function(content, success, error){
        doRequest("/customers", "POST", content, success, error)
    }

    $.restService.insertProduct = function(content, success, error){
        doRequest("/products", "POST", content, success, error)
    }

    $.restService.insertOrder = function(content, success, error){
        doRequest("/orders", "POST", content, success, error)
    }

    $.restService.insertCart = function(content, success, error){
        doRequest("/carts", "POST", content, success, error)
    }

    // [Update]
    $.restService.updateCustomer = function(path, content, success, error){
        doRequest("/customers/" + path, "PUT", content, success, error)
    }

    $.restService.updateProduct = function(path, content, success, error){
        doRequest("/products/" + path, "PUT", content, success, error)
    }

    $.restService.updateOrder = function(path, content, success, error){
        doRequest("/orders/" + path, "PUT", content, success, error)
    }

    $.restService.updateCart = function(path, content, success, error){
        doRequest("/carts/" + path, "PUT", content, success, error)
    }

    // [Delete]
    $.restService.deleteCart = function(content, success, error){
        doRequest("/carts", "DELETE", content, success, error)
    }

    function doRequest(path, type, content, success, error){
        var url = $.restService.host + path;
        jQuery.ajax({
            url: url,
            type: type,
            data: JSON.stringify(content),
            dataType : 'json',
            success: success,
            error : error,
            timeout: 12000,
        });
    }

})($,window,document);