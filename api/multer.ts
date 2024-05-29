import multer from 'multer';
import { extname, resolve } from 'path';
import config from './config';
import { promises as fs, unlink } from 'fs';
import { randomUUID } from 'crypto';

const avatarStorage = multer.diskStorage({
  destination: async (_req, _file, callback) => {
    const destDir = resolve(config.publicPath, 'avatars');
    await fs.mkdir(destDir, { recursive: true });
    callback(null, config.publicPath);
  },
  filename(_req, file, callback) {
    const ext = extname(file.originalname);
    callback(null, 'avatars/' + randomUUID() + ext);
  },
});

const cocktailsStorage = multer.diskStorage({
  destination: async (_req, _file, callback) => {
    const destDir = resolve(config.publicPath, 'cocktails');
    await fs.mkdir(destDir, { recursive: true });
    callback(null, config.publicPath);
  },
  filename(_req, file, callback) {
    const ext = extname(file.originalname);
    callback(null, 'cocktails/' + randomUUID() + ext);
  },
});

export const avatarsUpload = multer({ storage: avatarStorage });
export const cocktailsUpload = multer({ storage: cocktailsStorage });

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
