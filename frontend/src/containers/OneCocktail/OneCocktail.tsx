import {
  Box,
  CircularProgress,
  Container,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectCocktailsLoading,
  selectOneCocktail,
} from '../../store/cocktails/cocktailsSlice';
import { fetchOneCocktail, fetchOneCocktailByUser } from '../../store/cocktails/cocktailsThunks';
import { apiUrl } from '../../constants';

const OneCocktail: React.FC = () => {
  const params = useParams();
  const {pathname} = useLocation();
  const dispatch = useAppDispatch();
  const cocktail = useAppSelector(selectOneCocktail);
  const loading = useAppSelector(selectCocktailsLoading);

  const getOneCocktail = async () => {
    if (params.id) {
      if (pathname.includes('byUser')) {
        await dispatch(fetchOneCocktailByUser(params.id));
      } else {
        await dispatch(fetchOneCocktail(params.id));
      }
    }
  };

  useEffect(() => {
    void getOneCocktail();
  }, []);

  let content = (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress size={'3rem'} sx={{ mt: 2 }} />
    </Box>
  );

  if (cocktail._id && !loading) {
    content = (
      <>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ maxWidth: '400px' }}>
            <img
              src={apiUrl + '/' + cocktail.image}
              alt={cocktail.name}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
              }}
            />
          </Box>
          <Box>
            <Typography variant='h4' sx={{ mb: 2 }}>
              {cocktail.name}
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
              Ingredients:
            </Typography>
            <List dense disablePadding sx={{ listStyleType: 'disc', pl: 4 }}>
              {cocktail.ingredients.map((item) => (
                <ListItem key={item._id} sx={{ display: 'list-item', pl: 0 }}>
                  {item.name} - {item.amount}
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
        <Box>
          <Typography variant='h6' sx={{ fontWeight: 'bold', mt: 1 }}>
            Recipe:
          </Typography>
          <Typography variant='body1' sx={{ fontSize: '1.2rem' }}>
            {cocktail.recipe}
          </Typography>
        </Box>
      </>
    );
  }
  return <Container sx={{ py: 5 }}>{content}</Container>;
};

export default OneCocktail;
