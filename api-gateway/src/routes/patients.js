const express = require('express');
const router = express.Router();
const { registerPatient, getPatientRecords } = require('../services/blockchain');
const { addFile, getFile } = require('../services/ipfs');
const authMiddleware = require('../middleware/auth');

// Get patient records
router.get('/:patientId/records', authMiddleware, async (req, res) => {
    try {
        const { patientId } = req.params;
        const records = await getPatientRecords(patientId);
        res.json({ success: true, records });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Register a new patient
router.post('/register', authMiddleware, async (req, res) => {
    try {
        const { name, dateOfBirth } = req.body;
        const result = await registerPatient(name, dateOfBirth);
        res.json({ success: true, patientId: result.events.PatientRegistered.returnValues.id });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Upload medical record
router.post('/:patientId/upload', authMiddleware, async (req, res) => {
    try {
        const { patientId } = req.params;
        const { file, description } = req.body;
        
        // Upload to IPFS and get CID
        const cid = await addFile(file);
        
        // Store CID on blockchain
        const result = await addMedicalRecord(patientId, JSON.stringify({
            description,
            cid,
            timestamp: Date.now()
        }));
        
        res.json({ success: true, cid });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
