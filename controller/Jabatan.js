const { uploadFile, deleteFile } = require("../service/google-api/googleapi");
const Pegawai = require("../models/Pegawai");

module.exports = {
	add: async (req, res) => {
		const { nip } = req.params;
		try {
			const pegawai = await Pegawai.findOne({ nip });
			let filename;

			if (req.file !== undefined) {
				if (req.body.filename !== "") {
					filename = req.body.filename;
				} else {
					filename = "Dokumen Jabatan";
				}
			} else {
				if (req.body.filename !== "") {
					filename = req.body.filename;
				} else {
					filename = "Dokumen Jabatan";
				}
			}

			const file =
				req.file !== undefined
					? await uploadFile(
							req.file,
							`${filename} - ${req.body.jabatan} - ${pegawai.nama_lengkap}`,
							pegawai.folderId.jabatan
					  )
					: "-";

			const newData = {
				jabatan: req.body.jabatan,
				divisi: req.body.divisi,
				aktif: req.body.aktif,
				periode: req.body.periode,
				filename: filename,
				keterangan: req.body.keterangan,
				fileId: file.id || file,
				folderId: pegawai.folderId.jabatan,
			};
			await Pegawai.findOneAndUpdate({ nip }, { $push: { jabatan: newData } });
			return res.created({
				success: true,
				message: "Berhasil Menambahkan Data",
				content: newData,
			});
		} catch (err) {
			return res.error({
				success: false,
				message: "Gagal Menambahkan Data",
				content: err,
			});
		}
	},

	findAll: async (req, res) => {
		const { nip } = req.params;
		try {
			const results = await Pegawai.findOne({ nip });
			return res.ok({
				success: true,
				message: "Berhasil Mendapatkan Data",
				content: results.jabatan,
			});
		} catch (err) {
			return res.error({
				success: false,
				message: "Gagal Mendapatkan Data",
				content: err,
			});
		}
	},

	findById: async (req, res) => {
		const { nip, id } = req.params;
		try {
			const results = await Pegawai.findOne({ nip }).select({
				jabatan: { $elemMatch: { _id: id } },
			});
			return res.ok({
				success: true,
				message: "Berhasil Mendapatkan Data",
				content: results.jabatan,
			});
		} catch (err) {
			return res.error({
				success: false,
				message: "Gagal Mendapatkan Data",
				content: err,
			});
		}
	},

	update: async (req, res) => {
		const { nip, id } = req.params;
		try {
			const data = await Pegawai.findOne({ nip });
			const jabatan = data.jabatan.filter((j) => j._id == id);
			let filename;

			if (req.file !== undefined) {
				if (req.body.filename !== "") {
					filename = req.body.filename;
				} else {
					filename = "Dokumen Jabatan";
				}
			} else {
				if (req.body.filename !== "") {
					filename = req.body.filename;
				} else {
					filename = "Dokumen Jabatan";
				}
			}

			if (jabatan[0].fileId !== "-") {
				if (req.file !== undefined) {
					await deleteFile(jabatan[0].fileId);
				}
			}

			const fileJabatan =
				req.file !== undefined
					? await uploadFile(
							req.file,
							`${filename} - ${req.body.jabatan} - ${data.nama_lengkap}`,
							data.folderId.jabatan
					  )
					: jabatan[0].fileId;

			const updateData = {
				jabatan: req.body.jabatan,
				divisi: req.body.divisi,
				aktif: req.body.aktif,
				periode: req.body.periode,
				filename: filename,
				keterangan: req.body.keterangan,
				fileId: fileJabatan.id || fileJabatan,
			};

			await Pegawai.updateOne(
				{ nip, "jabatan._id": id },
				{
					$set: {
						"jabatan.$.jabatan": updateData.jabatan,
						"jabatan.$.divisi": updateData.divisi,
						"jabatan.$.aktif": updateData.aktif,
						"jabatan.$.periode": updateData.periode,
						"jabatan.$.filename": updateData.filename,
						"jabatan.$.keterangan": updateData.keterangan,
						"jabatan.$.fileId": updateData.fileId,
					},
				}
			);
			return res.ok({
				success: true,
				message: "Berhasil Memperbarui Data",
				content: updateData,
			});
		} catch (err) {
			return res.error({
				success: false,
				message: "Gagal Memperbarui Data",
				content: err,
			});
		}
	},

	delete: async (req, res) => {
		const { nip, id } = req.params;
		try {
			const data = await Pegawai.findOne({ nip }).select({
				jabatan: { $elemMatch: { _id: id } },
			});
			if (data.jabatan[0].fileId !== "-") {
				await deleteFile(data.jabatan[0].fileId);
			}

			await Pegawai.updateOne(
				{ nip, "jabatan._id": id },
				{
					$pull: { jabatan: { _id: id } },
				}
			);
			return res.ok({
				status: true,
				message: "Berhasil Menghapus Data",
				content: id,
			});
		} catch (err) {
			return res.error({
				success: false,
				message: "Gagal Menghapus Data",
				content: err,
			});
		}
	},
};
