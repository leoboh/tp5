CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  -- Prénom du bénévole uniquement (minimisation : ni nom, ni e-mail, ni téléphone)
  assignee VARCHAR(50),
  complete BOOLEAN GENERATED ALWAYS AS (
    COALESCE(TRIM(name), '') <> '' AND COALESCE(TRIM(description), '') <> ''
  ) STORED
);

-- Prénoms fictifs : jamais ceux de vrais bénévoles
INSERT INTO tasks (name, description, assignee) VALUES
  ('Première tâche', 'Créée par le script d''initialisation', 'Jean'),
  ('Deuxième tâche', 'Elle aussi', 'John'),
  ('Troisième tâche', 'Toujours créée par le script d''initialisation', 'Hélène');
