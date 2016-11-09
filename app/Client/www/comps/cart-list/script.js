app.directive('cartList', function($timeout) {
    return {
        restrict: 'E',
        transclude:true,
        scope: {

        },
        templateUrl: 'comps/cart-list/markup.html',
        link: function(scope, element, attr) {
        	// debugger;
        	(function(element){
	        	$timeout(function(){
	        		$(element).find(".table").prepend(
	        			"<div class='table-header'>" + 
	        				"<div class='col'>Order ID</div>" + 
	        				"<div class='col'>Product ID</div>" + 
	        				"<div class='col'>Quanity</div>" + 
	        			"</div>"
	        		);
	        	});
        	})(element);
	    }
    };
});

