# Jim Backend

A secure and scalable backend API built with Node.js, Express, and TypeScript.

## Features

- User authentication (register, login, logout)
- JWT-based authentication with HTTP-only cookies
- Input validation using Zod
- Rate limiting
- Error handling middleware
- MongoDB integration
- TypeScript support
- CORS enabled
- Secure password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd jim-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jim-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## Development

To run the development server:

```bash
npm run dev
```

## Production

To build and run the production server:

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

## Security Features

- Password hashing using bcrypt
- JWT stored in HTTP-only cookies
- Rate limiting to prevent abuse
- Input validation using Zod
- CORS configuration
- Secure cookie settings

## Error Handling

The API includes a global error handling middleware that provides consistent error responses across all endpoints.

## License

MIT
