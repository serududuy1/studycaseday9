const bookStore = require("../modells");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const hapusgambar = (filePath) => {
  filePath = path.join(__dirname + "../../../" + filePath);
  fs.unlink(filePath, (err) => {
    console.log(err);
  });
};

module.exports = {
  allBook(req, res) {
    bookStore.find().then((respon) => {
      res.status(200).json({
        message: "berhasil get all book",
        data: respon,
      });
    });
  },

  post(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = new Error("inputan harus diatas 5");
      err.errorStatus = 401;
      err.data = errors.array();
      throw err;
    }

    if (!req.file) {
      const err = new Error("harap masukkan file");
      err.errorStatus = 422;
      throw err;
    }

    const data = {
      gambar: req.file.path,
      judul: req.body.judul,
      tahun: req.body.tahun,
      penulis: req.body.penulis,
    };

    const posting = new bookStore(data);
    posting
      .save()
      .then((res2) => {
        res.status(200).json({
          message: "data berhasil dipost",
          data: res2,
        });
      })
      .catch((e) => console.log(e));
  },

  bookById(req, res) {
    const blogId = req.params.blogId;
    bookStore.findById(blogId).then((respon) => {
      res.status(200).json({
        message: `berhasil mengambil buku `,
        data: respon,
      });
    });
  },

  updateData(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = new Error("inputan harus diatas 5");
      err.errorStatus = 401;
      err.data = errors.array();
      throw err;
    }

    console.log(req.file);

    if (!req.file) {
      const err = new Error("harap masukkan file");
      err.errorStatus = 422;
      throw err;
    }

    const data = {
      gambar: req.file.path,
      judul: req.body.judul,
      tahun: req.body.tahun,
      penulis: req.body.penulis,
    };
    const blogId = req.params.blogId;
    bookStore
      .findById(blogId)
      .then((respon) => {
        if (!respon) {
          const err = new Error("id tidak ditemukan");
          err.errorStatus = 403;
          throw err;
        }
        respon.gambar = data.gambar;
        respon.judul = data.judul;
        respon.tahun = data.tahun;
        respon.penulis = data.penulis;
        return respon.save();
      })
      .then((respon) => {
        res.status(201).json({
          message: "data berhasil di edit",
          data: respon,
        });
      })
      .catch((e) => next(e));
  },

  destroy(req, res, next) {
    const blogId = req.params.blogId;

    bookStore
      .findById(blogId)
      .then((respon) => {
        if (!respon) {
          const err = new Error("id tidak ditemukan");
          err.errorStatus = 403;
          throw err;
        }

        hapusgambar(respon.gambar);
        return bookStore.findByIdAndRemove(blogId);
      })
      .then((respon) => {
        res.status(201).json({
          message: "data berhasil di hapus",
          data: respon,
        });
      })
      .catch((e) => next(e));
  },
};
