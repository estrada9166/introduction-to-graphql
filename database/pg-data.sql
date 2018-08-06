-- createdb makeitreal

drop table if exists careers, students;

create table careers (
  id serial primary key,
  name varchar(255) not null unique
);

create table students (
  id serial primary key,
  email varchar(255) not null unique,
  username varchar(128) not null unique,
  career_id integer references careers not null
);
