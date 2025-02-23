**Node.js Blog API**

Overview

This is a Node.js-based blog API that allows users to register, log in, and manage their blog posts securely. The application follows a  clean architecture , ensuring scalability, security, and maintainability.

Features
- User Authentication & Authorization 
  - Secure user registration and login
  - Password hashing for security
  - JWT-based authentication

- Blog Management 
  - Create, edit, delete, and fetch blog posts
  - Authorization: Users can only modify their own posts
  - Input validation and error handling

- Security Implementations 
  - Passwords hashed using bcrypt
  - JWT for user authentication
  - Input validation to prevent malicious attacks

Technologies Used
- Backend: Node.js, Express.js
-  Database : MongoDB (Mongoose ORM)
-  Authentication : JWT (JSON Web Token)
-  Security : Bcrypt for password hashing, Input validation

  Folder Structure
```
📦 nodejs-blog-api
 ┣ 📂 config
 ┃┗ 📜 configKeys.js              Configuration keys from .env
 ┃ ┗ 📜 dbConnection.js           Database configuration
 ┣ 📂 controllers
 ┃ ┣ 📜 userController.js     Handles user operations
 ┃ ┗ 📜 blogController.js     Handles blog operations
 ┣ 📂 middleware
 ┃ ┗ 📜 auth.js            JWT authentication middleware
 ┃┗ 📜 errorHandler.js     Error Handling middleware
 ┣ 📂 models
 ┃ ┣ 📜 UserSchema.js         User schema
 ┃ ┗ 📜 BlogSchema.js         Blog schema
 ┣ 📂 routes
 ┃ ┣ 📜 user.js    Authentication routes
 ┃ ┗ 📜 blog.js    Blog management routes
 ┣ 📂 utils
 ┃ ┗ 📜 AppError.js      
 ❌ 📜 .env               No env file
 ┣ 📜 app.js          Entry point of the application
 ┗ 📜 package.json       Dependencies and scripts
```

  API Endpoints
  
   User Operations
-  POST  `/register` - Register a new user
-  POST  `/login`    - Log in an existing user
-  POST  '/logout'   - Logout 

   Blog Management
-  POST  `/create-blogs`       - Create a new blog (Authenticated users only)
-  GET  `/all-blogs`           - Get all blogs
-  GET  `/blogs/:id`           - Get a single blog by ID
-  GET  '/my-blogs'            - Get all blogs posted by the owner(Only the owner)
-  PUT  `/update-blog/:id`     - Edit a blog post (Only the owner)
-  DELETE  `/delete-blog/:id`  - Delete a blog post (Only the owner)

  Installation & Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nodejs-blog-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file based on `.env.example`
   - Add your MongoDB connection string and JWT secret
4. Start the application:
   ```bash
   npm start
   ```

  Security Considerations
- Passwords are securely hashed before storage.
- JWT tokens are used for authentication and authorization.
- Input validation is implemented to prevent security vulnerabilities.


  Contributing
If you’d like to contribute, please fork the repository and submit a pull request.

  License
This project is licensed under the MIT License.

