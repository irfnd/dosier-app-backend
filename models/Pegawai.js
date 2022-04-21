const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { JabatanSchema } = require("./Jabatan");
const { DataKeluargaSchema } = require("./DataKeluarga");
const { SK_MasukSchema } = require("./SK_Masuk");
const { SK_TalentaSchema } = require("./SK_Talenta");
const { SK_PHDPSchema } = require("./SK_PHDP");
const { DiklatSchema } = require("./Diklat");
const { HukumanSchema } = require("./Hukuman");

const PegawaiSchema = new Schema({
  nip: { type: String, required: true, unique: true },
  nama_lengkap: { type: String, required: true },
  kelamin: { type: String, default: "-" },
  tgl_lahir: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  kontak: { type: String, required: true, unique: true },
  isPensiun: { type: Boolean, default: false },
  isMenikah: { type: Boolean, default: false },
  thn_masuk: { type: Number, required: true },
  fotoId: { type: String, default: "-" },
  folderId: {
    pegawai: String,
    foto: String,
    jabatan: String,
    data_keluarga: String,
    sk_masuk: String,
    sk_talenta: String,
    sk_phdp: String,
    diklat: String,
    hukuman: String,
  },
  jabatan: [JabatanSchema],
  data_keluarga: [DataKeluargaSchema],
  sk_masuk: [SK_MasukSchema],
  sk_talenta: [SK_TalentaSchema],
  sk_phdp: [SK_PHDPSchema],
  diklat: [DiklatSchema],
  hukuman: [HukumanSchema],
});

PegawaiSchema.plugin(mongoosePaginate);
module.exports = model("pegawai", PegawaiSchema);
