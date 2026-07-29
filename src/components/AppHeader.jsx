

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
              borderRadius: 3,
              padding: 1,
              minWidth: 320
            }
          }}
        >
          <DialogContent sx={{ textAlign: 'center', py: 3 }}>

            {/* ICON */}
            <WarningAmberIcon
              sx={{
                fontSize: 50,
                color: '#f57c00',
                mb: 1
              }}
            />

            {/* TITLE */}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Confirm Logout
            </Typography>

            {/* MESSAGE */}
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              Are you sure you want to logout?
            </Typography>

          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: 'center',
              pb: 2,
              gap: 1
            }}
          >
            {/* NO BUTTON */}
            <Button
              onClick={() => setOpenDialog(false)}
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 3
              }}
            >
              Cancel
            </Button>

            {/* YES BUTTON */}
            <Button
              onClick={handleLogout}
              variant="contained"
              color="error"
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0px 4px 10px rgba(0,0,0,0.2)'
                }
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

