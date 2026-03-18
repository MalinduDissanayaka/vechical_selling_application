const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  title: String,
  category: { type: String, enum: ['car', 'van', 'bus', 'lorry'] },
  make: String,
  model: String,
  year: Number,
  price: Number,
  image: String,           // URL (you can use cloudinary later)
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Vehicle', VehicleSchema);