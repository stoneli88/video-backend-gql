# Backend Server

This Server implement a GraphQL server with an user-password-based authentication workflow based on Prisma & [graphql-yoga](https://github.com/graphcool/graphql-yoga).

## Get started

### 1. Install the Prisma CLI

The `prisma` cli is the core component of your development workflow. `prisma` should be installed as a global dependency, you can install this with `npm install -g prisma`

### 2. Download the example & install dependencies

Clone the Prisma monorepo and navigate to this directory or download _only_ this example with the following command:

```sh
curl https://codeload.github.com/prismagraphql/prisma/tar.gz/authentication | tar -xz --strip=2 prisma-master/examples/application-server
```

Next, navigate into the downloaded folder and install the NPM dependencies:

```sh
cd authentication
yarn install
```

### 3. Deploy the Prisma database service

You can now [deploy](https://www.prisma.io/docs/reference/cli-command-reference/database-service/prisma-deploy-kee1iedaov) the Prisma service (note that this requires you to have [Docker](https://www.docker.com) installed on your machine - if that's not the case, follow the collapsed instructions below the code block):

```sh
# Ensure docker is running the server's dependencies
docker-compose up
# Deploy the server
cd prisma
prisma deploy
```

<details>
 <summary><strong>I don't have <a href="https://www.docker.com">Docker</a> installed on my machine</strong></summary>

To deploy your service to a demo server (rather than locally with Docker), please follow [this link](https://www.prisma.io/docs/quickstart/).

</details>

### 4. Explore the API

### To start the server, run the following command

`yarn start`

The easiest way to explore this deployed service and play with the API generated from the data model is by using the [GraphQL Playground](https://github.com/graphcool/graphql-playground).

### Open a Playground

You can either start the [desktop app](https://github.com/graphcool/graphql-playground) via

```sh
yarn playground
```

Or you can open a Playground by navigating to [http://localhost:4000](http://localhost:4000) in your browser.


### Database Schema

#### Video
`
"vid":"39271",
"uid":"1",
"title":"video's title",
"keyword":"video's keywords",
"channel":"2",
"duration":7063.39,
"framerate":29.97,
"hd":true,
"addtime":1491800115,
"viewnumber":50,
"likes":0,
"dislikes":0,
"video_url":"https://video-name",
"preview_url":"https://video.jpg"
`

#### Categories
`
"CHID":"1",
"name":"category name",
"slug":"category",
"total_videos":350,
"category_url":"",
"cover_url":""
`
#### Collections
`
 "id":"1",
"title":"name",
"keyword":"name",
"cover_url":"",
"total_views":204011,
"video_count":17,
"collection_url":""
`

