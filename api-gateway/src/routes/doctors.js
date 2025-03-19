const express = require('express');
const router = express.Router();
const { grantAccess, revokeAccess } = require('../services/blockchain');
const authMiddleware = require('../middleware/auth');

// Grant access to doctor
router.post('/grant-access', authMiddleware, async (req, res) => {
    try {
        const { patientId, doctorId } = req.body;
        await grantAccess(patientId, doctorId);
        res.json({ success: true, message: 'Access granted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Revoke access from doctor
router.post('/revoke-access', authMiddleware, async (req, res) => {
    try {
        const { patientId, doctorId } = req.body;
        await revokeAccess(patientId, doctorId);
        res.json({ success: true, message: 'Access revoked successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
