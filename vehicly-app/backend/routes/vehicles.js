const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { auth, admin } = require('../middleware/auth');

// Get all vehicles (public)
router.get('/', async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const vehicles = await Vehicle.find(filter);
  res.json(vehicles);
});

// Admin CRUD
router.post('/', auth, admin, async (req, res) => {
  const vehicle = new Vehicle({ ...req.body, createdBy: req.user.id });
  await vehicle.save();
  res.json(vehicle);
});

router.put('/:id', auth, admin, async (req, res) => {
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(vehicle);
});

router.delete('/:id', auth, admin, async (req, res) => {
  await Vehicle.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Deleted' });
});

module.exports = router;