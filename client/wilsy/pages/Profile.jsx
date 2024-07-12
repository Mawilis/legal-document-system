import React, { useEffect, useState } from 'react';
import { Typography, Box, Divider, TextField, Button, Alert } from '@mui/material';
import apiService from '../services/apiService';
import authService from '../services/authService';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    phoneNumber: Yup.string().required('Required'),
    // Add more validation rules for other fields as needed
});

function Profile() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); // State for success message
    const userRole = authService.getUserRole();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiService.get(`/users/profile/${userRole}/${authService.getUserId()}`);
                setProfileData(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userRole]);

    const formik = useFormik({
        initialValues: profileData || { name: '', email: '', phoneNumber: '' },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const response = await apiService.put(`/users/${authService.getUserId()}`, values);
                setProfileData(response.data); // Update profile data after successful update
                setSuccessMessage('Profile updated successfully');
                setError(null); // Clear any previous errors
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred');
                setSuccessMessage(null); // Clear any previous success message
            }
        }
    });

    if (loading) return <Typography variant="h6">Loading profile...</Typography>;
    if (error) return <Typography variant="h6" color="error">Error: {error}</Typography>;

    return (
        <Box className="profile-details">
            <Typography variant="h4">Profile</Typography>
            <Divider />

            {/* Success message display */}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}

            <form onSubmit={formik.handleSubmit}>
                <TextField
                    label="Name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    fullWidth
                    margin="normal"
                />

                {/* Similar TextField components for email and phoneNumber */}
                <TextField
                    label="Email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                    fullWidth
                    margin="normal"
                />

                {/* Add more fields based on the role if needed */}
                {userRole === 'sheriff' && (
                    <TextField
                        label="Office"
                        name="office"
                        value={formik.values.office}
                        onChange={formik.handleChange}
                        disabled // Disable office field for sheriff, as it cannot be changed here
                        fullWidth
                        margin="normal"
                    />
                )}

                <Button type="submit" variant="contained" color="primary">
                    Save Changes
                </Button>
            </form>
        </Box>
    );
}

export default Profile;
