import React, { useEffect, useState } from 'react';
import { Grid, Typography, Paper, Button } from '@mui/material';
import DocumentCard from '../components/DocumentCard';
import apiService from '../services/apiService';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './Documents.css';
import { ToastContainer } from 'react-toastify';

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await apiService.get('/documents');
        setDocuments(response.data);
      } catch (err) {
        // Error is handled by apiService interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const handleCreateDocument = () => {
    navigate('/documents/new'); 
  };

  return (
    <div className="documents-page">
      <ToastContainer /> {/* Add ToastContainer for notifications */}
      <Typography variant="h4" gutterBottom>
        Documents
      </Typography>

      {/* Only show Create New Document button for attorneys */}
      {authService.getUserRole() === 'attorney' && (
        <Button variant="contained" color="primary" onClick={handleCreateDocument}>
          Create New Document
        </Button>
      )}
      <Grid container spacing={3}>
      {loading ? (
        <Typography variant="h6">Loading documents...</Typography>
      ) : error ? (
        <Typography variant="h6" color="error">Error: {error}</Typography>
      ) : (
        documents.map(doc => (
          <Grid item xs={12} sm={6} md={4} key={doc._id}>
            <DocumentCard document={doc} />
          </Grid>
        ))
      )}
      </Grid>
    </div>
  );
}

export default Documents;
