CREATE DATABASE application_api;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL, 
  email TEXT NOT NULL UNIQUE,
  password VARCHAR(60) NOT NULL,
  created_at timestamp
);
  