const users = require("./../users/users-model");
const posts = require("../posts/posts-model");

function logger(req, res, next) {
  // DO YOUR MAGIC

  const timeStamp = Date.now();
  console.log(`${req.method}, ${req.url}, ${timeStamp}`);
  next();
  //const logger = require("morgan");
  // server.use(logger("dev"));
}

function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  let { id } = req.params;
  users.getById(id).then((user) => {
    if (user == null) {
      res.status(404).json({ message: `user not found` });
    } else {
      req.user = user;

      next();
    }
  });
}

function validateUser(req, res, next) {
  let body = req.body;
  if (!body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
  // users.insert(body).then((user) => {
  //   if (!user.name) {
  //     res.status(400).json({ message: "missing required name field" });
  //   } else {
  //     req.newUser = user;
  //     next();
  //   }
  //});
  // DO YOUR MAGIC
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
};
