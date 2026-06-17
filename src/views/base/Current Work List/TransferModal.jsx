import React, { useEffect, useState } from 'react'
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import { Tooltip, Link, TableBody, TableCell, TableRow, TableHead, Table, Paper, TableContainer, FormControlLabel, MenuItem, Checkbox, Button, TextField, Grid, Card, CardContent, Typography, Box } from '@mui/material';
import closebtn from '../../../assets/images/Saki-NuoveXT-Actions-button-cancel.ico'
import useModal from '../../../components/UseModal';

function TransferModal({ visible2, setVisible2, size = 'md', selectedRow, transferDept, setTransferDept,
    transferStaff, setTransferStaff, allDept, allStaff, role, isHOD, isAdmin, empId,
    deptid, transferRow, setTransferRow, transferDetails, setTransferDetails, handleTransfer,
    resetTransModal, detailsInputRef, transStaffInputRef, transDeptinputref }) {

    const { modalClass } = useModal()

    const filteredTransferStaff = transferDept
        ? allStaff.filter(staff =>
            Number(staff.Dept_id) === Number(transferDept) &&
            Number(staff.ahmst_key) !== Number(empId)
        )
        : [];

    return (
        <>
            <CModal
                size={size}
                backdrop='static'
                className={`${modalClass} modal custom-modal-close custom-modal-width custom-centered-modal`}  // Concatenate class names correctly
                alignment="center"
                visible={visible2}
                onClose={() => {
                    setVisible2(false);
                    resetTransModal();
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
                        Transfer Details
                    </CModalTitle>

                    <button
                        onClick={() => setVisible2(false)}
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
                            <Grid container spacing={1}>

                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            borderBottom: "1px solid #eee",
                                            pb: 1,
                                            mb: 1
                                        }}
                                    >
                                        <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>
                                            Ticket No:
                                        </Typography>

                                        <Box
                                            sx={{
                                                fontWeight: 700,
                                                color: "#DC3545",
                                                backgroundColor: "rgba(220,53,69,0.1)",
                                                px: 1.5,
                                                py: 0.3,
                                                borderRadius: "6px",
                                                fontSize: "14px"
                                            }}>
                                            {transferRow?.TicketNo || "-"}
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            backgroundColor: "#f7eaea",
                                            border: "1px solid #ec9c9c",
                                            borderRadius: "8px",
                                            p: 1.2
                                        }}>
                                        <Typography sx={{ fontSize: "13px", color: "#888", mb: 0.5 }}>
                                            Description
                                        </Typography>

                                        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                                            {transferRow?.Tkt_Description || "No description"}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} lg={12} >

                                    <TextField
                                        select
                                        label="Department"
                                        size="small"
                                        fullWidth
                                        value={transferDept}
                                        onChange={(e) => {
                                            setTransferDept(e.target.value);
                                            // reset selected staff
                                            setTransferStaff("");
                                        }}
                                        inputRef={transDeptinputref}
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                backgroundColor: 'var(--focus-bg-color)',
                                            },
                                        }}>
                                        {allDept
                                            .map((dept) => (
                                                <MenuItem
                                                    key={dept.mstr_key}
                                                    value={dept.mstr_key}
                                                >
                                                    {dept.desc}
                                                </MenuItem>
                                            ))}
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} lg={12}>

                                    <TextField
                                        select
                                        size="small"
                                        fullWidth
                                        label="Staff"
                                        value={transferStaff}
                                        onChange={(e) => {

                                            const value = e.target.value;

                                            setTransferStaff(
                                                value
                                            );

                                        }}
                                        inputRef={transStaffInputRef}
                                        sx={{
                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                backgroundColor: 'var(--focus-bg-color)',
                                            },
                                        }}
                                    >

                                        {filteredTransferStaff.map((staff) => (
                                            <MenuItem
                                                key={staff.ahmst_key}
                                                value={staff.ahmst_key}
                                            >
                                                {staff.ahmst_pname}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} lg={12}>

                                    <TextField
                                        label="Details"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={transferDetails}
                                        onChange={(e) => setTransferDetails(e.target.value)}
                                        inputRef={detailsInputRef}
                                        sx={{
                                            '@media (max-width: 320px)': {
                                                width: '100%', // Ensure full width on small screens
                                            },
                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                backgroundColor: 'var(--focus-bg-color)', // Set background color on focus
                                            },
                                        }}
                                    >

                                    </TextField>
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
                                        onClick={handleTransfer}
                                    >
                                        Transfer
                                    </Button>

                                </Grid>

                            </Grid>
                        </CardContent>
                    </Card>

                </CModalBody>

            </CModal >

        </>
    )
}

export default TransferModal
