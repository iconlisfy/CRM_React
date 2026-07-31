import { Card, CardContent, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../axios'
import { useNavigate } from 'react-router-dom';
import getReduxState from '../../../ReduxState';

function LeadsView({ ldViewsData, setLdViewsData, formatDateTime }) {
    const navigate = useNavigate();

    return (
        <>
            <Grid container spacing={1}>

                <Grid item xs={12}>

                    <TableContainer
                        component={Paper}
                        sx={{
                            height: {
                                xs: 'calc(100vh - 140px)',
                                sm: 'calc(100vh - 550px)',
                                md: 'calc(100vh - 500px)',
                                lg: 'calc(100vh - 135px)',
                                xl: 'calc(100vh - 508px)'
                            },
                            width: '100%',
                            overflowX: 'auto',
                            overflowY: 'auto',
                            border: '1px solid #e0e0e0',
                            boxShadow: 'none',
                            '&::-webkit-scrollbar': { width: '6px' },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '3px' },
                            '&::-webkit-scrollbar-track': { backgroundColor: '#f0f0f0' },
                        }}
                    >
                        <Table stickyHeader size="small" sx={{
                            "& .MuiTableCell-root": {
                                fontSize: "0.95rem", // Increase font size
                            },
                        }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '4%', }}>SlNo</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '8%', }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '6%', }}>LeadId</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '12%', }}>CustName</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '10%', }}>PhnNo</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '10%', }}>Bussiness Val</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '8%', }}>LeadQuality</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '10%', }}>Assigning</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '12%', }}>Last Followup</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ldViewsData && ldViewsData.length > 0 ? (
                                    ldViewsData.map((row, index) => (
                                        <TableRow key={row.LeadKey} sx={{
                                            height: 50, // Increase row height
                                        }}>
                                            <TableCell>{ldViewsData.length - index}</TableCell>

                                            <TableCell>
                                                {new Date(row.LeadDate).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </TableCell>

                                            <TableCell>
                                                <span
                                                    style={{
                                                        color: "#1976d2",
                                                        cursor: "pointer",
                                                        //  textDecoration: "underline",
                                                    }}
                                                    onClick={() => navigate(`/LeadDetails/${row.LeadCode}`)}                                                >
                                                    {row.LeadCode}
                                                </span>
                                            </TableCell>

                                            <TableCell>
                                                {row.CustomerName}
                                            </TableCell>

                                            <TableCell>
                                                {row.CustomerPhone}
                                            </TableCell>

                                            <TableCell>
                                                {row.Products?.reduce(
                                                    (total, item) => total + (item.Rate * item.Quantity),
                                                    0
                                                ).toLocaleString('en-US')}
                                            </TableCell>

                                            <TableCell>
                                                {row.LeadQuality}
                                            </TableCell>

                                            <TableCell>
                                                {row.AssignTo}
                                            </TableCell>

                                            <TableCell>
                                                {row.FollowUpDate
                                                    ? formatDateTime(row.FollowUpDate)
                                                    : "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">
                                            No Leads Found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>


                </Grid>

            </Grid>
        </>
    )
}

export default LeadsView
