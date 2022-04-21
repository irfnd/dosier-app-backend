const { uploadFile, deleteFile } = require("../service/google-api/googleapi");
const Pegawai = require("../models/Pegawai");

module.exports = {
  add: async (req, res) => {
    const { nip } = req.params;

    try {
      const pegawai = await Pegawai.findOne({ nip });
      const fileSKTalenta = await uploadFile(
        req.file,
        `${req.body.filename} - ${pegawai.nama_lengkap}`,
        pegawai.folderId.sk_talenta
      );

      const newData = {
        filename: req.body.filename,
        keterangan: req.body.keterangan,
        fileId: fileSKTalenta.id,
        folderId: pegawai.folderId.sk_talenta,
      };

      await Pegawai.findOneAndUpdate(
        { nip },
        { $push: { sk_talenta: newData } }
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
        content: results.sk_talenta,
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
      const results = await Pegawai.findOne({ nip, "sk_talenta._id": id });
      return res.ok({
        success: true,
        message: "Berhasil Mendapatkan Data",
        content: results.sk_talenta[0],
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
      const pegawai = await Pegawai.findOne({ nip, "sk_talenta._id": id });
      if (req.file != undefined) await deleteFile(pegawai.sk_talenta[0].fileId);
      const fileSKTalenta =
        req.file != undefined
          ? await uploadFile(
              req.file,
              `${req.body.filename} - ${pegawai.nama_lengkap}`,
              pegawai.folderId.sk_talenta
            )
          : "-";

      const updateData = {
        filename: req.body.filename,
        keterangan: req.body.keterangan,
        fileId: fileSKTalenta.id || pegawai.sk_talenta[0].fileId,
      };

      await Pegawai.updateOne(
        { nip, "sk_talenta._id": id },
        {
          $set: {
            "sk_talenta.$.filename": updateData.filename,
            "sk_talenta.$.keterangan": updateData.keterangan,
            "sk_talenta.$.fileId": updateData.fileId,
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
      const pegawai = await Pegawai.findOne({ nip, "sk_talenta._id": id });
      await deleteFile(pegawai.sk_talenta[0].fileId);

      await Pegawai.updateOne(
        { nip, "sk_talenta._id": id },
        {
          $pull: { sk_talenta: { _id: id } },
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
