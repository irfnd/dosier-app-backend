const { uploadFile, deleteFile } = require("../service/google-api/googleapi");
const Pegawai = require("../models/Pegawai");

module.exports = {
  add: async (req, res) => {
    const { nip } = req.params;

    try {
      const pegawai = await Pegawai.findOne({ nip });
      const fileDiklat = await uploadFile(
        req.file,
        `${req.body.filename} - ${pegawai.nama_lengkap}`,
        pegawai.folderId.diklat
      );
      const newData = {
        filename: req.body.filename,
        keterangan: req.body.keterangan,
        fileId: fileDiklat.id,
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
      const results = await Pegawai.findOne({ nip, "diklat._id": id });
      return res.ok({
        success: true,
        message: "Berhasil Mendapatkan Data",
        content: results.diklat[0],
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
      const pegawai = await Pegawai.findOne({ nip, "diklat._id": id });
      if (req.file != undefined) await deleteFile(pegawai.diklat[0].fileId);
      const fileDiklat =
        req.file != undefined
          ? await uploadFile(
              req.file,
              `${req.body.filename} - ${pegawai.nama_lengkap}`,
              pegawai.folderId.diklat
            )
          : "-";

      const updateData = {
        filename: req.body.filename,
        keterangan: req.body.keterangan,
        fileId: fileDiklat.id,
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
      const pegawai = await Pegawai.findOne({ nip, "diklat._id": id });
      await deleteFile(pegawai.diklat[0].fileId);
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
