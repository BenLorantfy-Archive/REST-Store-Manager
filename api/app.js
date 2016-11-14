
// [ Routing Library ]
var express = require('express');
var cors    = require('cors'); 
var fs      = require('fs');
var knex    = require("knex");

// [ Config file with db credentials ]
var config  = require("./config.json");

// [ Start server ]
console.log("Starting REST server...");

// [ The Knex query builder instance ]
var db = knex(config);

// [ Create the express app ]
var app = express();

// [ Middleware to get the reqeust body ]
app.use (function(req, res, next) {
    var data='';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { 
       data += chunk;
    });

    req.on('end', function() {
        req.body = data;
        try{
            req.body = JSON.parse(data);
        }catch(e){
            // do nothing
        }
        next();
    });
});

// [ Allows cross origin requests ]
// https://www.html5rocks.com/en/tutorials/cors/
app.use(cors());

// [ Customer CRUD functions ****************************************************** ]
// [ Customer Search ]
app.get("/customers",function(req,res){
    var query = db
        .select("custID","firstName","lastName","phoneNumber")
        .from("Customer");

    if(req.query.custID){
        query.where("custID", req.query.custID);
    }

    //if custID is present, than these
    if(!req.query.custID) {
        if (req.query.firstName) {
            query.andWhere("firstName", "like", "%" + req.query.firstName + "%");
        }

        if (req.query.lastName) {
            query.andWhere("lastName", "like", "%" + req.query.lastName + "%");
        }

        if (req.query.phoneNumber) {
            query.andWhere("phoneNumber", req.query.phoneNumber);
        }
    }

    // console.log(query);
    query.then(function (customers) {
            res.end(JSON.stringify(customers));
        })
        .catch(function(err) {
            res.end(JSON.stringify({
                success: false,
                error: err.errno
            }));
        });
})

// [ Customer Insert ]
app.post("/customers",function(req,res){
    var query = db
        .insert({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber:req.body.phoneNumber
        })
        .into('Customer');

    query.then(function(){
        res.end(JSON.stringify({ success:true }));
    })
        .catch(function(err) {
            res.end(JSON.stringify({
                success: false,
                error: err.errno
            }));
        });
})

// [ Customer Update ]
app.put("/customers/:custID", function(req,res) {
    var query = db
        .update({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber:req.body.phoneNumber
        })
        .where("custID", req.params.custID )
        ('Customer');

    query.then(function () {
        res.end(JSON.stringify({success: true}));
    })
        .catch(function(err) {
            res.end(JSON.stringify({
                success: false,
                error: err.errno
            }));
        });

})

// [ Customer Delete ]
app.delete("/customers/:custID", function(req,res) {
    var query = db('Customer')
        .where("custID", req.params.custID)
        .del();

    query.then(function () {
        res.end(JSON.stringify({success: true}));
    })
        .catch(function(err) {
            res.end(JSON.stringify({
                success: false,
                error: err.errno
            }));
        });

})

// [ Product CRUD Functions****************************************************** ]
// [ Product Search ]
app.get("/products", function (req, res) {
    var query = db
        .select("prodID", "prodName", "price", "prodWeight", "inStock")
        .from("Product");

    if (req.query.prodID) {
        query.where("prodID", req.query.prodID);
    }

    if (!req.query.prodID) {

        if (req.query.prodName) {
            query.andWhere("prodName", "like", "%" + req.query.prodName + "%");
        }

        if (req.query.price) {
            query.andWhere("price", req.query.price);
        }

        if (req.query.prodWeight) {
            query.andWhere("prodWeight", req.query.prodWeight);
        }

        if (req.query.inStock) {
            query.andWhere("inStock", req.query.inStock);
        }
    }

    // console.log(query);

    query.then(function (products) {
        res.end(JSON.stringify(products));
    })
        .catch(function(err) {
            res.end(JSON.stringify({
                success: false,
                error: err.errno
            }));
        });
})

