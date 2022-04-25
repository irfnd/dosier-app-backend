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
							pegawai.folderId.hukuman
					  )
					: "-";

			const newData = {
				filename: req.body.filename,
				keterangan: req.body.keterangan,
				fileId: file.id || file,
				folderId: pegawai.folderId.hukuman,
			};

			await Pegawai.findOneAndUpdate({ nip }, { $push: { hukuman: newData } });
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
				content: results.hukuman,
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
				hukuman: { $elemMatch: { _id: id } },
			});
			return res.ok({
				success: true,
				message: "Berhasil Mendapatkan Data",
				content: results.hukuman,
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
			const hukuman = data.hukuman.filter((j) => j._id == id);

			if (hukuman[0].fileId !== "-") {
				if (req.file !== undefined) {
					await deleteFile(hukuman[0].fileId);
				}
			}

			const fileHukuman =
				req.file !== undefined
					? await uploadFile(
							req.file,
							`${req.body.filename} - ${data.nama_lengkap}`,
							data.folderId.hukuman
					  )
					: hukuman[0].fileId;

			const updateData = {
				filename: req.body.filename,
				keterangan: req.body.keterangan,
				fileId: fileHukuman.id || fileHukuman,
			};
			await Pegawai.updateOne(
				{ nip, "hukuman._id": id },
				{
					$set: {
						"hukuman.$.filename": updateData.filename,
						"hukuman.$.keterangan": updateData.keterangan,
						"hukuman.$.fileId": updateData.fileId,
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
				hukuman: { $elemMatch: { _id: id } },
			});
			if (data.hukuman[0].fileId !== "-") {
				await deleteFile(data.hukuman[0].fileId);
			}

			await Pegawai.updateOne(
				{ nip, "hukuman._id": id },
				{
					$pull: { hukuman: { _id: id } },
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
