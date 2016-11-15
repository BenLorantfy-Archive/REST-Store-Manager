var app = angular.module('app', []);

app.controller('MainController', function($scope, $compile) {

	// [ Set the REST API root ]
	$.request.host = "http://localhost:1337/";
    $.restService.host = "http://localhost:1337";

	// [ Page Events ]
	// These functions are invoked whenever the user navigates to the corresponding page
	var pages = {
        purchaseOrder:function(){
//            var exampleResponse = {
//                firstName:"SADF",
//                phoneNumber:"213434",
//                poNumber:"1234",
//                rows:[
//                    {
//                        prodName:"Blender",
//                        quanity:2,
//                        price:100			
//                    }
//                ]
//            }


            $.request("GET","/orders/" + currPurchaseOrderID).done(function(rows){
                $("#purchaseOrderPage .custID").text(rows[0].custID);
                $("#purchaseOrderPage .custName").text(rows[0].lastName + ", " + rows[0].firstName);
                $("#purchaseOrderPage .phone").text(rows[0].phoneNumber);
                $("#purchaseOrderPage .date").text(moment(rows[0].orderDate).format("MM-DD-YY"));
                $("#purchaseOrderPage .poNumber").text(rows[0].poNumber);
                
                // phone
                
                // Remove old items
                $("#purchaseOrderPage .item").remove();
                
                // Add all the new ones
                var subtotal = 0;
                var totalCount = 0;
                var totalWeight = 0;
                $.each(rows,function(i,row){
                    totalCount += row.quantity;
                    totalWeight += row.quantity * row.prodWeight;
                    subtotal += row.quantity * row.price;
                    $("#purchaseOrderPage .items").append(
                        "<tr class='item'>" +
                            "<td>" + row.prodID + "</td>" +
                            "<td>" + row.prodName + "</td>" + 
                            "<td>" + row.quantity + "</td>" +
                            "<td>$" + row.price + "</td>" +
                            "<td>" + row.prodWeight + " kg</td>" +
                        "</tr>"
                    );
                })
                
                var tax = subtotal * 0.13;
                var total = tax + subtotal;
                
                $("#purchaseOrderPage .subtotal").text("$" + Math.round(subtotal * 100) / 100);
                $("#purchaseOrderPage .tax").text("$" + Math.round(tax * 100) / 100);
                $("#purchaseOrderPage .total").text("$" + Math.round(total * 100) / 100);
                
                $("#purchaseOrderPage .totalCount").text(totalCount);
                $("#purchaseOrderPage .totalWeight").text(Math.round(totalWeight * 100) / 100 + " kg");
                
            });

        },
		searchCustomersResults: function(){


			// [ Make the request for customers ]
			// The search should uses the query string, which is the most RESTful way of searching
			// http://stackoverflow.com/a/1081720
			var query = "?";

			// [ Get search parameters ]
			var custID = $("#searchCustomersPage .custID").val();
			var firstName = $("#searchCustomersPage .firstName").val();
			var lastName = $("#searchCustomersPage .lastName").val();
			var phoneNumber = $("#searchCustomersPage .phoneNumber").val();

			if(custID) query += "custID=" + encodeURI(custID) + "&";
			if(firstName) query += "firstName=" + encodeURI(firstName) + "&";
			if(lastName) query += "lastName=" + encodeURI(lastName) + "&";
			if(phoneNumber) query += "phoneNumber=" + encodeURI(phoneNumber) + "&";

			// [ Make the actual REST request ]
			$.request("GET","/customers" + query).done(renderCustomers);

			// [ Render the customers ]
			function renderCustomers(customers){
                if(customers.length == 0){
                    addError("No customer matches query");
                }
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
		},
		searchProductsResults: function(){
            var prodID   = $("#searchProductsPage .prodID").val();
            var prodName = $("#searchProductsPage .prodName").val();
            var price = $("#searchProductsPage .price").val();
            var prodWeight = $("#searchProductsPage .prodWeight").val();
            var inStock = $("#searchProductsPage .inStock").is(':checked')  ? 1 : 0;

            var query = "?";
            if(prodID) query += "prodID=" + encodeURI(prodID) + "&";
            if(prodName) query += "prodName=" + encodeURI(prodName) + "&";
            if(price) query += "price=" + encodeURI(price) + "&";
            if(prodWeight) query += "prodWeight=" + encodeURI(prodWeight) + "&";
            if(inStock) query += "inStock=" + encodeURI(inStock) + "&";

            $.request("GET","/products" + query).done(renderProducts);

            function renderProducts(products){
                var list = $("<product-list></product-list>");

                $.each(products,function(i,product){
                    var el = $("<product-item></product-item>");
                    el.attr({
                         "product-id": product.prodID
                        ,"name": product.prodName
                        ,"price": product.price
                        ,"weight": product.prodWeight
                        ,"in-stock": product.inStock
                    });

                    list.append(el);
                });

                $("#searchProductsResultsPage").find("product-list").replaceWith(list);
                $compile(list)($scope);
            }
		},
		searchOrdersResults: function(){
            var orderID   = $("#searchOrdersPage .orderID").val();
            var custID = $("#searchOrdersPage .custID").val();
            var poNumber = $("#searchOrdersPage .poNumber").val();
            var orderDate = $("#searchOrdersPage .orderDate").val();

            var query = "?";
            if(orderID) query += "orderID=" + encodeURI(orderID) + "&";
            if(custID) query += "custID=" + encodeURI(custID) + "&";
            if(poNumber) query += "poNumber=" + encodeURI(poNumber) + "&";
            if(orderDate) query += "orderDate=" + encodeURI(orderDate) + "&";

            $.request("GET","/orders" + query).done(renderOrders);

            function renderOrders(orders){
                var list = $("<order-list></order-list>");

                $.each(orders,function(i,order){
                    var el = $("<order-item></order-item>");
                    el.attr({
                         "order-id": order.orderID
                        ,"customer-id": order.custID
                        ,"po-number": order.poNumber
                        ,"order-date": moment(order.orderDate).format("MM-DD-YY")
                    });

                    list.append(el);
                });

                $("#searchOrdersResultsPage").find("order-list").replaceWith(list);
                $compile(list)($scope);
            }
        },
        searchCartResults: function(){
            var orderID   = $("#searchCartPage .orderID").val();
            var prodID    = $("#searchCartPage .prodID").val();
            var quantity = $("#searchCartPage .quanity").val();
            var custID = $("#searchCartPage .custID").val();
            var prodName = $("#searchCartPage .prodName").val();

            var query = "?";
            if(orderID) query += "orderID=" + encodeURI(orderID) + "&";
            if(prodID) query += "prodID=" + encodeURI(prodID) + "&";
            if(quantity) query += "quantity=" + encodeURI(quantity) + "&";
            if(custID) query += "custID=" + encodeURI(custID) + "&";
            if(prodName) query += "prodName=" + encodeURI(prodName) + "&";

            $.request("GET","/carts" + query).done(renderCarts);

            function renderCarts(carts){
                var list = $("<cart-list></cart-list>");

                $.each(carts,function(i,cart){
                    var el = $("<cart-item></cart-item>");
                    el.attr({
                         "order-id": cart.orderID
                        ,"product-id": cart.prodID
                        ,"quanity": cart.quantity
                    });

                    list.append(el);
                });

                $("#searchCartResultsPage").find("cart-list").replaceWith(list);
                $compile(list)($scope);
            }
        }
	};

    var currPurchaseOrderID = 0;
    var currPage = "";
    function addError(message){
        
        $(".error").append($("<div>" + message + "</div>"));
    
        console.log(currPage);
        console.log($("#" + currPage + "Page .error"));
        $("#" + currPage + "Page .error").each(function(){
            if(!$(this).is(":visible")){
                $(this).slideToggle();
            }
        });
    }
    
    
	// [ Navigation ]
	(function navigation(){
		currPage = $(".page").eq(0).attr("id").replace("Page","");
		var currPageLabel = currPage;
		window.pageStack = [currPage];
		window.pageLabelStack = [currPageLabel];
		var fromPage = "";
		window.toPage = "";
		var pageKey = 0;
		var navEl = $("");

		updateTabIndex();

		// [ On Click ]
		$("body").on("click","nav-item",function(){
			fromPage = $(this).closest(".page").attr("id").replace("Page","");
			toPage = $(this).attr("page");
			toLabel = $(this).attr("label");
			$(".navItem").removeClass("selected");
			navigate(fromPage,toPage,toLabel);
		});

		$(document).keydown(function(e){
			if(dontJump){
				dontJump = false;
				return;
			}

			var page = $("#" + currPage + "Page");

			if (e.keyCode == 9 && e.shiftKey == false) {
				if($(document.activeElement).prop("tagName").toLowerCase() != "input"){
					e.preventDefault();
					page.find("input").first().focus();
				}
			}
		})

		var dontJump = false;

		// [ Don't Tab to Url Bar ]
		$('input:visible').on('keydown', function (e) {
			var page = $("#" + currPage + "Page");

			if($(this).index() == page.find("input").last().index()){
			    if (e.keyCode == 9 && e.shiftKey == false) {
			        e.preventDefault();
			        $(this).blur();
			        dontJump = true;
			       // $('.page input:visible').first().focus();
			    }				
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
            if(toPage=="none") return;
            
            $(".error").empty().hide();
            
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

			// [ Make sure user can't tab to offscreen elements ]
			updateTabIndex();
		}

		function updateTabIndex(){
			var page = $("#" + currPage + "Page");
			$("input").attr("tabindex",-1);
			page.find("input").removeAttr("tabindex");
		}

        $("body").on("click", ".createPO", function(){
            currPurchaseOrderID = $(this).data("id");
            navigate(currPage,"purchaseOrder");
        });
	})();
    
    // [ Inserting ]
    $("#insertCustomerPage .insert").click(function(){
        var firstName   = $("#insertCustomerPage .firstName").val();
        var lastName    = $("#insertCustomerPage .lastName").val();
        var phoneNumber = $("#insertCustomerPage .phoneNumber").val();
        
        var data = {
             firstName:firstName
            ,lastName:lastName
            ,phoneNumber:phoneNumber
        }
        
        $.restService.insertCustomer(data, function(res){
                                            showMessage(res);
                                        },
                                        function(res){
                                            showMessage(res);
                                        })
    })

    $("#insertProductPage .insert").click(function(){
        $(".error").empty();
        
        var hasErrors = false;
        var prodName = $("#insertProductPage .productName").val();
        var price = $("#insertProductPage .price").val();
        var prodWeight = $("#insertProductPage .weight").val();
        var inStock = $("#insertProductPage .inStock").is(':checked') ? 1 : 0;

        /*if(prodName == ""){
            hasErrors = true;
            addError("Product name is required");           
        }else{
             if(prodName.length > 100){
                hasErrors = true;
                addError("Product name must be less than 100 charachters");
            }           
        }

        if(price == ""){
            hasErrors = true;
            addError("Price is required");           
        }else{
            if(isNaN(price)){
                hasErrors = true;
                addError("Price must be a valid number");
            }else{
                if(price < 0){
                    hasErrors = true;
                    addError("Price must be positive");
                }   
            }           
        }
        
        if(prodWeight == ""){
            hasErrors = true;
            addError("Weight is required");           
        }else{
            if(isNaN(prodWeight)){
                hasErrors = true;
                addError("Weight must be a valid number");
            }else{
                if(prodWeight <= 0){
                    hasErrors = true;
                    addError("Weight must be positive");
                }   
            }          
        }
        
        if(hasErrors) return;*/
        
        var data = {
             prodName:prodName
            ,price:price
            ,prodWeight:prodWeight
            ,inStock:inStock
        }

        $.restService.insertProduct(data, function(res){
                                    showMessage(res);
                                },
                                function(res){
                                    showMessage(res);
                                })
    })

    $("#insertOrderPage .insert").click(function(){
        var custID = $("#insertOrderPage .custID").val();
        var poNumber = $("#insertOrderPage .poNumber").val();
        var orderDate = $("#insertOrderPage .orderDate").val();

        var data = {
             custID:custID
            ,poNumber:poNumber
            ,orderDate:orderDate
        }

        $.restService.insertOrder(data, function(res){
                                    showMessage(res);
                                },
                                function(res){
                                    showMessage(res);
                                })
    })

    $("#insertCartPage .insert").click(function(){
        var orderID   = $("#insertCartPage .orderID").val();
        var prodID    = $("#insertCartPage .prodID").val();
        var quantity = $("#insertCartPage .quanity").val();

        var data = {
             orderID:orderID
            ,prodID:prodID
            ,quantity:quantity
        }

        $.restService.insertCart(data, function(res){
                                    showMessage(res);
                                },
                                function(res){
                                    showMessage(res);
                                })
    })

    // [Update]
    $("#updateCustomerPage .update").click(function(){
        var custID = $("#updateCustomerPage .custID").val();
        var firstName = $("#updateCustomerPage .firstName").val();
        var lastName = $("#updateCustomerPage .lastName").val();
        var phoneNumber = $("#updateCustomerPage .phoneNumber").val();

        var data = {
             firstName:firstName
            ,lastName:lastName
            ,phoneNumber:phoneNumber
        }

        $.restService.updateCustomer(custID, data, function(res){
                                    showMessage(res);
                                },
                                function(res){
                                    showMessage(res);
                                })
    })

    $("#updateProductPage .update").click(function(){
        $(".error").empty();
        hasErrors = false;
        var prodID   = $("#updateProductPage .prodID").val();
        var prodName = $("#updateProductPage .productName").val();
        var price = $("#updateProductPage .price").val();
        var prodWeight = $("#updateProductPage .weight").val();
        var inStock = $("#updateProductPage .inStock").is(':checked')  ? 1 : 0;

        /*if(prodName != ""){
            if(prodName.length > 100){
                hasErrors = true;
                addError("Product name must be less than 100 charachters");
            }
        }
        
        if(price != ""){
            if(isNaN(price)){
                hasErrors = true;
                addError("Price must be a valid number");
            }else{
                if(price < 0){
                    hasErrors = true;
                    addError("Price must be positive");
                }   
            }            
        }

        if(prodWeight != ""){
            if(isNaN(prodWeight)){
                hasErrors = true;
                addError("Weight must be a valid number");
            }else{
                if(prodWeight <= 0){
                    hasErrors = true;
                    addError("Weight must be positive");
                }   
            }            
        }

        
        if(hasErrors) return;*/
        
        var data = {
             prodName:prodName
            ,price:price
            ,prodWeight:prodWeight
            ,inStock:inStock
        }

        $.restService.updateProduct(prodID, data, function(res){
                                    showMessage(res);
                                },
                                function(res){
                                    showMessage(res);
                                })
    })

    $("#updateOrderPage .update").click(function(){
        var orderID   = $("#updateOrderPage .orderID").val();
        var custID = $("#updateOrderPage .custID").val();
        var poNumber = $("#updateOrderPage .poNumber").val();
        var orderDate = $("#updateOrderPage .orderDate").val();

        var data = {
             custID:custID
            ,poNumber:poNumber
            ,orderDate:orderDate
        }

        $.restService.updateOrder(orderID, data, function(res){
                                    showMessage(res);
                                },
                                function(res){
                                    showMessage(res);
                                })
    })

    $("#updateCartPage .update").click(function(){
        var orderID   = $("#updateCartPage .orderID").val();
        var prodID    = $("#updateCartPage .prodID").val();
        var quantity = $("#updateCartPage .quanity").val();

        var data = {
             quantity:quantity
        }

        var id = orderID + "-" + prodID;

        $.restService.updateCart(id, data, function(res){
                                    showMessage(res);
                                },
                                function(res){
                                    showMessage(res);
                                })
    })

});

$("#deleteCustomerPage .delete").click(function(){
    var id = $("#deleteCustomerPage .custID").val();

    $.request("DELETE","/customers/" + id).done(function(data){

    }).fail(function(data){

    })        
});    

$("#deleteProductPage .delete").click(function(){
    var id = $("#deleteProductPage .prodID").val();

    $.request("DELETE","/products/" + id).done(function(){

    }).fail(function(){

    })        
}); 

$("#deleteOrderPage .delete").click(function(){
    var id = $("#deleteOrderPage .orderID").val();

    $.request("DELETE","/orders/" + id).done(function(){

    }).fail(function(){

    })       
});

$("#deleteCartPage .delete").click(function(){
    var orderId = $("#deleteCartPage .orderID").val();
    var prodId = $("#deleteCartPage .prodID").val();

    var id = orderId + "-" + prodId;

    $.request("DELETE","/carts/" + id).done(function(){

    }).fail(function(){

    })       
});

// [ Add error containers ]
$(".page").each(function(){
    $(this).prepend('<div class="error"></div>');
});

function showMessage(data){
    var red = "#D15854";
    var green = "#53CE7D";

    var success = (typeof data !== 'undefined' ? (typeof data['success'] !== 'undefined' ? data['success'] : false): false);

    $("#messageBox").css("background-color", success ? green : red)

    var errorText = "";
    var error = (typeof data !== 'undefined' ? (typeof data['error'] !== 'undefined' ? data['error'] : -1): -1);
    if (error == -1){
        errorText = "Unhandled exception happened";
    }else if (error == 2){
        errorText = "Empty field";
    }else if (error == 42){
        errorText = "Wrong phone number";
    }else if (error == 43){
        errorText = "Wrong first name";
    }else if (error == 44){
        errorText = "Wrong last name";
    }else if (error == 32){
        errorText = "Wrong price";
    }else if (error == 33){
        errorText = "Wrong weight";
    }else if (error == 34){
        errorText = "Wrong 'in stock' value";
    }else if (error == 22){
        errorText = "Wrong order date";
    }else if (error == 12){
        errorText = "Wrong quantity";
    }else if (error == 1366){
        errorText = "Wrong data";
    }else if (error == 1452){
        errorText = "Wrong key id";
    }else{
        errorText = "Unknown error occurred. See code " + error + " for reference.";
    }

    $("#messageBox").html(success ? "Successful" : errorText);
    $("#messageBox").animate({marginTop: "0px", opacity: "1"}, 600, "easeOutCubic", function(){
        $("#messageBox").delay(2000).animate({marginTop: "-100px", opacity: "0"}, 600, "easeInCubic", function(){
            $("#messageBox").html("");
        })
    });
}

// [ Async load all the components ]
// - Declutters the head tag in index.html
// - App loads faster
(function(){
	var comps = [
		 "nav-item"
		,"customer-item"
		,"customer-list"
		,"product-item"
		,"product-list"
		,"order-item"
		,"order-list"
		,"cart-item"
		,"cart-list"
	];

	$.each(comps,function(i,name){
		$("body").append("<link rel='stylesheet' type='text/css' href='comps/" + name + "/styles.css'></link>");
	});

	$.each(comps,function(i,name){
		$("body").append("<script src='comps/" + name + "/script.js'></script>");
	});
})();

