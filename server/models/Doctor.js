const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true, lowercase: true },
  specialization: { type: String, required: true, trim: true },
  experience: { type: Number, default: 0 },
  qualification: { type: String, trim: true },
  hospital: { type: String, trim: true },
  consultationFee: { type: Number, default: 0 },
  availability: [
    {
      date: { type: Date },
      slots: [{ type: String }],
    },
  ],
  approved: { type: Boolean, default: false },
  profileImage: { type: String, default: '' },
  phone: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Doctor', doctorSchema);
