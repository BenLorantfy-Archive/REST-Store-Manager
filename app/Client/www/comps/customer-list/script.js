app.directive('customerList', function($timeout) {
    return {
        restrict: 'E',
        transclude:true,
        scope: {

        },
        templateUrl: 'comps/customer-list/markup.html',
        link: function(scope, element, attr) {
        	// debugger;
        	(function(element){
	        	$timeout(function(){
	        		$(element).find(".table").prepend(
	        			"<div class='table-header'>" + 
	        				"<div class='col'>Customer Id</div>" + 
	        				"<div class='col'>First Name</div>" + 
	        				"<div class='col'>Last Name</div>" + 
	        				"<div class='col'>Phone Number</div>" + 
	        			"</div>"
	        		);
	        	});
        	})(element);
	    }
    };
});

