const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const {
  allBook,
  post,
  bookById,
  updateData,
  destroy,
} = require("../controllers");

const validation = [
  body("judul")
    .isLength({ min: 5 })
    .withMessage("judul harus diatas 5 karakter"),
  body("tahun")
    .isLength({ min: 4, max: 4 })
    .withMessage("tahun harus 4 karakter"),
  body("penulis")
    .isLength({ min: 5 })
    .withMessage("author harus diatas 5 karakter"),
];

router.get("/book", allBook);
router.post("/book/post", validation, post);
router.get("/book/:blogId", bookById);
router.put("/book/:blogId", validation, updateData);
router.delete("/book/:blogId", destroy);
module.exports = router;
