-- Add a department
INSERT INTO department (name) VALUES ('Marketing');

-- Add a role
INSERT INTO role (title, salary, department_id) VALUES ('Marketing Manager', 60000, 1);

-- Add an employee
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL);

-- Change an employee's role
UPDATE employee SET role_id = 2 WHERE id = 1;

-- View all departments
SELECT * FROM department;

-- View all roles
SELECT * FROM role;

-- View all employees
SELECT * FROM employee;