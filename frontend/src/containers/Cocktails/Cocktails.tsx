import {
  Box,
  Card,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchCocktails } from '../../store/cocktails/cocktailsThunks';
import {
  selectCocktails,
  selectCocktailsLoading,
} from '../../store/cocktails/cocktailsSlice';
import { Link } from 'react-router-dom';
import { apiUrl } from '../../constants';

const Cocktails: React.FC = () => {
  const dispatch = useAppDispatch();
  const cocktails = useAppSelector(selectCocktails);
  const loading = useAppSelector(selectCocktailsLoading);
  
  const getCocktails = async () => {
    await dispatch(fetchCocktails());
  };

  useEffect(() => {
    void getCocktails();
  }, []);

  let content = (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress size={'3rem'} sx={{ mt: 2 }} />
    </Box>
  );

  if (cocktails.length > 0 && !loading) {
    content = (
      <Grid container sx={{ display: 'flex', gap: 2 }}>
        {cocktails.map((cocktail) => (
          <Link
            to={`/cocktails/${cocktail._id}`}
            style={{ textDecoration: 'none', width: '200px' }}
            key={cocktail._id}
          >
            <Card sx={{ p: 1, backgroundColor: '#fff9f1', height: '100%' }}>
              <img
                src={apiUrl + '/' + cocktail.image}
                alt={cocktail.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '169px',
                  objectFit: 'cover',
                }}
              />
              <Typography variant='h5' sx={{ textAlign: 'center' }}>
                {cocktail.name}
              </Typography>
            </Card>
          </Link>
        ))}
      </Grid>
    );
  } else if (cocktails.length === 0 && !loading) {
    content = (
      <Typography variant='h5' textAlign={'center'} mt={3}>
        No cocktails yet.
      </Typography>
    );
  }
  return (
    <Container>
      <Typography
        variant='h3'
        sx={{
          textAlign: 'center',
          my: 3,
          fontWeight: 'bold',
          letterSpacing: '2px',
          backgroundImage: 'linear-gradient(30deg, #cd0303, #ffc400)',
          color: 'transparent',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
        }}
      >
        Explore our drinks
      </Typography>
      {content}
    </Container>
  );
};

export default Cocktails;
