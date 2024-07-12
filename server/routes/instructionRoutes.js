const express = require('express');
const router = express.Router();
const instructionController = require('../controllers/instructionController'); // Make sure this is correct
const authenticateJWT = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.get('/', authenticateJWT, authorizeRoles(['attorney', 'sheriff', 'admin']), instructionController.getAllInstructions);
router.get('/:id', authenticateJWT, authorizeRoles(['attorney', 'sheriff', 'admin']), instructionController.getInstructionById);
router.post('/', authenticateJWT, authorizeRoles(['attorney']), instructionController.createInstruction);
router.put('/:id', authenticateJWT, authorizeRoles(['attorney']), instructionController.updateInstruction);
router.delete('/:id', authenticateJWT, authorizeRoles(['attorney']), instructionController.deleteInstruction);

module.exports = router;

