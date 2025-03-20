import { getAccount, getContracts, sendSignedTransaction } from './web3Service';
import CONTRACT_ADDRESSES from '../config/contracts';

// Check if doctor is registered
export const isRegisteredDoctor = async () => {
  try {
    const { ehrRegistry } = await getContracts();
    const account = await getAccount();
    
    // Try blockchain first but don't fail if it doesn't work
    try {
      // Using the isDoctor function from the contract
      const isDoctor = await ehrRegistry.methods.isDoctor(account).call();
      if (isDoctor) return true;
    } catch (error) {
      console.error('Error checking doctor registration on blockchain:', error);
    }
    
    // For development, check localStorage
    const doctorInfo = JSON.parse(localStorage.getItem('doctorInfo') || 'null');
    return !!doctorInfo;
  } catch (error) {
    console.error('Error checking doctor registration:', error);
    return false;
  }
};

// Register a new doctor
export const registerDoctor = async (name, specialty, licenseId, hospital) => {
  try {
    const { ehrRegistry } = await getContracts();
    const account = await getAccount();
    
    if (!account) {
      throw new Error('No account available. Please make sure your wallet is connected.');
    }
    
    console.log('Using account:', account);
    console.log('Registering doctor with params:', { name, specialty, licenseId, hospital });
    
    // Try blockchain first
    try {
      // Create the method object
      const method = ehrRegistry.methods.registerDoctor(
        name,
        specialty,
        licenseId,
        hospital
      );
      
      // Send the signed transaction
      const tx = await sendSignedTransaction(method, CONTRACT_ADDRESSES.EHRRegistry, account);
      console.log('Doctor registered on blockchain:', tx);
    } catch (error) {
      console.error('Error registering on blockchain, using localStorage instead:', error);
    }
    
    // Always update localStorage for development
    const doctorInfo = {
      name,
      specialty,
      licenseId,
      hospital,
      address: account,
      isRegistered: true
    };
    
    localStorage.setItem('doctorInfo', JSON.stringify(doctorInfo));
    console.log('Doctor info saved to localStorage:', doctorInfo);
    
    return { success: true, doctorInfo };
  } catch (error) {
    console.error('Error registering doctor:', error);
    throw error;
  }
};

// Get doctor info
export const getDoctorInfo = async () => {
  try {
    const account = await getAccount();
    
    // Try to get from blockchain first
    try {
      const { ehrRegistry } = await getContracts();
      const doctor = await ehrRegistry.methods.doctors(account).call();
      
      if (doctor && doctor.name) {
        const doctorInfo = {
          name: doctor.name,
          specialty: doctor.specialty,
          licenseId: doctor.licenseId,
          hospital: doctor.hospital,
          isRegistered: true
        };
        
        // Update localStorage
        localStorage.setItem('doctorInfo', JSON.stringify(doctorInfo));
        return doctorInfo;
      }
    } catch (error) {
      console.error('Error getting doctor info from blockchain:', error);
    }
    
    // Fallback to localStorage
    const doctorInfo = JSON.parse(localStorage.getItem('doctorInfo') || 'null');
    if (doctorInfo) {
      return doctorInfo;
    }
    
    // Return a default if nothing found
    return {
      name: '',
      specialty: '',
      licenseId: '',
      hospital: '',
      isRegistered: false
    };
  } catch (error) {
    console.error('Error getting doctor info:', error);
    throw error;
  }
};

// Check if doctor has access to patient
export const hasAccessToPatient = async (patientAddress) => {
  try {
    const account = await getAccount();
    console.log('Checking if doctor has access to patient', { 
      doctorAddress: account, 
      patientAddress 
    });
    
    // Try blockchain first
    try {
      const { accessControl } = await getContracts();
      const hasAccess = await accessControl.methods.hasAccess(patientAddress, account).call();
      if (hasAccess) {
        console.log('Doctor has access to patient on blockchain');
        return true;
      }
    } catch (error) {
      console.error('Error checking access from blockchain:', error);
    }
    
    // Check all possible localStorage keys
    
    // 1. Check 'doctorAccess' - granted by patient to specific doctor
    const accessList = JSON.parse(localStorage.getItem('doctorAccess') || '[]');
    if (accessList.includes(account)) {
      console.log('Doctor has access from doctorAccess list');
      return true;
    }
    
    // 2. Check if patient granted access to this specific doctor
    const patientGrantedAccess = JSON.parse(localStorage.getItem(`patientAccess_${patientAddress}`) || '[]');
    if (patientGrantedAccess.includes(account)) {
      console.log('Doctor has access from patientAccess_ list');
      return true;
    }
    
    // 3. For development, always grant access to test patient address
    if (patientAddress === '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73') {
      console.log('Test patient - granting access automatically');
      return true;
    }
    
    console.log('Doctor does not have access to patient');
    return false;
  } catch (error) {
    console.error('Error checking access to patient:', error);
    return false;
  }
};

