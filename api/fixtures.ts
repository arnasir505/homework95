import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import Cocktail from './models/Cocktail';

const dropCollection = async (
  db: mongoose.Connection,
  collectionName: string,
) => {
  try {
    await db.dropCollection(collectionName);
  } catch (error) {
    console.log(`Collection ${collectionName} is missing. Skipping drop...`);
  }
};

const collections: string[] = ['users', 'cocktails'];

const run = async () => {
  await mongoose.connect(config.mongoose.db);
  const db = mongoose.connection;

  for (const collection of collections) {
    await dropCollection(db, collection);
  }

  const [user1, user2] = await User.create(
    {
      email: 'admin505@gmail.com',
      password: 'iLoveBishkek1234%',
      token: crypto.randomUUID(),
      role: 'admin',
      displayName: 'Admin',
      avatar: 'fixtures/admin.jpg',
    },
    {
      email: 'usermaster@gmail.com',
      password: 'iLoveBishkek4321%',
      token: crypto.randomUUID(),
      role: 'user',
      displayName: 'User',
      avatar: 'fixtures/user.gif',
    },
  );

  await Cocktail.create({
    name: 'Mojito',
    ingredients: [
      { name: 'Light rum', amount: '2-3 oz' },
      { name: 'Lime', amount: 'juice of 1' },
      { name: 'Sugar', amount: '2 tsp' },
      { name: 'Mint', amount: '2-4' },
      { name: 'Soda water', amount: '1 glass' },
    ],
    recipe:
      'Muddle mint leaves with sugar and lime juice. Add a splash of soda water and fill the glass with cracked ice. Pour the rum and top with soda water. Garnish and serve with straw.',
    image: 'fixtures/mojito.jpg',
    user: user2._id,
    isPublished: false,
  });

  await db.close();
};

void run().catch(console.error);
