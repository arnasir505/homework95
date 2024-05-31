import { Card, Container, Divider, Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCocktails } from '../../store/cocktails/cocktailsSlice';
import { fetchCocktailsAdmin } from '../../store/cocktails/cocktailsThunks';
import { apiUrl } from '../../constants';

const Admin: React.FC = () => {
  const dispatch = useAppDispatch();
  const cocktails = useAppSelector(selectCocktails);

  const getCocktailsAdmin = async () => {
    await dispatch(fetchCocktailsAdmin());
  };

  useEffect(() => {
    void getCocktailsAdmin();
  }, []);
  return (
    <Container sx={{ py: 5 }}>
      <Typography variant='h5' color='green' sx={{ mt: 2, mb: 1 }}>
        Published
      </Typography>
      <Grid container sx={{ display: 'flex', gap: 2 }}>
        {cocktails.map((cocktail) => (
          <Card
            sx={{
              display: cocktail.isPublished ? 'block' : 'none',
              p: 1,
              backgroundColor: '#fff9f1',
              height: '100%',
            }}
            key={cocktail._id}
          >
            <img
              src={apiUrl + '/' + cocktail.image}
              alt={cocktail.name}
              style={{
                width: '100%',
                maxHeight: '169px',
                objectFit: 'cover',
              }}
            />
            <Typography variant='h5' sx={{ textAlign: 'center' }}>
              {cocktail.name}
            </Typography>
          </Card>
        ))}
      </Grid>
      <Divider sx={{ mt: 3 }} />
      <Typography variant='h5' color='gray' sx={{ mt: 2, mb: 1 }}>
        Unpublished
      </Typography>
      <Grid container sx={{ display: 'flex', gap: 2 }}>
        {cocktails.map((cocktail) => (
          <Card
            sx={{
              display: cocktail.isPublished ? 'none' : 'block',
              p: 1,
              backgroundColor: '#fff9f1',
              height: '100%',
            }}
            key={cocktail._id}
          >
            <img
              src={apiUrl + '/' + cocktail.image}
              alt={cocktail.name}
              style={{
                width: '100%',
                maxHeight: '169px',
                objectFit: 'cover',
              }}
            />
            <Typography variant='h5' sx={{ textAlign: 'center' }}>
              {cocktail.name}
            </Typography>
          </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default Admin;
