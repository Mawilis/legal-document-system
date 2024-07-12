import React from 'react';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './DocumentCard.css'; // Your CSS file for additional styling

function DocumentCard({ document }) {
    const navigate = useNavigate();
    const userRole = authService.getUserRole();

    const handleViewClick = () => {
        navigate(`/documents/${document._id}`); // Navigate to document details page
    };

    const handleEditClick = () => {
        navigate(`/documents/${document._id}/edit`); // Navigate to document edit page
    };

    return (
        <Card className="document-card">
            <CardContent>
                <Typography variant="h5" component="div">
                    {document.documentId} - {document.documentType}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                    Case: {document.caseNumber}
                </Typography>
                <Typography variant="body2">
                    Client: {document.client.name}
                </Typography>
                <Typography variant="body2">
                    Parties: {document.plaintiff} v. {document.defendant}
                </Typography>
                <Typography variant="body2">
                    Status: {document.serviceStatus}
                </Typography>
                {/* Display other relevant document details as needed */}
            </CardContent>
            <CardActions>
                <Button size="small" onClick={handleViewClick}>View</Button>
                {userRole === 'attorney' && (
                    <Button size="small" onClick={handleEditClick}>Edit</Button>
                )}
            </CardActions>
        </Card>
    );
}

export default DocumentCard;
