const Table = require('cli-table');
const inquirer = require('inquirer');

const connection = require('./util/database');

connection.connect(err => {
  if (err) throw err;
  listMenuOptions();
});

const listMenuOptions = () => {
  const options = [{
    name: 'choice',
    type: 'list',
    choices: ['View Product Sales by Department', 'Create New Department', 'Exit'],
    message: 'What would you like to do?'
  }];

  inquirer
    .prompt(options)
    .then(answer => {
      if (answer.choice === 'View Product Sales by Department') {
        viewProductSalesByDept();
      } else if (answer.choice === 'Create New Department') {
        createNewDept();
      } else {
        connection.end();
      }
    });
};

const viewProductSalesByDept = () => {
  const query = `
  SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales)
  FROM products LEFT JOIN departments ON(departments.department_name = products.department_name)
  GROUP BY departments.department_id;
  `;
  const table = new Table({
    head: ['department_id', 'department_name', 'over_head_costs', 'product_sales', 'total_profit'],
    colWidths: [17, 17, 17, 17, 17]
  });

  connection.query(query, (err, res) => {
    res.forEach(obj => {
      let arrValues = Object.values(obj);
      let difference = arrValues[2] - arrValues[3];
      let profit = null;
      const posOrNeg = Math.sign(difference);
      if (!posOrNeg) {
        profit = difference * -1;
      } else {
        profit = 0;
      }
      arrValues[4] = profit;
      table.push(arrValues);
    });
    console.log(table.toString())
    listMenuOptions();
  });
};