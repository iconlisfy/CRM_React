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
          background: 'linear-gradient(135deg, #4975db 0%, #12265e 100%)',
          // boxShadow: '4px 0 20px rgba(0,0,0,0.35)',
        }}
      >
        {/* HEADER */}
        <CSidebarHeader 
          style={{
            border:'1px solid',
            height: 190,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #4975db 0%, #12265e 100%)',
            boxShadow: '4px 0 20px rgba(0,0,0,0.35)',
          }}
        >
          {/* <Avatar
            src={
              Image
                ? Image.startsWith("data:")
                  ? Image
                  : `data:image/png;base64,${Image}`
                : ""
            }
            sx={{
              width: 80,
              height:  105,
              p: 0, // remove padding
              '& img': {
                width: '100%',
                height: '100%',
                objectFit: 'cover',   // 🔥 important
                filter: 'contrast(1.1) saturate(1.05) sharpen(0.2)',
              }
            }}
          /> */}

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
            }}>            {name}
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

            // hide scrollbar
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge

            '&::-webkit-scrollbar': {
              display: 'none', // Chrome/Safari
            },
          }}>
          {renderItem('/dashboard', DashboardIcon, 'DashBoard')}
          {/* {renderItem('/Leads', LeaderboardIcon, 'Leads')} */}



          <Box
            onClick={() => setVisible(true)}
            onMouseEnter={() => setHovered('Leads')}
            onMouseLeave={() => setHovered('')}
            sx={{
              margin: '6px 12px',
              padding: '12px 15px',
              borderRadius: '14px',
              cursor: 'pointer',
              textDecoration: 'none',

              background:
                hovered === 'Leads'
                  ? 'rgba(59,130,246,0.25)'
                  : 'transparent',

              border:
                hovered === 'Leads'
                  ? '1px solid #fff'
                  : '1px solid transparent',

              transition: '0.3s',

              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >

            <LeaderboardIcon
              sx={{
                fontSize: 24,
                color:
                  hovered === 'Leads'
                    ? '#fff'
                    : '#CBD5E1',
              }}
            />


            <Typography
              sx={{
                fontSize: 15,
                fontWeight:
                  hovered === 'Leads'
                    ? 700
                    : 500,

                color:
                  hovered === 'Leads'
                    ? '#fff'
                    : '#CBD5E1',
              }}
            >
              Leads
            </Typography>


          </Box>


          {renderItem('/enq', SourceIcon, 'Enquiry')}




          {/* LOGOUT */}
          <Box
            onClick={() => setOpenDialog(true)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              padding: '12px 14px',
              color: '#DC3545',
              cursor: 'pointer',
              // borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.06)',
              },
            }}
          >
            <LogoutIcon style={{ fontSize: 24 }} />
            <span style={{ fontSize: 14, fontWeight: 500 }}>Exit</span>
          </Box>
        </Box>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebar>

      {/* LOGOUT DIALOG */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: { borderRadius: 3, minWidth: 320 },
        }}
      >
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <WarningAmberIcon sx={{ fontSize: 50, color: '#f57c00' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
            Confirm Logout
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Are you sure you want to logout?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 1 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleLogout} variant="contained" color="error">
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