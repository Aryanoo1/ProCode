# Online Coding Platform

An online coding platform that allows users to write, save, run, and store code in multiple programming languages. The platform also supports Google OAuth for user authentication.

## Features

- **Multi-language support**: Write and execute code in multiple programming languages.
- **User Authentication**: Google OAuth for secure login.
- **Code Saving & Retrieval**: Users can save and access their past codes.
- **Execution Environment**: Run code using JDoodle API.
- **MERN Stack**: Built with MongoDB, Express.js, React, and Node.js.

## Tech Stack

- **Frontend**: React, Redux, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: Google OAuth (Passport.js)
- **Code Execution**: JDoodle API

## Installation

### Prerequisites
- Node.js & npm
- MongoDB

### Steps to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Aryanoo1/ProCode.git
   cd ProCode
   ```

2. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add:
   ```env
   MONGO_URI=your_mongodb_uri
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   JWT_SECRET=your_jwt_secret
   JDOODLE_CLIENT_ID=your_jdoodle_client_id
   JDOODLE_CLIENT_SECRET=your_jdoodle_client_secret
   ```

4. Start the backend:
   ```bash
   npm run server
   ```

5. Start the frontend:
   ```bash
   cd client
   npm start
   ```

6. Open the app in your browser:
   ```
   http://localhost:3000
   ```

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a pull request
