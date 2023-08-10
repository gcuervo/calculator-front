import React, { useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom'

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
}));

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const { username } = useContext(AuthContext);


  return (
    <StyledAppBar position="static">
      <Toolbar>
        <StyledTypography variant="h6">
          True North - {username}
        </StyledTypography>
        <Link to="/" relative='path' style={{ textDecoration: 'none' }}>
          <Button style={{ textDecoration: 'none', color: 'white' }}>
            Calculator
          </Button>
        </Link>
        <Link to="/records" relative='path' style={{ textDecoration: 'none' }} >
          <Button style={{ textDecoration: 'none', color: 'white' }} >
            Records
          </Button>
        </Link>

        <Button color="inherit" onClick={logout}>Logout</Button>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
