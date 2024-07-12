import React, { useEffect, useState } from 'react';
import { Grid, Typography, Paper } from '@mui/material';
import apiService from '../services/apiService';
import authService from '../services/authService';
import './Dashboard.css'; // Import your CSS file for styling

function Dashboard() {
    const userRole = authService.getUserRole();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await apiService.get(`/dashboard/${userRole}`);
                setDashboardData(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [userRole]);

    if (loading) return <Typography variant="h6">Loading dashboard...</Typography>;
    if (error) return <Typography variant="h6" color="error">Error: {error}</Typography>;

    return (
        <Grid container spacing={3} className="dashboard-container">
            {userRole === 'attorney' && (
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} className="dashboard-card">
                        <Typography variant="h5" component="div">
                            Attorney Dashboard
                        </Typography>
                        <Typography variant="body1">
                            Pending Files: {dashboardData.pendingFiles}
                        </Typography>
                        <Typography variant="body1">
                            Completed Files: {dashboardData.completedFiles}
                        </Typography>
                        {/* Add more attorney-specific metrics */}
                    </Paper>
                </Grid>
            )}

            {userRole === 'sheriff' && (
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} className="dashboard-card">
                        <Typography variant="h5" component="div">
                            Sheriff Dashboard
                        </Typography>
                        <Typography variant="body1">
                            Assigned Documents: {dashboardData.assignedDocuments}
                        </Typography>
                        <Typography variant="body1">
                            Completed Services: {dashboardData.completedServices}
                        </Typography>
                        {/* Add more sheriff-specific metrics */}
                    </Paper>
                </Grid>
            )}

            {userRole === 'admin' && (
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} className="dashboard-card">
                        <Typography variant="h5" component="div">
                            Admin Dashboard
                        </Typography>
                        <Typography variant="body1">
                            Total Clients: {dashboardData.totalClients}
                        </Typography>
                        <Typography variant="body1">
                            Total Deputies: {dashboardData.totalDeputies}
                        </Typography>
                        {/* Add more admin-specific metrics and controls */}
                    </Paper>
                </Grid>
            )}
        </Grid>
    );
}

export default Dashboard;