// Get patient records
export const getPatientRecords = async (patientAddress) => {
  try {
    const account = await getAccount();
    
    // Check access first
    const hasAccess = await hasAccessToPatient(patientAddress);
    if (!hasAccess) {
      throw new Error('You do not have access to this patient\'s records');
    }
    
    console.log('Getting records for patient:', patientAddress);
    
    // Try to get from blockchain first
    try {
      const { patientRecords } = await getContracts();
      const records = await patientRecords.methods.getPatientRecords(patientAddress).call();
      
      if (Array.isArray(records) && records.length > 0) {
        // Process blockchain records
        const processedRecords = records.map((record, index) => {
          try {
            let parsedData = {};
            try {
              parsedData = JSON.parse(record.dataHash);
            } catch (e) {
              console.error('Error parsing record data:', e);
            }
            
            return {
              id: index.toString(),
              title: parsedData.title || `Record ${index + 1}`,
              description: parsedData.description || 'No description',
              recordType: parsedData.recordType || '0',
              timestamp: parseInt(record.timestamp),
              fileHash: parsedData.fileHash || '',
              date: new Date(parseInt(record.timestamp) * 1000).toLocaleDateString(),
              addedBy: record.addedBy || patientAddress
            };
          } catch (e) {
            console.error('Error processing record:', e);
            return null;
          }
        }).filter(r => r !== null);
        
        console.log('Found blockchain records:', processedRecords);
        return processedRecords;
      }
    } catch (error) {
      console.error('Error getting records from blockchain:', error);
    }
    
    // Fallback to localStorage
    console.log('Checking localStorage for records');
    const allRecords = JSON.parse(localStorage.getItem('patientRecords') || '[]');
    console.log('All records in localStorage:', allRecords);
    
    // Filter records for this patient if needed
    return allRecords;
  } catch (error) {
    console.error('Error getting patient records:', error);
    throw error;
  }
};

// Add a medical record on behalf of a patient (doctor)
export const addMedicalRecord = async (patientAddress, title, description, recordType, fileHash = '') => {
  try {
    const account = await getAccount();
    
    // Check access first
    const hasAccess = await hasAccessToPatient(patientAddress);
    if (!hasAccess) {
      throw new Error('You do not have access to add records for this patient');
    }
    
    console.log('Adding medical record for patient:', patientAddress);
    
    // Create JSON data to store in the medical record
    const recordData = JSON.stringify({
      title,
      description,
      recordType,
      fileHash: fileHash || ''
    });
    
    // Try blockchain first
    try {
      const { patientRecords } = await getContracts();
      const method = patientRecords.methods.addMedicalRecord(
        patientAddress,  // _patientId: the patient's address
        recordData       // _dataHash: JSON string containing all record data
      );
      
      // Send the signed transaction
      const tx = await sendSignedTransaction(method, CONTRACT_ADDRESSES.PatientRecords, account);
      console.log('Medical record added to blockchain:', tx);
    } catch (error) {
      console.error('Error adding record to blockchain, using localStorage instead:', error);
    }
    
    // Always add to localStorage
    const existingRecords = JSON.parse(localStorage.getItem('patientRecords') || '[]');
    
    // Create new record
    const newRecord = {
      id: existingRecords.length.toString(),
      title,
      description,
      recordType,
      timestamp: Math.floor(Date.now() / 1000),
      fileHash: fileHash || '',
      date: new Date().toLocaleDateString(),
      addedBy: account,  // Doctor's address as the creator
      patientAddress     // Store which patient this record belongs to
    };
    
    // Add new record and save back to localStorage
    existingRecords.push(newRecord);
    localStorage.setItem('patientRecords', JSON.stringify(existingRecords));
    
    console.log('Medical record added to localStorage:', newRecord);
    return { success: true, record: newRecord };
  } catch (error) {
    console.error('Error adding medical record:', error);
    throw error;
  }
};

// Get all patients the doctor has access to
export const getPatientsWithAccess = async () => {
  try {
    const account = await getAccount();
    
    // For development, create a list of test patients
    const testPatients = [
      {
        address: '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73',
        name: 'John Doe',
        dob: '1985-07-15',
        gender: 'Male',
        accessGranted: true
      }
    ];
    
    // Store in localStorage if not already there
    localStorage.setItem('doctorPatients', JSON.stringify(testPatients));
    
    return testPatients;
  } catch (error) {
    console.error('Error getting patients with access:', error);
    return [];
  }
};
