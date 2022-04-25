// Package Modules
const express = require("express");
const multer = require("multer");
const upload = multer();
const router = express.Router();

// Controller
const Pegawai = require("../controller/Pegawai");
const Jabatan = require("../controller/Jabatan");
const DataKeluarga = require("../controller/DataKeluarga");
const SK_Masuk = require("../controller/SK_Masuk");
const SK_Talenta = require("../controller/SK_Talenta");
const SK_PHDP = require("../controller/SK_PHDP");
const Diklat = require("../controller/Diklat");
const Hukuman = require("../controller/Hukuman");

// Route Index /api
router.get("/", (req, res) => {
	res.json({
		message: "Welcome to Dosier API",
		creator: "https://github.com/irfnd",
		tech: ["Express", "MongoDB", "Google Drive API"],
	});
});

// Route Data Personal
router.post("/pegawai", upload.single("foto_profil"), Pegawai.create);
router.get("/pegawai", Pegawai.findAll);
router.get("/pegawai/:nip", Pegawai.findById);
router.put("/pegawai/:nip", upload.single("foto_profil"), Pegawai.update);
router.delete("/pegawai/:nip", Pegawai.delete);

// Route Jabatan & SK Jabatan
router.post(
	"/pegawai/:nip/jabatan",
	upload.single("file_jabatan"),
	Jabatan.add
);
router.get("/pegawai/:nip/jabatan", Jabatan.findAll);
router.get("/pegawai/:nip/jabatan/:id", Jabatan.findById);
router.put(
	"/pegawai/:nip/jabatan/:id",
	upload.single("file_jabatan"),
	Jabatan.update
);
router.delete("/pegawai/:nip/jabatan/:id", Jabatan.delete);

// Route Data Keluarga
router.post(
	"/pegawai/:nip/data-keluarga",
	upload.single("file_keluarga"),
	DataKeluarga.add
);
router.get("/pegawai/:nip/data-keluarga", DataKeluarga.findAll);
router.get("/pegawai/:nip/data-keluarga/:id", DataKeluarga.findById);
router.put(
	"/pegawai/:nip/data-keluarga/:id",
	upload.single("file_keluarga"),
	DataKeluarga.update
);
router.delete("/pegawai/:nip/data-keluarga/:id", DataKeluarga.delete);

// Route SK Masuk
router.post(
	"/pegawai/:nip/sk-masuk",
	upload.single("file_sk_masuk"),
	SK_Masuk.add
);
router.get("/pegawai/:nip/sk-masuk", SK_Masuk.findAll);
router.get("/pegawai/:nip/sk-masuk/:id", SK_Masuk.findById);
router.put(
	"/pegawai/:nip/sk-masuk/:id",
	upload.single("file_sk_masuk"),
	SK_Masuk.update
);
router.delete("/pegawai/:nip/sk-masuk/:id", SK_Masuk.delete);

// Route SK Talenta
router.post(
	"/pegawai/:nip/sk-talenta",
	upload.single("file_sk_talenta"),
	SK_Talenta.add
);
router.get("/pegawai/:nip/sk-talenta", SK_Talenta.findAll);
router.get("/pegawai/:nip/sk-talenta/:id", SK_Talenta.findById);
router.put(
	"/pegawai/:nip/sk-talenta/:id",
	upload.single("file_sk_talenta"),
	SK_Talenta.update
);
router.delete("/pegawai/:nip/sk-talenta/:id", SK_Talenta.delete);

// Route SK PHDP
router.post(
	"/pegawai/:nip/sk-phdp",
	upload.single("file_sk_phdp"),
	SK_PHDP.add
);
router.get("/pegawai/:nip/sk-phdp", SK_PHDP.findAll);
router.get("/pegawai/:nip/sk-phdp/:id", SK_PHDP.findById);
router.put(
	"/pegawai/:nip/sk-phdp/:id",
	upload.single("file_sk_phdp"),
	SK_PHDP.update
);
router.delete("/pegawai/:nip/sk-phdp/:id", SK_PHDP.delete);

// Route Diklat
router.post("/pegawai/:nip/diklat", upload.single("file_diklat"), Diklat.add);
router.get("/pegawai/:nip/diklat", Diklat.findAll);
router.get("/pegawai/:nip/diklat/:id", Diklat.findById);
router.put(
	"/pegawai/:nip/diklat/:id",
	upload.single("file_diklat"),
	Diklat.update
);
router.delete("/pegawai/:nip/diklat/:id", Diklat.delete);

// Route Hukuman
router.post(
	"/pegawai/:nip/hukuman",
	upload.single("file_hukuman"),
	Hukuman.add
);
router.get("/pegawai/:nip/hukuman", Hukuman.findAll);
router.get("/pegawai/:nip/hukuman/:id", Hukuman.findById);
router.put(
	"/pegawai/:nip/hukuman/:id",
	upload.single("file_hukuman"),
	Hukuman.update
);
router.delete("/pegawai/:nip/hukuman/:id", Hukuman.delete);

module.exports = router;
