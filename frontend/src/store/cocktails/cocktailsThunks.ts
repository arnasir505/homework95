import { createAsyncThunk } from '@reduxjs/toolkit';
import { Cocktail, CocktailMutation, ValidationError } from '../../types';
import { isAxiosError } from 'axios';
import axiosApi from '../../axiosApi';

export const addCocktail = createAsyncThunk<
  Cocktail,
  CocktailMutation,
  { rejectValue: ValidationError }
>('cocktails/add', async (cocktailForm, { rejectWithValue }) => {
  try {
    const { name, ingredients, recipe, image } = cocktailForm;
    const formData = new FormData();

    formData.append('name', name);
    formData.append('ingredients', JSON.stringify(ingredients));
    formData.append('recipe', recipe);
    if (image) {
      formData.append('image', image);
    }
    const response = await axiosApi.post<Cocktail>('/cocktails', formData);
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});
