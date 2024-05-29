import multer from 'multer';
import { extname, resolve } from 'path';
import config from './config';
import { promises as fs, unlink } from 'fs';
import { randomUUID } from 'crypto';

const imageStorage = multer.diskStorage({
  destination: async (_req, _file, callback) => {
    const destDir = resolve(config.publicPath, 'images');
    await fs.mkdir(destDir, { recursive: true });
    callback(null, config.publicPath);
  },
  filename(_req, file, callback) {
    const ext = extname(file.originalname);
    callback(null, 'images/' + randomUUID() + ext);
  },
});

export const imagesUpload = multer({ storage: imageStorage });

export const clearImage = (imageName: string) => {
  unlink(resolve(config.publicPath, imageName), (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error('File does not exist.');
      } else {
        throw err;
      }
    } else {
      console.log('File deleted!');
    }
  });
};
