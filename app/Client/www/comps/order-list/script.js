app.directive('orderList', function($timeout) {
    return {
        restrict: 'E',
        transclude:true,
        scope: {

        },
        templateUrl: 'comps/product-list/markup.html',
        link: function(scope, element, attr) {
        	// debugger;
        	(function(element){
	        	$timeout(function(){
	        		$(element).find(".table").prepend(
	        			"<div class='table-header'>" + 
	        				"<div class='col'>Order ID</div>" + 
	        				"<div class='col'>Customer ID</div>" + 
	        				"<div class='col'>P.O. Number</div>" + 
	        				"<div class='col'>Order Date</div>" + 
	        			"</div>"
	        		);
	        	});
        	})(element);
	    }
    };
});

