
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

// [ Customer Search ]
app.get("/customers",function(req,res){
    var query = db
        .select("custID","firstName","lastName","phoneNumber")
        .from("Customer");

    if(req.query.custID){
        query.orWhere("custID","like","%" + req.query.custID + "%");
    }

    if(req.query.firstName){
        query.orWhere("firstName","like","%" + req.query.firstName + "%");
    }

    if(req.query.lastName){
        query.orWhere("lastName","like","%" + req.query.lastName + "%");
    }

    if(req.query.phoneNumber){
        query.orWhere("phoneNumber","like","%" + req.query.phoneNumber + "%");
    }

    // console.log(query);

    query.then(function(customers){
        res.end(JSON.stringify(customers));
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
        res.end(JSON.stringify({ sucess:true }));
    });
})

// [ Product Search ]
    app.get("/products", function (req, res) {
        var query = db
            .select("prodID", "prodName", "price", "prodWeight", "inStock")
            .from("Product");

        if (req.query.prodID) {
            query.orWhere("prodID", "like", "%" + req.query.prodID + "%");
        }

        if (req.query.prodName) {
            query.orWhere("prodName", "like", "%" + req.query.prodName + "%");
        }

        if (req.query.price) {
            query.orWhere("price", "like", "%" + req.query.price + "%");
        }

        if (req.query.prodWeight) {
            query.orWhere("prodWeight", "like", "%" + req.query.prodWeight + "%");
        }

        if (req.query.inStock) {
            query.orWhere("inStock", "like", "%" + req.query.inStock + "%");
        }

        // console.log(query);

        query.then(function (products) {
            res.end(JSON.stringify(products));
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
            res.end(JSON.stringify({sucess: true}));
        });
    })

// [ Order Search ]
    app.get("/orders", function (req, res) {
        var query = db
            .select("orderID", "custID", "poNumber", "orderDate")
            .from("Order");

        if (req.query.orderID) {
            query.orWhere("orderID", "like", "%" + req.query.orderID + "%");
        }

        if (req.query.custID) {
            query.orWhere("custID", "like", "%" + req.query.custID + "%");
        }

        if (req.query.poNumber) {
            query.orWhere("poNumber", "like", "%" + req.query.poNumber + "%");
        }

        if (req.query.orderDate) {
            query.orWhere("orderDate", "like", "%" + req.query.orderDate + "%");
        }

        // console.log(query);

        query.then(function (orders) {
            res.end(JSON.stringify(orders));
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
            .into('Order');

        query.then(function () {
            res.end(JSON.stringify({sucess: true}));
        });
    })

// [ Cart Search ]
    app.get("/carts", function (req, res) {
        var query = db
            .select("orderID", "prodID", "quantity")
            .from("Order");

        if (req.query.orderID) {
            query.orWhere("orderID", "like", "%" + req.query.orderID + "%");
        }

        if (req.query.prodID) {
            query.orWhere("prodID", "like", "%" + req.query.prodID + "%");
        }

        if (req.query.quantity) {
            query.orWhere("quantity", "like", "%" + req.query.quantity + "%");
        }

        // console.log(query);

        query.then(function (carts) {
            res.end(JSON.stringify(carts));
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
            res.end(JSON.stringify({sucess: true}));
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
