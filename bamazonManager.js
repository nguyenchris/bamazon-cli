const inquirer = require('inquirer');

const connection = require('./util/database');

connection.connect(err => {
    if (err) throw err;
    listMenuOptions();
});


const listMenuOptions = () => {
    console.log('\n=============\nManager Menu:\n=============\n')
    const options = [{
        name: 'choice',
        type: 'list',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add to Inventory', 'Add New Product', 'Exit'],
        message: 'What would you like to do?'
    }];

    inquirer
        .prompt(options)
        .then(answer => {
            switch (answer.choice) {
                case 'View Products for Sale':
                    displayProducts();
                    break;

                case 'View Low Inventory':
                    displayLowInventory();
                    break;

                case 'Add to Inventory':
                    addToInventory();
                    break;

                case 'Add New Product':
                    addNewProduct();
                    break;

                case 'Exit':
                    console.log('\nThanks for managing!')
                    connection.end();
                    break;
            }
        });
};


const displayContinue = () => {
    inquirer
        .prompt([{
            name: 'action',
            type: 'list',
            choices: ['Yes', 'No'],
            message: 'Would you like to keep managing the products?'
        }])
        .then(answer => {
            if (answer.action === 'Yes') {
                listMenuOptions();
            } else if (answer.action === 'No') {
                connection.end();
            }
        });
};

const displayProducts = () => {
    const q = 'SELECT * FROM products'
    connection.query(q, (err, res) => {
        if (err) throw err;
        console.log('\n=====================\nALL PRODUCTS FOR SALE\n=====================\n');

        res.forEach(product => {
            console.log(`ID: ${product.item_id} || Product: ${product.product_name} || Department: ${product.department_name} || Price: $${product.price} || Stock Qty: ${product.stock_quantity}`);
        });
        displayContinue();
    });
};


const displayLowInventory = () => {
    const q = 'SELECT * FROM products WHERE stock_quantity < 5'
    connection.query(q, (err, res) => {
        if (err) throw err;

        if (res.length === 0) {
            console.log('\nThere are no products with low inventory.\n')
        } else {
            console.log('\n============================\nProducts with Low Inventory:\n============================\n');
            res.forEach(product => {
                console.log(`ID: ${product.item_id} || Product: ${product.product_name} || Department: ${product.department_name} || Price: $${product.price} || Stock Qty: ${product.stock_quantity}`);
            });
        }
        displayContinue();
    });
};


const addToInventory = () => {
    const q = 'SELECT item_id, product_name, stock_quantity FROM products';
    connection.query(q, (err, res) => {
        if (err) throw err;
        console.log('\n=====================\nAll Product Inventory\n=====================\n');
        res.forEach(product => {
            console.log(`ID: ${product.item_id} || ${product.product_name} || Stock Qty: ${product.stock_quantity}`);
        });

        inquirer
            .prompt([{
                    name: 'id',
                    type: 'input',
                    message: 'Which product ID would you like to add additional inventory for?',
                    validate: function (val) {
                        if (isNaN(val) === false && parseInt(val) > 0) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: 'qty',
                    type: 'input',
                    message: 'How much more quantity would like you to add?',
                    validate: function (val) {
                        if (isNaN(val) === false && parseInt(val) > 0) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(answer => {
                const query = 'UPDATE products SET ? WHERE ?';
                const chosenItem = res.find(item => {
                    return item.item_id === parseInt(answer.id);
                });
                const totalQty = parseInt(answer.qty) + chosenItem.stock_quantity;

                if (!chosenItem) {
                    console.log(`\nProduct ID ${answer.id} does not exist!\n`);
                    return displayContinue();
                }

                connection.query(query, [{
                    stock_quantity: totalQty
                }, {
                    item_id: chosenItem.item_id
                }], (err, res) => {
                    if (err) throw err;
                    console.log(`\nAdded ${answer.qty} additional items to ${chosenItem.product_name}!`);
                    console.log(`Previous Stock Quantity: ${chosenItem.stock_quantity}\nNew Stock Quantity: ${totalQty}\n`);
                    displayContinue();
                });
            });
    });
};


const addNewProduct = () => {
    inquirer
        .prompt([{
                name: 'product_name',
                type: 'input',
                message: 'What is the product name?'
            },
            {
                name: 'department_name',
                type: 'input',
                message: 'What department would the product be in?'
            },
            {
                name: 'price',
                type: 'input',
                message: 'What is the price for the product?',
                validate: function (val) {
                    if (isNaN(val) === false && parseInt(val) > 0) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: 'stock_quantity',
                type: 'input',
                message: 'How much quantity will the product be in stock?',
                validate: function (val) {
                    if (isNaN(val) === false && parseInt(val) > 0) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(answer => {
            const query = 'INSERT INTO products SET ?';
            connection.query(query, [answer], (err, res) => {
                if (err) throw err;
                console.log('\nProduct Added!\n')
                displayContinue();
            });
        });
};