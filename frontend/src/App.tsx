import { Route, Routes } from 'react-router-dom';
import Appbar from './components/Appbar/Appbar';
import { Typography } from '@mui/material';

const App = () => {
  return (
    <>
      <header>
        <Appbar />
      </header>
      <main>
        <Routes>
          <Route path='/' element='Home' />
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
