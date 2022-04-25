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
							pegawai.folderId.diklat
					  )
					: "-";

			const newData = {
				filename: req.body.filename,
				keterangan: req.body.keterangan,
				fileId: file.id || file,
				folderId: pegawai.folderId.diklat,
			};
			await Pegawai.findOneAndUpdate({ nip }, { $push: { diklat: newData } });
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
				content: results.diklat,
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
				diklat: { $elemMatch: { _id: id } },
			});
			return res.ok({
				success: true,
				message: "Berhasil Mendapatkan Data",
				content: results.diklat,
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
			const diklat = data.diklat.filter((j) => j._id == id);

			if (diklat[0].fileId !== "-") {
				if (req.file !== undefined) {
					await deleteFile(diklat[0].fileId);
				}
			}

			const fileDiklat =
				req.file !== undefined
					? await uploadFile(
							req.file,
							`${req.body.filename} - ${data.nama_lengkap}`,
							data.folderId.diklat
					  )
					: diklat[0].fileId;

			const updateData = {
				filename: req.body.filename,
				keterangan: req.body.keterangan,
				fileId: fileDiklat.id || fileDiklat,
			};

			await Pegawai.updateOne(
				{ nip, "diklat._id": id },
				{
					$set: {
						"diklat.$.filename": updateData.filename,
						"diklat.$.keterangan": updateData.keterangan,
						"diklat.$.fileId": updateData.fileId,
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
				diklat: { $elemMatch: { _id: id } },
			});

			if (data.diklat[0].fileId !== "-") {
				await deleteFile(data.diklat[0].fileId);
			}

			await Pegawai.updateOne(
				{ nip, "diklat._id": id },
				{
					$pull: { diklat: { _id: id } },
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
