import { ObjectId } from 'mongoose';

export interface UserFields {
  email: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
  avatar: string;
  googleID?: string;
}

export interface Ingredient {
  name: string;
  amount: string;
}

interface Rating {
  user: string;
  rating: number;
}

export interface CocktailFields {
  name: string;
  ingredients: Ingredient[];
  recipe: string;
  image: string;
  user: ObjectId;
  isPublished: boolean;
}
