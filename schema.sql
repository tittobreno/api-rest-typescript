CREATE DATABASE application_api;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL, 
  email TEXT NOT NULL UNIQUE,
  password VARCHAR(60) NOT NULL,
  created_at timestamp
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  title TEXT
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  description TEXT,
  value integer,
  date DATE NOT NULL DEFAULT NOW(),
  category_id INTEGER NOT NULLT REFERENCES category(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  type TEXT
  );
