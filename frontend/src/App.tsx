import { Route, Routes } from 'react-router-dom';
import Appbar from './components/Appbar/Appbar';
import { Typography } from '@mui/material';
import Register from './containers/Register/Register';
import Login from './containers/Login/Login';
import NewCocktail from './containers/NewCocktail/NewCocktail';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { useAppSelector } from './app/hooks';
import { selectUser } from './store/users/usersSlice';
import Cocktails from './containers/Cocktails/Cocktails';
import OneCocktail from './containers/OneCocktail/OneCocktail';

const App = () => {
  const user = useAppSelector(selectUser);
  const roles = ['user', 'admin'];
  return (
    <>
      <header>
        <Appbar />
      </header>
      <main>
        <Routes>
          <Route path='/' element={<Cocktails />} />
          <Route path='/cocktails/:id' element={<OneCocktail />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route
            path='/cocktails/new'
            element={
              <ProtectedRoute isAllowed={user && roles.includes(user.role)}>
                <NewCocktail />
              </ProtectedRoute>
            }
          />
          <Route
            path='*'
            element={
              <Typography variant='h2' sx={{ textAlign: 'center', mt: 4 }}>
                Not Found.
              </Typography>
            }
          />
        </Routes>
      </main>
    </>
  );
};

export default App;
