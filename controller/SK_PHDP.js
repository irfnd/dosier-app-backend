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
							pegawai.folderId.sk_phdp
					  )
					: "-";

			const newData = {
				filename: req.body.filename,
				keterangan: req.body.keterangan,
				fileId: file.id || file,
				folderId: pegawai.folderId.sk_phdp,
			};

			await Pegawai.findOneAndUpdate({ nip }, { $push: { sk_phdp: newData } });
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
				content: results.sk_phdp,
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
				sk_phdp: { $elemMatch: { _id: id } },
			});
			return res.ok({
				success: true,
				message: "Berhasil Mendapatkan Data",
				content: results.sk_phdp,
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
			const sk_phdp = data.sk_phdp.filter((j) => j._id == id);

			if (sk_phdp[0].fileId !== "-") {
				if (req.file !== undefined) {
					await deleteFile(sk_phdp[0].fileId);
				}
			}

			const fileSKPHDP =
				req.file !== undefined
					? await uploadFile(
							req.file,
							`${req.body.filename} - ${data.nama_lengkap}`,
							data.folderId.sk_phdp
					  )
					: sk_phdp[0].fileId;

			const updateData = {
				filename: req.body.filename,
				keterangan: req.body.keterangan,
				fileId: fileSKPHDP.id || fileSKPHDP,
			};

			await Pegawai.updateOne(
				{ nip, "sk_phdp._id": id },
				{
					$set: {
						"sk_phdp.$.filename": updateData.filename,
						"sk_phdp.$.keterangan": updateData.keterangan,
						"sk_phdp.$.fileId": updateData.fileId,
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
				sk_phdp: { $elemMatch: { _id: id } },
			});
			if (data.sk_phdp[0].fileId !== "-") {
				await deleteFile(data.sk_phdp[0].fileId);
			}

			await Pegawai.updateOne(
				{ nip, "sk_phdp._id": id },
				{
					$pull: { sk_phdp: { _id: id } },
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
