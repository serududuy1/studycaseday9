const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dataRouter = require("./src/routes");
const path = require("path");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();
const { default: mongoose } = require("mongoose");

const port = process.env.PORT;
const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const cekfileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(cors());
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  multer({ storage: fileStorage, fileFilter: cekfileFilter }).single("gambar")
);

app.use("/v1/", dataRouter);

app.use((error, req, res, next) => {
  const status = error.errorStatus || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ message, data });
});

mongoose
  .connect(
    `mongodb+srv://serududuy:${process.env.token_auth}@bookstore.e4ijlmf.mongodb.net/?retryWrites=true&w=majority`
  )
  .then((res) => {
    app.listen(port, () =>
      console.log(`berhasil berjalan di http://localhost:${port}`)
    );
  })
  .catch((e) => console.log(e));
