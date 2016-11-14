(function($,window,document){
    $.restService = function(){}
    $.restService.host = "";

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