app.directive('productList', function($timeout) {
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
	        				"<div class='col'>Product ID</div>" + 
	        				"<div class='col'>Product Name</div>" + 
	        				"<div class='col'>Price</div>" + 
	        				"<div class='col'>Weight</div>" + 
	        				"<div class='col'>In Stock</div>" + 
	        			"</div>"
	        		);
	        	});
        	})(element);
	    }
    };
});

