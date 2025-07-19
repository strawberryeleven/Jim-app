import { Request, Response } from 'express';
import Profile from '../models/profileModel';
import { ErrorResponse } from '../types';

export class ProfileController {
  static async getProfile(req: Request, res: Response) {
    try {
      const profile = await Profile.findOne({ userId: (req as any).user.userId }).lean();
      if (!profile) {
        const response: ErrorResponse = {
          success: false,
          error: 'Profile not found',
          code: 'PROFILE_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      res.json({
        success: true,
        profile,
      });
    } catch (error) {
      throw error;
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const profile = await Profile.findOneAndUpdate(
        { userId: (req as any).user.userId },
        { ...req.body, updatedAt: new Date() },
        { new: true, upsert: true }
      ).lean();

      res.json({
        success: true,
        profile,
      });
    } catch (error) {
      throw error;
    }
  }
} 