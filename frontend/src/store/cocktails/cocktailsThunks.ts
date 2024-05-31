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

export const fetchCocktails = createAsyncThunk<Cocktail[]>(
  'cocktails/fetchAll',
  async () => {
    try {
      const response = await axiosApi.get<Cocktail[]>('/cocktails');
      return response.data;
    } catch (e) {
      throw e;
    }
  },
);

export const fetchUserCocktails = createAsyncThunk<Cocktail[]>(
  'cocktails/fetchUsersAll',
  async () => {
    try {
      const response = await axiosApi.get<Cocktail[]>('/cocktails/byUser');
      return response.data;
    } catch (e) {
      throw e;
    }
  },
);

export const fetchOneCocktail = createAsyncThunk<Cocktail, string>(
  'cocktails/fetchOne',
  async (id) => {
    try {
      const response = await axiosApi.get<Cocktail>('/cocktails/' + id);
      return response.data;
    } catch (e) {
      throw e;
    }
  },
);

export const fetchOneCocktailByUser = createAsyncThunk<Cocktail, string>(
  'cocktails/fetchOne',
  async (id) => {
    try {
      const response = await axiosApi.get<Cocktail>('/cocktails/' + id + '/byUser');
      return response.data;
    } catch (e) {
      throw e;
    }
  },
);

export const fetchCocktailsAdmin = createAsyncThunk<Cocktail[]>(
  'cocktails/fetchAllAdmin',
  async () => {
    try {
      const response = await axiosApi.get<Cocktail[]>('/cocktails/admin');
      return response.data;
    } catch (e) {
      throw e;
    }
  },
);
