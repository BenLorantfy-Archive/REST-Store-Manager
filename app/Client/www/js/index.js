var app = angular.module('app', []);

app.controller('MainController', function($scope, $compile) {

	// [ Set the REST API root ]
	$.request.host = "http://localhost/";


	// [ Page Events ]
	// These functions are invoked whenever the user navigates to the corresponding page
	var pages = {
		searchCustomersResults: function(){

			// [ Make the request for customers ]
			// The search should use the query string
			$.request("GET","/customers").done(renderCustomers);
			
			// [ Render the customers ]
			function renderCustomers(customers){
				var list = $("<customer-list></customer-list>");

				$.each(customers,function(i,customer){
					var el = $("<customer-item></customer-item>");
					el.attr({
						 "customer-id": customer.custID
						,"first-name": customer.firstName
						,"last-name": customer.lastName
						,"phone-number": customer.phoneNumber
					});

					list.append(el);
				});

				$("#searchCustomersResultsPage").find("customer-list").replaceWith(list);
				$compile(list)($scope);				
			}




		}
	};


	// [ Navigation ]
	(function navigation(){
		var currPage = $(".page").eq(0).attr("id").replace("Page","");
		var currPageLabel = currPage;
		window.pageStack = [currPage];
		window.pageLabelStack = [currPageLabel];
		var fromPage = "";
		window.toPage = "";
		var pageKey = 0;
		var navEl = $("");

		// [ On Click ]
		$("body").on("click","nav-item",function(){
			fromPage = $(this).closest(".page").attr("id").replace("Page","");
			toPage = $(this).attr("page");
			toLabel = $(this).attr("label");
			$(".navItem").removeClass("selected");
			navigate(fromPage,toPage,toLabel);
		});

		// [ Don't Tab to Url Bar ]
		$('.page input:visible').last().on('keydown', function (e) {
		    if (e.keyCode == 9 && e.shiftKey == false) {
		        e.preventDefault();
		        $(this).blur();
		       // $('.page input:visible').first().focus();
		    }
		});


		// [ On Key Press ]
		$(document).keydown(function(e){
			// If focused in textbox, don't use nav control hotkeys
			if($(document.activeElement).prop("tagName").toLowerCase() == "input" 
			 		|| $(document.activeElement).prop("tagName").toLowerCase() == "textarea"){
				return;
			}

			var number = e.keyCode - 48;
			var pageEl = $("#" + currPage + "Page");
			navEl = pageEl.find("nav-item").eq(number - 1);
			fromPage = pageEl.attr("id").replace("Page","");
			toPage = navEl.attr("page");
			toLabel = navEl.attr("label");

			$("nav-item").not(navEl).find(".navItem").removeClass("selected");
			navEl.find(".navItem").addClass("selected");
			

			pageKey = number;
		})

		$(document).keyup(function(e){
			// If focused in textbox, don't use nav control hotkeys
			if($(document.activeElement).prop("tagName").toLowerCase() == "input" 
			 		|| $(document.activeElement).prop("tagName").toLowerCase() == "textarea"){
				return;
			}

			var number = e.keyCode - 48;
			$("nav-item").not(navEl).find(".navItem").removeClass("selected");
			if(number == pageKey){
				if(toPage){
					navigate(fromPage,toPage,toLabel);
				}
			}	
		})

		function navigate(fromPage,toPage){
			if(toPage == "back"){
				pageStack.pop();
				pageLabelStack.pop();

				toPage = pageStack[pageStack.length - 1];

				$("#" + fromPage + "Page").addClass("moveRight");
				$("#" + toPage + "Page").removeClass("moveLeft").removeClass("moveRight");


				currPage = toPage;
									
			}else{
				$("#" + fromPage + "Page").addClass("moveLeft");
				$("#" + toPage + "Page").removeClass("moveLeft").removeClass("moveRight");

				currPage = toPage;
				pageStack.push(toPage);
				pageLabelStack.push(toLabel);
			}			

			// [ Update page stack ]
			var pageStackStr = "/ ";
			$.each(pageLabelStack, function(i,page){
				pageStackStr += page.toLowerCase().split("-")[0] + " / ";
			})

			$("#pageStack").text(pageStackStr);

			// [ Invoke page logic ]
			if(typeof pages[toPage] === "function"){
				pages[toPage]();
			}
		}


	})();

});

// [ Load all the components ]
(function(){
	var comps = [
		 "nav-item"
		,"customer-item"
		,"customer-list"
	];

	$.each(comps,function(i,name){
		$("body").append("<link rel='stylesheet' type='text/css' href='comps/" + name + "/styles.css'></link>");
	});

	$.each(comps,function(i,name){
		$("body").append("<script src='comps/" + name + "/script.js'></script>");
	});
})();

