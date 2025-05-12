
import { Request, Response } from 'express';
import User from '../models/userModel';
import { ErrorResponse, UserResponse, UsersResponse } from '../types';
import { mapUserToResponse } from '../utils/mappers';

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
} 