import express from 'express';
import User from '../models/User';
import mongoose, { mongo } from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import config from '../config';
import { clearImage, avatarsUpload } from '../multer';

const usersRouter = express.Router();
const client = new OAuth2Client(config.google.clientID);

usersRouter.post(
  '/',
  avatarsUpload.single('avatar'),
  async (req, res, next) => {
    try {
      const user = new User({
        email: req.body.email,
        displayName: req.body.displayName,
        avatar: req.file?.filename,
        password: req.body.password,
      });

      user.generateToken();

      await user.save();
      return res.send({ message: 'Successful sign up!', user });
    } catch (error) {
      if (req.file) {
        clearImage(req.file.filename);
      }
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).send(error);
      }
      if (error instanceof mongo.MongoServerError && error.code === 11000) {
        return res.status(422).send(error);
      }
      next(error);
    }
  },
);

usersRouter.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send({ error: 'Incorrect email or password.' });
    }

    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) {
      return res.status(400).send({ error: 'Incorrect email or password.' });
    }

    user.generateToken();
    await user.save();

    return res.send({ message: 'Successful log in!', user });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(error);
    }
    next(error);
  }
});

usersRouter.post('/sessions/google', async (req, res, next) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: config.google.clientID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).send({ error: 'Log in with Google failed.' });
    }

    const email = payload['email'];
    const id = payload['sub'];
    const displayName = payload['name'];
    const avatar = payload['picture'];

    if (!email) {
      return res.status(400).send({ error: 'Email is required.' });
    }

    let user = await User.findOne({ googleID: id });

    if (!user) {
      user = new User({
        email,
        password: crypto.randomUUID(),
        displayName,
        googleID: id,
        avatar,
      });
    }

    user.generateToken();
    await user.save();

    return res.send({ message: 'Log in with Google successful!', user });
  } catch (error) {
    next(error);
  }
});

usersRouter.delete('/sessions', async (req, res, next) => {
  try {
    const headerValue = req.get('Authorization');
    const successMessage = { message: 'Successful log out!' };

    if (!headerValue) {
      return res.send(successMessage);
    }

    const [_, token] = headerValue.split(' ');

    const user = await User.findOne({ token });

    if (!user) {
      return res.send(successMessage);
    }

    user.generateToken();
    await user.save();

    return res.send(successMessage);
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
