import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import authService from '../services/authService';

function Header({ isAuthenticated, userRole, onLogout }) {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/">LegalDoc</Link>
                </Typography>
                <Box>
                    {isAuthenticated ? (
                        <>
                            <Button color="inherit" component={Link} to="/">
                                Dashboard
                            </Button>
                            {userRole === 'attorney' && (
                                <Button color="inherit" component={Link} to="/documents">
                                    Documents
                                </Button>
                            )}
                            {userRole === 'sheriff' && (
                                <Button color="inherit" component={Link} to="/instructions">
                                    Instructions
                                </Button>
                            )}
                            <Button color="inherit" component={Link} to="/profile">
                                Profile
                            </Button>
                            <Button color="inherit" onClick={onLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
