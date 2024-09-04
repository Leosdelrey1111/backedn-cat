create table usuario(
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    contactNumber varchar(20),
    email varchar(50),
    password varchar(250),
    status varchar(20),
    role varchar(20),
    UNIQUE (email)
);

insert into usuario(name,contactNumber,email,password,status,role) values('Gael','232323','doesnt@gmail.com','momeodE#','High','adviser');