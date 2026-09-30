

import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { CContainer, CDropdown, CHeader, CHeaderNav, CHeaderToggler, } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu, } from '@coreui/icons'
import './AppHeader.css';
import { Menu, Grid, MenuItem, useMediaQuery, useTheme, Avatar, Paper, Box, Typography, Fade, Divider, ClickAwayListener, IconButton, Dialog, DialogContent, DialogActions, Button, Popover } from '@mui/material';
import axiosInstance from '../axios'
import { decryptData, encryptAES } from '../utils/Encryption'
import getReduxState from '../ReduxState'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import iconlogo from '../assets/images/iconinfoware logo.png'
import NotificationsIcon from '@mui/icons-material/Notifications';
import InputIcon from '@mui/icons-material/Input';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LogoutIcon from '@mui/icons-material/Logout';

const AppHeader = () => {
  const encryptionKey = "sblw-3hn8-sqoy19";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username, dept, empId } = getReduxState();

  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const handleNotifOpen = (event) => setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);
  const notifOpen = Boolean(notifAnchorEl);

  // const username = decryptData(username, encryptionKey)
  const headerRef = useRef()
  const [openDialog, setOpenDialog] = useState(false);

  const [openChangePassword, setOpenChangePassword] = useState(false);

  const handleLogout = async () => {

    const encryptedempId = encryptAES(empId.toString(), encryptionKey);
    try {
      if (encryptedempId) {
        console.log('empkey', empId);


        // API call to log out the user
        const response = await axiosInstance.post(
          `/UserLogin/LoginByUsername?encryptedEMPID=${encryptedempId}`
        );

        if (response.status === 200) {
          console.log("Logout successful");
          dispatch({ type: 'Logout' });

          // Redirect to login page
          navigate("/login");
        } else {
          console.error("Logout failed");
        }
      } else {
        console.error("Employee ID is missing");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
    finally {
      setOpenDialog(false); // close dialog
    }
  }


  const sidebarShow = useSelector((state) => state.sidebarShow);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null); // Close the menu
  };


  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if it's mobile view
  const toggleCard = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  return (
    <CHeader position="sticky" className="mb-4 p-0 c-header" ref={headerRef} style={{ backgroundColor: '#ffffff' }}>
      <CContainer className="" fluid>

        <Grid container alignItems="center" >

          {/* MENU BUTTON */}
          <CHeaderToggler
            onClick={() =>
              dispatch({
                type: 'set',
                payload: { sidebarShow: !sidebarShow },
              })
            }
            style={{ marginInlineStart: '-8px' }}
          >
            <CIcon
              icon={cilMenu}
              size="lg"
              style={{
                color: '#2f4050',
                transform: 'scale(1.15)',
              }}
            />
          </CHeaderToggler>

          {/* LOGO */}
          <Grid item sx={{ ml: 1 }} >
            <Box
              component="img"
              src={iconlogo}
              alt="Logo"
              sx={{
                width: 200,
                height: 'auto',
              }}
            />
          </Grid>

          {/* PUSH RIGHT CONTENT */}
          <Box sx={{ flexGrow: 1 }} />

          {/* RIGHT SECTION */}
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>

              <Typography
                sx={{
                  fontSize: '1rem',
                  // fontWeight: 600,
                  color: 'grey',
                  whiteSpace: 'nowrap'
                }}>
                Welcome to Icon Infoware Technologies!
              </Typography>


              {/* USER */}
              <Box
                sx={{
                  py: 1.5,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <IconButton
                  onClick={() => setOpenDialog(true)}
                  sx={{
                    color: 'action.active',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontWeight: 600, // applies to text inside
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                    }
                  }}
                >
                  <LogoutIcon sx={{ fontSize: 24 }} />  {/* slightly bigger = bolder look */}

                  <Typography
                    sx={{
                      fontSize: '0.90rem',
                      fontWeight: 600   // ✅ bold text
                    }}
                  >
                    Logout
                  </Typography>
                </IconButton>
              </Box>

            </Box>
          </Grid>

        </Grid>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              minWidth: 340,
              maxWidth: 380,
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(36,56,99,0.25)',
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
              pb: 2.5,
              background: 'linear-gradient(135deg, #f8fafc 0%, #eef4ff 60%, #dbeafe 100%)',
            }}
          >
            {/* ICON */}
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6d8ef5 0%, #4975db 50%, #3f5483 100%)',
                boxShadow: '0 6px 16px rgba(73,117,219,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <LogoutIcon sx={{ fontSize: 30, color: '#fff' }} />
            </Box>

            {/* TITLE */}
            <Typography sx={{ fontSize: 19, fontWeight: 700, color: '#243863' }}>
              Confirm Logout
            </Typography>

            {/* MESSAGE */}
            <Typography sx={{ fontSize: 13.5, color: '#5b6b8c', mt: 1 }}>
              Are you sure you want to logout?
            </Typography>
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: 'center',
              px: 4,
              pb: 3,
              pt: 0,
              gap: 1.2,
              background: '#dbeafe',
              backgroundImage: 'linear-gradient(135deg, #eef4ff 0%, #dbeafe 100%)',
            }}
          >
            {/* CANCEL */}
            <Button
              onClick={() => setOpenDialog(false)}
              variant="outlined"
              sx={{
                minWidth: 110,
                height: 40,
                textTransform: 'none',
                borderRadius: '9px',
                fontSize: 13.5,
                fontWeight: 600,
                color: '#3f5483',
                borderColor: '#3f5483',
                backgroundColor: '#fff',
                '&:hover': {
                  borderColor: '#243863',
                  backgroundColor: '#eef4ff',
                },
              }}
            >
              Cancel
            </Button>

            {/* LOGOUT */}
            <Button
              onClick={handleLogout}
              variant="contained"
              sx={{
                minWidth: 110,
                height: 40,
                textTransform: 'none',
                borderRadius: '9px',
                fontSize: 13.5,
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
              Logout
            </Button>
          </DialogActions>
        </Dialog>

      </CContainer>
      {/* 
      <ChangePassword
        visible={openChangePassword}
        setVisible={setOpenChangePassword} /> */}

    </CHeader>



  )
}

export default AppHeader

