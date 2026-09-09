import multer from 'multer';
import cloudinary from '../config/cloudinary';

const multerStorageModule = require('multer-storage-cloudinary');
const CloudinaryStorage =
    multerStorageModule.CloudinaryStorage ||
    multerStorageModule.default ||
    multerStorageModule;

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'pb-delicacies/menu',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 800, height: 800, crop: 'limit' }],
    } as any,
});

export const uploadMenuImage = multer({ storage });