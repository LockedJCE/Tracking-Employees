require('dotenv').config()
const inquirer = require('inquirer');

const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;

// Connect to database
const pool = new Pool(
  {
    // TODO: Enter PostgreSQL username
    user: process.env.DB_USER,
    // TODO: Enter PostgreSQL password
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE
  },
)

pool.connect()
  .then(() => {
    console.log("Connected to the empoloyee_db database");
})
  .catch(error => {
    console.error("Error connecting to the database:", error);
});

function init() {
  console.log("Welcome to the Tracking Empoloyee's Application!");

  // Display the main menu
  displayMenu().then(handleMenu);
}

// An array of questions for user input
function displayMenu() {
const questions = [
  {
      type: "list",
      name: "MENU",
      message: "What would you like to do?",
      choices:[
          'VIEW ALL DEPARTMENTS',
          'VIEW ALL ROLES',
          'VIEW ALL EMPLOYEES',
          'ADD DEPARTMENT',
          'ADD ROLE', 
          'ADD EMPLOYEE', 
          'UPDATE EMPLOYEE ROLE'   
          
      ]
  },
]
return inquirer.prompt(questions);
};

function handleMenu (selection){
  switch (selection.MENU) {

      case 'VIEW ALL DEPARTMENTS':
          viewDept();
          break;

      case 'VIEW ALL ROLES':
          viewRole();
          break;
      
      case 'VIEW ALL EMPLOYEES':
          viewEmp();
          break;

      case 'ADD DEPARTMENT':
          addDept();
          break;

      case 'ADD ROLE':
          addRole();
          break;
          
      case 'ADD EMPLOYEE':
          addEmp();
          break;
              
      case 'UPDATE EMPLOYEE ROLE':
          updateRole();
          break;
                 
          default:
              console.log('GOOD CHOICE!')
  }
  return false;
}

function viewDept(){
  pool.query(`SELECT * FROM department`, (err, result) =>{
      if(err){
          console.error(err);
      } else{
          console.log('DEPARTMENT LIST.....')
          console.table(result.rows);
          init()
      }
  });
};

function viewRole(){
  pool.query
  (`SELECT  
  role.title,
  role.id, 
  department.name, 
  role.salary 
  FROM department LEFT 
  JOIN role ON department.id=department_id`, (err, result) =>{
      if(err){
          console.error(err);
      } else{
          console.log('LIST OF ROLES......')
          console.table(result.rows);
          init()
      };
  });
};

function viewEmp(){
  pool.query(`SELECT
employee.id,  
employee.first_name,
employee.last_name,  
role.title, 
department.name AS department,
role.salary,
CONCAT (employee.last_name,', ',employee.first_name) 
AS employee_name, 
CONCAT(manager.first_name,' ',manager.last_name)AS manager_name
FROM department
JOIN role
ON department.id=role.department_id
JOIN employee
ON role.id=employee.role_id
LEFT JOIN employee manager 
ON employee.manager_id=manager.id;
`, (err, result) => {
  if (err){
      console.error(err);
  } else{
      console.log('\n');
      console.log('Minion list...');
      console.table(result.rows);
      init()
  }
})
};

function addDept(){
  const questions = [
      {
          type:"input",
          name:"newDept",
          message:"What is the department you would like to add?"
      }
  ]
inquirer.prompt(questions).then((answers) => {
  pool.query('INSERT INTO department(name) VALUES($1)', [answers.newDept]).then(console.log('Department successfully add...'))
  init();
})
};

function addRole(){
  pool.query(`SELECT id, name FROM department`,
(err, res) => {
  if (err) {
      console.error(err)
  }
  let dept =res.rows.map((row) => ({
      name: row.name,
      value: row.id
  })
)
const questions =[
  {
      type: 'input',
      name: 'role',
      message: 'Enter new role title.'
  },
  {
      type: 'input',
      name: 'salary',
      message: 'Enter salary.'
  },
  {
      type: 'list',
      name: 'department',
      message: 'What department is role under?',
      choices:dept
  }
]
inquirer.prompt(questions).then((answers) => {
  pool.query('INSERT INTO role(title, salary, department_id) VALUES ($1, $2, $3)', [answers.role, answers.salary, answers.department]).then(console.log('New role successfully added...'),
  init());

})
  });
}

  function addEmp() {
      pool.query(`SELECT id, 
      CONCAT ( employee.first_name, ' ', employee.last_name) 
      AS manager_name FROM employee`, (err, res) => {
          if (err){
              console.error(err)
          }
          let manager = res.rows.map((row) => ({
              name: row.manager_name,
              value: row.id
          }));
          pool.query(`SELECT id, title FROM role`, (err, res) => {
              if (err){
                  console.error(err)
              }
              let role = res.rows.map((row) =>({
                  name: row.title,
                  value: row.id
              }));
              const questions = [
                  {
                      type: 'input',
                      name: 'firstName',
                      message: 'What is the new employees first name?'
                  },
                  {
                      type: 'input',
                      name: 'lastName',
                      message: 'What is the new employees last name?'
                  },
                  {
                      type: 'list',
                      name: 'role',
                      message: 'What is the new employees role?',
                      choices: role, 
                  },
                  {
                      type: 'list',
                      name: 'manager',
                      message: 'Who is the new employees manager?',
                      choices: manager, 
                  },
              ];
              inquirer.prompt(questions).then((answers) => {
                  pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                  VALUES ($1, $2, $3, $4)`,
                  [answers.firstName, answers.lastName, answers.role, answers.manager])
                  .then(() =>  {
                      console.log('Employee successfully added...',)
                      init();
                  })
                  .catch((err) => {
                      console.error('FAILED TO ADD EMPLOYEE.', err)
                  });
              });
          });
      });
  }


  function updateRole(){
      pool.query(`SELECT id,
      CONCAT (employee.last_name,' ',employee.first_name) 
      AS employee_name FROM employee `,(err, res) => {
          if (err){
              console.error(err)
          }
          let employee = res.rows.map((row) => ({
              name: row.employee_name,
              value: row.id
          }));
  
          pool.query(`SELECT id, title FROM role`, (err, res) => {
              if (err){
                  console.error(err)
              }
              let role = res.rows.map((row) =>({
                  name: row.title,
                  value: row.id
              }));
  
              const questions = [
                  {
                      type:'list',
                      name: 'employee',
                      message:'SELECT EMPLOYEE',
                      choices: employee
                  },
                  {
                      type:'list',
                      name: 'newRole',
                      message:'SELECT THEIR NEW ROLE',
                      choices: role
                  }
              ]
              inquirer.prompt(questions).then(answers => {
                  pool.query(`UPDATE employee SET role_id = $1 WHERE id = $2`,
              [answers.newRole, answers.employee])
              .then((res) => {
                  console.log('Role successfully updated...')
                  init();
              });
              });
          })
      });
  };



// Function call to initialize app
init();