import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button ,Box,Typography } from '@mui/material';
import { hideDialogAction } from './Actions'; // Import the hide action
import { useNavigate } from 'react-router-dom';
import LockClockIcon from '@mui/icons-material/LockClock';

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
<Dialog
  open={showDialog}
  onClose={(event, reason) => {
    // Force the user to click OK instead of closing by clicking outside or pressing Esc
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
    handleClose();
  }}
  PaperProps={{
    sx: {
      borderRadius: '16px',
      minWidth: 340,
      maxWidth: 380,
      overflow: 'hidden',
      boxShadow: '0 12px 40px rgba(36,56,99,0.25)',
    },
  }}
  slotProps={{
    backdrop: {
      sx: {
        backgroundColor: 'rgba(36,56,99,0.35)',
        backdropFilter: 'blur(3px)',
      },
    },
  }}
>
  {/* Top accent bar */}
  <Box
    sx={{
      height: 6,
      background: 'linear-gradient(135deg, #6d8ef5 0%, #4975db 50%, #3f5483 100%)',
    }}
  />

  <DialogContent
    sx={{
      textAlign: 'center',
      px: 4,
      pt: 3.5,
      pb: 2,
      background: 'linear-gradient(135deg, #f8fafc 0%, #eef4ff 60%, #dbeafe 100%)',
    }}
  >
    {/* Icon */}
    <Box
      sx={{
        width: 68,
        height: 68,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6d8ef5 0%, #4975db 50%, #3f5483 100%)',
        boxShadow: '0 6px 16px rgba(73,117,219,0.35), 0 0 0 8px rgba(109,142,245,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mx: 'auto',
        mb: 2.5,
      }}
    >
      <LockClockIcon sx={{ fontSize: 34, color: '#fff' }} />
    </Box>

    {/* Title */}
    <Typography sx={{ fontSize: 19, fontWeight: 700, color: '#243863' }}>
      Session Expired
    </Typography>

    {/* Message */}
    <Typography sx={{ fontSize: 13.5, color: '#5b6b8c', mt: 1, lineHeight: 1.6 }}>
      Your session has expired.
      <br />
      Please log in again to continue.
    </Typography>
  </DialogContent>

  <DialogActions
    sx={{
      justifyContent: 'center',
      px: 4,
      pb: 3,
      pt: 1,
      backgroundImage: 'linear-gradient(135deg, #eef4ff 0%, #dbeafe 100%)',
    }}
  >
    <Button
      onClick={handleClose}
      variant="contained"
      autoFocus
      sx={{
        minWidth: 160,
        height: 40,
        textTransform: 'none',
        borderRadius: '9px',
        fontSize: 14,
        fontWeight: 600,
        color: '#f5f7fa',
        background: 'linear-gradient(135deg, #6d8ef5 0%, #4975db 50%, #3f5483 100%)',
        boxShadow: '0 4px 10px rgba(73,117,219,0.35)',
        '&:hover': {
          background: 'linear-gradient(135deg, #7b99f8 0%, #5b84e9 50%, #4a618f 100%)',
          boxShadow: '0 6px 14px rgba(73,117,219,0.45)',
        },
      }}
    >
      Log In Again
    </Button>
  </DialogActions>
</Dialog>
  );
};

export default DialogComponent;
