import { Route, Routes } from 'react-router-dom';
import Appbar from './components/Appbar/Appbar';
import { Typography } from '@mui/material';
import Register from './containers/Register/Register';
import Login from './containers/Login/Login';

const App = () => {
  return (
    <>
      <header>
        <Appbar />
      </header>
      <main>
        <Routes>
          <Route path='/' element='Home' />
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
