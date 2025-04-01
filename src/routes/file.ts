import express from 'express';
import { upload } from '../utils/fileUpload';
import {
  uploadFile,
  getFiles,
  getFile,
  deleteFile,
} from '../controllers/fileController';
import { protect } from '../middleware/auth';

const router = express.Router();

// 所有路由都需要认证
router.use(protect);

// 文件上传路由
router.post('/upload', upload.single('file'), uploadFile);

// 获取文件列表
router.get('/', getFiles);

// 获取单个文件
router.get('/:id', getFile);

// 删除文件
router.delete('/:id', deleteFile);

export default router; 