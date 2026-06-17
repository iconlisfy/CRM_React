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
import LookUpEntry from '../views/base/Lookup Entry/LookUpEntry';
import { encryptAES } from '../utils/Encryption';
import axiosInstance from '../axios';

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
    const active = isActive(path) || hovered === path;

    return (
      <CNavLink
        onClick={() => navigate(path)}
        onMouseEnter={() => setHovered(path)}
        onMouseLeave={() => setHovered('')}
        style={{
          display: 'block',
          width: '100%',
          padding: '10px 14px',
          //  borderRadius: '10px',
          marginBottom: '6px',

          backgroundColor: active
            ? '#fde2e5'            // 🔥 brighter light red
            : 'transparent',

          color: active
            ? '#b02a37'            // 🔥 darker red text (better contrast)
            : 'rgba(220,53,69,0.65)',

          borderLeft: active
            ? '4px solid #DC3545'  // 🔥 thicker highlight
            : '4px solid transparent',

          boxShadow: active
            ? '0 2px 6px rgba(220,53,69,0.2)' // subtle glow
            : 'none',

          transform: active ? 'translateX(3px)' : 'none',

          transition: 'all 0.2s ease',
          cursor: 'pointer',
          textDecoration: 'none',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
          <Icon
            style={{
              fontSize: 24,
              // color: active
              //   ? '#DC3545'
              //   : 'rgba(220,53,69,0.65)',

              color:
                '#DC3545'
              // : 'rgba(220,53,69,0.65)',
            }}
          />

          <span
            style={{
              fontSize: 15,
              fontWeight: active ? 600 : 500, // 🔥 bold active
              // color: active
              //   ? '#b02a37'
              //   : 'rgba(220,53,69,0.65)',
              color:
                '#b02a37'

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
          background: '#ffffff',
          boxShadow: '4px 0 20px rgba(0,0,0,0.25)',
        }}
      >
        {/* HEADER */}
        <CSidebarHeader
          style={{
            height: 180,
            //  border: '1px solid',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            //   borderBottom: '1px solid #fdb8bf',
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
              width: hasImage ? 80 : 70,
              height: hasImage ? 105 : 70,
              p: 0,
              '& img': {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: hasImage
                  ? 'contrast(1.1) saturate(1.05)'
                  : 'none',
              }
            }}
          >
            {!hasImage && (name?.trim()?.charAt(0)?.toUpperCase() || "?")}
          </Avatar>

          <Typography sx={{ fontSize: 16, fontWeight: 600, color: 'black', textTransform: 'uppercase', marginTop: '10px' }}>
            {name}
          </Typography>

          <Typography sx={{ fontSize: 14, color: '#252424' }}>
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
          {renderItem('/TicketLists', MenuIcon, 'Ticket List')}
          {renderItem('/CurrentWrkList', SourceIcon, 'My Work List')}
          {(role === "Administrator" || role === "HOD" || role === "Supervisor") &&
            renderItem('/CustomerDetails', GroupsIcon, 'Customer Details')}

          {renderItem('/TransferDetails', MultipleStopIcon, 'Transfer Details')}
          {renderItem('/TagList', LocalOfferIcon, 'Tag List')}
          {renderItem('/SortCusList', GradingIcon, 'Total Work List')}
          {renderItem('/AllReports', ArticleIcon, 'All Reports')}
          {renderItem('/ServiceSolution', EmojiObjectsIcon, 'Services & Solutions')}
          {(role === "Administrator" || role === "HOD") &&
            renderItem('/CreateNewUser', PersonAddIcon, 'Create Staff')
          }
          {(role === "Administrator" || role === "HOD") &&
            renderItem('/WorkStatus', WorkHistoryIcon, 'Work Status')
          }

          <Box
            onClick={() => setVisible(true)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.8,
              padding: '10px 14px',
              marginBottom: '6px',
              cursor: 'pointer',

              '&:hover': {
                backgroundColor: '#fde2e5',
              },
            }}
          >
            <LockIcon
              sx={{
                fontSize: 24,
                color: '#DC3545',
              }}
            />

            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 500,
                color: '#b02a37',
              }}
            >
              Lookup Entry
            </Typography>
          </Box>

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

      <LookUpEntry
        visible={visible}
        setVisible={setVisible} />

    </>
  );
};

export default React.memo(AppSidebar);