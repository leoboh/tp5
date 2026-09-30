TP4 – API Node.js avec PostgreSQL et Docker Compose

API REST de gestion de tâches (CRUD) écrite en Node.js avec Express. Les données sont stockées dans une base PostgreSQL, et l'ensemble tourne dans deux conteneurs orchestrés par Docker Compose.

////////////////////
////////////////////
Prérequis
Docker Desktop (inclut Docker Compose)
Optionnel : Bruno pour tester l'API, DBeaver pour explorer la base


////////////////////
////////////////////
Structure du projet
tp4/
├── docker-compose.yml   # Configuration des services db et api
├── .env.example         # Modèle des variables d'environnement
├── db-init/
│   └── 01-init.sql      # Création de la table tasks + données de test
└── api/
    ├── Dockerfile       # Image de l'API
    ├── package.json
    ├── db.js            # Connexion à PostgreSQL (package pg)
    └── index.js         # Routes CRUD


////////////////////
////////////////////
Démarrage
Cloner le dépôt :
bash
   git clone <url-du-depot>
   cd tp4
Créer le fichier .env à partir du modèle (modifiez les valeurs si besoin) :
bash
   cp .env.example .env
Lancer les services :
bash
   docker compose up -d --build
Vérifier que les deux conteneurs sont démarrés :
bash
   docker compose ps

L'API est disponible sur http://localhost:3000 et PostgreSQL sur localhost:5432.

Au premier démarrage, PostgreSQL exécute automatiquement les scripts du dossier db-init/, qui créent la table tasks et insèrent deux tâches de test.


////////////////////
////////////////////
Fonctionnement
Service db : image officielle postgres:16. Les données sont persistées dans le volume nommé db-data, et le dossier db-init/ est monté dans /docker-entrypoint-initdb.d pour l'initialisation.
Service api : construit depuis api/Dockerfile. Il se connecte à PostgreSQL avec le package pg, en utilisant le nom d'hôte db (le nom du service dans Docker Compose). Il ne démarre qu'une fois la base prête, grâce au healthcheck.
Les identifiants de la base sont définis dans .env et partagés par les deux services.


////////////////////
////////////////////
Routes de l'API
Méthode	Route	Description	Corps (JSON)	Réponse
GET	/tasks	Lister toutes les tâches	–	200
GET	/tasks/:id	Obtenir une tâche	–	200 ou 404
POST	/tasks	Créer une tâche	{"name": "...", "description": "..."}	201 ou 400
PUT	/tasks/:id	Modifier une tâche	{"name": "...", "description": "..."}	200 ou 404
DELETE	/tasks/:id	Supprimer une tâche	–	204 ou 404


////////////////////
////////////////////
Exemples avec curl
bash
# Lister
curl http://localhost:3000/tasks

# Créer
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"name": "Réviser Docker", "description": "TP4"}'

# Lire
curl http://localhost:3000/tasks/1

# Modifier
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Tâche modifiée", "description": "ok"}'

# Supprimer
curl -X DELETE http://localhost:3000/tasks/1

Ces requêtes peuvent aussi être envoyées depuis Bruno, Postman ou Insomnia.


////////////////////
////////////////////
Explorer la base de données

Avec DBeaver (ou tout client PostgreSQL), créez une connexion PostgreSQL avec :

Hôte : localhost
Port : 5432
User : leo
MDP : leo

La table se trouve dans public > tasks.

En ligne de commande, sans outil externe :

bash
docker compose exec db psql -U admin -d mabase -c "SELECT * FROM tasks;"

(en remplaçant admin et mabase par les valeurs de .env)


////////////////////
////////////////////
Commandes utiles
bash
docker compose logs api        # Logs de l'API
docker compose logs db         # Logs de PostgreSQL
docker compose down            # Arrêter (les données sont conservées)
docker compose down -v         # Arrêter et supprimer les données

Les scripts de db-init/ ne s'exécutent que lorsque la base est vide. Après une modification de 01-init.sql, relancez avec docker compose down -v puis docker compose up -d --build.