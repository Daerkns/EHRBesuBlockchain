# API Gateway for EHR Blockchain

This API Gateway serves as the intermediary between the frontend applications (Patient Portal and Doctor Dashboard) and the Hyperledger Besu blockchain network. It handles incoming requests, processes them, and communicates with the blockchain and IPFS for data storage and retrieval.

## Features

- **Middleware Integration**: Implements middleware for authentication and request validation.
- **Blockchain Interaction**: Provides services to interact with the Hyperledger Besu network for managing electronic health records.
- **IPFS Integration**: Facilitates storage of larger medical files on IPFS, ensuring that only hashes are stored on the blockchain.
- **Routing**: Defines routes for various API endpoints to handle requests from the frontend applications.

## Directory Structure

- **src/controllers**: Contains controller files that manage the logic for handling requests and responses.
- **src/middleware**: Includes middleware functions, such as authentication and error handling.
- **src/routes**: Defines the API endpoints and associates them with the appropriate controller functions.
- **src/services**: Contains service files for interacting with the blockchain and IPFS.
- **src/app.js**: The main entry point for the API gateway, setting up middleware and routes.

## Getting Started

1. **Install Dependencies**: Run `npm install` to install the required packages.
2. **Start the Server**: Use `npm start` to launch the API gateway.
3. **API Documentation**: Refer to the individual route files for details on available endpoints and their usage.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.