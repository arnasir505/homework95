import React, { useState } from 'react';
import { User } from '../../types';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectLogoutLoading } from '../../store/users/usersSlice';
import { logout } from '../../store/users/usersThunk';
import {
  Avatar,
  Button,
  CircularProgress,
  Menu,
  MenuItem,
} from '@mui/material';
import { apiUrl } from '../../constants';

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const dispatch = useAppDispatch();
  const [anchorEl, setAncorEl] = useState<HTMLElement | null>(null);
  const loading = useAppSelector(selectLogoutLoading);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAncorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAncorEl(null);
  };

  const handleLogout = async () => {
    await dispatch(logout());
  };

  return (
    <>
      <Button color='inherit' onClick={handleClick}>
        <Avatar
          src={
            user.avatar?.includes('google')
              ? user.avatar
              : `${apiUrl}/${user.avatar}`
          }
          sx={{ width: 35, height: 35, mr: 1 }}
          alt={user.displayName[0]}
        />
        {user.displayName}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        keepMounted
      >
        <Link
          to='/cocktails/new'
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          <MenuItem>Add Cocktail</MenuItem>
        </Link>
        <Link
          to='/my-cocktails'
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          <MenuItem>My cocktails</MenuItem>
        </Link>
        {user.role === 'admin' && (
          <Link
            to='/admin'
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            <MenuItem>Admin</MenuItem>
          </Link>
        )}
        <MenuItem onClick={handleLogout}>
          {loading && <CircularProgress size={20} sx={{ mr: 1 }} />}
          Log out
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
