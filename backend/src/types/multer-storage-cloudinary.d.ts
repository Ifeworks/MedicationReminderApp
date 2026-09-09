declare module 'multer-storage-cloudinary' {
    import { StorageEngine } from 'multer';

    interface CloudinaryStorageOptions {
        cloudinary: any;
        params: {
            folder?: string;
            allowed_formats?: string[];
            format?: string | ((req: any, file: any) => Promise<string> | string);
            public_id?: string | ((req: any, file: any) => Promise<string> | string);
            transformation?: any[];
            [key: string]: any;
        };
    }

    export class CloudinaryStorage implements StorageEngine {
        constructor(options: CloudinaryStorageOptions);
        _handleFile(req: any, file: any, callback: (error?: any, info?: { path: string; size: number }) => void): void;
        _removeFile(req: any, file: any, callback: (error: any) => void): void;
    }
}