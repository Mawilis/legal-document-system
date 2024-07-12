import React, { useState } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
    username: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
    role: Yup.string().required('Required')
});

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            if (isLogin) {
                await authService.login(values.username, values.password);
                navigate(authService.getUserRole() === 'attorney' ? '/documents' : '/');
            } else {
                await authService.register(values.username, values.password, values.role);
                setIsLogin(true);
                setError('Registration successful. Please log in.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        }
    };


    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Formik
                initialValues={{ username: '', password: '', role: 'sheriff' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
                        <TextField
                            label="Username"
                            name="username"
                            error={touched.username && Boolean(errors.username)}
                            helperText={touched.username && errors.username}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            name="password"
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                        />
                        {!isLogin && (
                            <FormControl fullWidth>
                                <InputLabel id="role-label">Role</InputLabel>
                                <Select
                                    labelId="role-label"
                                    id="role"
                                    name="role"
                                    label="Role"
                                    error={touched.role && Boolean(errors.role)}
                                >
                                    <MenuItem value="sheriff">Sheriff</MenuItem>
                                    <MenuItem value="attorney">Attorney</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </Select>
                                <ErrorMessage name="role" component="div" className="error" />
                            </FormControl>
                        )}
                        {error && <div className="error">{error}</div>}
                        <Button type="submit" variant="contained" color="primary">
                            {isLogin ? 'Login' : 'Register'}
                        </Button>
                        <Button type="button" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Register' : 'Login'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Box>
    );
}

export default Login;
