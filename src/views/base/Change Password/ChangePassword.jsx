import React, { useEffect, useRef, useState } from 'react'
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import { Tooltip, Link, TableBody, TableCell, TableRow, TableHead, Table, Paper, TableContainer, FormControlLabel, MenuItem, Checkbox, Button, TextField, Grid, Card, CardContent, Typography, Box, Autocomplete, InputAdornment, IconButton } from '@mui/material';
import closebtn from '../../../assets/images/Saki-NuoveXT-Actions-button-cancel.ico'
import useModal from '../../../components/UseModal';
import axiosInstance from '../../../axios';
import getReduxState from '../../../ReduxState';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";

function ChangePassword({ visible, setVisible, size = 'sm' }) {

    const { modalClass } = useModal()

    const { empId, role, dept, deptid, name } = getReduxState()

    const [allStaff, setAllStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [selectedStaffKey, setSelectedStaffKey] = useState(null);

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    const nameInputRef = useRef(null)
    const newpwdRef = useRef(null)
    const confirmpwdRef = useRef(null)

    // // Close dialog box and focus field if needed
    // const handleClose = () => {
    //     setOpenDialog(false);

    //     setTimeout(() => {
    //         if (dialogMessage === "Please Select a Staff") {
    //             nameInputRef.current?.focus();
    //         } else if (dialogMessage === "Please Enter New Password") {
    //             newpwdRef.current?.focus();
    //         } else if (dialogMessage === "Password confirmation failed. Please ensure both Passwords are Identical") {
    //             confirmpwdRef.current?.focus();
    //         }
    //         // Clear dialog state after focusing
    //         setDialogMessage("");
    //     }, 100);
    // };

    const [focusField, setFocusField] = useState("");
    // Close dialog box and focus field if needed
    const handleClose = () => {
        setOpenDialog(false);
    };

    // Fetch Staff
    const fetchStaff = async () => {
        try {
            const res = await axiosInstance.get("/AcctMstStaffAPI/GetAll");

            const staffData = res?.data?.staff || [];

            let filteredStaff = [];

            if (role === "Administrator") {
                // Can access all employees
                filteredStaff = staffData;
            }
            else if (role === "HOD") {
                // Same department only
                filteredStaff = staffData.filter(
                    item => Number(item?.Dept_id) === Number(deptid)
                );
            }
            else if (role === "Staff") {
                // Only himself
                filteredStaff = staffData.filter(
                    item => Number(item?.ahmst_key) === Number(empId)
                );
            }

            setAllStaff(filteredStaff);

        } catch (err) {
            console.log("Error fetching staff", err);
            setAllStaff([]);
        }
    };
    useEffect(() => {
        fetchStaff()
    }, [])

    // Highlight Text
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function highlightText(text = "", query = "") {
        if (!query) return text;

        const safeQuery = escapeRegExp(query);

        const regex = new RegExp(`(${safeQuery})`, "gi");

        const parts = text.split(regex);

        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <span
                    key={i}
                    style={{ backgroundColor: "var(--focus-bg-color)", fontWeight: 600 }}
                >
                    {part}
                </span>
            ) : (
                part
            )
        );
    }
    const fetchUserDetails = async (empId) => {
        try {
            const res = await axiosInstance.get(
                `/CreateUserAPI/GetUserDetails?empId=${empId}`
            );

            const data = res?.data?.Data;

            if (!data) return;

            setUserName(data?.User_Name || "");
            setPassword(data?.User_Password || "");

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (!allStaff?.length) return;

        const currentUser = allStaff.find(
            item => Number(item?.ahmst_key) === Number(empId)
        );

        if (currentUser) {
            setSelectedStaff(currentUser);
            setSelectedStaffKey(currentUser.ahmst_key);

            // Load username & password
            fetchUserDetails(currentUser.ahmst_key);
        }
    }, [allStaff, empId]);


    const handleReset = async () => {
        // setUserName("")
        // setPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setShowConfirmPassword("")
        setShowNewPassword("")
        setShowPassword("")
    }

    const handleSave = async () => {
        try {
            if (!selectedStaffKey) {
                setFocusField("staff");
                setDialogMessage("Please Select a Staff");
                setOpenDialog(true);
                return;
            }

            if (!newPassword) {
                setFocusField("newPassword");
                setDialogMessage("Please Enter New Password");
                setOpenDialog(true);
                return;
            }

            if (newPassword === password) {
                setFocusField("newPassword");
                setDialogMessage("New Password must be different from the Current Password.");
                setOpenDialog(true);
                return;
            }

            if (newPassword !== confirmPassword) {
                setFocusField("confirmPassword");
                setDialogMessage("Password confirmation failed. Please ensure both Passwords are Identical.");
                setOpenDialog(true);
                return;
            }

            const payload = {
                EmpId: selectedStaffKey,
                UserName: userName,
                NewPassword: newPassword,
                ConfirmPassword: confirmPassword,
                logReason: "Password Change",
                logDesc: `${userName} Changed Password`,
                logForm: "Change Password",
                logUser: name,
                logUserId: empId
            };

            const res = await axiosInstance.post(
                "/CreateUserAPI/ChangePassword",
                payload
            );

            if (res?.data?.Success) {
                toast.success(res.data.message || "Password changed successfully");

                // Reload latest user details
                await fetchUserDetails(selectedStaffKey);

                // Clear only new password fields
                setNewPassword("");
                setConfirmPassword("");
                setVisible(false)
            }

        } catch (err) {
            console.log(err);
            toast.error("Failed to change password");
        }
    };
    return (
        <>
            <CModal
                size={size}
                backdrop='static'
                className={`${modalClass} modal custom-modal-close custom-modal-width custom-centered-modal`}  // Concatenate class names correctly
                alignment="center"
                visible={visible}
                onClose={() => {
                    setVisible(false);
                    handleReset();
                }} aria-labelledby="VerticallyCenteredExample"
            >
                <CModalHeader
                    closeButton={false}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#DC3545',
                        color: '#fff',
                        padding: '2px 8px',
                        height: '32px',
                        minHeight: '32px',
                        lineHeight: '1',
                    }}>
                    <CModalTitle
                        id="VerticallyCenteredExample"
                        style={{
                            color: '#fff',
                            fontSize: '12.5px',
                            margin: 0,
                            lineHeight: '1',
                            padding: 0
                        }}>
                        Change Password
                    </CModalTitle>

                    <button
                        onClick={() => setVisible(false)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <img
                            src={closebtn}
                            alt="Close"
                            width="22"   // 🔽 smaller icon
                            height="22"

                        />
                    </button>
                </CModalHeader>

                <CModalBody className='c-modal-body no-scroll ' style={{ zoom: '0.8' }}>

                    <Card>
                        <CardContent>
                            <Grid container spacing={2}>



                                <Grid item xs={12} lg={12} >
                                    {/* 

                                    <Autocomplete
                                        fullWidth
                                        options={role === "Administrator" ? filteredStaff : allStaff}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                boxShadow: 'inset 4px 0 0 0 var(--search-side-color)',
                                                '& .MuiAutocomplete-input': {
                                                    paddingLeft: '16px',
                                                }
                                            }
                                        }}
                                        value={selectedStaff}
                                        getOptionLabel={(option) => option?.ahmst_pname || ""}

                                        renderOption={(props, option, { inputValue }) => (
                                            <li {...props}>
                                                {highlightText(option?.ahmst_pname || "", inputValue)}
                                            </li>
                                        )}

                                        filterOptions={(options, state) => {
                                            return options.filter((item) =>
                                                item?.ahmst_pname
                                                    ?.toLowerCase()
                                                    .includes(state.inputValue.toLowerCase())
                                            );
                                        }}

                                        onChange={(event, newValue) => {
                                            setSelectedStaff(newValue);
                                            setSelectedStaffKey(newValue?.ahmst_key || null);

                                            if (newValue?.ahmst_key) {
                                                fetchUserDetails(newValue.ahmst_key);
                                            }
                                        }}

                                        isOptionEqualToValue={(option, value) =>
                                            option?.ahmst_key === value?.ahmst_key
                                        }

                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Staff Name"
                                                size="small"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        height: 39,
                                                        paddingLeft: 0,
                                                        position: 'relative',
                                                        '& .MuiInputBase-input': {
                                                            fontSize: '0.95rem',
                                                            padding: '8px 8px 8px 12px',
                                                            position: 'relative',
                                                            zIndex: 1,
                                                        },
                                                        '&::before': {
                                                            content: '""',
                                                            position: 'absolute',
                                                            left: 0,
                                                            top: 0,
                                                            bottom: 0,
                                                            width: '4px',
                                                            backgroundColor: '#DC3545',
                                                            borderTopLeftRadius: '4px',
                                                            borderBottomLeftRadius: '4px',
                                                            zIndex: 2,
                                                        },
                                                        '&.Mui-focused': {
                                                            backgroundColor: 'var(--focus-bg-color) !important',
                                                        },
                                                    },
                                                }}
                                            />
                                        )}
                                    /> */}
                                    <Autocomplete
                                        fullWidth
                                        options={allStaff}
                                        value={selectedStaff}
                                        disableClearable={role === "Staff"}
                                        forcePopupIcon={role === "Staff" ? false : true}
                                        open={role === "Staff" ? false : undefined}
                                        getOptionLabel={(option) => option?.ahmst_pname || ""}
                                        isOptionEqualToValue={(option, value) =>
                                            option?.ahmst_key === value?.ahmst_key
                                        }
                                        onChange={(event, newValue) => {
                                            setSelectedStaff(newValue);
                                            setSelectedStaffKey(newValue?.ahmst_key || null);

                                            if (!newValue) {
                                                setUserName("");
                                                setPassword("");
                                                setConfirmPassword("");
                                                return;
                                            }

                                            fetchUserDetails(newValue.ahmst_key);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Staff Name"
                                                inputRef={nameInputRef}
                                                size="small"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    readOnly: role === "Staff",
                                                }}
                                                sx={{

                                                    '&.Mui-focused':
                                                    {
                                                        backgroundColor:
                                                            'var(--focus-bg-color) !important',
                                                    },
                                                }}
                                            />
                                        )}
                                    />

                                </Grid>

                                <Grid item xs={12} lg={12}>

                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="User Name"
                                        value={userName}
                                        InputProps={{
                                            readOnly: true
                                        }}

                                        sx={{
                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                backgroundColor: 'var(--focus-bg-color)',
                                            },
                                        }}
                                    >

                                    </TextField>
                                </Grid>



                                <Grid item xs={12} lg={12}>
                                    <TextField
                                        label="Password"
                                        type={showPassword ? "text" : "password"}
                                        size="small"
                                        fullWidth
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        //  inputRef={pwdInputRef}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                    >
                                                        {showPassword ? (
                                                            <Visibility />
                                                        ) : (
                                                            <VisibilityOff />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            fontSize: '1rem',
                                            height: 40,

                                            '& input': {
                                                padding: '8px',
                                                fontSize: '0.95rem',

                                                '&:focus': {
                                                    backgroundColor: 'var(--focus-bg-color)'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>



                                <Grid item xs={12} lg={12}>
                                    <TextField
                                        label="New Password"
                                        type={showNewPassword ? "text" : "password"}
                                        size="small"
                                        fullWidth

                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        inputRef={newpwdRef}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        edge="end"
                                                    >
                                                        {showNewPassword ? (
                                                            <Visibility />
                                                        ) : (
                                                            <VisibilityOff />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            fontSize: '1rem',
                                            height: 40,

                                            '& input': {
                                                padding: '8px',
                                                fontSize: '0.95rem',

                                                '&:focus': {
                                                    backgroundColor: 'var(--focus-bg-color)'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>


                                <Grid item xs={12} lg={12}>
                                    <TextField
                                        label="Confirm Password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        size="small"
                                        fullWidth
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        inputRef={confirmpwdRef}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        edge="end"
                                                    >
                                                        {showConfirmPassword ? (
                                                            <Visibility />
                                                        ) : (
                                                            <VisibilityOff />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            fontSize: '1rem',
                                            height: 40,

                                            '& input': {
                                                padding: '8px',
                                                fontSize: '0.95rem',

                                                '&:focus': {
                                                    backgroundColor: 'var(--focus-bg-color)'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>


                                <Grid item xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                    <Button
                                        sx={{
                                            textTransform: 'none',
                                            marginRight: 1,
                                            height: '38px',
                                            width: {
                                                xs: '100%',
                                                sm: "100px"
                                            },
                                            border: '#DC3545',
                                            color: '#f5f7fa',
                                            backgroundColor: '#DC3545',
                                            '&:hover': {
                                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                            },
                                        }}
                                        variant="contained"
                                        onClick={handleSave}
                                    >
                                        Save
                                    </Button>

                                </Grid>

                            </Grid>
                        </CardContent>
                    </Card>

                </CModalBody>

            </CModal >



            <Dialog open={openDialog}
                onClose={handleClose}
                disableRestoreFocus
                TransitionProps={{
                    onExited: () => {
                        setDialogMessage("");

                        if (focusField === "staff") {
                            nameInputRef.current?.focus();
                        }
                        else if (focusField === "newPassword") {
                            newpwdRef.current?.focus();
                        }
                        else if (focusField === "confirmPassword") {
                            confirmpwdRef.current?.focus();
                        }

                        setFocusField("");
                    }
                }}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        px: 1,
                        py: 1,
                        // minWidth: 300
                    }
                }}>
                <DialogContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* //   <WarningAmberIcon sx={{ color: '#f59e0b', fontSize: 22 }} /> */}
                        <Typography variant="body1" sx={{ fontWeight: 500 }}
                        >                {dialogMessage}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 1, pb: 1 }}>
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        size="small"
                        sx={{
                            textTransform: 'none',
                            backgroundColor: '#DC3545',
                            borderRadius: 1.5,
                            px: 2,
                            '&:hover': { backgroundColor: '#DC3545' }
                        }}
                    >            OK
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer autoClose={1000} hideProgressBar={true} position='top-center' theme='colored' transition={Bounce} />


        </>
    )
}

export default ChangePassword
