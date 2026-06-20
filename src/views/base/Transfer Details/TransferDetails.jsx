import React, { useEffect, useState } from 'react'
import { Card, Paper, CardContent, Checkbox, FormControlLabel, Grid, Radio, MenuItem, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, TableBody, Button, Box, InputAdornment, IconButton, CircularProgress, Chip, Tooltip } from '@mui/material'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import getReduxState from '../../../ReduxState';
import axiosInstance from '../../../axios';
import { useNavigate } from 'react-router-dom';
import NewTicket from '../Ticket List/NewTicket';
import VisibilityIcon from '@mui/icons-material/Visibility';

function TransferDetails() {

    const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]); // from date
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);// to date

    // Date
    const frmDate = fromDate ? format(fromDate, 'yyyy-MM-dd') : null
    const todate = toDate ? format(toDate, 'yyyy-MM-dd') : null

    const { role, deptid, name, empId, BrnchKey } = getReduxState()

    const isAdmin = role === "Administrator";
    const isHOD = role === "HOD";

    const [allDept, setAllDept] = useState([]);
    const [listDept, setListDept] = useState(
        isAdmin ? "All" : deptid
    );

    const [openTicketModal, setOpenTicketModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [allStaff, setAllStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(
        isAdmin ? "All" : empId
    );

    const [completewrk, setCompletewrk] = useState(false)
    const [isloading, setIsloading] = useState(false)

    const [tabledata, setTabledata] = useState([])

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




    const fetchdata = async () => {
        // console.log('listDept', listDept)
        // console.log('selectedStaff', selectedStaff)
        let depid = listDept === 'All' ? 0 : listDept
        let staffid = selectedStaff === "All" ? 0 : selectedStaff
        setIsloading(true)
        try {
            const response = await axiosInstance.get(`/ticket/TransferredWork?Department=${depid}&staff=${staffid}&FromDate=${frmDate}&ToDate=${todate}&UsrGrp=${role}&Iscompleted=${completewrk} `)
            console.log('Response', response);
            setIsloading(false)
            const tabledata = response.data
            setTabledata(tabledata)

        } catch (err) {
            console.error('failed to fetech transfer List')
        }

    }

    useEffect(() => {
        fetchdata()
    }, [])

    const navigate = useNavigate();

    const handleOpenTicket = (row) => {
        navigate("/TicketLists", {
            state: {
                opentransEdit: true,
                ticketData: row,
                fromTransferWorkList: true
            }
        });
    };

    // Print function
    const handlePrint = async (ticketNum) => {

        try {

            const url = `/RprtWorkListAPI/Print?ticketNum=${ticketNum}`
            const printResponseDate = await axiosInstance.get(url);

            console.log("print response", printResponseDate)
            if (printResponseDate.data) {
                const data = printResponseDate.data;
                const base64PDF = data.pdf;

                const byteCharacters = atob(base64PDF);
                const byteNumbers = new Array(byteCharacters.length)
                    .fill(0)
                    .map((_, i) => byteCharacters.charCodeAt(i));
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const blobUrl = URL.createObjectURL(blob);

                // Open PDF in a new window
                const newWindow = window.open('', 'newWindow', 'width=1000,height=1000');
                if (newWindow) {
                    newWindow.document.write(`
                                               <html>
                                                 <head><title>Current WorkList PDF</title></head>
                                                 <body style="margin:0">
                                                   <embed src="${blobUrl}" type="application/pdf" width="100%" height="100%">
                                                 </body>
                                               </html>
                                             `);
                    newWindow.document.close();

                } else {
                    // Print the PDF using printJS
                    printJS({
                        printable: blobUrl,
                        type: "pdf",

                    });
                    console.log("Printing started...");
                }
            }
        } catch (error) {
            console.error('API Error:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred while processing the request.';
            toast.error(errorMessage);
        }
    }


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
                Transfer Details
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

                        <Grid item xs={12} sm={4} md={4} lg={2.5} xl={2}>

                            <FormControlLabel
                                sx={{
                                    marginLeft: { xs: '0px', sm: "0px", lg: "0px" },
                                }}
                                control={<Checkbox
                                    // value={branchForm.itemDiscItem}
                                    onChange={(e) =>
                                        setCompletewrk(e.target.checked)
                                    }
                                    name='itemDiscItem'
                                    sx={{
                                        color: 'grey',
                                        '&.Mui-checked': {
                                            color: '#DC3545!important',   // 🔥 force override
                                        },
                                    }}
                                />}
                                label="Completed Work Items"
                            />
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

                        <Grid item xs={12} sm={4} md={4} lg={1} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                onClick={fetchdata}
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
                                        lg: 'calc(100vh - 150px)',
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
                                <Table striped sx={{ minWidth: 1200, tableLayout: 'fixed' }}>
                                    {/* Table Head */}
                                    <TableHead sx={{ position: 'sticky', zIndex: 1, top: 0, backgroundColor: 'var(--header-bg-color)' }}>

                                        <TableRow sx={{ height: '32px' }}>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}>SlNo</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>Ticket#</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '7%', fontWeight: 'bold' }}>DateTime</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '9%', fontWeight: 'bold' }}>Customer</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Priority</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '7%', fontWeight: 'bold' }}>Description</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Status</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Tat</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>Transferred To</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}></TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isloading ? (
                                            <TableRow>
                                                <TableCell colSpan={10} align="center">

                                                    <CircularProgress size={25} sx={{ color: "#DC3545" }} />
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            tabledata.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={10} align="center">
                                                        No Tickets Available
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                tabledata.map((row, index) =>
                                                    <TableRow key={index}
                                                        sx={{
                                                            height: "32px",
                                                            "&:hover": {
                                                                backgroundColor: "#fde2e5"
                                                            }
                                                        }}    >
                                                        <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{index + 1}</TableCell>
                                                        <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {/* <Tooltip title={row.Tkt_No} arrow placement="bottom">
                                                                <span style={{ textAlign: 'center' }}>{row.Tkt_No}</span>
                                                            </Tooltip> */}

                                                            <span
                                                                onClick={() => handleOpenTicket(row)}
                                                                style={{
                                                                    textDecoration: "none",
                                                                    color: "#1976d2",
                                                                    fontWeight: 500,
                                                                    cursor: "pointer"
                                                                }}
                                                            >{row.Tkt_No}</span>
                                                        </TableCell>
                                                        <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            <Tooltip title={row.strDate} arrow placement="bottom">
                                                                <span style={{ textAlign: 'center' }}>{row.strDate}</span>
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
                                                            <Tooltip title={row.Tkt_Tat} arrow placement="bottom">
                                                                <span style={{ textAlign: 'center' }}>{row.Tkt_Tat}</span>
                                                            </Tooltip></TableCell>
                                                        <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            <Tooltip title={row.TransPerName} arrow placement="bottom">
                                                                <span style={{ textAlign: 'center' }}>{row.TransPerName}</span>
                                                            </Tooltip></TableCell>

                                                        <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            <VisibilityIcon
                                                                onClick={() => handlePrint(row.Tkt_No)} />
                                                        </TableCell>

                                                    </TableRow>



                                                )
                                            )

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

export default TransferDetails
