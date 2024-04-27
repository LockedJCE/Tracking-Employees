DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

\c employee_db;

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30)NOT NULL, 
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

DO $$
DECLARE
    -- Any variable declarations would go here
BEGIN
    -- Begin transaction
INSERT INTO department (name)
VALUES (Example),
       (Test);

INSERT INTO role (title, salary, department_id)
VALUES ('Manager', 100000, )

    INSERT INTO authors (author_id, author_name)
    VALUES
        (10, 'Jane Austen'),
        (11, 'Harper Lee');

    -- If the code reaches here, it means no exceptions were raised.
    -- Thus, it will commit automatically at the end of the block.
RAISE NOTICE 'Transaction complete';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'An error occurred: %', SQLERRM; -- Log the error
        ROLLBACK; -- Explicitly roll back changes in case of error  
END $$;