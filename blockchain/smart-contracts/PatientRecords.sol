// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AccessControl.sol";

contract PatientRecords {
    AccessControl public accessControl;
    
    struct MedicalRecord {
        string dataHash;  // IPFS hash
        uint256 timestamp;
        address addedBy;
    }
    
    // Mapping of patient => array of medical records
    mapping(address => MedicalRecord[]) public records;
    
    // Events
    event RecordAdded(address indexed patient, string dataHash, address addedBy);
    
    constructor(address _accessControlAddress) {
        accessControl = AccessControl(_accessControlAddress);
    }
    
    // Add a new medical record
    function addMedicalRecord(address _patientId, string memory _dataHash) 
        public {
        // Check if sender is the patient or has access permission
        require(
            msg.sender == _patientId || 
            accessControl.hasAccess(_patientId, msg.sender),
            "Not authorized to add records"
        );
        
        records[_patientId].push(MedicalRecord({
            dataHash: _dataHash,
            timestamp: block.timestamp,
            addedBy: msg.sender
        }));
        
        emit RecordAdded(_patientId, _dataHash, msg.sender);
    }
    
    // Get all medical records for a patient
    function getPatientRecords(address _patientId) 
        public view 
        returns (MedicalRecord[] memory) {
        // Check if sender is the patient or has access permission
        require(
            msg.sender == _patientId || 
            accessControl.hasAccess(_patientId, msg.sender),
            "Not authorized to view records"
        );
        
        return records[_patientId];
    }
}
