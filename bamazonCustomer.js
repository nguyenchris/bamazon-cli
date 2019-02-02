const inquirer = require('inquirer');

const connection = require('./util/database');

connection.connect(err => {
    if (err) throw err;
    startPurchase()
});


// Ask if user would like to make a purchase
const startPurchase = () => {
    const question = [{
        name: 'start',
        type: 'list',
        choices: ['Yes', 'No'],
        message: 'Would you like to purchase a product?'
    }];
    inquirer
        .prompt(question)
        .then(answer => {
            if (answer.start === 'Yes') {
                displayProducts();
            } else if (answer.start === 'No') {
                console.log('\nSorry to see you go!')
                connection.end();
            }
        });
};


// Display all products to command line
const displayProducts = () => {
    const q = 'SELECT * FROM products'
    connection.query(q, (err, res) => {
        if (err) throw err;

        console.log('\nALL PRODUCTS\n');

        res.forEach(product => {
            console.log(`ID: ${product.item_id} || Product: ${product.product_name} || Department: ${product.department_name} || Price: $${product.price} || Stock Qty: ${product.stock_quantity}`);
        });
        askForPurchase()
    });
};


// Asks user to input product item ID as well as quantity amaount
// Returns the total price. If not enough stock quantity, returns 'insufficient quantity'.
const askForPurchase = () => {
    const questions = [{
        name: 'productId',
        type: 'input',
        message: 'Which product ID would you like to purchase?',
        validate: function (val) {
            if (isNaN(val) === false && parseInt(val) > 0) {
                return true;
            }
            return false;
        }
    }, {
        name: 'qty',
        type: 'input',
        message: 'How many would you like to purchase??',
        validate: function (val) {
            if (isNaN(val) === false && parseInt(val) > 0) {
                return true;
            }
            return false;
        }
    }];

    inquirer
        .prompt(questions)
        .then(answer => {
            queryForProduct(answer);
        });
};

// Make a query for the product the user chooses to purchase
// Update database product quantity depending on product chosen
const queryForProduct = (product) => {
    const qtyInt = parseInt(product.qty)
    const q = 'SELECT product_name, department_name, price, stock_quantity FROM products WHERE ?';
    connection.query(q, {
        item_id: product.productId
    }, (err, res) => {
        if (res.length === 0) {
            console.log(`\nThere is not a product for ID: ${product.productId}\n`);
        } else if (res[0].stock_quantity >= qtyInt) {
            const finalStock = res[0].stock_quantity - qtyInt;
            const totalPrice = parseFloat(Math.round(res[0].price * qtyInt * 100) / 100).toFixed(2);
            const query = 'UPDATE products SET ? WHERE ?';
            const queryOptions = [{
                    stock_quantity: res[0].stock_quantity - qtyInt
                },
                {
                    item_id: product.productId
                }
            ];
            console.log(`\nYou purchased:\nProduct: ${res[0].product_name}\nDepartment: ${res[0].department_name}\nQuantity: ${qtyInt}\nTotal Price: $${totalPrice}`);
            console.log(`\nRemaining Stock Quantity: ${finalStock}\n`);
            connection.query(query, queryOptions, (err, res) => {
                if (err) throw err;
            });

        } else {
            console.log(`\nThere's an insuffienct amount of quantity for ${res[0].product_name}!\n`);
        }
        startPurchase();
    });
};