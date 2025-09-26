# Hide and Squeak

> Run your own large-scale IRL hide and seek game

Imagine an epic hide-and-seek game with your friends, that takes place across a whole day in your village or town. This is your companion app that lets you make it happen.

Currently a work in progress.

## Screenshots

![Screenshot of the "Join game" screen](screenshots/join-game.png)
![Screenshot of the "Create game" screen](screenshots/create-game.png)

## Deployment guide using Docker

It's recommended to deploy Hide and Squeak using Docker (with Docker Compose). We'll be using the [`mmk21/hide-and-squeak-server`](https://hub.docker.com/r/mmk21/hide-and-squeak-server/) image, which supports x86_64 and ARM64 on Linux.

1. Create a folder for the Docker Compose and config files, e.g. `mkdir hide-and-squeak && cd hide-and-squeak`
2. Download the production [`compose.yaml`](deployment/downloads/compose.yaml) file: `wget https://raw.githubusercontent.com/MMK21Hub/hide-and-squeak/main/deployment/downloads/compose.yaml`
3. Download the [`example.env`](deployment/downloads/example.env) file: `wget https://raw.githubusercontent.com/MMK21Hub/hide-and-squeak/main/deployment/downloads/example.env`
4. Rename the `example.env` file to `.env`: `mv example.env .env`
5. Edit the `.env` file, replacing the default database password with a randomly-generated one (without special characters)
6. Run `docker compose up -d` to start the containers
7. Optional: Watch the logs with `docker compose logs -f` (the database will perform some initial migrations and then the server should start up after a few seconds)

By default, the app will be served on port 3010 (accessible at <http://localhost:3010>) and the database will stored in a `database` folder next to the `docker-compose.yaml` file. Both of those details can be changed by editing the `compose.yaml` file.

## Development setup

1. Clone the repository and change into the repository's directory
2. Run `yarn install`
3. Run `yarn run db:generate`

### Start the database

Any PostgreSQL database will do. I'd recommend spinning one up with Docker:

```bash
docker run --name has-dev-db \
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
docker exec -it has-dev-db psql -U postgres -d hide-and-squeak
```

Then run the following SQL command to enable PostGIS:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

Exit the shell.

### Adjust the `.env` file for the backend

Adjust the `backend/.env` file to match the database in your development environment. If you used the exact command above, you can keep the default.

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

### Working with Docker

#### Test the Dockerfile locally

1. Create a `.env` file in the root of the repo, using [`deployment/downloads/env.example`](deployment/downloads/env.example) as a template.
1. In the root of the repo: `docker compose up --build`
1. Hopefully it builds without errors and the app will work on port 3010

#### Build a multi-platform image

1. Set up a Docker BuildKit builder: `docker buildx create --use`
2. Install required emulators: `docker run --privileged --rm tonistiigi/binfmt --install arm64` (if your local machine is x86_64)
   - If you're on an ARM64 machine, you should install the `amd64` emulator instead
   - If you're on another architecture, install both (`arm64,amd64`)
3. Build it! `docker buildx build --platform linux/amd64,linux/arm64 --load .`

#### Build a multi-platform image and upload it to Docker Hub

1. Check the [tags already available on Docker Hub](https://hub.docker.com/r/mmk21/hide-and-squeak-server/tags)
2. Use the [`upload-new-docker-image.sh`](upload-new-docker-image.sh) script! E.g. `./upload-new-docker-image.sh v0.1.9`
   - This will automatically perform the preparatory steps for multi-platform builds (as above), build the image, tag it, and upload it to Docker Hub

#### Publish a single-platform Docker image to Docker Hub manually (not recommended)

This process is no longer recommended, because you can now use the `upload-new-docker-image.sh` script to upload multi-platform images.

1. Pick a version number: `export VERSION=v0.1.0`
2. Build the image: `docker build -t mmk21/hide-and-squeak-server .`
3. Tag it with the version tag: `docker tag mmk21/hide-and-squeak-server mmk21/hide-and-squeak-server:$VERSION`
4. Upload the version tag: `docker push mmk21/hide-and-squeak-server:$VERSION`
5. Upload the `latest` tag: `docker push mmk21/hide-and-squeak-server`

## AI usage statement

The following kinds of AI assistance have been used to for this project:

- GitHub Copilot's tab-completion and edit predictions
- Asking ChatGPT to compare different available framework/library/other technology choices
- Asking ChatGPT for help with debugging Docker issues
- ChatGPT scaffolded a basic `schema.prisma` file which was then modified

None of the prose in the app, or documentation, has been written or rewritten by AI.
