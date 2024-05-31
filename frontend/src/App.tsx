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
import UserCocktails from './containers/UserCocktails/UserCocktails';
import Admin from './containers/Admin/Admin';

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
          <Route
            path='/cocktails/:id/byUser'
            element={
              <ProtectedRoute isAllowed={user && roles.includes(user.role)}>
                <OneCocktail />
              </ProtectedRoute>
            }
          />
          <Route
            path='/my-cocktails'
            element={
              <ProtectedRoute isAllowed={user && roles.includes(user.role)}>
                <UserCocktails />
              </ProtectedRoute>
            }
          />
          <Route
            path='/cocktails/new'
            element={
              <ProtectedRoute isAllowed={user && roles.includes(user.role)}>
                <NewCocktail />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin'
            element={
              <ProtectedRoute isAllowed={user && user.role === 'admin'}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
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
