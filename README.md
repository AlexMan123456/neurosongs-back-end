### Neurosongs Back-end API

This is the back-end server for the Neurosongs website, also created by me. It aims to be a mix between YouTube, Spotify, and a hint of Metacritic, taking the streaming capabilities of Spotify, the community aspect of YouTube, and the rating system from Metacritic.

## Cloning

To clone the project, set the terminal to your chosen directory, then run:

    git clone https://github.com/AlexMan123456/neurosongs-back-end

Then navigate into the directory:

    cd neurosongs-back-end

Install all required dependencies using:

    npm install

A list of all dependencies and their required versions can be found in the `package.json` file.

## Setting up Environment Variables

Create two environment variables, `.env.test` and `.env.development`. Each of them will have just one environment variable set, that being `DATABASE_URL`. Put your test database URL in `.env.test` and your development database URL in `.env.development`, like so:

    DATABASE_URL=your_database_url

The database in both cases are managed with Prisma, so I would recommend setting both up using a Prisma database: https://www.prisma.io/postgres

## Seeding Databases

Test database seeding is done automatically when running the server tests. The database is re-seeded after every test to ensure data doesn't persist between tests.

To seed the development database, run the following:
    
    npm run seed-dev

## Running the tests

To run the tests, you will first need to set up Docker. Install Docker and Docker Compose using [this link](https://docs.docker.com/get-started/get-docker/).

After that, run the following command:

    docker compose up -d

Check that your Docker container is running using docker ps. Your terminal should look something like this:

![CONTAINER ID: (your container ID). IMAGE: postgres:latest. COMMAND: "docker-entrypoint.s...". CREATED: 9 days ago. STATUS: Up 4 hours (healthy). PORTS: 0.0.0.0:5432->5432/tcp. NAMES: integration-tests-prisma.](./docker-ps-result.png)

If this succeeds, now run the following command:

    npm test server

If you've set up your environment variables and Docker environment correctly, all tests should be passing. Make sure they are still passing if you decide to make any pull requests - I will be checking!

## Links

Link to front-end repository: https://github.com/AlexMan123456/neurosongs-front-end

Link to hosted version of the site: https://neurosongs.netlify.app