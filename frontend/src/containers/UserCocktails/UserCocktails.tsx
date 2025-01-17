import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchUserCocktails } from '../../store/cocktails/cocktailsThunks';
import {
  selectCocktails,
  selectCocktailsLoading,
} from '../../store/cocktails/cocktailsSlice';
import {
  Box,
  Card,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { apiUrl } from '../../constants';
import { Link } from 'react-router-dom';

const UserCocktails: React.FC = () => {
  const dispatch = useAppDispatch();
  const cocktails = useAppSelector(selectCocktails);
  const loading = useAppSelector(selectCocktailsLoading);

  const getUserCocktails = async () => {
    await dispatch(fetchUserCocktails());
  };

  useEffect(() => {
    void getUserCocktails();
  }, []);

  let content = (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress size={'3rem'} sx={{ mt: 2 }} />
    </Box>
  );

  if (cocktails.length > 0 && !loading) {
    content = (
      <>
        <Typography variant='h5' color='green' sx={{ mt: 2, mb: 1 }}>
          Published
        </Typography>
        <Grid container sx={{ display: 'flex', gap: 2 }}>
          {cocktails.map((cocktail) => (
            <Link
              to={`/cocktails/${cocktail._id}/byUser`}
              style={{
                textDecoration: 'none',
                display: cocktail.isPublished ? 'block' : 'none',
              }}
              key={cocktail._id}
            >
              <Card
                sx={{
                  p: 1,
                  backgroundColor: '#fff9f1',
                  height: '100%',
                }}
              >
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
        <Divider sx={{ mt: 3 }} />
        <Typography variant='h5' color='gray' sx={{ mt: 2, mb: 1 }}>
          Unpublished
        </Typography>
        <Grid container sx={{ display: 'flex', gap: 2 }}>
          {cocktails.map((cocktail) => (
            <Link
              to={`/cocktails/${cocktail._id}/byUser`}
              style={{
                textDecoration: 'none',
                display: cocktail.isPublished ? 'none' : 'block',
              }}
              key={cocktail._id}
            >
              <Card
                sx={{
                  p: 1,
                  backgroundColor: '#fff9f1',
                  height: '100%',
                }}
              >
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
      </>
    );
  } else if (cocktails.length === 0 && !loading) {
    content = (
      <Typography variant='h5' textAlign={'center'} mt={3}>
        No cocktails yet. <Link to={'/cocktails/new'}>Add your first!</Link>
      </Typography>
    );
  }
  return (
    <Container sx={{ py: 5 }}>
      <Typography variant='h4'>My Cocktails</Typography>
      {content}
    </Container>
  );
};

export default UserCocktails;
