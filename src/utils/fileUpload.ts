import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { AppError } from '../middleware/errorHandler';

// 允许的文件类型
const ALLOWED_FILE_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'text/plain': '.txt',
};

// 文件大小限制 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// 配置 S3 客户端
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// 内存存储
const storage = multer.memoryStorage();

// 文件过滤器
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_FILE_TYPES[file.mimetype as keyof typeof ALLOWED_FILE_TYPES]) {
    cb(null, true);
  } else {
    cb(new AppError('不支持的文件类型', 400));
  }
};

// 创建 multer 实例
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  }
});

// 上传文件到 S3
export const uploadToS3 = async (file: Express.Multer.File, userId: string): Promise<string> => {
  try {
    const ext = ALLOWED_FILE_TYPES[file.mimetype as keyof typeof ALLOWED_FILE_TYPES];
    const key = `uploads/${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET || '',
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);

    // 返回文件的公共访问 URL
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    throw new AppError('文件上传失败', 500);
  }
};

// 获取文件扩展名
export const getFileExtension = (mimetype: string): string => {
  return ALLOWED_FILE_TYPES[mimetype as keyof typeof ALLOWED_FILE_TYPES] || '';
};

// 验证文件类型
export const validateFileType = (mimetype: string): boolean => {
  return !!ALLOWED_FILE_TYPES[mimetype as keyof typeof ALLOWED_FILE_TYPES];
}; 