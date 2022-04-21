const { uploadFile, deleteFile } = require("../service/google-api/googleapi");
const Pegawai = require("../models/Pegawai");

module.exports = {
	add: async (req, res) => {
		const { nip } = req.params;
		try {
			const pegawai = await Pegawai.findOne({ nip });
			const folder = await createFolder("Data Keluarga", pegawai.folderId);
			const file = await uploadFile(
				req.file,
				`${req.body.filename} - ${pegawai.nama_lengkap}`,
				folder.id
			);
			const newData = {
				filename: req.body.filename,
				keterangan: req.body.keterangan,
				fileId: file.id,
				folderId: folder.id,
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

	findById: async (req, res) => {
		const { nip, id } = req.params;
		try {
			const results = await Pegawai.findOne({ nip, "data_keluarga._id": id });
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
			const pegawai = await Pegawai.findOne({ nip });
			const data = pegawai.data_keluarga.filter((d) => d._id == id)[0];
			await deleteFile(data.fileId);
			const file = await uploadFile(
				req.file,
				`${req.body.filename} - ${pegawai.nama_lengkap}`,
				data.folderId
			);
			const updateData = {
				filename: req.body.filename,
				keterangan: req.body.keterangan,
				fileId: file.id,
			};

			await Pegawai.updateOne(
				{ nip, "data_keluarga._id": id },
				{
					$set: {
						"data_keluarga.$.filename": updateData.filename,
						"data_keluarga.$.keterangan": updateData.keterangan,
						"data_keluarga.$.fileId": updateData.url_file,
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
			const results = await Pegawai.findOne({ nip, "data_keluarga._id": id });
			return res.ok({
				success: true,
				message: "Berhasil Mendapatkan Data",
				content: results.data_keluarga[0],
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
			const pegawai = await Pegawai.findOne({ nip, "data_keluarga._id": id });
			if (req.file != undefined)
				await deleteFile(pegawai.data_keluarga[0].fileId);
			const fileKeluarga =
				req.file != undefined
					? await uploadFile(
							req.file,
							`${req.body.filename} - ${pegawai.nama_lengkap}`,
							pegawai.folderId.data_keluarga
					  )
					: "-";

			const updateData = {
				filename: req.body.filename,
				keterangan: req.body.keterangan,
				fileId: fileKeluarga.id || pegawai.data_keluarga[0].fileId,
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
			const pegawai = await Pegawai.findOne({ nip, "data_keluarga._id": id });
			await deleteFile(pegawai.data_keluarga[0].fileId);

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
