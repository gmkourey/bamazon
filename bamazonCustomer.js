var cTable = require('console.table');
var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "bootcamp",
    database: "bamazon_db"
  });

connection.connect(function(err) {
    if (err) throw err;
});

function startPurchase() {
    connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        console.log("\n");

        purchaseProduct();
    });
}

function purchaseProduct() {

inquirer.prompt([
    {
        type: "number",
        message: "What is the ID of the item you would like to buy?",
        name: "idToBuy"
    },
    {
        type: "number",
        message: "How many of that item would you like to buy?",
        name: "quantity"
    }
]).then(function(response) {
    checkInStock(response.idToBuy, response.quantity);
});
};

function checkInStock(id, quantity) {
        connection.query("SELECT * FROM products WHERE item_id =" + id, function(err, res) {
        if (err) throw err;
        if (res[0].stock_quantity >= quantity) {
            console.log("Your total cost is: $" + (quantity * res[0].price) + "\n");
            updateStock(res[0].stock_quantity, quantity, id);
            updateTotalSales(id, quantity);
            startPurchase();
        } else {
            console.log("There is not enough in stock for you to make your purchase!\n");
            startPurchase();
        }
    });

};

function updateStock(stockQuantity, purchaseQuantity, id) {
    connection.query("UPDATE products SET ? WHERE ?",
    [
        {
            stock_quantity: (stockQuantity - purchaseQuantity)
        },
        {
            item_id: id
        }
    ],
    );
}

function updateTotalSales(id, purchaseQuantity) {

    connection.query("SELECT * FROM products WHERE item_id=" + id, function(err, res) {
        if (err) throw err;
        var itemPrice = res[0].price;
        var currentSales = res[0].product_sales;
        var updatedProductSales = currentSales + (itemPrice * purchaseQuantity);
        connection.query("UPDATE products SET ? WHERE ?",
        [{
            product_sales: updatedProductSales
        },
    {
        item_id: id
    }]
    )
 });
}

startPurchase();