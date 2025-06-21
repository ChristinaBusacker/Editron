import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { customAlphabet } from 'nanoid';

const generateId = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  16,
);

const ensureDir = (path: string) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
};

export const assetUploadOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = 'uploads/originals';
      ensureDir(uploadPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = extname(file.originalname);
      const filename = `${generateId()}${ext}`;
      cb(null, filename);
    },
  }),
  limits: {
    fileSize: 200 * 1024 * 1024, // 200 MB
  },
};
