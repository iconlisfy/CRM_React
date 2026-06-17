import { Box, Button, Card, CardContent, Checkbox, FormControlLabel, Grid, MenuItem, IconButton, InputAdornment, Paper, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, TableBody } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import getReduxState from '../../../ReduxState';
import axiosInstance from '../../../axios';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";

function WorkStatus() {


    const { role, deptid, name, empId, BrnchKey } = getReduxState()

    const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]); // from date
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);// to date

    // Date
    const frmDate = fromDate ? format(fromDate, 'yyyy-MM-dd') : null
    const todate = toDate ? format(toDate, 'yyyy-MM-dd') : null


    const [getData, setGetData] = useState([])
    const [openRows, setOpenRows] = useState({});

    const isAdmin = role === "Administrator";
    const isHOD = role === "HOD";

    const [allDept, setAllDept] = useState([]);
    const [listDept, setListDept] = useState(
        isAdmin ? "All" : deptid
    );
    const [allStaff, setAllStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(empId);

    const [status, setStatus] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All"); // applied filter

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


    const handleToggleRow = (ticketNo) => {
        setOpenRows((prev) => ({
            ...prev,
            [ticketNo]: !prev[ticketNo]
        }));
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

    

    // fetch data
    const fetchData = async () => {
        try {

            const department =
                isAdmin
                    ? (listDept === "All" ? 0 : listDept)
                    : deptid;

            const staff =
                isAdmin
                    ? (selectedStaff === "All" ? 0 : selectedStaff)
                    : isHOD
                        ? (selectedStaff === "All" ? 0 : selectedStaff)
                        : empId;

            const fetchResponse = await axiosInstance.get(
                `/WorkStatusAPI/GetData?EmpId=${empId}&Department=${department}&staff=${staff}&BrnchId=${BrnchKey}&UsrGrp=${role}&FromDate=${frmDate}&ToDate=${todate}`
            );

            if (fetchResponse.data?.data) {
                setGetData(fetchResponse.data.data);
            }
            setSelectedStatus(status);

        } catch (error) {
            console.log("Error while fetching data", error);
        }
    };

    useEffect(() => {
        fetchStaff()
        fetchDepartment()
    }, [])


    const filteredData =
        selectedStatus === "All"
            ? getData
            : getData.filter(
                item =>
                    item?.TicketStatus?.toLowerCase() ===
                    selectedStatus.toLowerCase()
            );

    return (
        <>
            <Box
                sx={{
                    zoom: { xs: "0.9", sm: "0.9", md: "1", lg: "1", xl: "0.9" }
                }}>

                <Grid container spacing={1}>

                    <Grid item xs={12} >
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
                                // marginLeft: { xs: '20px', sm: '0px', md: "-10px", lg: "-140px", xl: "-180px" },
                                marginTop: { xs: '-20px', sm: '-20px', md: "-20px", lg: "-20px", xl: "-20px" }
                            }}>
                            Work Status</Typography>

                    </Grid>

                    <Grid item xs={12} >

                        <Card>
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




                                    <Grid item xs={12} sm={4} md={4} lg={1.8} xl={2}>

                                        <DatePicker
                                            selected={fromDate ? new Date(fromDate) : null}
                                            onChange={(date) => setFromDate(date)}
                                            popperPlacement="top-start"
                                            portalId="root-portal" // Ensures it's rendered at the end of the body
                                            dateFormat="dd-MMM-yyyy"
                                            customInput={
                                                <TextField
                                                    label="From Date"
                                                    size="small"
                                                    fullWidth
                                                    InputLabelProps={{ shrink: true }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton onClick={() => inputRef.current?.focus()}>
                                                                    <CalendarTodayIcon />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{

                                                        '& input': {
                                                            // borderLeft: '4px solid var(--primary-bg-color)',
                                                            '&:focus': {
                                                                backgroundColor: 'var(--focus-bg-color)',
                                                            }
                                                        }
                                                    }}
                                                />
                                            }
                                        />


                                    </Grid>
                                    <Grid item xs={12} sm={4} md={4} lg={1.8} xl={2}>

                                        <DatePicker
                                            selected={todate ? new Date(todate) : null}
                                            onChange={(date) => setToDate(date)}
                                            popperPlacement="top-start"
                                            portalId="root-portal" // Ensures it's rendered at the end of the body
                                            dateFormat="dd-MMM-yyyy"
                                            customInput={
                                                <TextField
                                                    label="To Date"
                                                    size="small"
                                                    fullWidth
                                                    InputLabelProps={{ shrink: true }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton onClick={() => inputRef.current?.focus()}>
                                                                    <CalendarTodayIcon />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{

                                                        '& input': {
                                                            // borderLeft: '4px solid var(--primary-bg-color)',
                                                            '&:focus': {
                                                                backgroundColor: 'var(--focus-bg-color)',
                                                            }
                                                        }
                                                    }}
                                                />
                                            }
                                        />

                                    </Grid>


                                    <Grid item xs={12} sm={4} md={4} lg={2} xl={2}>

                                        <TextField
                                            select
                                            size="small"
                                            fullWidth
                                            label="Status"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}

                                            sx={{
                                                '& .MuiOutlinedInput-root.Mui-focused': {
                                                    backgroundColor: 'var(--focus-bg-color)',
                                                },
                                            }}
                                        >
                                            <MenuItem value="All">--All--</MenuItem>
                                            <MenuItem value="Doing">Doing</MenuItem>
                                            <MenuItem value="Completed">Completed</MenuItem>
                                            <MenuItem value="Paused">Paused</MenuItem>

                                        </TextField>


                                    </Grid>

                                    <Grid item xs={12} sm={4} md={4} lg={1} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            onClick={fetchData}
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
                                            variant="contained">
                                            Submit
                                        </Button>

                                    </Grid>


                                    <Grid item xs={12} sx={{ marginBottom: { xs: '40px', sm: '30px', md: '30px' } }}>

                                        <TableContainer
                                            component={Paper}
                                            sx={{
                                                height: {
                                                    xs: 'calc(100vh - 150px)',
                                                    sm: 'calc(100vh - 190px)',
                                                    md: 'calc(100vh - 150px)',
                                                    lg: 'calc(100vh - 140px)',
                                                    xl: 'calc(100vh - 158px)'
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
                                            <Table striped sx={{ minWidth: 1000, tableLayout: 'fixed' }}>
                                                {/* Table Head */}
                                                <TableHead sx={{ position: 'sticky', zIndex: 1, top: 0, backgroundColor: 'var(--header-bg-color)' }}>

                                                    <TableRow sx={{ height: '32px' }}>
                                                        <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}>SlNo</TableCell>
                                                        <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '6%', fontWeight: 'bold' }}>Employee</TableCell>
                                                        <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '9%', fontWeight: 'bold' }}>Last UpdatedOn</TableCell>
                                                        <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>Ticket#</TableCell>
                                                        <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '12%', fontWeight: 'bold' }}>Customer</TableCell>
                                                        <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '10%', fontWeight: 'bold' }}>Description</TableCell>
                                                        <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '7%', fontWeight: 'bold' }}>Status</TableCell>
                                                        <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '6%', fontWeight: 'bold' }}>Employee</TableCell>
                                                        <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Sub Works</TableCell>

                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {filteredData?.length > 0 ? (
                                                        filteredData.map((item, index) => (
                                                            <React.Fragment key={index}>

                                                                <TableRow>
                                                                    <TableCell>{item.Row}</TableCell>
                                                                    <TableCell>{item.Employee}</TableCell>
                                                                    <TableCell>{item.UpdateDate}</TableCell>
                                                                    <TableCell>{item.TicketNo}</TableCell>
                                                                    <TableCell>{item.CustomerName}</TableCell>
                                                                    <TableCell>{item.Description}</TableCell>
                                                                    <TableCell>{item.TicketStatus}</TableCell>
                                                                    <TableCell>{item.Employee}</TableCell>

                                                                    <TableCell align="center">
                                                                        <Button
                                                                            size="small"
                                                                            variant="outlined"
                                                                            onClick={() => handleToggleRow(item.TicketNo)}
                                                                            endIcon={
                                                                                openRows[item.TicketNo]
                                                                                    ? <KeyboardArrowUpIcon />
                                                                                    : <KeyboardArrowDownIcon />
                                                                            }
                                                                            sx={{
                                                                                backgroundColor: "#f7eaea",
                                                                                border: "1px solid #ec9c9c",
                                                                                color: "#DC3545",
                                                                                textTransform: "none",
                                                                                fontWeight: 600,
                                                                                "&:hover": {
                                                                                    backgroundColor: "#f3dede",
                                                                                    border: "1px solid #dc7c7c"
                                                                                }
                                                                            }}
                                                                        >
                                                                            {item.SubTasks?.length || 0}
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>

                                                                <TableRow>
                                                                    <TableCell
                                                                        colSpan={9}
                                                                        sx={{
                                                                            p: 0,
                                                                            borderBottom: openRows[item.TicketNo]
                                                                                ? "1px solid #e0e0e0"
                                                                                : "none"
                                                                        }}
                                                                    >
                                                                        <Collapse
                                                                            in={openRows[item.TicketNo]}
                                                                            timeout="auto"
                                                                            unmountOnExit
                                                                        >
                                                                            <Box sx={{ p: 2, bgcolor: "#fafafa" }}>
                                                                                {item.SubTasks?.map((task, subIndex) => (
                                                                                    <Box
                                                                                        key={subIndex}
                                                                                        sx={{
                                                                                            p: 1.5,
                                                                                            mb: 1,
                                                                                            backgroundColor: "#f7eaea",
                                                                                            border: "1px solid #ec9c9c",
                                                                                            borderRadius: 2,
                                                                                        }}
                                                                                    >
                                                                                        <Typography
                                                                                            fontWeight={600}
                                                                                            color={'#DC3545'}
                                                                                        >
                                                                                            {task.WorkTitle}
                                                                                        </Typography>

                                                                                        <Typography variant="body2">
                                                                                            Status : {task.Status}
                                                                                        </Typography>

                                                                                        <Typography variant="body2">
                                                                                            Progress : {task.Percentage}%
                                                                                        </Typography>

                                                                                        <Typography variant="body2">
                                                                                            Last Updated On : {task.WorkDate}
                                                                                        </Typography>

                                                                                        <Typography variant="body2">
                                                                                            Start : {task.StartDate || "-"}
                                                                                        </Typography>

                                                                                        <Typography variant="body2">
                                                                                            End : {task.EndDate || "-"}
                                                                                        </Typography>
                                                                                    </Box>
                                                                                ))}
                                                                            </Box>
                                                                        </Collapse>
                                                                    </TableCell>
                                                                </TableRow>

                                                            </React.Fragment>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={9} align="center">
                                                                No Data Available
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>


                                            </Table>

                                        </TableContainer>
                                    </Grid>


                                </Grid>

                            </CardContent>
                        </Card>



                    </Grid>


                </Grid>

            </Box>
        </>
    )
}

export default WorkStatus
