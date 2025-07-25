import { Request, Response } from 'express';
import User from '../models/userModel';
import { ErrorResponse, UserResponse, UsersResponse } from '../types';
import { mapUserToResponse } from '../utils/mappers';
import bcrypt from 'bcryptjs';
import WorkoutLog from '../models/workoutLogModel';

export class UserController {
  static async getUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const user = await User.findById(userId)
        .select('name email profileImage bio followers following')
        .lean();

      if (!user) {
        const response: ErrorResponse = {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      // Get workout count
      const workoutCount = await WorkoutLog.countDocuments({ userId });

      const response: UserResponse = {
        success: true,
        user: {
          ...mapUserToResponse(user),
          username: user.name,
          workoutCount,
          followersCount: user.followers?.length || 0,
          followingCount: user.following?.length || 0
        }
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const user = await User.findById((req as any).user.userId)
        .select('name email profileImage bio followers following')
        .lean();
      if (!user) {
        const response: ErrorResponse = {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      const workoutCount = await WorkoutLog.countDocuments({ userId: user._id });

      const response: UserResponse = {
        success: true,
        user: {
          ...mapUserToResponse(user),
          username: user.name,
          workoutCount,
          followersCount: user.followers?.length || 0,
          followingCount: user.following?.length || 0
        }
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

      const workoutCount = await WorkoutLog.countDocuments({ userId: user._id });

      const response: UserResponse = {
        success: true,
        user: {
          ...mapUserToResponse(user),
          username: user.name,
          workoutCount,
          followersCount: user.followers?.length || 0,
          followingCount: user.following?.length || 0
        }
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
      if (!updatedUser) {
        const response: ErrorResponse = {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      const workoutCount = await WorkoutLog.countDocuments({ userId: updatedUser._id });

      const response: UserResponse = {
        success: true,
        user: {
          ...mapUserToResponse(updatedUser),
          username: updatedUser.name,
          workoutCount,
          followersCount: updatedUser.followers?.length || 0,
          followingCount: updatedUser.following?.length || 0
        }
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
      if (!updatedUser) {
        const response: ErrorResponse = {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      const workoutCount = await WorkoutLog.countDocuments({ userId: updatedUser._id });

      const response: UserResponse = {
        success: true,
        user: {
          ...mapUserToResponse(updatedUser),
          username: updatedUser.name,
          workoutCount,
          followersCount: updatedUser.followers?.length || 0,
          followingCount: updatedUser.following?.length || 0
        }
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
        users: user.followers.map((f: any) => ({
          ...mapUserToResponse(f),
          username: f.name
        }))
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
        users: user.following.map((f: any) => ({
          ...mapUserToResponse(f),
          username: f.name
        }))
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

      const workoutCount = await WorkoutLog.countDocuments({ userId: user._id });

      const response: UserResponse = {
        success: true,
        user: {
          ...mapUserToResponse(user),
          username: user.name,
          workoutCount,
          followersCount: user.followers?.length || 0,
          followingCount: user.following?.length || 0
        }
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

      const workoutCount = await WorkoutLog.countDocuments({ userId: user._id });

      const response: UserResponse = {
        success: true,
        user: {
          ...mapUserToResponse(user),
          username: user.name,
          workoutCount,
          followersCount: user.followers?.length || 0,
          followingCount: user.following?.length || 0
        }
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

      const workoutCount = await WorkoutLog.countDocuments({ userId: user._id });

      const response: UserResponse = {
        success: true,
        user: {
          ...mapUserToResponse(user),
          username: user.name,
          workoutCount,
          followersCount: user.followers?.length || 0,
          followingCount: user.following?.length || 0
        }
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const users = await User.find()
        .select('name email profileImage bio followers following')
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await User.countDocuments();

      const response: UsersResponse = {
        success: true,
        users: users.map(user => ({
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          bio: user.bio,
          username: user.name,
          followers: (user.followers || []).map((f: any) => f.toString()),
          following: (user.following || []).map((f: any) => f.toString())
        })),
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }
} 