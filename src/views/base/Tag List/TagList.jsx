import React, { useEffect, useState } from 'react'
import { Card, Paper, CardContent, Checkbox, FormControlLabel, Grid, Radio, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, TableBody, Button, Box, InputAdornment, IconButton, MenuItem, Tooltip, Chip } from '@mui/material'
import getReduxState from '../../../ReduxState';
import axiosInstance from '../../../axios';
import NewTicket from '../Ticket List/NewTicket';
import { useNavigate } from 'react-router-dom';


function TagList() {


    const { role, deptid, name, empId, BrnchKey } = getReduxState()

    const isAdmin = role === "Administrator";
    const isHOD = role === "HOD";

    const [allDept, setAllDept] = useState([]);
    const [listDept, setListDept] = useState(
        isAdmin ? "All" : deptid
    );

    const [allStaff, setAllStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(empId);

    const [getData, setGetData] = useState([])

    const [openTicketModal, setOpenTicketModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    // Fetch Staff
    const fetchStaff = async () => {
        try {
            const res = await axiosInstance.get("/AcctMstStaffAPI/GetAll");

            const staffData = res?.data?.staff;

            setAllStaff(Array.isArray(staffData) ? staffData : []);
        } catch (err) {
            console.log("Error fetching staff", err);
            setAllStaff([]);
        }
    };

    // Fetch Department
    const fetchDepartment = async () => {
        try {
            const fetchResponse = await axiosInstance.get(`MasterAPI/Search?Type=Dept`)

            if (fetchResponse.data && fetchResponse.data.MasterList) {
                setAllDept(fetchResponse.data.MasterList);
            }
        } catch (error) {
            console.log("error while fetching all data", error)
        }
    }

    // Filter Staff According to Dept
    // Filter Staff According to Dept
    const filteredStaff = (() => {

        if (isAdmin) {
            return listDept === "All"
                ? allStaff
                : allStaff.filter(
                    s => Number(s.Dept_id) === Number(listDept)
                );
        }

        if (isHOD) {
            return allStaff.filter(
                s => Number(s.Dept_id) === Number(deptid)
            );
        }

        // Normal user
        return allStaff.filter(
            s => Number(s.ahmst_key) === Number(empId)
        );

    })();

    useEffect(() => {
        if (isAdmin) {
            setListDept("All");

            // show admin own name initially
            setSelectedStaff(empId);
        }
        else if (isHOD) {
            setListDept(deptid);

            // HOD own name
            setSelectedStaff(empId);
        }
        else {
            setListDept(deptid);
            setSelectedStaff(empId);
        }
    }, [role, deptid, empId]);

    useEffect(() => {

        // wait until staff loaded
        if (allStaff.length === 0) return;

        // skip if already all
        if (selectedStaff === "All") return;

        const staffExists = filteredStaff.some(
            staff => Number(staff.ahmst_key) === Number(selectedStaff)
        );

        if (!staffExists) {

            // HOD -> own login initially
            if (isHOD) {
                setSelectedStaff(empId);
            }

            // ADMIN -> all
            else if (isAdmin) {
                setSelectedStaff("All");
            }

            // USER -> own login
            else {
                setSelectedStaff(empId);
            }
        }

    }, [listDept, filteredStaff, allStaff]);

    useEffect(() => {
        fetchStaff()
        fetchDepartment()
    }, [])


    const fetchData = async () => {

        const requestData = {
            EmpId: empId,

            StaffId:
                isAdmin
                    ? (selectedStaff === "All" ? 0 : selectedStaff)
                    : isHOD
                        ? (selectedStaff === "All" ? 0 : selectedStaff)
                        : empId,

            DeptId:
                isAdmin
                    ? (listDept === "All" ? 0 : listDept)
                    : deptid,

            BrnchId: BrnchKey,
            UserGroup: role
        };

        try {

            const response = await axiosInstance.get(
                `/TagListAPI/TagList`,
                {
                    params: requestData
                }
            );

            if (response.data && response.data.data) {
                setGetData(response.data.data)
            }

            console.log("tag list response", response.data);

        } catch (error) {

            console.log("error while fetching data", error);

        }
    };


    useEffect(() => {
        fetchData();
    }, [selectedStaff, listDept]);

    const navigate = useNavigate()

    const handleOpenTicket = (row) => {
        navigate("/TicketLists", {
            state: {
                openTagEdit: true,
                ticketData: row,
                fromTagList: true
            }
        });
    };


    return (

        <div>
            <Typography
                variant="h2"
                component="div"
                display={'flex'}
                alignItems={'center'}
                textAlign={'center'}
                color={'#DC3545'}

                sx={{
                    fontSize: '1.4rem',
                    fontWeight: 'bold',
                    marginTop: { xs: '-20px', sm: '-20px', md: "-20px", lg: "-20px", xl: "-20px" }
                }}



            >
                Tag Lists
            </Typography>

            <Card sx={{ marginTop: "1px" }}>
                <CardContent>
                    <Grid container spacing={1}>

                        <Grid item xs={12} sm={4} md={4} lg={2.7}>

                            <TextField
                                select
                                label="Department"
                                size="small"
                                fullWidth
                                value={listDept}
                                onChange={(e) => setListDept(e.target.value)}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        backgroundColor: 'var(--focus-bg-color)',
                                    },
                                }}
                            >
                                {/* ✅ Show "All" only for Admin */}
                                {role === "Administrator" && (
                                    <MenuItem value="All">-- All --</MenuItem>
                                )}

                                {/* ✅ Admin → all departments */}
                                {/* ✅ User → only their department */}
                                {allDept
                                    .filter(dept =>
                                        role === "Administrator"
                                            ? true
                                            : dept.mstr_key === deptid
                                    )
                                    .map((dept) => (
                                        <MenuItem key={dept.mstr_key} value={dept.mstr_key}>
                                            {dept.desc}
                                        </MenuItem>
                                    ))}
                            </TextField>
                        </Grid>


                        <Grid item xs={12} sm={4} md={4} lg={2.2} >

                            <TextField
                                select
                                size="small"
                                fullWidth
                                label="Staff"
                                value={selectedStaff}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedStaff(value === "All" ? "All" : Number(value));
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        backgroundColor: 'var(--focus-bg-color)',
                                    },
                                }}
                            >
                                {(isAdmin || isHOD) && (
                                    <MenuItem value="All">-- All --</MenuItem>
                                )}

                                {filteredStaff.map(staff => (
                                    <MenuItem key={staff.ahmst_key} value={staff.ahmst_key}>
                                        {staff.ahmst_pname}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={4} md={4} lg={2.2} >

                            <TextField
                                select
                                label="Select All"
                                size="small"
                                fullWidth
                                variant="outlined"
                                sx={{
                                    '@media (max-width: 320px)': {
                                        width: '100%', // Ensure full width on small screens
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        backgroundColor: 'var( --focus-bg-color)', // Set background color on focus
                                    },
                                }}
                            >
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="Assigned">Assigned</MenuItem>
                                <MenuItem value="Unassigned">Unassigned</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={4} md={4} lg={2} xl={2}>

                            <FormControlLabel
                                sx={{
                                    marginLeft: { xs: '0px', sm: "0px", lg: "0px" },
                                }}
                                control={<Checkbox
                                    // value={branchForm.itemDiscItem}
                                    name='itemDiscItem'
                                    sx={{
                                        color: 'grey',
                                        '&.Mui-checked': {
                                            color: '#DC3545!important',   // 🔥 force override
                                        },
                                    }}
                                />}
                                label="Todays Messages"
                            />
                        </Grid>





                        <Grid item xs={12} sx={{ marginBottom: { xs: '40px', sm: '30px', md: '30px' } }}>

                            <TableContainer
                                component={Paper}
                                sx={{
                                    height: {
                                        xs: 'calc(100vh - 150px)',
                                        sm: 'calc(100vh - 190px)',
                                        md: 'calc(100vh - 150px)',
                                        lg: 'calc(100vh - 150px)',
                                        xl: 'calc(100vh - 158px)'
                                    }, overflowX: 'auto',
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
                                <Table striped sx={{ minWidth: 1200, tableLayout: 'fixed' }}>
                                    {/* Table Head */}
                                    <TableHead sx={{ position: 'sticky', zIndex: 1, top: 0, backgroundColor: 'var(--header-bg-color)' }}>

                                        <TableRow sx={{ height: '32px' }}>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '2%', fontWeight: 'bold' }}>SlNo</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Ticket#</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '7%', fontWeight: 'bold' }}>DateTime</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '6%', fontWeight: 'bold' }}>Customer</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Priority</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '7%', fontWeight: 'bold' }}>Description</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Status</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Tat</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Created by</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>WorkTaken by</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getData.length > 0 ? (
                                            getData.map((row, index) => (
                                                <TableRow sx={{
                                                    height: "32px",
                                                    "&:hover": {
                                                        backgroundColor: "#fde2e5"
                                                    }
                                                }}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>
                                                        <span
                                                            onClick={() => handleOpenTicket(row)}
                                                            style={{
                                                                textDecoration: "none",
                                                                color: "#1976d2",
                                                                fontWeight: 500,
                                                                cursor: "pointer"
                                                            }}
                                                        >{row.TicketNo}</span></TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.Date_Time} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.Date_Time}</span>
                                                        </Tooltip></TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.Tkt_CustName} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.Tkt_CustName}</span>
                                                        </Tooltip></TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Chip
                                                            label={row.Tkt_Priorities || "High"}
                                                            size="medium"
                                                            sx={{
                                                                width: 90,                //  fixed width
                                                                justifyContent: "center", //  center text
                                                                fontWeight: 600,
                                                                fontSize: '0.8rem',
                                                                height: 28,
                                                                borderRadius: '6px',

                                                                backgroundColor:
                                                                    row.Tkt_Priorities === "High"
                                                                        ? "rgba(214, 54, 54, 0.12)"
                                                                        : row.Tkt_Priorities === "Medium"
                                                                            ? "rgba(250, 173, 20, 0.12)"
                                                                            : "rgba(78, 202, 16, 0.12)",

                                                                color:
                                                                    row.Tkt_Priorities === "High"
                                                                        ? "#cf1322"
                                                                        : row.Tkt_Priorities === "Medium"
                                                                            ? "#d48806"
                                                                            : "#389e0d",

                                                                border:
                                                                    row.Tkt_Priorities === "High"
                                                                        ? "1px solid #ef5350"
                                                                        : row.Tkt_Priorities === "Medium"
                                                                            ? "1px solid #f9a825"
                                                                            : "1px solid #4caf50",

                                                                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                                                            }}
                                                        /></TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.Tkt_Description} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.Tkt_Description}</span>
                                                        </Tooltip></TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.Tkt_Status} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.Tkt_Status}</span>
                                                        </Tooltip></TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.Tat} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.Tat}</span>
                                                        </Tooltip></TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.CreatedBy} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.CreatedBy}</span>
                                                        </Tooltip></TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.WorkTakenBy} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.WorkTakenBy}</span>
                                                        </Tooltip></TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={10} sx={{ textAlign: 'center' }}>No Data Available</TableCell>
                                            </TableRow>

                                        )}
                                    </TableBody>

                                </Table>

                            </TableContainer>
                        </Grid>





                    </Grid>





                </CardContent>
            </Card>



            <NewTicket
                visible={openTicketModal}
                setVisible={setOpenTicketModal}
                selectedRow={selectedRow} />
        </div>



    )
}

export default TagList
