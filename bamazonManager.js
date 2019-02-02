const inquirer = require('inquirer');

const connection = require('./util/database');

connection.connect(err => {
    if (err) throw err;
    listMenuOptions();
});


const listMenuOptions = () => {
    console.log('\nManager Options:\n')
    const options = [{
        name: 'choice',
        type: 'list',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add to Inventory', 'Add New Product', 'Exit'],
        message: 'What would you like to do?'
    }]

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
                    break;

                case 'Add New Product':
                    break;

                case 'Exit':
                    connection.end();
                    break;
            }
        });
}


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

        console.log('\nALL PRODUCTS FOR SALE\n');

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
            console.log('\nProducts with Low Inventory:\n')
            res.forEach(product => {
                console.log(`ID: ${product.item_id} || Product: ${product.product_name} || Department: ${product.department_name} || Price: $${product.price} || Stock Qty: ${product.stock_quantity}`);
            });
        }
        displayContinue();
    });
};