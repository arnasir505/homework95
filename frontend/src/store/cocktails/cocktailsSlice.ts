import { createSlice } from '@reduxjs/toolkit';
import { Cocktail, ValidationError } from '../../types';
import { RootState } from '../../app/store';

interface CocktailsState {
  cocktails: Cocktail[];
  addCocktailLoading: boolean;
  addCocktailError: ValidationError | null;
}

const initialState: CocktailsState = {
  cocktails: [],
  addCocktailLoading: false,
  addCocktailError: null,
};

const cocktailsSlice = createSlice({
  name: 'cocktails',
  initialState,
  reducers: {},
});

export const selectCocktails = (state: RootState) => state.cocktails.cocktails;
export const selectAddCocktailLoading = (state: RootState) =>
  state.cocktails.addCocktailLoading;
export const selectAddCocktailError = (state: RootState) =>
  state.cocktails.addCocktailError;

export const cocktailsReducer = cocktailsSlice.reducer;
