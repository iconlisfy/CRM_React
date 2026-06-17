import React, { useEffect, useState } from 'react'
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import { Tooltip, Link, TableBody, TableCell, TableRow, TableHead, Table, Paper, TableContainer, FormControlLabel, MenuItem, Checkbox, Button, TextField, Grid, Card, CardContent, Typography, FormControl, RadioGroup, Radio } from '@mui/material';
import closebtn from '../../../assets/images/Saki-NuoveXT-Actions-button-cancel.ico'
import useModal from '../../../components/UseModal';

function Updatemodal({ visibleUpt, setVisibleUpt, size = 'md', dateTime, note, setNote, onSave,
    pendingUpdateIndex, setPendingUpdateIndex, status, setStatus, latestStatus, setLatestStatus, userInfo,name
}) {


    const { modalClass } = useModal();

    return (
        <>
            <CModal
                size={size}
                backdrop='static'
                className={`${modalClass} modal custom-modal-close custom-modal-width custom-centered-modal`}  // Concatenate class names correctly
                alignment="center"
                visible={visibleUpt}
                onClose={() => setVisibleUpt(false)}
                aria-labelledby="VerticallyCenteredExample"
            >
                <CModalHeader
                    closeButton={false}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#DC3545',
                        color: '#fff',

                        padding: '2px 8px',     //  reduce padding
                        height: '32px',         //  force exact height
                        minHeight: '32px',      //  override default
                        lineHeight: '1',        //  remove extra vertical space
                    }}>
                    <CModalTitle
                        id="VerticallyCenteredExample"
                        style={{
                            color: '#fff',
                            fontSize: '12.5px',
                            margin: 0,
                            lineHeight: '1',     //  important
                            padding: 0
                        }}
                    >
                        Status
                    </CModalTitle>

                    <button
                        onClick={() => setVisibleUpt(false)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,          // 🔥 remove default button padding
                            display: 'flex',
                            alignItems: 'center'
                        }}>
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
                                {/* <Grid item xs={12} lg={6}>
                                    <Typography>Ticket#</Typography>
                                </Grid> */}


                                <Grid item xs={12} lg={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Typography sx={{
                                        fontSize: "0.95rem",
                                        fontWeight: "bold"
                                    }}>{dateTime}</Typography>
                                </Grid>

                                <Grid item xs={12} lg={12} >

                                    <TextField
                                        label="Note"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={note || ''}
                                        onChange={(e) => setNote(e.target.value)}
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

                                <Grid item xs={12}>

                                    <FormControl>
                                        <RadioGroup
                                            row
                                            value={status}
                                            onChange={(e) => setStatus(Number(e.target.value))} // ✅ get value
                                        >
                                            <FormControlLabel
                                                value={1}   // ✅ Open = 1
                                                control={<Radio size="small" />}
                                                label="Open"
                                            />

                                            <FormControlLabel
                                                value={2}   // ✅ InProgress = 2
                                                control={<Radio size="small" />}
                                                label="InProgress"
                                            />

                                            <FormControlLabel
                                                value={3}   // ✅ Closed = 3
                                                control={<Radio size="small" />}
                                                label="Closed"
                                            />
                                        </RadioGroup>
                                    </FormControl>

                                </Grid>

                                <Grid container spacing={1} className='mt-2'>

                                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{ marginLeft: '10px' }}>
                                        <Typography sx={{
                                            fontSize: "0.95rem",
                                            fontWeight: "bold"
                                        }}>UserInfo : {userInfo || name}</Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                                            onClick={() => {
                                                onSave({
                                                    note,
                                                    status
                                                });
                                                setVisibleUpt(false);
                                            }}
                                        >
                                            Save
                                        </Button>

                                    </Grid>
                                </Grid>

                            </Grid>
                        </CardContent>
                    </Card>

                </CModalBody>

            </CModal>
        </>
    )
}

export default Updatemodal
