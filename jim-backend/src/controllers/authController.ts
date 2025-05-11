import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/userModel';
import { JWTService } from '../services/jwtService';
import { AuthResponse, ErrorResponse } from '../types/index';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const response: ErrorResponse = {
          success: false,
          error: 'Email already exists',
          code: 'AUTH002',
        };
        return res.status(400).json(response);
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        password: hashedPassword,
        name,
      });

      await user.save();

      const payload = { userId: user._id.toString(), email: user.email };
      const token = JWTService.generateAccessToken(payload);
      const refreshToken = JWTService.generateRefreshToken(payload);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      const response: AuthResponse = {
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        },
        token,
      };
      res.status(201).json(response);
    } catch (error) {
      throw error;
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        const response: ErrorResponse = {
          success: false,
          error: 'Account not found',
          code: 'AUTH005',
        };
        return res.status(404).json(response);
      }

      if (!user.isActive) {
        const response: ErrorResponse = {
          success: false,
          error: 'Account is inactive',
          code: 'AUTH006',
        };
        return res.status(403).json(response);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        const response: ErrorResponse = {
          success: false,
          error: 'Invalid credentials',
          code: 'AUTH001',
        };
        return res.status(401).json(response);
      }

      user.lastLogin = new Date();
      await user.save();

      const payload = { userId: user._id.toString(), email: user.email };
      const token = JWTService.generateAccessToken(payload);
      const refreshToken = JWTService.generateRefreshToken(payload);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      const response: AuthResponse = {
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        },
        token,
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      res.clearCookie('refreshToken');
      const response: AuthResponse = {
        success: true,
        message: 'Logged out successfully',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async verify(req: Request, res: Response) {
    try {
      const user = await User.findById((req as any).user.userId);
      if (!user) {
        const response: ErrorResponse = {
          success: false,
          error: 'Account not found',
          code: 'AUTH005',
        };
        return res.status(404).json(response);
      }

      const response: AuthResponse = {
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        },
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }
}