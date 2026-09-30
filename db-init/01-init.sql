CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

INSERT INTO tasks (name, description) VALUES
  ('Première tâche', 'Créée par le script d''initialisation'),
  ('Deuxième tâche', 'Elle aussi');
