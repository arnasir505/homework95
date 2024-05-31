import express from 'express';
import Cocktail from '../models/Cocktail';
import { clearImage, cocktailsUpload } from '../multer';
import auth, { RequestWithUser } from '../middleware/auth';
import mongoose from 'mongoose';
import permit from '../middleware/permit';

const cocktailsRouter = express.Router();

cocktailsRouter.post(
  '/',
  auth,
  cocktailsUpload.single('image'),
  async (req: RequestWithUser, res, next) => {
    try {
      const cocktail = new Cocktail({
        name: req.body.name,
        ingredients: JSON.parse(req.body.ingredients),
        recipe: req.body.recipe,
        image: req.file?.filename,
        user: req.user?._id,
      });
      await cocktail.save();
      return res.status(201).send(cocktail);
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

cocktailsRouter.get('/', async (_req, res, next) => {
  try {
    const cocktails = await Cocktail.find({ isPublished: true });
    return res.send(cocktails);
  } catch (e) {
    next(e);
  }
});

cocktailsRouter.get('/byUser', auth, async (req, res, next) => {
  try {
    const userID = req.query.user;
    if (!userID) return res.status(400).send({ error: 'User id is required.' });
    const cocktailsByUser = await Cocktail.find({ user: userID.toString() });
    return res.send(cocktailsByUser);
  } catch (e) {
    next(e);
  }
});

cocktailsRouter.get(
  '/admin',
  auth,
  permit('admin'),
  async (_req, res, next) => {
    try {
      const cocktails = await Cocktail.find();
      return res.send(cocktails);
    } catch (e) {
      next(e);
    }
  },
);

cocktailsRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id.toString())) {
      return res.status(422).send({ error: 'Invalid cocktail id!' });
    }
    const cocktail = await Cocktail.findOne({ _id: id });
    if (!cocktail) {
      return res.status(404).send({error: 'Not Found!'})
    }
    return res.send(cocktail);
  } catch (e) {
    next(e);
  }
});

cocktailsRouter.patch(
  '/:id/togglePublished',
  auth,
  permit('admin'),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const cocktail = await Cocktail.findById(id);
      if (!cocktail) {
        return res.status(404).send({ error: 'Nof Found.' });
      }
      cocktail.togglePublished();
      await cocktail.save();
      return res.send(cocktail);
    } catch (e) {
      next(e);
    }
  },
);

cocktailsRouter.delete(
  '/:id',
  auth,
  permit('admin'),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const cocktail = await Cocktail.findByIdAndDelete(id);
      if (!cocktail) {
        return res.status(404).send({ error: 'Not Found' });
      }
      clearImage(cocktail.image);
      return res.send({ message: 'Deleted' });
    } catch (e) {
      next(e);
    }
  },
);

export default cocktailsRouter;
