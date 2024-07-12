import React, { useEffect, useState } from 'react';
import { Typography, Box, Divider, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import authService from '../services/authService';
import './DocumentDetails.css';

function DocumentDetails() {
    const { documentId } = useParams();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userRole = authService.getUserRole();

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await apiService.get(`/documents/${documentId}`);
                setDocument(response.data);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError('Document not found');
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDocument();
    }, [documentId]);

    const handleEdit = () => {
        navigate(`/documents/${documentId}/edit`);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                await apiService.delete(`/documents/${documentId}`);
                navigate('/documents');
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box className="document-details">
            <Typography variant="h4">Document Details</Typography>
            <Divider />
            <List>
                <ListItem>
                    <ListItemText primary="Document ID:" secondary={document.documentId} />
                </ListItem>
                {/* ... other ListItem components for caseNumber, client, etc. ... */}
            </List>
            <Box mt={2}>
                {userRole === 'attorney' && (
                    <>
                        <Button variant="outlined" color="primary" onClick={handleEdit} sx={{ mr: 2 }}>
                            Edit
                        </Button>
                        <Button variant="outlined" color="error" onClick={handleDelete}>
                            Delete
                        </Button>
                    </>
                )}
            </Box>
        </Box>
    );
}

export default DocumentDetails;
