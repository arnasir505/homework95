import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  GlobalError,
  LoginMutation,
  RegisterMutation,
  RegisterResponse,
  User,
  ValidationError,
} from '../../types';
import axiosApi from '../../axiosApi';
import { isAxiosError } from 'axios';
import { RootState } from '../../app/store';
import { unsetUser } from './usersSlice';

export const register = createAsyncThunk<
  User,
  RegisterMutation,
  { rejectValue: ValidationError }
>('users/register', async (registerForm, { rejectWithValue }) => {
  try {
    const { email, displayName, avatar, password } = registerForm;
    const formData = new FormData();

    formData.append('email', email);
    formData.append('displayName', displayName);
    if (avatar) {
      formData.append('avatar', avatar);
    }
    formData.append('password', password);
    const response = await axiosApi.post<RegisterResponse>('/users', formData);
    return response.data.user;
  } catch (error) {
    if (
      isAxiosError(error) &&
      error.response &&
      error.response.status === 400
    ) {
      return rejectWithValue(error.response.data as ValidationError);
    }
    throw error;
  }
});

export const login = createAsyncThunk<
  User,
  LoginMutation,
  { rejectValue: GlobalError }
>('users/login', async (loginMutation, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post<RegisterResponse>(
      '/users/sessions',
      loginMutation,
    );
    return response.data.user;
  } catch (error) {
    if (
      isAxiosError(error) &&
      error.response &&
      error.response.status === 400
    ) {
      return rejectWithValue(error.response.data);
    }

    throw error;
  }
});

export const loginWithGoogle = createAsyncThunk<
  User,
  string,
  { rejectValue: GlobalError }
>('users/loginWithGoogle', async (credential, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post<RegisterResponse>(
      '/users/sessions/google',
      { credential },
    );
    return response.data.user;
  } catch (error) {
    if (
      isAxiosError(error) &&
      error.response &&
      error.response.status === 400
    ) {
      return rejectWithValue(error.response.data);
    }

    throw error;
  }
});

export const logout = createAsyncThunk<void, undefined, { state: RootState }>(
  'users/logout',
  async (_, { dispatch }) => {
    await axiosApi.delete('/users/sessions');
    dispatch(unsetUser());
  },
);
