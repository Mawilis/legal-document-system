const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { body } = require('express-validator');
const authenticateJWT = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const documentValidationRules = [
    body('documentId').notEmpty().withMessage('Document ID is required'),
    body('client').notEmpty().withMessage('Client is required'),
    body('plaintiff').notEmpty().withMessage('Plaintiff is required'),
    body('defendant').notEmpty().withMessage('Defendant is required'),
    body('addressToServe').isObject().withMessage('Address to serve is required'),
    body('addressToServe.addressLine1').notEmpty().withMessage('Address Line 1 is required'),
    body('addressToServe.city').notEmpty().withMessage('City is required'),
    body('addressToServe.province').notEmpty().withMessage('Province is required'),
    body('addressToServe.postalCode').notEmpty().withMessage('Postal code is required'),
    body('documentType').notEmpty().withMessage('Document Type is required'),
    // ...other validation rules...
];

router.get('/', authenticateJWT, authorizeRoles(['attorney', 'admin']), documentController.getAllDocuments);
router.post('/', documentValidationRules, authenticateJWT, authorizeRoles(['attorney']), documentController.createDocument);
router.get('/:documentId', authenticateJWT, authorizeRoles(['attorney', 'admin']), documentController.getDocumentById); // Note: Updated route parameter
router.put('/:documentId', documentValidationRules, authenticateJWT, authorizeRoles(['attorney']), documentController.updateDocument);
router.delete('/:documentId', authenticateJWT, authorizeRoles(['attorney']), documentController.deleteDocument);

module.exports = router;

