const Pegawai = require("../models/Pegawai");

module.exports = {
  add: async (req, res) => {
    const { nip } = req.params;

    try {
      const pegawai = await Pegawai.findOne({ nip });
      const fileSKPHDP = await uploadFile(
        req.file,
        `${req.body.filename} - ${pegawai.nama_lengkap}`,
        pegawai.folderId.sk_phdp
      );

      const newData = {
        filename: req.body.filename,
        keterangan: req.body.keterangan,
        fileId: fileSKPHDP.id,
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
      const results = await Pegawai.findOne({ nip, "sk_phdp._id": id });
      return res.ok({
        success: true,
        message: "Berhasil Mendapatkan Data",
        content: results.sk_phdp[0],
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
      const pegawai = await Pegawai.findOne({ nip, "sk_phdp._id": id });
      if (req.file != undefined) await deleteFile(pegawai.sk_phdp[0].fileId);
      const fileSKPHDP =
        req.file != undefined
          ? await uploadFile(
              req.file,
              `${req.body.filename} - ${pegawai.nama_lengkap}`,
              pegawai.folderId.sk_phdp
            )
          : "-";

      const updateData = {
        filename: req.body.filename,
        keterangan: req.body.keterangan,
        fileId: fileJabatan.id || pegawai.jabatan[0].fileId,
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
      const pegawai = await Pegawai.findOne({ nip, "jabatan._id": id });
      await deleteFile(pegawai.sk_phdp[0].fileId);

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
