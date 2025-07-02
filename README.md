# Hide and Squeak

> Run your own large-scale IRL hide and seek game

Imagine an epic hide-and-seek game with your friends, that takes place across a whole day in your village or town. This is your companion app that lets you make it happen.

Currently a work in progress.

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

## AI usage statement

The following kinds of AI assistance have been used to for this project:

- GitHub Copilot's tab-completion and edit predictions
- Asking ChatGPT to compare different available framework/library/other technology choices
- ChatGPT scaffolded a basic `schema.prisma` file which was then modified

None of the prose in the app, or documentation, has been written or rewritten by AI.
