import React, { useEffect, useState } from 'react'
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import { Tooltip, Link, TableBody, TableCell, TableRow, TableHead, Table, Paper, TableContainer, FormControlLabel, MenuItem, Checkbox, Button, TextField, Grid, Card, CardContent, Typography, Box } from '@mui/material';
import closebtn from '../../../assets/images/Saki-NuoveXT-Actions-button-cancel.ico'
import useModal from '../../../components/UseModal';

function DetailsModal({ visible1, setVisible1, size = 'md', selectedRow, details, setDetails, statusPer,
    setStatusPer, percentage, setPercentage, selectedItem, setSelectedItem, handleSave, resetmodal,
    percentageInputRef, detailsInputRef, setSelectedRow, activeWork, setActiveWork, isAllCompleted
}) {

    const { modalClass } = useModal();

    // useEffect(() => {
    //     if (selectedRow?.WorkItems) {
    //         const active = selectedRow.WorkItems.find(
    //             w => w.TktItm_CurrentlyWorking === true
    //         );

    //         setSelectedItem(active || null);
    //     }
    // }, [selectedRow]);

    // useEffect(() => {

    //     if (selectedRow?.WorkItems) {

    //         // first check currently working
    //         const active = selectedRow.WorkItems.find(
    //             w => w.TktItm_CurrentlyWorking === true
    //         );

    //         if (active) {

    //             setSelectedItem(active);

    //         } else if (selectedRow.WorkItems.length === 1) {

    //             // auto select single row
    //             const firstItem = selectedRow.WorkItems[0];

    //             if (firstItem?.Tkt_Progress !== 3) {
    //                 setSelectedItem(firstItem);
    //             }

    //         } else {

    //             setSelectedItem(null);
    //         }
    //     }

    // }, [selectedRow]);


    useEffect(() => {

        if (!selectedRow?.WorkItems?.length) {
            setSelectedItem(null);
            return;
        }

        // ignore completed works
        const validItems = selectedRow.WorkItems.filter(
            item => item?.Tkt_Progress !== 3
        );

        // find active work
        const active = validItems.find(
            item => item?.TktItm_CurrentlyWorking === true
        );

        if (active) {

            setSelectedItem(active);

        } else if (validItems.length === 1) {

            // auto tick single remaining work
            setSelectedItem(validItems[0]);

        } else {

            setSelectedItem(null);
        }

    }, [visible1, selectedRow]);

  //  console.log("selectedrow", selectedRow)

    return (
        <>
            <CModal
                size={size}
                backdrop='static'
                className={`${modalClass} modal custom-modal-close custom-modal-width custom-centered-modal`}  // Concatenate class names correctly
                alignment="center"
                visible={visible1}
                onClose={() => {
                    setVisible1(false);
                    resetmodal();
                }}
                aria-labelledby="VerticallyCenteredExample">
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
                        Details
                    </CModalTitle>

                    <button
                        onClick={() => setVisible1(false)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                        <img
                            src={closebtn}
                            alt="Close"
                            width="22"
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
                                            }}
                                        >
                                            {selectedRow?.TicketNo || "-"}
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
                                        }}
                                    >
                                        <Typography sx={{ fontSize: "13px", color: "#888", mb: 0.5 }}>
                                            Customer
                                        </Typography>

                                        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                                            {selectedRow?.Tkt_CustName || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <TableContainer
                                        component={Paper}
                                        sx={{
                                            height: {
                                                xs: '190px',
                                                sm: '190px',
                                                md: '180px',
                                                lg: '180px',
                                            },
                                            overflowX: 'auto',
                                            overflowY: 'auto', // shows scrollbar only if needed
                                            '&::-webkit-scrollbar': {
                                                width: '6px',          // thin scrollbar width
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                backgroundColor: '#888', // thumb color
                                                borderRadius: '3px',
                                            },
                                            '&::-webkit-scrollbar-track': {
                                                backgroundColor: '#f0f0f0', // track color
                                            },
                                            scrollbarWidth: 'thin',       // Firefox: thin scrollbar
                                            scrollbarColor: '#888 #f0f0f0', // Firefox: thumb and track colors
                                            marginTop: 1,
                                        }}
                                    >
                                        <Table striped sx={{ minWidth: 100, tableLayout: 'fixed' }}>
                                            {/* Table Head */}
                                            <TableHead sx={{ position: 'sticky', zIndex: 1, top: 0, backgroundColor: 'var(--header-bg-color)' }}>

                                                <TableRow sx={{ height: '32px' }}>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>SlNo</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '35%', fontWeight: 'bold' }}>Work</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '8%', fontWeight: 'bold' }}>%</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '8%', fontWeight: 'bold' }}></TableCell>

                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {selectedRow?.WorkItems?.length > 0 ? (
                                                    selectedRow.WorkItems.map((item, index) => (
                                                        <TableRow key={index}
                                                            sx={{
                                                                backgroundColor:
                                                                    item.Tkt_Progress === 3
                                                                        ? "#e5fde6"
                                                                        : "transparent"
                                                            }}>
                                                            {/* SlNo */}
                                                            <TableCell>
                                                                {index + 1}
                                                            </TableCell>

                                                            {/* Work (Product + Title) */}
                                                            <TableCell
                                                                sx={{
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis'
                                                                }}
                                                            >
                                                                <Tooltip
                                                                    title={`${item.TktItm_WrkTitle}`}
                                                                    arrow
                                                                >
                                                                    <span>
                                                                        {item.TktItm_WrkTitle}
                                                                    </span>
                                                                </Tooltip>
                                                            </TableCell>

                                                            <TableCell>
                                                                {item.WorkItem_Percentage
                                                                    ? `${item.WorkItem_Percentage}%`
                                                                    : ''}
                                                            </TableCell>
                                                            {/* Status */}
                                                            <TableCell>
                                                                <FormControlLabel
                                                                    sx={{ marginLeft: 0 }}
                                                                    control={

                                                                        <Checkbox
                                                                            checked={
                                                                                item.Tkt_Progress === 3
                                                                                    ? false
                                                                                    : selectedItem
                                                                                        ? selectedItem.TktItm_Key === item.TktItm_Key
                                                                                        : item.TktItm_CurrentlyWorking === true
                                                                            }
                                                                            disabled={item.Tkt_Progress === 3}
                                                                            onChange={(e) => {
                                                                                if (item.Tkt_Progress === 3) return;

                                                                                // currently clicked item
                                                                                setSelectedItem(item);

                                                                                // setSelectedRow(prev => ({
                                                                                //     ...prev,
                                                                                //     WorkItems: prev.WorkItems.map(w => ({
                                                                                //         ...w,
                                                                                //         TktItm_CurrentlyWorking:
                                                                                //             w.TktItm_Key === item.TktItm_Key
                                                                                //     }))
                                                                                // }));
                                                                            }}
                                                                            name="transferworkitems"
                                                                            size="small"
                                                                            sx={{
                                                                                p: "0px",
                                                                                transform: "scale(0.8)",
                                                                                color: "grey",
                                                                                "&.Mui-checked": {
                                                                                    color: "#DC3545 !important",
                                                                                },
                                                                                "& .MuiSvgIcon-root": {
                                                                                    fontSize: 24,
                                                                                }
                                                                            }}
                                                                        />

                                                                    }
                                                                    label=""
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={4} align="center">
                                                            <Typography sx={{ fontSize: "0.85rem", color: "#999" }}>
                                                                No Work Items
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>

                                        </Table>

                                    </TableContainer>

                                </Grid>

                                <Grid item xs={12} lg={12} >

                                    <TextField
                                        label="Details"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                        inputRef={detailsInputRef}
                                        sx={{
                                            '@media (max-width: 320px)': {
                                                width: '100%', // Ensure full width on small screens
                                            },
                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                backgroundColor: 'var(--focus-bg-color)', // Set background color on focus
                                            },
                                        }}>

                                    </TextField>
                                </Grid>

                                <Grid item xs={12} lg={12}>

                                    <TextField
                                        select
                                        label="Status"
                                        variant="outlined"
                                        size="small"
                                        value={statusPer}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            setStatusPer(value);

                                            if (value === "Doing") {
                                                setDetails("");
                                                setPercentage("");
                                            }

                                            if (value === "Completed") {
                                                setPercentage("100");
                                            }
                                        }}
                                        fullWidth
                                        sx={{
                                            '@media (max-width: 320px)': {
                                                width: '100%', // Ensure full width on small screens
                                            },
                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                backgroundColor: 'var(--focus-bg-color)', // Set background color on focus
                                            },
                                        }}>
                                        <MenuItem value="Doing">Doing</MenuItem>
                                        <MenuItem value="Paused">Paused</MenuItem>
                                        <MenuItem value="Hold">Hold</MenuItem>
                                        <MenuItem value="Completed">Completed</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} lg={12}>

                                    <TextField
                                        label="Percentage"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        type="text"
                                        value={percentage}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            // allow only 0-100
                                            if (value === "" || (/^\d+$/.test(value) && Number(value) <= 100)) {
                                                setPercentage(value);
                                            }
                                        }}
                                        inputRef={percentageInputRef}
                                        InputProps={{
                                            readOnly:
                                                statusPer === "Doing" ||
                                                statusPer === "Completed",
                                            inputProps: {
                                                min: 0,
                                                max: 100
                                            }
                                        }}
                                        sx={{
                                            '@media (max-width: 320px)': {
                                                width: '100%',
                                            },
                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                backgroundColor: 'var(--focus-bg-color)',
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'flex-end', margintop: '10px' }}>
                                    <Button
                                        disabled={isAllCompleted}
                                        sx={{
                                            textTransform: 'none',
                                            marginTop: 1,
                                            marginRight: 1,
                                            height: '35px',
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
                                            '&.Mui-disabled': {
                                                backgroundColor: '#DC3545',
                                                color: '#f5f7fa',
                                                cursor: 'not-allowed',
                                                pointerEvents: 'auto'
                                            }
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

            </CModal>

        </>
    )
}

export default DetailsModal
