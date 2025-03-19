// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EHRRegistry {
    struct Patient {
        string name;
        string dateOfBirth;
        bool exists;
    }
    
    struct Doctor {
        string name;
        string specialty;
        bool exists;
    }
    
    // Mappings to store patients and doctors
    mapping(address => Patient) public patients;
    mapping(address => Doctor) public doctors;
    
    // Events
    event PatientRegistered(address indexed id, string name);
    event DoctorRegistered(address indexed id, string name, string specialty);
    
    // Register a new patient
    function registerPatient(string memory _name, string memory _dateOfBirth) public {
        require(!patients[msg.sender].exists, "Patient already registered");
        
        patients[msg.sender] = Patient({
            name: _name,
            dateOfBirth: _dateOfBirth,
            exists: true
        });
        
        emit PatientRegistered(msg.sender, _name);
    }
    
    // Register a new doctor
    function registerDoctor(string memory _name, string memory _specialty) public {
        require(!doctors[msg.sender].exists, "Doctor already registered");
        
        doctors[msg.sender] = Doctor({
            name: _name,
            specialty: _specialty,
            exists: true
        });
        
        emit DoctorRegistered(msg.sender, _name, _specialty);
    }
    
    // Check if an address is a registered patient
    function isPatient(address _id) public view returns (bool) {
        return patients[_id].exists;
    }
    
    // Check if an address is a registered doctor
    function isDoctor(address _id) public view returns (bool) {
        return doctors[_id].exists;
    }
}
