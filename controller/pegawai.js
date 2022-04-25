const {
	uploadFile,
	createFolder,
	folderPegawaiBaru,
	deleteFile,
} = require("../service/google-api/googleapi");
const Pegawai = require("../models/Pegawai");

const getPagination = (page, size) => {
	const limit = size ? +size : 6;
	const offset = page ? page * limit : 0;
	return { limit, offset };
};

module.exports = {
	create: async (req, res) => {
		try {
			const folderPegawai = await createFolder(
				`${req.body.nip} - ${req.body.nama_lengkap}`,
				process.env.FOLDER_ID
			);

			const folderId = await folderPegawaiBaru(folderPegawai.id);

			const foto =
				req.file != undefined
					? await uploadFile(
							req.file,
							`Foto Profil - ${req.body.nama_lengkap}`,
							folderId.foto
					  )
					: "-";

			const newData = new Pegawai({
				nip: req.body.nip,
				nama_lengkap: req.body.nama_lengkap,
				kelamin: req.body.kelamin,
				tgl_lahir: new Date(req.body.tgl_lahir),
				email: req.body.email,
				kontak: req.body.kontak,
				isPensiun: req.body.isPensiun,
				isMenikah: req.body.isMenikah,
				thn_masuk: req.body.thn_masuk,
				fotoId: foto.id || foto,
				folderId: {
					pegawai: folderPegawai.id,
					foto: folderId.foto,
					jabatan: folderId.jabatan,
					data_keluarga: folderId.data_keluarga,
					sk_masuk: folderId.sk_masuk,
					sk_talenta: folderId.sk_talenta,
					sk_phdp: folderId.sk_phdp,
					diklat: folderId.diklat,
					hukuman: folderId.hukuman,
				},
				jabatan: [],
				data_keluarga: [],
				sk_masuk: [],
				sk_talenta: [],
				sk_phdp: [],
				diklat: [],
				hukuman: [],
			});
			const pegawai = await newData.save();
			return res.created({
				success: true,
				message: "Berhasil Menambahkan Data",
				content: pegawai,
			});
		} catch (err) {
			res.error({
				success: false,
				message: "Gagal Menambahkan Data",
				content: err,
			});
		}
	},

	findAll: async (req, res) => {
		const { page, size, nip, nama } = req.query;
		let conditions = {};
		if (nip) {
			conditions.nip = { $regex: new RegExp(nip), $options: "i" };
		}

		if (nama) {
			conditions.nama_lengkap = { $regex: new RegExp(nama), $options: "i" };
		}

		const { limit, offset } = getPagination(page, size);
		try {
			const data = await Pegawai.paginate(conditions, { offset, limit });
			return res.ok({
				success: true,
				message: "Berhasil Mendapatkan Data",
				content: data.docs,
				totalItems: data.totalDocs,
				totalPages: data.totalPages,
				currentPage: data.page - 1,
			});
		} catch (err) {
			return res.notFound({
				success: false,
				message: "Gagal Mendapatkan Data",
				content: err,
			});
		}
	},

	findById: async (req, res) => {
		const { nip } = req.params;
		try {
			const results = await Pegawai.findOne({ nip });
			if (results === null) throw err;
			return res.ok({
				success: true,
				message: "Berhasil Mendapatkan Data",
				content: results,
			});
		} catch (err) {
			return res.notFound({
				success: false,
				message: "Gagal Mendapatkan Data",
				content: err,
			});
		}
	},

	update: async (req, res) => {
		const { nip } = req.params;
		try {
			const data = await Pegawai.findOne({ nip });

			if (data.fotoId !== "-") {
				if (req.file !== undefined) {
					await deleteFile(data.fotoId);
				}
			}

			const foto =
				req.file !== undefined
					? await uploadFile(
							req.file,
							`Foto Profil - ${req.body.nama_lengkap}`,
							data.folderId.foto
					  )
					: data.fotoId;

			const updateData = {
				nip: req.body.nip,
				nama_lengkap: req.body.nama_lengkap,
				kelamin: req.body.kelamin,
				tgl_lahir: new Date(req.body.tgl_lahir),
				email: req.body.email,
				kontak: req.body.kontak,
				isPensiun: req.body.isPensiun,
				isMenikah: req.body.isMenikah,
				thn_masuk: req.body.thn_masuk,
				fotoId: foto.id || foto,
			};

			await Pegawai.updateOne({ nip }, { $set: updateData });
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
		const { nip } = req.params;
		try {
			const data = await Pegawai.findOne({ nip });
			await deleteFile(data.folderId.pegawai);
			await Pegawai.findOneAndRemove(nip);
			return res.ok({
				status: true,
				message: "Berhasil Menghapus Data",
				content: nip,
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
