const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const resolvers = require("./graphql/resolver");
const typeDefs = require("./graphql/TypeDefs");
const jwtProvider = require("./config/jwtProvider");

async function startServer() {
  const app = express();
  connectDB();
  const PORT = 3292;

  app.use(express.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || "";
      const user = jwtProvider.verifyToken(token);
      return { user };
    }
  });

  await server.start();
  app.use("/graphql", expressMiddleware(server));

  app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
}

startServer();