// [ Product Insert ]
app.post("/products", function (req, res) {
    var query = db
        .insert({
            prodName: req.body.prodName,
            price: req.body.price,
            prodWeight: req.body.prodWeight,
            inStock: req.body.inStock
        })
        .into('Product');

    query.then(function () {
        res.end(JSON.stringify({success: true}));
    })
        .catch(function(err) {
            res.end(JSON.stringify({
                success: false,
                error: err.errno
            }));
        });
})

// [ Product Update ]
app.put("/products/:prodID", function(req,res) {
    var query = db
        .update({
            prodName: req.body.prodName,
            price: req.body.price,
            prodWeight:req.body.prodWeight,
            inStock:req.body.inStock
        })
        .where("prodID",req.params.prodID)
        .into('Product');

    query.then(function () {
        res.end(JSON.stringify({success: true}));
    })
        .catch(function(err) {
            res.end(JSON.stringify({
                success: false,
                error: err.errno
            }));
        });

})

// [ Product Delete ]
app.delete("/products/:prodID", function(req,res) {
    var query = db('Product')
        .where("prodID", req.params.prodID)
        .del();

    query.then(function () {
        res.end(JSON.stringify({success: true}));
    })
        .catch(function(err) {
            res.end(JSON.stringify({
                success: false,
                error: err.errno
            }));
        });

})

// [ Order CRUD Functions*************************************************************** ]
// [ Order Search ]
app.get("/orders", function (req, res) {
    var query = db
        //.select('orderID", "custID", "poNumber", "orderDate")
        .select('*')
        .from("Order1");

    if (req.query.orderID) {
        query.where("orderID", req.query.orderID);
    }

    //if the user specified an orderID, none of these field would matter
    if(!req.query.orderID) {

        if (req.query.poNumber) {
            query.andWhere("poNumber", req.query.poNumber);
        }

        if (req.query.orderDate) {
            query.andWhere("orderDate", req.query.orderDate);
        }
    }

    if(req.query.prodID){
        query.innerJoin('Cart', 'Order1.orderID', 'Cart.orderID')
            .innerJoin('Product', 'Cart.prodID', 'Product.prodID')
        query.andWhere("Cart.prodID",req.query.prodID)
    }

    if(!req.query.prodID) {

        if (req.query.quantity) {
            query.innerJoin('Cart', 'Order1.orderID', 'Cart.orderID')
                .innerJoin('Product', 'Cart.prodID', 'Product.prodID')
            query.andWhere("Cart.quantity", req.query.quantity)
        }

        if (req.query.prodName) {
            query.innerJoin('Cart', 'Order1.orderID', 'Cart.orderID')
                .innerJoin('Product', 'Cart.prodID', 'Product.prodID')
            query.andWhere("Product.prodName", req.query.prodName)
        }

        if (req.query.price) {
            query.innerJoin('Cart', 'Order1.orderID', 'Cart.orderID')
                .innerJoin('Product', 'Cart.prodID', 'Product.prodID')
            query.andWhere("Product.price", req.query.price)
        }

        if (req.query.prodWeight) {
            query.innerJoin('Cart', 'Order1.orderID', 'Cart.orderID')
                .innerJoin('Product', 'Cart.prodID', 'Product.prodID')
            query.andWhere("Product.prodWeight", req.query.prodWeight)
        }

        if (req.query.inStock) {
            query.innerJoin('Cart', 'Order1.orderID', 'Cart.orderID')
                .innerJoin('Product', 'Cart.prodID', 'Product.prodID')
            query.andWhere("Product.inStock", req.query.inStock)
        }
    }

    if (req.query.custID) {
        query.innerJoin('Customer', 'Order1.custID', 'Customer.custID')
        query.andWhere("Order1.custID", req.query.custID);
    }

    if(!req.query.custID) {
        if (req.query.firstName) {
            query.innerJoin('Customer', 'Order1.custID', 'Customer.custID')
            query.andWhere("Customer.firstName", req.query.firstName);
        }

        if (req.query.lastName) {
            query.innerJoin('Customer', 'Order1.custID', 'Customer.custID')
            query.andWhere("Customer.lastName", req.query.lastName);
        }

        if (req.query.phoneNumber) {
            query.innerJoin('Customer', 'Order1.custID', 'Customer.custID')
            query.andWhere("Customer.phoneNumber", req.query.phoneNumer);
        }
    }


    // console.log(query);

    query.then(function (orders) {
        res.end(JSON.stringify(orders));
    })
        .catch(function(err) {
            res.end(JSON.stringify({
                success: false,
                error: err.errno
            }));
        });
})

