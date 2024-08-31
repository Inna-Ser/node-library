const router = require("express").Router();
const loggerOne = require("../middlewares/loggerOne");
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/books");

router.use(loggerOne);

router.get("/", getBooks);
router.get("/:book_id", getBook);
router.post("/", createBook);
router.patch("/:book_id", updateBook);
router.delete("/:book_id", deleteBook);

module.exports = router;
