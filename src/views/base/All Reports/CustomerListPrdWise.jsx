import React, { useEffect, useState } from 'react'
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import { Tooltip, Link, TableBody, TableCell, TableRow, TableHead, Table, Paper, TableContainer, FormControlLabel, MenuItem, Checkbox, Button, TextField, Grid, Card, CardContent, Typography, Box } from '@mui/material';
import closebtn from '../../../assets/images/Saki-NuoveXT-Actions-button-cancel.ico'
import useModal from '../../../components/UseModal';

function CustomerListPrdWise({ visible, setVisible, size = 'md', allProducts, selectAllChecked, setSelectAllChecked,
    checkedItems, setCheckedItems, handleCheckboxChange, handleSelectAllChange, handleCustListPrdWisrPrint
}) {

    const { modalClass } = useModal();

    const handleCloseModal = () => {
        setVisible(false);

        setSelectAllChecked(false);
        setCheckedItems([]);
    };


    return (
        <div>
            <CModal
                size={size}
                backdrop='static'
                className={`${modalClass} modal custom-modal-close custom-modal-width custom-centered-modal`}  // Concatenate class names correctly
                alignment="center"
                visible={visible}
                 onClose={handleCloseModal}
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
                        Customer List ProductWise
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

                    <Card sx={{
                        height: { sm: '550px', lg: '580px' }
                    }}>
                        <CardContent>
                            <Grid container spacing={1}>

                                <Grid item xs={12}>
                                    <TableContainer
                                        component={Paper}
                                        sx={{
                                            height: {
                                                xs: '300px',
                                                sm: '440px',
                                                md: '440px',
                                                lg: '470px',
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
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '35%', fontWeight: 'bold' }}>Produc</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '8%', fontWeight: 'bold' }}>Select</TableCell>

                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {allProducts && allProducts.length > 0 ? (
                                                    allProducts.map((row, index) => (
                                                        <TableRow>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell>{row.desc}</TableCell>
                                                            <TableCell>
                                                                <FormControlLabel
                                                                    sx={{
                                                                        marginLeft: { xs: '0px', sm: "0px", lg: "0px" },
                                                                    }}
                                                                    control={<Checkbox
                                                                        checked={checkedItems.includes(row.mstr_key)}
                                                                        onChange={(event) => handleCheckboxChange(event, row)}
                                                                        sx={{
                                                                            p: 0.3,
                                                                            '& .MuiSvgIcon-root': {
                                                                                fontSize: 18,
                                                                            },
                                                                            color: 'grey',
                                                                            '&.Mui-checked': {
                                                                                color: '#DC3545 !important',
                                                                            },
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
                                                        <TableCell>No Data Available</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>

                                    </TableContainer>

                                </Grid>





                                <Grid item sm={6} md={6} lg={6} sx={{ marginTop: '10px' }}>

                                    <FormControlLabel
                                        control={<Checkbox name="Select All"
                                            checked={selectAllChecked}
                                            onChange={handleSelectAllChange}
                                            sx={{
                                                color: 'grey', // Unchecked color
                                                '&.Mui-checked': {
                                                    color: 'var(--primary-checkbox-color)', // Checked color
                                                },
                                            }} />}
                                        label="Select All"
                                    />

                                </Grid>

                                <Grid item xs={12} sm={5.5} md={5.5} lg={5.5} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>

                                    <Button
                                        sx={{
                                            width: {
                                                xs: '100%',
                                                sm: 'auto'
                                            },
                                            textTransform: 'none',
                                            height: '38px',
                                            minWidth: '100px',
                                            color: '#f5f7fa',
                                            backgroundColor: '#DC3545',
                                            '&:hover': {
                                                backgroundColor: '#c82333',
                                                boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                                            },
                                        }}
                                        variant="contained"
                                        color="success"
                                        onClick={handleCustListPrdWisrPrint}
                                    >
                                        Print
                                    </Button>



                                </Grid>






                            </Grid>
                        </CardContent>
                    </Card>

                </CModalBody>

            </CModal>
        </div>
    )
}

export default CustomerListPrdWise
