import React, { useState, useEffect } from 'react';
import {
    Button, TextField, FormControl, InputLabel, Select, MenuItem,
    Box, Grid, Typography, Alert, Autocomplete, Divider, FormGroup,
    FormLabel, FormControlLabel, Checkbox, Chip, CircularProgress
} from '@mui/material';
import { Formik, Form, Field, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import apiService from '../services/apiService';
import { useNavigate, useParams } from 'react-router-dom';
import authService from '../services/authService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

const documentValidationSchema = Yup.object().shape({
    documentId: Yup.string().required('Document ID is required'),
    caseNumber: Yup.string(),
    client: Yup.object().required('Client is required').nullable(),
    plaintiff: Yup.string().required('Plaintiff is required'),
    defendant: Yup.string().required('Defendant is required'),
    addressToServe: Yup.object().shape({
        addressLine1: Yup.string().required('Required'),
        addressLine2: Yup.string(),
        city: Yup.string().required('Required'),
        province: Yup.string().required('Required'),
        postalCode: Yup.string().required('Required'),
    }),
    documentType: Yup.string()
        .required('Required')
        .oneOf(
            ['Directive Execution', 'Combined Summons', 'Notice of Motion', 'Urgent Application', 'Interlocutory Application'],
            'Invalid document type'
        ),
    serviceStatus: Yup.string().oneOf(['Pending', 'In Progress', 'Served', 'Unserved']),
    assignedDeputy: Yup.object().nullable(),
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
        date: Yup.date().nullable(), // Allow null for service date
        time: Yup.string(),
        method: Yup.string(),
        deputy: Yup.string(),
    }),
    feesAndExpenses: Yup.array().of(
        Yup.object().shape({
            description: Yup.string(),
            amount: Yup.number().min(0).required('Required'),
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
        client: null,
        plaintiff: '',
        defendant: '',
        addressToServe: {
            addressLine1: '',
            addressLine2: '',
            city: '',
            province: '',
            postalCode: '',
        },
        documentType: '',
        serviceStatus: 'Pending',
        assignedDeputy: null,
        location: 'Office',
        attempts: [],
        serviceDetails: null,
        feesAndExpenses: [],
        notes: '',
        additionalDocuments: [],
    });
    const [loading, setLoading] = useState(isEditing);
    const [error, setError] = useState(null);
    const [clients, setClients] = useState([]);
    const [deputies, setDeputies] = useState([]);

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const clientResponse = await apiService.get('/clients');
                setClients(clientResponse.data);

                const deputyResponse = await apiService.get('/deputies');
                setDeputies(deputyResponse.data);

                if (isEditing) {
                    const documentResponse = await apiService.get(`/documents/${documentId}`);
                    const formattedDocument = {
                        ...documentResponse.data,
                        serviceDetails: documentResponse.data.serviceDetails
                            ? {
                                ...documentResponse.data.serviceDetails,
                                date: dayjs(documentResponse.data.serviceDetails.date),
                            }
                            : null,
                        attempts: documentResponse.data.attempts.map((attempt) => ({
                            ...attempt,
                            date: dayjs(attempt.date),
                        })),
                        // Convert additional date fields (if any) to dayjs objects
                    };
                    setInitialValues(formattedDocument);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching data');
                toast.error(err.response?.data?.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchFormData();
    }, [documentId, isEditing]);

    const handleSubmit = async (values) => {
        try {
            // Convert Day.js dates back to regular Date objects
            const formattedValues = {
                ...values,
                serviceDetails: values.serviceDetails
                    ? {
                        ...values.serviceDetails,
                        date: values.serviceDetails.date.toDate(),
                    }
                    : null,
                attempts: values.attempts.map((attempt) => ({
                    ...attempt,
                    date: attempt.date.toDate(),
                })),
            };

            if (isEditing) {
                // Update existing document
                await apiService.put(`/documents/${documentId}`, formattedValues);
                toast.success('Document updated successfully');
            } else {
                // Create new document
                await apiService.post('/documents', formattedValues);
                toast.success('Document created successfully');
            }
            navigate('/documents');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            toast.error(err.response?.data?.message || 'An error occurred');
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema: documentValidationSchema,
        onSubmit: handleSubmit,
    });

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <FormikProvider value={formik}>
            <Form>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="documentId"
                            name="documentId"
                            label="Document ID"
                            {...formik.getFieldProps('documentId')}
                            error={formik.touched.documentId && Boolean(formik.errors.documentId)}
                            helperText={formik.touched.documentId && formik.errors.documentId}
                            disabled={isEditing}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="caseNumber"
                            name="caseNumber"
                            label="Case Number"
                            {...formik.getFieldProps('caseNumber')}
                            error={formik.touched.caseNumber && Boolean(formik.errors.caseNumber)}
                            helperText={formik.touched.caseNumber && formik.errors.caseNumber}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Autocomplete
                            id="client"
                            options={clients}
                            getOptionLabel={(client) => client.name}
                            value={clients.find(client => client._id === formik.values.client?._id) || null} // Find the client object
                            onChange={(event, newValue) => formik.setFieldValue('client', newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Client"
                                    error={formik.touched.client && Boolean(formik.errors.client)}
                                    helperText={formik.touched.client && formik.errors.client}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="plaintiff"
                            name="plaintiff"
                            label="Plaintiff"
                            {...formik.getFieldProps('plaintiff')}
                            error={formik.touched.plaintiff && Boolean(formik.errors.plaintiff)}
                            helperText={formik.touched.plaintiff && formik.errors.plaintiff}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="defendant"
                            name="defendant"
                            label="Defendant"
                            {...formik.getFieldProps('defendant')}
                            error={formik.touched.defendant && Boolean(formik.errors.defendant)}
                            helperText={formik.touched.defendant && formik.errors.defendant}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="document-type-label">Document Type</InputLabel>
                            <Select
                                labelId="document-type-label"
                                id="documentType"
                                name="documentType"
                                {...formik.getFieldProps('documentType')}
                                error={formik.touched.documentType && Boolean(formik.errors.documentType)}
                                helperText={formik.touched.documentType && formik.errors.documentType}
                            >
                                <MenuItem value="Directive Execution">Directive Execution</MenuItem>
                                <MenuItem value="Combined Summons">Combined Summons</MenuItem>
                                <MenuItem value="Notice of Motion">Notice of Motion</MenuItem>
                                <MenuItem value="Urgent Application">Urgent Application</MenuItem>
                                <MenuItem value="Interlocutory Application">Interlocutory Application</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Button color="primary" variant="contained" onClick={formik.handleSubmit}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Form>
        </FormikProvider>
    );
}

export default DocumentForm;
