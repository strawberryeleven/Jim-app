import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import Profile from '../models/profileModel';
import { AuthResponse, ErrorResponse } from '../types';
import { mapUserToResponse } from '../utils/mappers';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email }).lean();
      if (existingUser) {
        const response: ErrorResponse = {
          success: false,
          error: 'User already exists',
          code: 'USER_EXISTS',
        };
        return res.status(400).json(response);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        password: hashedPassword,
        isActive: false,
      });
      await user.save();

      // Create profile for the new user
      await Profile.create({
        userId: user._id,
        username: name,
      });

      const accessToken = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );
      const refreshToken = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '7d' }
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      const response: AuthResponse = {
        success: true,
        user: mapUserToResponse(user.toObject()),
        token: accessToken,
      };
      res.status(201).json(response);
    } catch (error) {
      throw error;
    }
  }

  static async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.query;
      const decoded = jwt.verify(token as string, process.env.JWT_SECRET!) as { userId: string };
      const user = await User.findById(decoded.userId);
      if (!user) {
        const response: ErrorResponse = {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      if (user.isActive) {
        const response: ErrorResponse = {
          success: false,
          error: 'User already verified',
          code: 'USER_ALREADY_VERIFIED',
        };
        return res.status(400).json(response);
      }

      user.isActive = true;
      await user.save();

      const response: AuthResponse = {
        success: true,
        message: 'Email verified successfully',
      };
      res.json(response);
    } catch (error) {
      const response: ErrorResponse = {
        success: false,
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
      };
      res.status(400).json(response);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !user.isActive) {
        const response: ErrorResponse = {
          success: false,
          error: 'Invalid credentials or unverified account',
          code: 'INVALID_CREDENTIALS',
        };
        return res.status(401).json(response);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        const response: ErrorResponse = {
          success: false,
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
        };
        return res.status(401).json(response);
      }

      user.lastLogin = new Date();
      await user.save();

      const accessToken = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );
      const refreshToken = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '7d' }
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      const response: AuthResponse = {
        success: true,
        user: mapUserToResponse(user.toObject()),
        token: accessToken,
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const user = await User.findById((req as any).user.userId);
      if (!user) {
        const response: ErrorResponse = {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      const response: AuthResponse = {
        success: true,
        message: 'Logged out successfully',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        const response: ErrorResponse = {
          success: false,
          error: 'No refresh token provided',
          code: 'NO_TOKEN',
        };
        return res.status(401).json(response);
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string };
      const user = await User.findById(decoded.userId);
      if (!user) {
        const response: ErrorResponse = {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      const accessToken = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      const response: AuthResponse = {
        success: true,
        user: mapUserToResponse(user.toObject()),
        token: accessToken,
      };
      res.json(response);
    } catch (error) {
      const response: ErrorResponse = {
        success: false,
        error: 'Invalid or expired refresh token',
        code: 'INVALID_TOKEN',
      };
      res.status(401).json(response);
    }
  }
}