// [ Order Insert ]
app.post("/orders", function (req, res) {
    var query = db
        .insert({
            custID: req.body.custID,
            poNumber: req.body.poNumber,
            orderDate: req.body.orderDate
        })
        .into('Order1');

    query.then(function () {
        res.end(JSON.stringify({success: true}));
    })
        .catch(function(err) {
            res.end(JSON.stringify({
                success: false,
                error: err.errno
            }));
        });
})

// [ Order Update ]
app.put("/orders/:orderID", function(req,res) {
    var query = db
        .update({
            custID: req.body.custID,
            poNumber: req.body.poNumber,
            orderDate:req.body.orderDate
        })
        .where("orderID",req.params.orderID)
        .into('Order1');

    query.then(function () {
        res.end(JSON.stringify({success: true}));
    })
        .catch(function(err) {
            res.end(JSON.stringify({
                success: false,
                error: err.errno
            }));
        });

})

// [ Order Delete ]
app.delete("/orders/:orderID", function(req,res) {
    var query = db('Order1')
        .where("orderID",req.params.orderID)
        .del();

    query.then(function () {
        res.end(JSON.stringify({success: true}));
    })
        .catch(function(err) {
            res.end(JSON.stringify({
                success: false,
                error: err.errno
            }));
        });

})

// [ Cart CRUD Functions*************************************************************** ]
// [ Cart Search ]
app.get("/carts", function (req, res) {
    var query = db
        .select("orderID", "prodID", "quantity")
        .from("Order1");

    if (req.query.orderID) {
        query.andWhere("orderID",req.query.orderID);
    }

    if (req.query.prodID) {
        query.andWhere("prodID",req.query.prodID);
    }

    if(!req.query.prodID && !req.query.orderID) {
        if (req.query.quantity) {
            query.andWhere("quantity", req.query.quantity);
        }
    }

    // console.log(query);

    query.then(function (carts) {
        res.end(JSON.stringify(carts));
    })
        .catch(function(err) {
            res.end(JSON.stringify({
                success: false,
                error: err.errno
            }));
        });
})

// [ Cart Insert ]
app.post("/carts", function (req, res) {
    var query = db
        .insert({
            orderID: req.body.orderID,
            prodID: req.body.prodID,
            quantity: req.body.quantity
        })
        .into('Cart');

        query.then(function () {
            res.end(JSON.stringify({success: true}));
        })
        .catch(function(err) {
            res.end(JSON.stringify({
                success: false,
                error: err.errno
            }));
        });

})

// [ Cart Update ]
app.put("/carts/:cartID", function(req,res) {
    var query = db
        .update({
            quantity:req.body.quantity
        })
        .where({
            "orderID": req.params.cartID.split('-')[0],
            "prodID": req.params.cartID.split('-')[1]
        })
        .into('Cart');

    query.then(function () {
        res.end(JSON.stringify({success: true}));
    })
        .catch(function(err) {
            res.end(JSON.stringify({
                success: false,
                error: err.errno
            }));
        });

})

// [ Cart Delete ]
app.delete("/carts/:cartID", function(req,res) {
    var query = db('Cart')
        .where({
            "orderID": req.params.cartID.split('-')[0],
            "prodID": req.params.cartID.split('-')[1]
        })
        .del();

    query.then(function () {
        res.end(JSON.stringify({success: true}));
    })
        .catch(function(err) {
            res.end(JSON.stringify({
                success: false,
                error: err.errno
            }));
        });

})


// [ Listen for requests ]
app.listen(80, function () {
    console.log('Web server listening on port 80...');
});

//process.on('SIGTERM', function () {
//  app.close(function () {
//    process.exit(0);
//  });
//});
