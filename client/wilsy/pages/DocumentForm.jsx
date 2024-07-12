import React, { useState, useEffect } from 'react';
import {
    Button, TextField, FormControl, InputLabel, Select, MenuItem,
    Box, Grid, Typography, Alert
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, Grid, Typography, Alert } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik'; // Import Formik components
import * as Yup from 'yup';
import apiService from '../services/apiService';
import { useNavigate, useParams } from 'react-router-dom';
import authService from '../services/authService';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import apiService from '../services/apiService';
import { useNavigate, useParams } from 'react-router-dom';
import authService from '../services/authService';

const validationSchema = Yup.object({
    documentId: Yup.string().required('Document ID is required'),
    caseNumber: Yup.string(),
    client: Yup.string().required('Client is required'),
    plaintiff: Yup.string().required('Required'),
    defendant: Yup.string().required('Required'),
    addressToServe: Yup.object().shape({
        addressLine1: Yup.string().required('Required'),
        addressLine2: Yup.string(),
        city: Yup.string().required('Required'),
        province: Yup.string().required('Required'),
        postalCode: Yup.string().required('Required'),
    }),
    documentType: Yup.string().required('Required').oneOf(['Directive Execution', 'Combined Summons', 'Notice of Motion', 'Urgent Application', 'Interlocutory Application']),
    serviceStatus: Yup.string().oneOf(['Pending', 'In Progress', 'Served', 'Unserved']),
    assignedDeputy: Yup.string(),
    location: Yup.string().oneOf(['Office', 'Deputy', 'Client', 'Courier', 'Post']),
    attempts: Yup.array().of(
        Yup.object().shape({
            date: Yup.date(),
            time: Yup.string(),
            notes: Yup.string(),
            deputy: Yup.string(),
        })
    ),
    serviceDetails: Yup.object().shape({
        date: Yup.date(),
        time: Yup.string(),
        method: Yup.string(),
        deputy: Yup.string(),
    }),
    feesAndExpenses: Yup.array().of(
        Yup.object().shape({
            description: Yup.string(),
            amount: Yup.number(),
        })
    ),
    notes: Yup.string(),
    additionalDocuments: Yup.array().of(Yup.string()),
});

function DocumentForm() {
    const navigate = useNavigate();
    const { documentId } = useParams();
    const isEditing = !!documentId;

    const [initialValues, setInitialValues] = useState({
        documentId: '',
        caseNumber: '',
        client: '', // You might want to change this to an object for selecting the client from a dropdown
        plaintiff: '',
        defendant: '',
        addressToServe: {
            addressLine1: '',
            addressLine2: '',
            city: '',
            province: '',
            postalCode: '',
        },
        documentType: '', // Empty initially if there is no default
        serviceStatus: 'Pending', // Initial status
        assignedDeputy: '', // You might want to change this to an object for selecting a deputy
        location: 'Office',
        attempts: [],
        serviceDetails: null, // Initialize as null since it might not be filled in immediately
        feesAndExpenses: [],
        notes: '',
        additionalDocuments: [],
    });

    const [loading, setLoading] = useState(isEditing); // Load only if editing
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocument = async () => {
            if (isEditing) {
                try {
                    const response = await apiService.get(`/documents/${documentId}`);
                    setInitialValues(response.data);
                } catch (err) {
                    setError(err.response?.data?.message || 'Error fetching document');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchDocument();
    }, [documentId, isEditing]);

    const handleSubmit = async (values) => {
        try {
            if (isEditing) {
                await apiService.put(`/documents/${documentId}`, values);
            } else {
                await apiService.post('/documents', values);
            }
            navigate('/documents');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    // Form fields using Material UI
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {/* Render your form with Material UI components here */}
        </Formik>
    );
}

export default DocumentForm;
