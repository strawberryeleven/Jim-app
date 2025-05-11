# Authentication Backend Implementation Guide

## Overview

This guide outlines the backend implementation for user authentication in the Jim-app fitness application. The system uses JWT (JSON Web Tokens) for authentication and session management.

## Database Models

### User Model

```typescript
interface User {
  id: string; // UUID
  email: string; // Unique, required
  password: string; // Hashed
  name: string; // Required
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-updated
  lastLogin: Date; // Updated on login
  isActive: boolean; // Default: true
}
```

## API Endpoints

### Authentication Routes

#### 1. Register User

```typescript
POST /api/auth/register
Request Body:
{
  email: string;
  password: string;
  name: string;
}

Response:
{
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;  // JWT token
}
```

#### 2. Login User

```typescript
POST /api/auth/login
Request Body:
{
  email: string;
  password: string;
}

Response:
{
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;  // JWT token
}
```

#### 3. Logout User

```typescript
POST / api / auth / logout;
Headers: {
  Authorization: "Bearer <token>";
}

Response: {
  success: boolean;
  message: string;
}
```

#### 4. Verify Token

```typescript
GET / api / auth / verify;
Headers: {
  Authorization: "Bearer <token>";
}

Response: {
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
  }
}
```

## JWT Implementation

### Token Structure

```typescript
interface JWTPayload {
  userId: string;
  email: string;
  iat: number; // Issued at
  exp: number; // Expiration time
}
```

### Token Configuration

- Access Token Expiration: 24 hours
- Refresh Token Expiration: 7 days
- Algorithm: HS256

## Security Measures

1. Password Hashing

   - Use bcrypt with salt rounds of 12
   - Never store plain text passwords

2. JWT Security

   - Store tokens in HTTP-only cookies
   - Implement token rotation
   - Use secure and httpOnly flags for cookies

3. Rate Limiting

   - Implement rate limiting for auth endpoints
   - Max 5 attempts per minute for login
   - Max 3 attempts per minute for registration

4. Input Validation
   - Validate email format
   - Password requirements:
     - Minimum 8 characters
     - At least one uppercase letter
     - At least one number
     - At least one special character

## Error Handling

### Common Error Codes

```typescript
{
  AUTH001: "Invalid credentials",
  AUTH002: "Email already exists",
  AUTH003: "Invalid token",
  AUTH004: "Token expired",
  AUTH005: "Account not found",
  AUTH006: "Account is inactive"
}
```

## Implementation Steps

1. Set up Express.js server with TypeScript
2. Implement database connection (MongoDB/PostgreSQL)
3. Create User model and migration
4. Implement password hashing middleware
5. Create JWT service for token generation and verification
6. Implement authentication middleware
7. Create authentication routes
8. Add input validation middleware
9. Implement error handling middleware
10. Add rate limiting
11. Set up CORS configuration
12. Implement logging system

## Environment Variables

```env
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret
DB_CONNECTION_STRING=your_database_connection_string
NODE_ENV=development|production
PORT=3000
```

## Testing

### Unit Tests

- Test user registration
- Test user login
- Test token verification
- Test password hashing
- Test input validation

### Integration Tests

- Test complete authentication flow
- Test protected routes
- Test error scenarios
- Test rate limiting

## Security Checklist

- [ ] Implement HTTPS
- [ ] Set secure cookie flags
- [ ] Implement CSRF protection
- [ ] Add request validation
- [ ] Implement rate limiting
- [ ] Set up proper CORS configuration
- [ ] Add security headers
- [ ] Implement logging
- [ ] Set up error monitoring
- [ ] Regular security audits

## Frontend Integration

1. Store JWT token in Zustand store
2. Add token to all API requests
3. Handle token expiration
4. Implement automatic logout
5. Add loading states
6. Handle error messages
7. Implement remember me functionality

## Monitoring and Maintenance

1. Monitor failed login attempts
2. Track token usage
3. Monitor API response times
4. Set up alerts for suspicious activities
5. Regular security updates
6. Database maintenance
7. Log rotation
