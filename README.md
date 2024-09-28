# Personal-finance-tracker

create database finance_tracker;

create table User(
user_id int auto_increment primary key,
user_name varchar(50),
email varchar(100),
password varchar(255)
);

create table Accounts(
ac_id int auto_increment primary key,
user_id int,
ac_name varchar(100),
ac_type varchar(100),
ac_balance decimal(15,2),
foreign key (user_id) references User(user_id)
);

create table Category(
category_id int auto_increment primary key,
user_id int,
category_type varchar(100),
category_name varchar(100),
foreign key (user_id) references User(user_id)
);

create table budget(
budget_id int auto_increment primary key,
user_id int,
created_date date,
category_id int,
assigned decimal(15,2),
foreign key (user_id) references User(user_id),
foreign key (category_id) references Category(category_id)
);

CREATE TABLE transaction (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    ac_id INT,
    category_id INT,
    created_date DATE,
    payee VARCHAR(50),
    outflow DECIMAL(15,2),
    inflow DECIMAL(15,2),
    cleared BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (ac_id) REFERENCES Accounts(ac_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Category(category_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

