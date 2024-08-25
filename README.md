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

create table transaction(
id int auto_increment primary key,
user_id int,
ac_id int,
created_date date,
payee varchar(50),
category_id int,
outflow decimal(15,2),
inflow decimal(15,2),
cleared boolean,
foreign key (user_id) references User(user_id)
foreign key (ac_id) references Accounts(ac_id)
foreign key (category_id) references Category(category_id)
);

