# Authentication Service for EHR Blockchain

This directory contains the authentication service for the Electronic Health Record (EHR) blockchain project. The authentication service is responsible for managing user authentication and authorization for patients and doctors interacting with the system.

## Features

- **User Authentication**: Handles login and registration for patients and doctors.
- **Role-Based Access Control**: Implements role-based access control to ensure that users have the appropriate permissions to access resources.
- **Integration with OAuth/IAM**: Supports integration with OAuth or other Identity Access Management solutions for scalable access control.

## Directory Structure

- **src/controllers**: Contains controller files that handle authentication logic.
- **src/models**: Contains model files for user and role definitions.
- **src/app.js**: The main entry point for the authentication service, setting up middleware and routes.

## Getting Started

1. **Install Dependencies**: Run `npm install` to install the required dependencies.
2. **Configuration**: Update any necessary configuration settings in the `src/app.js` file.
3. **Run the Service**: Start the authentication service using `npm start`.

## API Endpoints

- **POST /api/auth/login**: Authenticates a user and returns a token.
- **POST /api/auth/register**: Registers a new user.
- **GET /api/auth/logout**: Logs out the user.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.