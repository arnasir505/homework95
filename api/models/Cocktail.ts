import { Model, Schema, Types, model } from 'mongoose';
import { CocktailFields, Ingredient } from '../types';
import User from './User';

interface CocktailMethods {
  togglePublished(): void;
}

type CocktailModel = Model<CocktailFields, {}, CocktailMethods>;

const IngredientsSubSchema = new Schema<Ingredient>({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
});
const CocktailSchema = new Schema<CocktailFields, CocktailModel>(
  {
    name: {
      type: String,
      required: [true, 'Please enter cocktail name.'],
    },
    ingredients: {
      type: [IngredientsSubSchema],
      required: true,
      validate: {
        validator: function (ingredients: Ingredient[]) {
          if (ingredients.length === 0) return false;
        },
        message: 'Please add at least 1 ingredient.'
      },
    },
    recipe: {
      type: String,
      required: [true, 'Please enter cocktail recipe.'],
    },
    image: {
      type: String,
      required: [true, 'Please upload cocktail image.'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      validate: {
        validator: async (id: Types.ObjectId) => User.findById(id),
        message: 'User does not exist.',
      },
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    versionKey: false,
  },
);

CocktailSchema.method('togglePublished', function () {
  this.isPublished = !this.isPublished;
});

const Cocktail = model<CocktailFields, CocktailModel>(
  'Cocktail',
  CocktailSchema,
);

export default Cocktail;
