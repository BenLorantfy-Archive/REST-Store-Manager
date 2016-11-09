app.directive('cartItem', function() {
    return {
        restrict: 'E',
        scope: {
            "orderId": '@',
			"productId": '@',
			"quanity": '@'
        },
        templateUrl: 'comps/cart-item/markup.html',
    };
});

