// Package Modules
const express = require("express");
const jwt = require("jsonwebtoken");
const { hashSync, compareSync } = require("bcrypt");
const router = express.Router();
require("dotenv").config();

// Admin Model
const { Admin } = require("../models/Admin");

// Route Index (/)
router.get("/", (req, res) => {
  res.ok({
    success: true,
    message: "Welcome to Dosier API",
    creator: "https://github.com/irfnd",
    tech: ["Express", "MongoDB", "Google Drive API"],
  });
});

// Route Register (/register)
router.post("/register", async (req, res) => {
  const newAdmin = new Admin({
    email: req.body.email,
    nama: req.body.nama,
    password: hashSync(req.body.password, 10),
  });
  try {
    const admin = await newAdmin.save();
    return res.ok({
      success: true,
      message: "Berhasil Menambahkan Data",
      content: {
        id: admin._id,
        email: admin.email,
        nama: admin.nama,
      },
    });
  } catch (err) {
    return res.error({
      success: false,
      message: "Gagal Menambahkan Data",
      content: err,
    });
  }
});

// Route Auth (/auth)
router.post("/auth", async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      return res.unauthorized({
        success: false,
        message: "Gagal Menemukan Admin",
        content: admin,
      });
    }

    if (!compareSync(req.body.password, admin.password)) {
      return res.unauthorized({
        success: false,
        message: "Password Salah",
        content: admin,
      });
    }

    const payload = {
      id: admin._id,
      email: admin.email,
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" });

    return res.ok({
      success: true,
      message: "Login Berhasil",
      content: {
        id: payload.id,
        email: payload.email,
        token: "Bearer " + token,
      },
    });
  } catch (err) {
    return res.error({
      success: false,
      message: "Login Gagal",
      content: err,
    });
  }
});

module.exports = router;
