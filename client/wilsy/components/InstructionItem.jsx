import React, { useState } from 'react';
import { ListItem, ListItemText, Collapse, List, ListItemButton, Checkbox, TextField, Button } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import apiService from '../services/apiService';
import authService from '../services/authService';
import './InstructionItem.css'; // Import your CSS file for styling


function InstructionItem({ instruction, onInstructionUpdate }) { // Add onInstructionUpdate prop
    const [open, setOpen] = useState(false);
    const [editInstructions, setEditInstructions] = useState(false);
    const [editedInstructions, setEditedInstructions] = useState(instruction.instructions);
    const [isCompleted, setIsCompleted] = useState(instruction.status === 'Completed');

    const handleClick = () => {
        setOpen(!open);
    };

    const handleEditInstructions = () => {
        setEditInstructions(true);
    };

    const handleSaveInstructions = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await apiService.put(`/instructions/${instruction._id}`, { instructions: editedInstructions }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onInstructionUpdate(instruction._id, editedInstructions);
            setEditInstructions(false);
        } catch (err) {
            // Handle error (display error message, etc.)
            console.error('Error updating instructions:', err);
        }
    };

    const handleCancelEdit = () => {
        setEditedInstructions(instruction.instructions);
        setEditInstructions(false);
    };
    const handleCheckboxChange = async (event) => {
        try {
            const newStatus = event.target.checked ? 'Completed' : 'Pending';
            const token = localStorage.getItem('authToken');
            await apiService.put(`/instructions/${instruction._id}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsCompleted(event.target.checked);
            onInstructionUpdate(instruction._id, newStatus); // Update parent component
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    return (
        <div className="instruction-item">
            <ListItemButton onClick={handleClick}>
                <ListItemText primary={instruction.instructions} secondary={`Case: ${instruction.document.caseNumber}`} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem sx={{ pl: 4 }}>
                        <ListItemText
                            primary={
                                editInstructions ? (
                                    <TextField
                                        value={editedInstructions}
                                        onChange={(e) => setEditedInstructions(e.target.value)}
                                        multiline
                                        fullWidth
                                    />
                                ) : (
                                    instruction.instructions
                                )
                            }
                        />
                    </ListItem>
                    <ListItem sx={{ pl: 4 }}>
                        <ListItemText primary={`Due Date: ${new Date(instruction.dueDate).toLocaleDateString()}`} />
                    </ListItem>
                    {authService.getUserRole() === 'sheriff' && ( // Show checkbox only to sheriff
                        <ListItem sx={{ pl: 4 }}>
                            <Checkbox checked={isCompleted} onChange={handleCheckboxChange} />
                            <ListItemText primary="Mark as Completed" />
                        </ListItem>
                    )}
                    <ListItem sx={{ pl: 4, justifyContent: 'flex-end' }}>
                        {editInstructions ? (
                            <>
                                <Button onClick={handleSaveInstructions}>Save</Button>
                                <Button onClick={handleCancelEdit}>Cancel</Button>
                            </>
                        ) : (
                            authService.getUserRole() === 'attorney' && ( // Show edit button only to attorney
                                <Button onClick={handleEditInstructions}>Edit</Button>
                            )
                        )}
                    </ListItem>
                </List>
            </Collapse>
        </div>
    );
}

export default InstructionItem;
