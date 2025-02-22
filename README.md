# Medical Camp Management System - Server

This repository contains the backend/server code for the Medical Camp Management System. The server is built using Node.js and Express.js, and it connects to a MongoDB database. This project facilitates the management of medical camps, user registrations, payment processing, and more.


## Live Links

- **Live Website-1**: [MCMS Live-1](https://medical-camp-management-b10a12.web.app)


- **Live Website-2**: [MCMS Live-2](https://medical-camp-management-b10a12.firebaseapp.com)


- **Live Website-3**: [MCMS Live-3](https://medical-camp-management-system-b10a12.netlify.app)


## Features

- **User Management**: User registration, authentication (JWT), and role-based access control (admin and participants).
- **Camp Management**: CRUD operations for medical camps, participant registration, and camp updates.
- **Payment Processing**: Integration with Stripe for secure payment handling.
- **Feedback System**: Allows participants to provide feedback.
- **Admin Controls**: Includes admin-specific APIs for managing camps and participants.
- **Middleware**: Includes middleware for CORS, JWT verification, and logging.

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB**
- **Stripe**
- **JWT (JSON Web Tokens)**
- **dotenv** for environment variables
- **morgan** for logging
- **cors** for Cross-Origin Resource Sharing


## API Endpoints

### Authentication
- **POST** `/jwt` - Generates a JWT token for a user.

### Users
- **POST** `/users` - Register a new user.
- **GET** `/users` - Get all users.
- **PATCH** `/user/:id` - Update user information.
- **GET** `/users/admin/:email` - Check if a user is an admin.

### Camps
- **GET** `/camps` - Retrieve all camps.
- **GET** `/camps/:id` - Retrieve a specific camp by ID.
- **POST** `/camp` - Add a new camp (admin only).
- **PATCH** `/camp/:id` - Update camp details (admin only).
- **DELETE** `/delete-camp/:id` - Delete a camp (admin only).

### Camp Registration
- **POST** `/join-camps` - Register for a camp.
- **GET** `/registeredCamps/:email` - Retrieve registered camps for a user.
- **DELETE** `/delete-joined-camp/:id` - Remove a registered camp.

### Payments
- **POST** `/create-payment-intent` - Create a Stripe payment intent.
- **PATCH** `/join-camp/:id` - Update payment status for a registered camp.

### Doctors
- **GET** `/doctors` - Retrieve all doctors.

### Feedback
- **POST** `/feedback` - Submit feedback.
- **GET** `/feedbacks` - Retrieve all feedbacks.

## Folder Structure

```
medical-camp-management-server/
├── .env
├── package.json
├── server.js
└── README.md
```


## Contributing

Contributions are welcome! Please fork this repository and submit a pull request with your changes.

