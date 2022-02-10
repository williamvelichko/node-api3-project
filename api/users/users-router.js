const express = require("express");

// You will need `users-model.js` and `posts-model.js` both
const users = require("./users-model");
const posts = require("../posts/posts-model");
const midwire = require("../middleware/middleware");

// The middleware functions also need to be required

const router = express.Router();

router.get("/", (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  users
    .get()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(500).json({ message: "could not get the users" });
    });
});

router.get("/:id", midwire.validateUserId, (req, res) => {
  res.status(200).json(req.user);
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
});

router.post("/", midwire.validateUser, (req, res) => {
  users.insert(req.body).then((user) => {
    res.status(210).json(user);
  });
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
});

router.put("/:id", midwire.validateUserId, midwire.validateUser, (req, res) => {
  let { id } = req.params;
  let body = req.body;

  users.update(id, body).then((updatedUser) => {
    res.json(updatedUser);
  });
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.delete("/:id", midwire.validateUserId, (req, res) => {
  users.remove(req.params.id).then((deleted) => {
    res.json(req.user);
  });
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
});

router.get("/:id/posts", midwire.validateUserId, (req, res) => {
  let { id } = req.params;
  users.getUserPosts(id).then((post) => {
    res.json(post);
  });
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
});

router.post(
  "/:id/posts",
  midwire.validateUserId,
  midwire.validatePost,
  async (req, res, next) => {
    let { id } = req.params;
    let body = req.body;

    try {
      const newPost = await posts.insert({
        user_id: req.params.id,
        text: req.text,
      });
      res.status(201).json(newPost);
    } catch (e) {
      next();
    }
    // posts
    //   .getById(id)
    //   .then(({ post }) => {
    //     return posts.insert(post);
    //   })
    //   .then((newPost) => {
    //     res.json(newPost);
    //   })
    //   .catch((err) => {});
    // RETURN THE NEWLY CREATED USER POST
    // this needs a middleware to verify user id
    // and another middleware to check that the request body is valid
  }
);
router.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: "something bad has happended" });
});

// do not forget to export the router
module.exports = router;
