app.directive('productItem', function() {
    return {
        restrict: 'E',
        scope: {
            "productId": '@',
			"name": '@',
			"price": '@',
			"weight": '@',
            "inStock": '@'
        },
        templateUrl: 'comps/product-item/markup.html',
    };
});

