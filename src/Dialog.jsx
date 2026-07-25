import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { hideDialogAction } from './Actions'; // Import the hide action
import { useNavigate } from 'react-router-dom';

const DialogComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showDialog = useSelector((state) => state.showDialog); // Get showDialog state from Redux

  const handleClose = () => {
    dispatch(hideDialogAction()); 
    setTimeout(()=>{// Hide the dialog
    navigate('/login');
    },200) // Redirect to login after dialog is closed
  };

  return (
    <Dialog open={showDialog} onClose={handleClose} >
      <DialogContent>
        <p>Your session has expired .Please log in again to continue</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}   sx={{
              textTransform: 'none',
              marginRight: 1,
              backgroundColor: 'var(--primary-btn-color)',
              '&:hover': {
                backgroundColor: 'var(--primary-btn-hoverColor)',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
              },
            }}
            variant="contained"
            color="success">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogComponent;
