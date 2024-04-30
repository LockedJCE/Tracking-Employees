INSERT INTO department (name) VALUES
('Frontend'), 
('Backend'), 
('Marketing'), 
('IT'); 

INSERT INTO role (title, salary, department_id) VALUES
('Frontend Manager', 160000, 1),
('Frontend Developer', 100000, 1),
('Backend Manager', 160000, 2),
('Backend Developer', 100000, 2),
('Marketing Manager', 160000, 3),
('Marketing Service', 100000, 3),
('IT Manager', 160000, 4),
('IT Service', 100000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Smith', 1, NULL),
('Mark', 'Zuck', 2, 1),
('Bill', 'Gates', 3, 1),
('Steve', 'Jobs', 4, NULL),
('John', 'Cena', 5, 4),
('Mike', 'Tyson', 7, NULL),
('Sarah', 'Smith', 6, 4),
('Rebecca', 'Jones', 8, NULL);
