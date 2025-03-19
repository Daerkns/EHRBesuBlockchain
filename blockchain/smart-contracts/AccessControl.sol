// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./EHRRegistry.sol";

contract AccessControl {
    EHRRegistry public ehrRegistry;
    
    // Mapping of patient => doctor => access permission
    mapping(address => mapping(address => bool)) public accessPermissions;
    
    // Events
    event AccessGranted(address indexed patient, address indexed doctor);
    event AccessRevoked(address indexed patient, address indexed doctor);
    
    constructor(address _ehrRegistryAddress) {
        ehrRegistry = EHRRegistry(_ehrRegistryAddress);
    }
    
    // Grant access to a doctor
    function grantAccess(address _doctorId) public {
        require(ehrRegistry.isPatient(msg.sender), "Only patients can grant access");
        require(ehrRegistry.isDoctor(_doctorId), "Doctor not registered");
        
        accessPermissions[msg.sender][_doctorId] = true;
        emit AccessGranted(msg.sender, _doctorId);
    }
    
    // Revoke access from a doctor
    function revokeAccess(address _doctorId) public {
        require(ehrRegistry.isPatient(msg.sender), "Only patients can revoke access");
        
        accessPermissions[msg.sender][_doctorId] = false;
        emit AccessRevoked(msg.sender, _doctorId);
    }
    
    // Check if a doctor has access to a patient's records
    function hasAccess(address _patientId, address _doctorId) public view returns (bool) {
        return accessPermissions[_patientId][_doctorId];
    }
}
