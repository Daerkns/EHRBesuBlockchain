const fs = require('fs');
const path = require('path');

const contractsDir = path.join(__dirname, '../build/contracts');

// List JSON files in the directory
try {
  const files = fs.readdirSync(contractsDir).filter(file => file.endsWith('.json'));
  
  console.log(`Found ${files.length} contract files in ${contractsDir}:`);
  console.log(files);
  
  // Validate each file
  files.forEach(file => {
    try {
      const filePath = path.join(contractsDir, file);
      const rawData = fs.readFileSync(filePath, 'utf8');
      const contractData = JSON.parse(rawData);
      
      console.log(`\n${file}:`);
      console.log(`- Contract name: ${contractData.contractName}`);
      console.log(`- Has ABI: ${contractData.abi ? 'Yes' : 'No'}`);
      if (contractData.abi) {
        console.log(`- ABI items: ${contractData.abi.length}`);
        
        // Count functions
        const functions = contractData.abi.filter(item => item.type === 'function');
        console.log(`- Functions: ${functions.length}`);
        
        if (functions.length > 0) {
          console.log('- Function names:');
          functions.forEach(func => {
            console.log(`  * ${func.name}`);
          });
        }
      }
    } catch (err) {
      console.error(`Error parsing ${file}: ${err.message}`);
    }
  });
} catch (err) {
  console.error(`Error reading contracts directory: ${err.message}`);
}
