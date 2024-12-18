import { catchAsync, AppError } from '../../utils/errors';
import multer from 'multer';
import sharp from 'sharp';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// 配置AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// 配置Multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 限制5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError('请上传图片文件', 400), false);
    }
  },
});

// 处理单个图片上传
export const uploadImage = upload.single('image');

// 处理图片并上传到S3
export const processAndUploadImage = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError('请选择要上传的图片', 400);
  }

  // 处理图片
  const processedImage = await sharp(req.file.buffer)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();

  // 生成文件名
  const key = `images/${uuidv4()}.jpg`;

  // 上传到S3
  const uploadResult = await s3.upload({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: processedImage,
    ContentType: 'image/jpeg',
    ACL: 'public-read',
  }).promise();

  res.status(201).json({
    url: uploadResult.Location,
    key: uploadResult.Key,
  });
});

// 删除S3中的图片
export const deleteImage = catchAsync(async (req, res) => {
  const { key } = req.params;

  await s3.deleteObject({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  }).promise();

  res.status(204).json(null);
});

// 批量上传图片
export const uploadMultipleImages = upload.array('images', 10);

export const processAndUploadMultipleImages = catchAsync(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError('请选择要上传的图片', 400);
  }

  const uploadPromises = req.files.map(async (file) => {
    const processedImage = await sharp(file.buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    const key = `images/${uuidv4()}.jpg`;

    const uploadResult = await s3.upload({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: processedImage,
      ContentType: 'image/jpeg',
      ACL: 'public-read',
    }).promise();

    return {
      url: uploadResult.Location,
      key: uploadResult.Key,
    };
  });

  const results = await Promise.all(uploadPromises);
  res.status(201).json(results);
}); 