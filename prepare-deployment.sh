#!/bin/bash

echo "[UploadSoul Deploy]: Creating deployment package..."

# Create deployment directory
mkdir -p uploadsoul-deploy

# Copy dist folder to deployment directory
cp -r dist uploadsoul-deploy/

# Copy deployment instructions
cp UPLOAD_INSTRUCTIONS.md uploadsoul-deploy/

# Copy necessary configuration files
cp vercel.json uploadsoul-deploy/

# Create a README for quick reference
cat > uploadsoul-deploy/README.txt << "EOL"
UploadSoul 部署包 (Deployment Package)
==============================

此目录包含UploadSoul网站的完整构建版本，以及部署说明。

请查看UPLOAD_INSTRUCTIONS.md获取完整的部署指南。

主要文件说明：
- dist/ 目录: 包含网站的所有构建文件
- UPLOAD_INSTRUCTIONS.md: 详细的部署说明
- vercel.json: Vercel配置文件(如果使用Vercel部署)

部署后，请访问www.uploadsoul.com验证所有功能是否正常工作。
EOL

echo "[UploadSoul Deploy]: 创建GitHub上传脚本..."

echo "[UploadSoul Deploy]: 创建压缩包..."
zip -r uploadsoul-deploy.zip uploadsoul-deploy

echo "[UploadSoul Deploy]: 部署包已创建: uploadsoul-deploy.zip"
echo "[UploadSoul Deploy]: 请下载此包并按照UPLOAD_INSTRUCTIONS.md中的说明进行部署。"