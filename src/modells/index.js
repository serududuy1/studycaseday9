const mongoose = require("mongoose");
const Scheme = mongoose.Schema;

const bookStore = new Scheme(
  {
    judul: {
      type: String,
      required: true,
    },
    penulis: {
      type: String,
      required: true,
    },
    tahun: {
      type: String,
      required: true,
    },
    gambar: {
      type: String,
      required: true,
    },
  },
  {
    timetamps: true,
  }
);

module.exports = mongoose.model("library", bookStore);
