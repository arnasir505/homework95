import {
  Box,
  ButtonGroup,
  Card,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectCocktails,
  selectCocktailsLoading,
} from '../../store/cocktails/cocktailsSlice';
import {
  fetchCocktailsAdmin,
  togglePublish,
} from '../../store/cocktails/cocktailsThunks';
import { apiUrl } from '../../constants';
import { Link } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';

const Admin: React.FC = () => {
  const dispatch = useAppDispatch();
  const cocktails = useAppSelector(selectCocktails);
  const loading = useAppSelector(selectCocktailsLoading);
  const [disabledBtn, setDisabledBtn] = useState('');

  const getCocktailsAdmin = async () => {
    await dispatch(fetchCocktailsAdmin());
  };

  const onTogglePublish = async (id: string) => {
    setDisabledBtn(id);
    await dispatch(togglePublish(id));
    setDisabledBtn('')
    void getCocktailsAdmin();
  };

  useEffect(() => {
    void getCocktailsAdmin();
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
            <Card
              sx={{
                p: 1,
                backgroundColor: '#fff9f1',
                display: cocktail.isPublished ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
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
              <Typography variant='h5'>{cocktail.name}</Typography>
              <Link
                to={`/cocktails/${cocktail._id}/admin`}
                style={{
                  color: 'brown',
                }}
              >
                See more
              </Link>
              <ButtonGroup size='small' sx={{ mt: 1 }}>
                <LoadingButton
                  onClick={() => onTogglePublish(cocktail._id)}
                  loading={cocktail._id === disabledBtn}
                >
                  Unpublish
                </LoadingButton>
                <LoadingButton loading={cocktail._id === disabledBtn}>
                  Delete
                </LoadingButton>
              </ButtonGroup>
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
                p: 1,
                backgroundColor: '#fff9f1',
                display: cocktail.isPublished ? 'none' : 'flex',
                flexDirection: 'column',
                alignItems: 'center',
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
              <Typography variant='h5'>{cocktail.name}</Typography>
              <Link
                to={`/cocktails/${cocktail._id}/admin`}
                style={{
                  color: 'brown',
                }}
              >
                See more
              </Link>
              <ButtonGroup size='small' sx={{ mt: 1 }}>
                <LoadingButton
                  onClick={() => onTogglePublish(cocktail._id)}
                  loading={cocktail._id === disabledBtn}
                >
                  Publish
                </LoadingButton>
                <LoadingButton loading={cocktail._id === disabledBtn}>
                  Delete
                </LoadingButton>
              </ButtonGroup>
            </Card>
          ))}
        </Grid>
      </>
    );
  }

  return <Container sx={{ py: 5 }}>{content}</Container>;
};

export default Admin;
