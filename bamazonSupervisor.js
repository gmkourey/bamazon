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
        message: "What do you need to do?",
        name: "action",
        choices: ["View Product Sales By Department", "Create New Department"]
    }
]).then(function(response) {
    console.log(response.action);

    switch(response.action) {
        case "View Product Sales By Department":
        viewProducts();
        break;

        case "Create New Department":
        addDepartment();
        break;
    }
});
}

function viewProducts() {

    var query="SELECT department_id, departments.department_name, over_head_costs, SUM(product_sales) AS total_product_sales FROM departments" +
    " LEFT JOIN products ON departments.department_name=products.department_name GROUP BY department_name ORDER BY department_id;"

    connection.query(query, function(err, res) {
        if (err) throw err;

        for(var i = 0; i < res.length; i++) {
            if(res[i].total_product_sales === null) {
                res[i].total_product_sales  = 0;
            }
        };

        for(var i = 0; i < res.length; i++) {
            var dProfit = parseInt(res[i].total_product_sales) - parseInt(res[i].over_head_costs);
            res[i].total_profit = dProfit;
        }

        console.table(res);

        startProcess();
    })
}

function addDepartment () {
    inquirer.prompt([
        {
            type: "input",
            message: "What department would you like to add?",
            name: "departmentName"
        },
        {
            type: "input",
            message: "What is the overhead cost for this department?",
            name: "overheadCost"
        }
    ]).then(function(response) {
        connection.query("INSERT INTO departments SET ?", 
    {
        department_name: response.departmentName,
        over_head_costs: response.overheadCost
    });
    startProcess();
    });
}

startProcess();