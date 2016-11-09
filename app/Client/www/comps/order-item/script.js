app.directive('orderItem', function() {
    return {
        restrict: 'E',
        scope: {
            "orderId": '@',
			"customerId": '@',
			"poNumber": '@',
			"orderDate": '@'
        },
        templateUrl: 'comps/order-item/markup.html',
    };
});

