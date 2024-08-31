const router = require("express").Router();
const loggerTwo = require("../middlewares/loggerTwo");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

router.use(loggerTwo);

router.get("/", getUsers);
router.get("/:user_id", getUser);
router.post("/", createUser);
router.patch("/:user_id", updateUser);
router.delete("/:user_id", deleteUser);

module.exports = router;
