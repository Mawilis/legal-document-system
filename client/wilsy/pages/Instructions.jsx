import React, { useEffect, useState } from 'react';
import { Grid, Typography, Paper } from '@mui/material';
import apiService from '../services/apiService';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import InstructionItem from '../components/InstructionItem';
import { ToastContainer } from 'react-toastify';

function Instructions({ onInstructionUpdate }) {
    const [instructions, setInstructions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInstructions = async () => {
            try {
                const response = await apiService.get('/instructions');
                setInstructions(response.data);
            } catch (err) {
                // Error is handled by apiService interceptor
            } finally {
                setLoading(false);
            }
        };

        fetchInstructions();
    }, []);

    // Function to handle updates from InstructionItem
    const handleInstructionUpdate = (updatedInstruction) => {
        setInstructions(prevInstructions =>
            prevInstructions.map(instr =>
                instr._id === updatedInstruction._id ? updatedInstruction : instr
            )
        );
    };

    return (
        <div className="instruction-list">
            <ToastContainer />
            <Typography variant="h4" gutterBottom>Instructions</Typography>
            <Grid container spacing={3}>
                {loading ? (
                    <Typography variant="h6">Loading instructions...</Typography>
                ) : error ? (
                    <Typography variant="h6" color="error">Error: {error}</Typography>
                ) : (
                    instructions.map(instruction => (
                        <Grid item xs={12} sm={6} md={4} key={instruction._id}>
                            <InstructionItem instruction={instruction} onInstructionUpdate={handleInstructionUpdate} />
                        </Grid>
                    ))
                )}
            </Grid>
        </div>
    );
}

export default Instructions;
