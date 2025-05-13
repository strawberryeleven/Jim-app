import { Request, Response } from 'express';
import User from '../models/userModel';
import { ErrorResponse, UserResponse, UsersResponse } from '../types';
import { mapUserToResponse } from '../utils/mappers';
import bcrypt from 'bcryptjs';

export class UserController {
  static async getUser(req: Request, res: Response) {
    try {
      const user = await User.findById(req.params.id).lean();
      if (!user) {
        const response: ErrorResponse = {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      const response: UserResponse = {
        success: true,
        user: mapUserToResponse(user),
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const user = await User.findById((req as any).user.userId).lean();
      if (!user) {
        const response: ErrorResponse = {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      const response: UserResponse = {
        success: true,
        user: mapUserToResponse(user),
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const user = await User.findByIdAndUpdate(
        (req as any).user.userId,
        { ...req.body, updatedAt: new Date() },
        { new: true }
      ).lean();
      if (!user) {
        const response: ErrorResponse = {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      const response: UserResponse = {
        success: true,
        user: mapUserToResponse(user),
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async followUser(req: Request, res: Response) {
    try {
      const userToFollow = await User.findById(req.params.id);
      if (!userToFollow) {
        const response: ErrorResponse = {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      await User.findByIdAndUpdate((req as any).user.userId, {
        $addToSet: { following: req.params.id },
      });

      await User.findByIdAndUpdate(req.params.id, {
        $addToSet: { followers: (req as any).user.userId },
      });

      const updatedUser = await User.findById((req as any).user.userId).lean();
      const response: UserResponse = {
        success: true,
        user: mapUserToResponse(updatedUser!),
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async unfollowUser(req: Request, res: Response) {
    try {
      const userToUnfollow = await User.findById(req.params.id);
      if (!userToUnfollow) {
        const response: ErrorResponse = {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      await User.findByIdAndUpdate((req as any).user.userId, {
        $pull: { following: req.params.id },
      });

      await User.findByIdAndUpdate(req.params.id, {
        $pull: { followers: (req as any).user.userId },
      });

      const updatedUser = await User.findById((req as any).user.userId).lean();
      const response: UserResponse = {
        success: true,
        user: mapUserToResponse(updatedUser!),
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async getFollowers(req: Request, res: Response) {
    try {
      const user = await User.findById(req.params.id).populate('followers', 'name email').lean();
      if (!user) {
        const response: ErrorResponse = {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      const response: UsersResponse = {
        success: true,
        users: user.followers.map((f: any) => mapUserToResponse(f)),
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async getFollowing(req: Request, res: Response) {
    try {
      const user = await User.findById(req.params.id).populate('following', 'name email').lean();
      if (!user) {
        const response: ErrorResponse = {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      const response: UsersResponse = {
        success: true,
        users: user.following.map((f: any) => mapUserToResponse(f)),
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async updateName(req: Request, res: Response) {
    try {
      const user = await User.findByIdAndUpdate(
        (req as any).user.userId,
        { name: req.body.name },
        { new: true }
      ).lean();

      if (!user) {
        const response: ErrorResponse = {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      const response: UserResponse = {
        success: true,
        user: mapUserToResponse(user),
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async updateEmail(req: Request, res: Response) {
    try {
      // Check if email is already taken
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        const response: ErrorResponse = {
          success: false,
          error: 'Email is already taken',
          code: 'EMAIL_TAKEN',
        };
        return res.status(400).json(response);
      }

      const user = await User.findByIdAndUpdate(
        (req as any).user.userId,
        { email: req.body.email },
        { new: true }
      ).lean();

      if (!user) {
        const response: ErrorResponse = {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      const response: UserResponse = {
        success: true,
        user: mapUserToResponse(user),
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async updatePassword(req: Request, res: Response) {
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

      // Verify current password
      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) {
        const response: ErrorResponse = {
          success: false,
          error: 'Current password is incorrect',
          code: 'INVALID_PASSWORD',
        };
        return res.status(400).json(response);
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

      // Update password
      user.password = hashedPassword;
      await user.save();

      const response: UserResponse = {
        success: true,
        message: 'Password updated successfully',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }
} 