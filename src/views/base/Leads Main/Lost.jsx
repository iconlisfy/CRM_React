import { Card, CardContent, Grid, Paper, Table, MenuItem, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function Lost({ isAdmin, lostViewsData, formatDateTime }) {


    const navigate = useNavigate()

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12}>

                    <TableContainer
                        component={Paper}
                        sx={{
                            height: {
                                xs: 'calc(100vh - 200px)',
                                sm: 'calc(100vh - 200px)',
                                md: 'calc(100vh - 200px)',
                                lg: 'calc(100vh - 200px)',
                                xl: 'calc(100vh - 208px)',
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
                        <Table striped sx={{ minWidth: 1200, tableLayout: 'fixed' }}>
                            {/* Table Head */}
                            <TableHead sx={{ position: 'sticky', zIndex: 1, top: 0, backgroundColor: 'var(--header-bg-color)' }}>

                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '4%', }}>SlNo</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '8%', }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '6%', }}>Lead Id</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '14%', }}>Customer Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '10%', }}>PhnNo</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '10%', }}>Bussiness Val</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '8%', }}>LeadQuality</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '10%', }}>Assigning</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '12%', }}>Last Followup</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {lostViewsData && lostViewsData.length > 0 ? (
                                    lostViewsData.map((row, index) => (
                                        <TableRow key={row.LeadKey} sx={{
                                            height: 50, // Increase row height
                                        }}>
                                            <TableCell sx={{ fontSize: '0.95rem' }}>{lostViewsData.length - index}</TableCell>

                                            <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.95rem' }}>
                                                {new Date(row.LeadDate).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    fontSize: '0.95rem'
                                                }}
                                            >
                                                <Tooltip title={row.LeadCode} arrow placement="bottom">
                                                    <span
                                                        style={{
                                                            color: "#1976d2",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => navigate(`/LeadDetails/${row.LeadCode}`)}
                                                    >
                                                        {row.LeadCode}
                                                    </span>
                                                </Tooltip>
                                            </TableCell>

                                            <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.95rem' }}>
                                                <Tooltip title={row.CustomerName} arrow placement="bottom">
                                                    <span style={{ textAlign: 'center' }}>{row.CustomerName}</span>
                                                </Tooltip>
                                            </TableCell>

                                            <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.95rem' }}>
                                                <Tooltip title={row.CustomerPhone} arrow placement="bottom">
                                                    <span style={{ textAlign: 'center' }}>{row.CustomerPhone}</span>
                                                </Tooltip>
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: 120
                                                }}
                                            >
                                                <Tooltip
                                                    title={
                                                        row.Products?.reduce(
                                                            (total, item) => total + (item.Rate * item.Quantity),
                                                            0
                                                        ).toLocaleString('en-US')
                                                    }
                                                    arrow
                                                >
                                                    <span>
                                                        {row.Products?.reduce(
                                                            (total, item) => total + (item.Rate * item.Quantity),
                                                            0
                                                        ).toLocaleString('en-US')}
                                                    </span>
                                                </Tooltip>
                                            </TableCell>

                                            <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.95rem' }}>
                                                <Tooltip title={row.LeadQuality} arrow placement="bottom">
                                                    <span style={{ textAlign: 'center' }}>{row.LeadQuality}</span>
                                                </Tooltip>
                                            </TableCell>

                                            <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.95rem' }}>
                                                <Tooltip title={row.AssignTo} arrow placement="bottom">
                                                    <span style={{ textAlign: 'center' }}>{row.AssignTo}</span>
                                                </Tooltip>
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: 120
                                                }}
                                            >
                                                {formatDateTime(row.FollowUpDate) || '-'}
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

export default Lost
