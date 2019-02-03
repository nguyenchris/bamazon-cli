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
    choices: ['View Product Sales by Department', 'Create New Department'],
    message: 'What would you like to do?'
  }];

  inquirer
    .prompt(options)
    .then(answer => {
      if (answer.choice === 'View Product Sales by Department') {
        viewProductSalesByDept()
      } else if (answer.choice === 'Create New Department') {

      }
    });
};

const viewProductSalesByDept = () => {
  const table = new Table({
    head: ['TH 1 label', 'TH 2 label', 'TH 2 label', 'TH 2 label', 'TH 2 label'],
    colWidths: [16, 16, 16, 16, 16]
  });

  table.push(
    ['First value', 'Second value', 'Second value', 'Second value', 'Second value']
  );

  console.log(table.toString())
};