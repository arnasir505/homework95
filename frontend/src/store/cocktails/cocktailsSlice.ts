import { createSlice } from '@reduxjs/toolkit';
import { Cocktail, ValidationError } from '../../types';
import { RootState } from '../../app/store';
import {
  addCocktail,
  fetchCocktails,
  fetchOneCocktail,
} from './cocktailsThunks';

interface CocktailsState {
  cocktails: Cocktail[];
  oneCocktail: Cocktail;
  cocktailsLoading: boolean;
  addCocktailLoading: boolean;
  addCocktailError: ValidationError | null;
}

const initialState: CocktailsState = {
  cocktails: [],
  oneCocktail: {
    _id: '',
    name: '',
    ingredients: [],
    recipe: '',
    image: '',
    user: '',
    isPublished: false,
  },
  cocktailsLoading: false,
  addCocktailLoading: false,
  addCocktailError: null,
};

const cocktailsSlice = createSlice({
  name: 'cocktails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCocktail.pending, (state) => {
        state.addCocktailLoading = true;
        state.addCocktailError = null;
      })
      .addCase(addCocktail.fulfilled, (state) => {
        state.addCocktailLoading = false;
      })
      .addCase(addCocktail.rejected, (state, { payload: error }) => {
        state.addCocktailLoading = false;
        state.addCocktailError = error || null;
      });
    builder
      .addCase(fetchCocktails.pending, (state) => {
        state.cocktailsLoading = true;
      })
      .addCase(fetchCocktails.fulfilled, (state, { payload: cocktails }) => {
        state.cocktailsLoading = false;
        state.cocktails = cocktails;
      })
      .addCase(fetchCocktails.rejected, (state) => {
        state.cocktailsLoading = false;
      });
    builder
      .addCase(fetchOneCocktail.pending, (state) => {
        state.cocktailsLoading = true;
      })
      .addCase(fetchOneCocktail.fulfilled, (state, { payload: cocktail }) => {
        state.cocktailsLoading = false;
        state.oneCocktail = cocktail;
      })
      .addCase(fetchOneCocktail.rejected, (state) => {
        state.cocktailsLoading = false;
      });
  },
});

export const selectCocktails = (state: RootState) => state.cocktails.cocktails;
export const selectOneCocktail = (state: RootState) =>
  state.cocktails.oneCocktail;
export const selectCocktailsLoading = (state: RootState) =>
  state.cocktails.cocktailsLoading;
export const selectAddCocktailLoading = (state: RootState) =>
  state.cocktails.addCocktailLoading;
export const selectAddCocktailError = (state: RootState) =>
  state.cocktails.addCocktailError;

export const cocktailsReducer = cocktailsSlice.reducer;
