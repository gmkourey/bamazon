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

function startProcess() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "action",
            choices: ["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add New Product"]
        }
        ]).then(function(res) {

            switch(res.action) {

            case "View Products For Sale":
            viewProduct();
            break;

            case "View Low Inventory":
            viewLowInventory();
            break;

            case "Add To Inventory":
            addToInventory();
            break;

            case "Add New Product":
            addProduct();
            break;
            }
        });
};

function viewProduct() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        startProcess();
    });
};

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 25", function (err, res) {
        if (err) throw err;
        console.table(res);
        startProcess();
    })
};

function addToInventory () {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        inquirer.prompt([
            {
                type: "input",
                message: "Enter the ID of the item where you are trying to add inventory",
                name: "itemSelection"
            },
            {
                type: "number",
                message: "How many would you like to add?",
                name: "inventoryAdd"
            }
        ]).then(function(response) {
            connection.query("SELECT * FROM products WHERE item_id='" + response.itemSelection + "'", function(err, res) {
                if (err) throw err;
                var dataSelection = res;
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: (dataSelection[0].stock_quantity + response.inventoryAdd)
                        },
                        {
                            item_id: dataSelection[0].item_id
                        }
                    ])
                    startProcess();
                });
            });
        });
}

function addProduct() {

        var choicesArray = [];
        connection.query("SELECT * FROM departments", function(err, res) {
            if (err) throw err;
            for(var i = 0; i < res.length; i++) {
                choicesArray.push(res[i].department_name);
            }
        })

    inquirer.prompt([
        {
            type: "input",
            message: "What product would you like to add?",
            name: "productName"
        },
        {
            type: "list",
            message: "What department is the product included in?",
            name: "departmentName",
            choices: choicesArray
        },
        {
            type: "number",
            message: "What is the price of this product?",
            name: "price"
        },
        {
            type: "number",
            message: "What is the initial stock quantity of this product?",
            name: "stockQuantity"
        }
    ]).then(function(response) {
    connection.query('INSERT INTO products SET ?',
    {
        product_name: response.productName,
        department_name: response.departmentName,
        price: response.price,
        stock_quantity: response.stockQuantity
    })
    startProcess();
})

}
startProcess();