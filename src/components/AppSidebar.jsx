import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CCloseButton,
  CNavLink,
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { sygnet } from 'src/assets/brand/Sygnet';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import MenuIcon from '@mui/icons-material/Menu';
import GroupsIcon from '@mui/icons-material/Groups';
import MultipleStopIcon from '@mui/icons-material/MultipleStop';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GradingIcon from '@mui/icons-material/Grading';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SourceIcon from '@mui/icons-material/Source';
import getReduxState from '../ReduxState';
import ArticleIcon from '@mui/icons-material/Article';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
// import LookUpEntry from '../views/base/Lookup Entry/LookUpEntry';
import { encryptAES } from '../utils/Encryption';
import axiosInstance from '../axios';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import Leads from '../views/base/Leads/Leads';

const AppSidebar = () => {

  const { deptid, name, Image, dept, role, empId } = getReduxState()

  const encryptionKey = "sblw-3hn8-sqoy19";
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);

  const navigate = useNavigate();
  const location = useLocation();

  const [hovered, setHovered] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [visible, setVisible] = useState(false)

  const isActive = (path) => location.pathname === path;

  const getNavStyle = (path) => {
    const active = isActive(path) || hovered === path;


    return {
      display: 'block',
      width: '100%',
      padding: '10px 14px',
      borderRadius: '10px',
      marginBottom: '6px',
      backgroundColor: active ? 'rgba(255,255,255,0.08)' : 'transparent',
      color: active ? '#fff' : '#b8c2cc',
      transform: active ? 'translateX(2px)' : 'translateX(0px)',
      transition: 'all 0.25s ease',
      cursor: 'pointer',
      textDecoration: 'none',
    };
  };

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



  const renderItem = (path, Icon, label) => {

    const active =
      isActive(path) ||
      hovered === path;


    return (

      <CNavLink
        onClick={() => navigate(path)}
        onMouseEnter={() => setHovered(path)}
        onMouseLeave={() => setHovered('')}
        style={{
          margin: '6px 12px',
          padding: '12px 15px',
          borderRadius: '14px',
          cursor: 'pointer',
          textDecoration: 'none',
          background: active ? 'rgba(59,130,246,0.25)' : 'transparent',
          border: active ? '1px solid #fff' : '1px solid transparent',
          transition: '0.3s'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >

          <Icon
            style={{
              fontSize: 24,
              color:
                active ? '#fff' : '#CBD5E1'
            }}
          />

          <span
            style={{
              fontSize: 15,
              fontWeight: active ? 700 : 500,
              color: active ? '#fff' : '#CBD5E1'
            }}
          >
            {label}

          </span>

        </Box>

      </CNavLink>

    );

  };
  // const hasImage = !!Image;
  const hasImage = !!Image && Image !== "null";

  // const sidebarGradient = 'linear-gradient(135deg, #4975db 0%, #12265e 100%)';
  const sidebarGradient = " #243863";

  return (
    <>
      <CSidebar
        position="fixed"
        visible={sidebarShow}
        unfoldable={unfoldable}
        onVisibleChange={(visible) =>
          dispatch({ type: 'set', sidebarShow: visible })
        }
        style={{
          background: sidebarGradient,
        }}
      >
        <CSidebarHeader
          style={{
            height: 190,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: sidebarGradient,
          }}
        >

          <Avatar
            src={
              hasImage
                ? (Image.startsWith("data:")
                  ? Image
                  : `data:image/png;base64,${Image}`)
                : ""
            }
            sx={{
              width: hasImage ? 90 : 75,
              height: hasImage ? 110 : 75,
              border: '3px solid rgba(255,255,255,0.8)',
              boxShadow:
                '0 4px 15px rgba(0,0,0,0.3)',
              p: 0,
              '& img': {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }
            }}
          >
            {!hasImage && (name?.trim()?.charAt(0)?.toUpperCase() || "?")}
          </Avatar>

          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 700,
              color: '#fff',
              textTransform: 'uppercase',
              marginTop: '12px'
            }}>
            {name}
          </Typography>

          <Typography sx={{ fontSize: 14, color: '#fff', }}>
            {dept}
          </Typography>

          {/* <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={28} /> */}
        </CSidebarHeader>

        {/* MENU */}
        <Box
          sx={{
            mt: 1,
            px: 1,
            flex: 1,

            overflowY: 'auto',

            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pb: 2,
            cursor: 'pointer',
            // hide scrollbar
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge

            '&::-webkit-scrollbar': {
              display: 'none', // Chrome/Safari
            },
          }}>
          {renderItem('/dashboard', DashboardIcon, 'DashBoard')}
          {renderItem('/Leads', LeaderboardIcon, 'Leads')}
          {renderItem('/CustomerDetails', GroupsIcon, 'CustomerDetails')}

          {/* {renderItem('/enq', SourceIcon, 'Enquiry')} */}

          {/* LOGOUT */}
          <Box
            onClick={() => setOpenDialog(true)}
            sx={{
              margin: '6px 12px',
              padding: '12px 15px',
              borderRadius: '14px',
              cursor: 'pointer',
              textDecoration: 'none',

              background:
                hovered === 'Exit'
                  ? 'rgba(59,130,246,0.25)'
                  : 'transparent',

              border:
                hovered === 'Exit'
                  ? '1px solid #fff'
                  : '1px solid transparent',

              transition: '0.3s',

              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <LogoutIcon sx={{
              fontSize: 24,
              color:
                hovered === 'Exit'
                  ? '#fff'
                  : '#CBD5E1',
            }} />
            <Typography
              sx={{
                fontSize: 15,
                fontWeight:
                  hovered === 'Exit'
                    ? 700
                    : 500,

                color:
                  hovered === 'Exit'
                    ? '#fff'
                    : '#CBD5E1',
              }}
            >
              Exit
            </Typography>
          </Box>
        </Box>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebar >

      {/* LOGOUT DIALOG */}
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


      <Leads
        visible={visible}
        setVisible={setVisible}
      />


    </>
  );
};

export default React.memo(AppSidebar);