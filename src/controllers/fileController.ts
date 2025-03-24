import { Request, Response } from 'express';
import { File } from '../models/File';
import { AppError } from '../middleware/errorHandler';
import { uploadToS3 } from '../utils/fileUpload';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../utils/s3Client';

// 上传单个文件
export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new AppError('没有文件被上传', 400);
    }

    if (!req.user?._id) {
      throw new AppError('用户未认证', 401);
    }

    // 上传到 S3
    const fileUrl = await uploadToS3(req.file, req.user._id.toString());

    const file = await File.create({
      filename: req.file.originalname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: fileUrl,
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      status: 'success',
      data: {
        file: {
          id: file._id,
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
          uploadedAt: file.createdAt,
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

// 获取文件列表
export const getFiles = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      throw new AppError('用户未认证', 401);
    }

    const files = await File.find({ uploadedBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: {
        files,
      },
    });
  } catch (error) {
    throw error;
  }
};

// 获取单个文件
export const getFile = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      throw new AppError('用户未认证', 401);
    }

    const file = await File.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id,
    });

    if (!file) {
      throw new AppError('文件不存在', 404);
    }

    res.json({
      status: 'success',
      data: {
        file,
      },
    });
  } catch (error) {
    throw error;
  }
};

// 删除文件
export const deleteFile = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      throw new AppError('用户未认证', 401);
    }

    const file = await File.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id,
    });

    if (!file) {
      throw new AppError('文件不存在', 404);
    }

    // 从 S3 删除文件
    const key = file.path.split('/').slice(-2).join('/');
    await s3Client.send(new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET || '',
      Key: key,
    }));

    // 删除数据库记录
    await file.deleteOne();

    res.json({
      status: 'success',
      message: '文件已删除',
    });
  } catch (error) {
    throw error;
  }
}; 