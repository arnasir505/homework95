import express from 'express';
import Cocktail from '../models/Cocktail';
import { clearImage, cocktailsUpload } from '../multer';
import auth, { RequestWithUser } from '../middleware/auth';
import mongoose from 'mongoose';

const cocktailsRouter = express.Router();

cocktailsRouter.post(
  '/',
  auth,
  cocktailsUpload.single('image'),
  async (req: RequestWithUser, res, next) => {
    try {
      const cocktail = new Cocktail({
        name: req.body.name,
        ingredients: req.body.ingredients,
        recipe: req.body.recipe,
        image: req.file?.filename,
        user: req.user?._id,
      });

      await cocktail.save();

      return res.send(cocktail);
    } catch (e) {
      if (req.file) {
        clearImage(req.file.filename);
      }
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(400).send(e);
      }
      next(e);
    }
  },
);

cocktailsRouter.get('/', async (req, res) => {
  const cocktails = await Cocktail.find();
  return res.send(cocktails);
});

export default cocktailsRouter;
