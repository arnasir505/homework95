import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { CocktailMutation } from '../../types';
import { Delete } from '@mui/icons-material';
import FileInput from '../../components/FileInput/FileInput';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectAddCocktailError,
  selectAddCocktailLoading,
} from '../../store/cocktails/cocktailsSlice';
import { LoadingButton } from '@mui/lab';
import { addCocktail } from '../../store/cocktails/cocktailsThunks';
import { useNavigate } from 'react-router-dom';

const NewCocktail: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectAddCocktailError);
  const loading = useAppSelector(selectAddCocktailLoading);
  const [cocktailForm, setCocktailForm] = useState<CocktailMutation>({
    name: '',
    ingredients: [{ name: '', amount: '' }],
    recipe: '',
    image: null,
  });

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCocktailForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files[0]) {
      setCocktailForm((prevState) => ({ ...prevState, image: files[0] }));
    } else {
      setCocktailForm((prevState) => ({ ...prevState, image: null }));
    }
  };

  const ingredientsChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    const { name, value } = e.target;
    setCocktailForm((prevState) => {
      const updatedInputs = [...prevState.ingredients];
      updatedInputs[index] = { ...updatedInputs[index], [name]: value };
      return { ...prevState, ingredients: updatedInputs };
    });
  };

  const addIngredientInput = () => {
    setCocktailForm((prevState) => ({
      ...prevState,
      ingredients: [...prevState.ingredients, { name: '', amount: '' }],
    }));
  };

  const deleteIngredientInput = (index: number) => {
    const newArray = [...cocktailForm.ingredients];
    newArray.splice(index, 1);
    setCocktailForm((prevState) => ({
      ...prevState,
      ingredients: newArray,
    }));
  };

  const clearCocktailForm = () => {
    setCocktailForm({
      name: '',
      ingredients: [{ name: '', amount: '' }],
      recipe: '',
      image: null,
    });
  };

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  const onCocktailFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(addCocktail(cocktailForm)).unwrap();
    clearCocktailForm();
    navigate('/');
  };
  
  return (
    <Container sx={{ py: 3 }} maxWidth='md'>
      <Typography variant='h4' sx={{ mb: 2 }}>
        Add Cocktail
      </Typography>
      <Box component='form' onSubmit={onCocktailFormSubmit}>
        <Grid container rowSpacing={2}>
          <Grid item xs={12}>
            <TextField
              type='text'
              name='name'
              label='Cocktail name'
              value={cocktailForm.name}
              onChange={inputChangeHandler}
              size='small'
              error={Boolean(getFieldError('name'))}
              helperText={getFieldError('name')}
            />
          </Grid>
          {cocktailForm.ingredients.map((item, index) => (
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', gap: 2, alignItems: 'start' }}
              key={index}
            >
              <TextField
                type='text'
                name='name'
                label='Ingredient'
                autoComplete='ingredient'
                value={item.name}
                onChange={(e) => ingredientsChangeHandler(e, index)}
                size='small'
                sx={{ flexBasis: 1, flexGrow: 2 }}
                error={Boolean(getFieldError(`ingredients.${index}.name`))}
                helperText={getFieldError(`ingredients.${index}.name`)}
              />
              <TextField
                type='text'
                name='amount'
                label='Amount'
                autoComplete='amount'
                value={item.amount}
                onChange={(e) => ingredientsChangeHandler(e, index)}
                size='small'
                sx={{ flexBasis: 1, flexGrow: 1 }}
                error={Boolean(getFieldError(`ingredients.${index}.amount`))}
                helperText={getFieldError(`ingredients.${index}.amount`)}
              />
              {cocktailForm.ingredients.length > 1 && (
                <Button onClick={() => deleteIngredientInput(index)}>
                  <Delete />
                </Button>
              )}
              {index === cocktailForm.ingredients.length - 1 && (
                <Button variant='outlined' onClick={addIngredientInput}>
                  Add Ingredient
                </Button>
              )}
            </Grid>
          ))}
          <Grid item xs={12}>
            <TextField
              type='text'
              multiline
              name='recipe'
              label='Instruction'
              value={cocktailForm.recipe}
              onChange={inputChangeHandler}
              error={Boolean(getFieldError('recipe'))}
              helperText={getFieldError('recipe')}
            />
          </Grid>
          <Grid item xs={12}>
            <FileInput
              name='image'
              label='Image'
              onChange={fileInputChangeHandler}
              error={error}
            />
          </Grid>
          <Grid item xs={12}>
            <LoadingButton variant='contained' type='submit' loading={loading}>
              Add cocktail
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default NewCocktail;
