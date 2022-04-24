const { uploadFile, deleteFile } = require("../service/google-api/googleapi");
const Pegawai = require("../models/Pegawai");

module.exports = {
	add: async (req, res) => {
		const { nip } = req.params;
		try {
			const pegawai = await Pegawai.findOne({ nip });
			const file =
				req.file !== undefined
					? await uploadFile(
							req.file,
							`${req.body.filename} - ${pegawai.nama_lengkap}`,
							pegawai.folderId.jabatan
					  )
					: "-";

			const newData = {
				jabatan: req.body.jabatan,
				divisi: req.body.divisi,
				aktif: req.body.aktif,
				periode: req.body.periode,
				filename: req.body.filename,
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
			const results = await Pegawai.findOne({ nip, "jabatan._id": id });
			return res.ok({
				success: true,
				message: "Berhasil Mendapatkan Data",
				content: results.jabatan.filter((el) => el._id == id),
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
			const data = await Pegawai.findOne({ nip, "jabatan._id": id });

			if (data.jabatan[0].fileId !== "-") {
				await deleteFile(data.jabatan[0].fileId);
			}

			const fileJabatan =
				req.file !== undefined
					? await uploadFile(
							req.file,
							`${req.filename} - ${data.nama_lengkap}`,
							data.folderId.jabatan
					  )
					: "-";

			const updateData = {
				jabatan: req.body.jabatan,
				divisi: req.body.divisi,
				aktif: req.body.aktif,
				periode: req.body.periode,
				filename: req.file === undefined ? fileJabatan : req.body.filename,
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
			const data = await Pegawai.findOne({ nip, "jabatan._id": id });
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
