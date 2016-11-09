app.directive('customerItem', function() {
    return {
        restrict: 'E',
        scope: {
            "customerId": '@',
			"firstName": '@',
			"lastName": '@',
			"phoneNumber": '@'
        },
        templateUrl: 'comps/customer-item/markup.html',
    };
});

