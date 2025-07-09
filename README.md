# Hide and Squeak

> Run your own large-scale IRL hide and seek game

Imagine an epic hide-and-seek game with your friends, that takes place across a whole day in your village or town. This is your companion app that lets you make it happen.

Currently a work in progress.

## Screenshots

![Screenshot of the "Join a game" screen](screenshot.png)

## Deployment guide using Docker

It's recommended to deploy Hide and Squeak using Docker (with Docker Compose).

1. Create a folder for the Docker Compose and config files, e.g. `mkdir hide-and-squeak`
2. Download the production [`compose.yaml`](deployment/downloads/compose.yaml) file
3. Download the [`env.example`](deployment/downloads/env.example) file
4. Rename the `env.example` file to `.env`
5. Edit the `.env` file, replacing the default database password with a randomly-generated one
6. Run `docker compose up -d` to start the containers
7. Optional: Watch the logs with `docker compose logs -f` (the database will perform some initial migrations and then the server should start up after a few seconds)

By default, the app will be served on port 3010 (accessible at <http://localhost:3010>) and the database will stored in a `database` folder next to the `docker-compose.yaml` file. Both of those details can be changed by editing the `compose.yaml` file.

## Development setup

1. Clone the repository
2. `yarn install` in the repository's directory

### Start the database

Any PostgreSQL database will do. I'd recommend spinning one up with Docker:

```bash
docker run --name hide-and-squeak-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=hide-and-squeak \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  -d postgis/postgis:17-3.5
```

### Initialise the database

Enable the PostGIS extension for the database by opening a `psql` shell:

```bash
docker exec -it hide-and-squeak-db psql -U postgres
```

Then run the following SQL command to enable PostGIS:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

Exit the shell.

### Create a `.env` file for the backend

Create the file `backend/.env` and use it to specify configuration for your development environment:

```bash
# Adjust if you're using a different database setup to the one above
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hide-and-squeak"
```

### Start the backend server

Start the backend server with `yarn workspace hide-and-squeak-server start`

- Leave this running in the background
- Restart the command if you make changes to the backend code
- Test it by going to <http://localhost:3010/ping>

### Start the frontend development server

Also start the frontend development server with `yarn workspace hide-and-squeak dev`

- Live reload will be available

## Development tips

### Updating the database schema

Edit `backend/prisma/schema.prisma`. Then:

- Run `yarn run db:push` to update the database
- Run `yarn run db:studio` to examine the database contents using Prisma Studio (web UI)

### Test the Dockerfile

1. Create a `.env` file in the root of the repo, using [`deployment/downloads/env.example`](deployment/downloads/env.example) as a template
1. In the root of the repo: `docker compose up --build`
1. Hopefully it builds without errors and the app will work on port 3010

## AI usage statement

The following kinds of AI assistance have been used to for this project:

- GitHub Copilot's tab-completion and edit predictions
- Asking ChatGPT to compare different available framework/library/other technology choices
- Asking ChatGPT for help with debugging Docker issues
- ChatGPT scaffolded a basic `schema.prisma` file which was then modified

None of the prose in the app, or documentation, has been written or rewritten by AI.
