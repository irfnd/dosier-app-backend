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
							pegawai.folderId.data_keluarga
					  )
					: "-";

			const newData = {
				filename: req.body.filename,
				keterangan: req.body.keterangan,
				fileId: file.id || file,
				folderId: pegawai.folderId.data_keluarga,
			};
			await Pegawai.findOneAndUpdate(
				{ nip },
				{ $push: { data_keluarga: newData } }
			);
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
				content: results.data_keluarga,
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
				data_keluarga: { $elemMatch: { _id: id } },
			});
			return res.ok({
				success: true,
				message: "Berhasil Mendapatkan Data",
				content: results.data_keluarga,
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
			const data_keluarga = data.data_keluarga.filter((j) => j._id == id);

			if (data_keluarga[0].fileId !== "-") {
				if (req.file !== undefined) {
					await deleteFile(data_keluarga[0].fileId);
				}
			}

			const fileDataKeluarga =
				req.file !== undefined
					? await uploadFile(
							req.file,
							`${req.body.filename} - ${data.nama_lengkap}`,
							data.folderId.data_keluarga
					  )
					: data_keluarga[0].fileId;

			const updateData = {
				filename: req.body.filename,
				keterangan: req.body.keterangan,
				fileId: fileDataKeluarga.id || fileDataKeluarga,
			};

			await Pegawai.updateOne(
				{ nip, "data_keluarga._id": id },
				{
					$set: {
						"data_keluarga.$.filename": updateData.filename,
						"data_keluarga.$.keterangan": updateData.keterangan,
						"data_keluarga.$.fileId": updateData.fileId,
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
				data_keluarga: { $elemMatch: { _id: id } },
			});
			if (data.data_keluarga[0].fileId !== "-") {
				await deleteFile(data.data_keluarga[0].fileId);
			}

			await Pegawai.updateOne(
				{ nip, "data_keluarga._id": id },
				{
					$pull: { data_keluarga: { _id: id } },
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
