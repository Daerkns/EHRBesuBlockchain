const express = require('express');
const router = express.Router();
const patientRoutes = require('./patients');
const doctorRoutes = require('./doctors');

router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);

module.exports = router;
