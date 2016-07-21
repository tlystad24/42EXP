-- postgres version 9.4

DROP DATABASE IF EXISTS Xanadu;
CREATE DATABASE Xanadu;

\c Xanadu;

CREATE TABLE IF NOT EXISTS Account(
  id SERIAL PRIMARY KEY,
  Username VARCHAR(40) UNIQUE,
  Email VARCHAR(40),
  Password VARCHAR,
  Join_date TIMESTAMPTZ DEFAULT NOW(),
  XP INTEGER DEFAULT 0,
  Level Integer DEFAULT 1,
  Provider VARCHAR,
  is_admin BOOLEAN DEFAULT FALSE;
);

CREATE TABLE IF NOT EXISTS Skill(
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE
);

CREATE TABLE IF NOT EXISTS Category(
  id SERIAL PRIMARY KEY,
  name VARCHAR(25) UNIQUE
);

CREATE TABLE IF NOT EXISTS Project(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  Owner VARCHAR REFERENCES Accounts (Username) ON UPDATE CASCADE ON DELETE CASCADE,
  Description text,
  Link VARCHAR,
  Category VARCHAR REFERENCES Category (name) ,
  Create_date TIMESTAMPTZ DEFAULT NOW(),
);

CREATE TABLE IF NOT EXISTS Account_Projects(
  id SERIAL PRIMARY KEY,
  Username VARCHAR REFERENCES Accounts (Username),
  Project VARCHAR REFERENCES Project (name) ON DELETE CASCADE ON UPDATE CASCADE,
  Join_date TIMESTAMPTZ DEFAULT NOW(),
  ROLE VARCHAR(10),
  Last_activity TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Project_Messages(
  id SERIAL PRIMARY KEY,
  Project VARCHAR REFERENCES Project (name) ON DELETE CASCADE ON UPDATE CASCADE,
  Message Text,
  Username VARCHAR REFERENCES Account (Username),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Account_skills(
  id SERIAL PRIMARY KEY,
  Username VARCHAR REFERENCES Account (Username),
  Skill VARCHAR REFERENCES skill (name),
  Commends INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Project_skills(
  id SERIAL PRIMARY KEY,
  Project VARCHAR REFERENCES Project (Project_name) ON DELETE CASCADE ON UPDATE CASCADE,
  Skill VARCHAR REFERENCES skill (name)
);

CREATE TABLE IF NOT EXISTS VOTES(
  id SERIAL PRIMARY KEY,
  Voter VARCHAR REFERENCES Account(Username),
  Votee VARCHAR REFERENCES Account(Username),
  skill INTEGER REFERENCES Account_skills (id),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (Voter,Votee,skill)
);
