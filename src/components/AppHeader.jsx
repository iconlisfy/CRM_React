

import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { CContainer, CDropdown, CHeader, CHeaderNav, CHeaderToggler, } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu, } from '@coreui/icons'
import './AppHeader.css';
import { Menu, Grid, MenuItem, useMediaQuery, useTheme, Avatar, Paper, Box, Typography, Fade, Divider, ClickAwayListener, IconButton, Dialog, DialogContent, DialogActions, Button, Popover } from '@mui/material';
import avatar from "../assets/images/trans2.png"
import image from '../assets/images/common.png'
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
import Badge from '@mui/material/Badge';
import { useWorkList } from '../Context/WorkListContext'
import LockIcon from '@mui/icons-material/Lock';
import ChangePassword from '../views/base/Change Password/ChangePassword'
const AppHeader = () => {
  const encryptionKey = "sblw-3hn8-sqoy19";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username, dept, empId } = getReduxState();

  const { transCount, transferData, setSelectedTransData, setShouldHighlight, payableCount, payableData, } = useWorkList();

  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const handleNotifOpen = (event) => setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);
  const notifOpen = Boolean(notifAnchorEl);

  // const username = decryptData(username, encryptionKey)
  const headerRef = useRef()
  const [openDialog, setOpenDialog] = useState(false);

  const [openChangePassword, setOpenChangePassword] = useState(false);

  // const handleLogout = () => {
  //   // 1. Clear Redux state
  //   dispatch({ type: 'Logout' });

  //   // 2. Clear localStorage/sessionStorage if used
  //   localStorage.clear();
  //   sessionStorage.clear();

  //   // 3. Redirect to login page
  //   navigate("/login");

  //   // 4. Close the dialog
  //   setOpenDialog(false);
  // };

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

  const handleSelectTransTkt = (ticketNo) => {
    setSelectedTransData(ticketNo)
    setShouldHighlight(true)
    handleNotifClose();
    navigate('/CurrentWrkList');
  }

  const totalNotificationCount =
    transCount + (dept === "Accounts" ? payableCount : 0);


  //  console.log("payable data", payableData)

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
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'grey',
                  whiteSpace: 'nowrap'
                }}>
                WELCOME TO ICON INFOWARE TECHNOLOGIES
              </Typography>



              <Box sx={{ position: 'relative', display: 'inline-flex' }}>

                <IconButton
                  onClick={() => setOpenChangePassword(true)}
                  size="small"
                  sx={{
                    color: openChangePassword ? '#DC3545' : '#555',
                    '&:hover': { backgroundColor: '#fff0f0', color: '#DC3545' },
                    transition: 'color 0.2s',
                  }}
                >
                  <LockIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={handleNotifOpen}
                  size="small"
                  sx={{
                    color: notifOpen ? '#DC3545' : '#555',
                    '&:hover': { backgroundColor: '#fff0f0', color: '#DC3545' },
                    transition: 'color 0.2s',
                  }}
                >
                  <NotificationsIcon fontSize="small" />
                </IconButton>
                {totalNotificationCount > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 3,
                      backgroundColor: '#DC3545',
                      color: '#fff',
                      borderRadius: '50%',
                      width: 15,
                      height: 15,
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1,
                      pointerEvents: 'none',
                    }}>
                    {totalNotificationCount}
                  </Box>
                )}
              </Box>

              <Popover
                open={notifOpen}
                anchorEl={notifAnchorEl}
                onClose={handleNotifClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                  elevation: 4,
                  sx: {
                    mt: 1,
                    borderRadius: '5px',
                    width: 380,
                    maxHeight: 480,
                    overflow: 'hidden',
                    border: '1px solid #f0f0f0',
                  }
                }}
              >
                {/* <Box sx={{ overflowY: 'auto', maxHeight: 420 }}>
                  {transferData.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '0.85rem', color: '#999' }}>No transfer requests</Typography>
                    </Box>
                  ) : (
                    transferData.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          px: 2, py: 1.5,
                          borderBottom: index < transferData.length - 1 ? '1px solid #f5f5f5' : 'none',
                          '&:hover': { backgroundColor: '#fff8f8' },
                          transition: 'background 0.15s',
                          cursor: 'pointer',
                        }}>

                        <Typography sx={{
                          fontSize: '0.78rem', color: '#212529', mb: 0.5,
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                        }} onClick={() => handleSelectTransTkt(item.TicketNo)}>
                          TransTicket:"{item.TicketNo}" Work Transfered
                          By {item.WorktransferredBy}
                        </Typography>

                      </Box>
                    ))
                  )}
                </Box> */}
                <Box sx={{ overflowY: 'auto', maxHeight: 420 }}>

                  {/* Transfer Notifications */}
                  {transferData.map((item, index) => (
                    <Box
                      key={`transfer-${index}`}
                      sx={{
                        px: 2,
                        py: 1.5,
                        borderBottom: '1px solid #f5f5f5',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleSelectTransTkt(item.TicketNo)}
                    >
                      <Typography sx={{ fontSize: '0.78rem' }}>
                        🔄 Ticket "{item.TicketNo}" transferred by {item.WorktransferredBy}
                      </Typography>
                    </Box>
                  ))}

                  {/* Show only for Accounts */}
                  {dept === "Accounts" &&
                    payableData.map((item, index) => (
                      <Box
                        key={`payable-${index}`}
                        sx={{
                          px: 2,
                          py: 1.5,
                          borderBottom: '1px solid #f5f5f5',
                          backgroundColor: '#fff8e1'
                        }}
                      >
                        <Typography sx={{ fontSize: '0.78rem' }}>
                          💰 Payable Service - Ticket "{item.ticketno}"" CreatedBy:"{item.CreatedBy}"
                        </Typography>
                        {item.PayableServNote && (
                          <Typography
                            sx={{
                              fontSize: '0.72rem',
                              color: '#666',
                              mt: 0.5
                            }}
                          >
                            Note: {item.PayableServNote}
                          </Typography>
                        )}
                      </Box>
                    ))}

                  {transferData.length === 0 &&
                    (dept !== "Accounts" || payableData.length === 0) && (
                      <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '0.85rem', color: '#999' }}>
                          No notifications
                        </Typography>
                      </Box>
                    )}

                </Box>
              </Popover>

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

      <ChangePassword
        visible={openChangePassword}
        setVisible={setOpenChangePassword} />

    </CHeader>



  )
}

export default AppHeader

