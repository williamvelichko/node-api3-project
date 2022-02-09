const express = require("express");
const post = require("./users/users-router");
const server = express();
const midwire = require("./middleware/middleware");

// remember express by default cannot parse JSON in request bodies
server.use(express.json());
server.use(midwire.logger);
// global middlewares and the user's router need to be connected here
server.use("/api/users", post);
server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

module.exports = server;
