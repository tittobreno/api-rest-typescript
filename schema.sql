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
  category_id INTEGER NOT NULL REFERENCES category(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  type TEXT
  );

INSERT INTO categories (title) VALUES
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');