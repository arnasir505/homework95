import { createSlice } from '@reduxjs/toolkit';
import { Cocktail, ValidationError } from '../../types';
import { RootState } from '../../app/store';
import {
  addCocktail,
  fetchCocktails,
  fetchCocktailsAdmin,
  fetchOneCocktail,
  fetchUserCocktails,
} from './cocktailsThunks';

interface CocktailsState {
  cocktails: Cocktail[];
  oneCocktail: Cocktail;
  cocktailsLoading: boolean;
  cocktailError: boolean;
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
  cocktailError: false,
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
        state.cocktailError = false;
      })
      .addCase(fetchCocktails.fulfilled, (state, { payload: cocktails }) => {
        state.cocktailsLoading = false;
        state.cocktails = cocktails;
      })
      .addCase(fetchCocktails.rejected, (state) => {
        state.cocktailsLoading = false;
        state.cocktailError = true;
      });
    builder
      .addCase(fetchOneCocktail.pending, (state) => {
        state.cocktailsLoading = true;
        state.cocktailError = false;
      })
      .addCase(fetchOneCocktail.fulfilled, (state, { payload: cocktail }) => {
        state.cocktailsLoading = false;
        state.oneCocktail = cocktail;
      })
      .addCase(fetchOneCocktail.rejected, (state) => {
        state.cocktailsLoading = false;
        state.cocktailError = true;
      });
    builder
      .addCase(fetchUserCocktails.pending, (state) => {
        state.cocktailsLoading = true;
        state.cocktailError = false;
      })
      .addCase(
        fetchUserCocktails.fulfilled,
        (state, { payload: userCocktails }) => {
          state.cocktailsLoading = false;
          state.cocktails = userCocktails;
        },
      )
      .addCase(fetchUserCocktails.rejected, (state) => {
        state.cocktailsLoading = false;
        state.cocktailError = true;
      });
    builder
      .addCase(fetchCocktailsAdmin.pending, (state) => {
        state.cocktailsLoading = true;
        state.cocktailError = false;
      })
      .addCase(
        fetchCocktailsAdmin.fulfilled,
        (state, { payload: cocktails }) => {
          state.cocktailsLoading = false;
          state.cocktails = cocktails;
        },
      )
      .addCase(fetchCocktailsAdmin.rejected, (state) => {
        state.cocktailsLoading = false;
        state.cocktailError = true;
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
