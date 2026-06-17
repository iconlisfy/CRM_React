import React, { useEffect, useState } from 'react'
import { Card, Paper, CardContent, Checkbox, FormControlLabel, Grid, Radio, MenuItem, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, TableBody, Button, Box, InputAdornment, IconButton, Chip, Tooltip } from '@mui/material'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import getReduxState from '../../../ReduxState';
import axiosInstance from '../../../axios';
import { useNavigate } from 'react-router-dom';
import NewTicket from '../Ticket List/NewTicket';
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import whatsapp from '../../../assets/images/whatsapp.svg'
import loadinggif from '../../../assets/images/load.gif'

function OverAllworkReports() {

    const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]); // from date
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);// to date

    const [getData, setGetData] = useState([])

    // Date
    const frmDate = fromDate ? format(fromDate, 'yyyy-MM-dd') : null
    const todate = toDate ? format(toDate, 'yyyy-MM-dd') : null

    const { role, deptid, name, empId, BrnchKey } = getReduxState()

    const isAdmin = role === "Administrator";
    const isHOD = role === "HOD";

    const [selectAll, setSelectAll] = useState(false);

    const [allDept, setAllDept] = useState([]);
    const [listDept, setListDept] = useState(
        isAdmin ? "All" : deptid
    );

    const [allStaff, setAllStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(empId);


    const [openTicketModal, setOpenTicketModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

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
    // const filteredStaff = (() => {

    //     if (isAdmin) {
    //         return listDept === "All"
    //             ? allStaff
    //             : allStaff.filter(
    //                 s => Number(s.Dept_id) === Number(listDept)
    //             );
    //     }

    //     if (isHOD) {
    //         return allStaff.filter(
    //             s => Number(s.Dept_id) === Number(deptid)
    //         );
    //     }

    //     // Normal user
    //     return allStaff.filter(
    //         s => Number(s.ahmst_key) === Number(empId)
    //     );

    // })();
    const filteredStaff = (() => {

        // // When checkbox checked show logged-in department users
        // if (selectAll) {
        //     return allStaff.filter(
        //         s => Number(s.Dept_id) === Number(deptid)
        //     );
        // }

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

        try {

            const fetchResponse = await axiosInstance.get(
                `/WorkListAPI/GetReports`,
                {
                    params: {
                        EmpId: empId,

                        Department:
                            isAdmin
                                ? (listDept === "All" ? 0 : listDept)
                                : deptid,
                        staff:
                            isAdmin
                                ? (selectedStaff === "All" ? 0 : selectedStaff)
                                : isHOD
                                    ? (selectedStaff === "All" ? 0 : selectedStaff)
                                    : empId,
                        BrnchId: BrnchKey,
                        UsrGrp: role,
                        FromDate: frmDate,
                        ToDate: todate,
                        ShowAllDept: selectAll
                    }
                }
            );
            console.log("fetchresponse", fetchResponse)

            if (fetchResponse.data && fetchResponse.data.data) {

                setGetData(fetchResponse.data.data);
            }

        } catch (error) {
            console.log("Error while fetching reports", error);
        }
    };

    useEffect(() => {
        fetchData()
    }, [])


    const navigate = useNavigate();

    const handleOpenTicket = (row) => {
        navigate("/TicketLists", {
            state: {
                openReportsEdit: true,
                ticketData: row,
                fromRepotsDetails: true
            }
        });
    };

    // Print function
    // const handlePrint = async () => {

    //     const requestdata = {

    //         Department:
    //             isAdmin
    //                 ? (listDept === "All" ? 0 : listDept)
    //                 : deptid,

    //         Staff:
    //             isAdmin
    //                 ? (selectedStaff === "All" ? 0 : selectedStaff)
    //                 : isHOD
    //                     ? (selectedStaff === "All" ? 0 : selectedStaff)
    //                     : empId,

    //         FromDate: frmDate,
    //         ToDate: todate,
    //         ShowAllDept: selectAll
    //     };
    //     console.log("requestdata", requestdata)

    //     try {



    //         const url = `/RprtOverallWorklistAPI/Print`
    //         console.log("API URL:", url);

    //         const printResponseDate = await axiosInstance.post(url, requestdata);

    //         console.log("print response", printResponseDate)
    //         if (printResponseDate.data) {
    //             const data = printResponseDate.data;
    //             const base64PDF = data.pdf;

    //             const byteCharacters = atob(base64PDF);
    //             const byteNumbers = new Array(byteCharacters.length)
    //                 .fill(0)
    //                 .map((_, i) => byteCharacters.charCodeAt(i));
    //             const byteArray = new Uint8Array(byteNumbers);
    //             const blob = new Blob([byteArray], { type: 'application/pdf' });
    //             const blobUrl = URL.createObjectURL(blob);

    //             // Open PDF in a new window
    //             const newWindow = window.open('', 'newWindow', 'width=1000,height=1000');
    //             if (newWindow) {
    //                 newWindow.document.write(`
    //                                        <html>
    //                                          <head><title>Account Heads Transaction PDF</title></head>
    //                                          <body style="margin:0">
    //                                            <embed src="${blobUrl}" type="application/pdf" width="100%" height="100%">
    //                                          </body>
    //                                        </html>
    //                                      `);
    //                 newWindow.document.close();

    //             } else {
    //                 // Print the PDF using printJS
    //                 printJS({
    //                     printable: blobUrl,
    //                     type: "pdf",

    //                 });
    //                 console.log("Printing started...");
    //             }
    //         }
    //     } catch (error) {
    //         console.error('API Error:', error);
    //         const errorMessage = error.response?.data?.message || 'An error occurred while processing the request.';
    //         toast.error(errorMessage);
    //     }
    // }


    const handlePrint = async () => {


        const requestdata = {

            Department:
                isAdmin
                    ? (listDept === "All" ? 0 : listDept)
                    : deptid,

            Staff:
                isAdmin
                    ? (selectedStaff === "All" ? 0 : selectedStaff)
                    : isHOD
                        ? (selectedStaff === "All" ? 0 : selectedStaff)
                        : empId,

            FromDate: frmDate,
            ToDate: todate,
            ShowAllDept: selectAll
        };
        console.log("requestdata", requestdata)
        try {
            setIsLoading(true);

            const url = `/RprtOverallWorklistAPI/Print`;

            const printResponseDate = await axiosInstance.post(url, requestdata);

            if (printResponseDate.data) {
                const base64PDF = printResponseDate.data.pdf;

                const byteCharacters = atob(base64PDF);
                const byteNumbers = new Array(byteCharacters.length)
                    .fill(0)
                    .map((_, i) => byteCharacters.charCodeAt(i));

                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: "application/pdf" });
                const blobUrl = URL.createObjectURL(blob);

                const newWindow = window.open(
                    "",
                    "newWindow",
                    "width=1000,height=1000"
                );

                if (newWindow) {
                    newWindow.document.write(`
          <html>
            <head><title>PDF</title></head>
            <body style="margin:0">
              <embed src="${blobUrl}" type="application/pdf" width="100%" height="100%">
            </body>
          </html>
        `);
                    newWindow.document.close();
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message ||
                "An error occurred while processing the request."
            );
        } finally {
            setIsLoading(false);
        }
    };


    const handleWhatsApp = async () => {

        const requestdata = {
            Department:
                isAdmin
                    ? (listDept === "All" ? 0 : listDept)
                    : deptid,

            Staff:
                isAdmin
                    ? (selectedStaff === "All" ? 0 : selectedStaff)
                    : isHOD
                        ? (selectedStaff === "All" ? 0 : selectedStaff)
                        : empId,

            FromDate: frmDate,
            ToDate: todate,
            ShowAllDept: selectAll
        };

        try {
            setIsLoading(true);

            const response = await axiosInstance.post(
                "/RprtOverallWorklistAPI/Print",
                requestdata
            );

            const base64PDF = response.data?.pdf;

            const byteCharacters = atob(base64PDF);
            const byteNumbers = Array.from(
                byteCharacters,
                c => c.charCodeAt(0)
            );

            const blob = new Blob(
                [new Uint8Array(byteNumbers)],
                { type: "application/pdf" }
            );

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);

            // Date for filename
            const today = new Date();

            const formattedDate = today.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }).replace(/ /g, "-");

            // OverallWorkReport-06-June-2026.pdf
            link.download = `OverallWorkReport-[${formattedDate}].pdf`;

            link.click();

            setTimeout(() => {
                window.open("https://web.whatsapp.com/", "_blank");
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error("Error generating report");
        } finally {
            setIsLoading(false);
        }
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
                }}>
                OverAll Reports
            </Typography>

            <Card sx={{ marginTop: "1px" }}>
                <CardContent>
                    <Grid container spacing={1}>

                        <Grid item xs={12} sm={4} md={4} lg={2.5}>

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
                                {/*  Show "All" only for Admin */}
                                {role === "Administrator" && (
                                    <MenuItem value="All">-- All --</MenuItem>
                                )}

                                {/*  Admin → all departments */}
                                {/*  User → only their department */}
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

                        <Grid item xs={12} sm={4} md={4} lg={2} >

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

                        <Grid item xs={12} sm={4} md={4} lg={1.8} xl={1.8}>

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
                        <Grid item xs={12} sm={4} md={4} lg={1.8} xl={1.8}>

                            <DatePicker
                                selected={toDate ? new Date(toDate) : null}
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


                        <Grid item sm={2} lg={1.2}>
                            <FormControlLabel
                                control={<Checkbox size="small"
                                    checked={selectAll}
                                    onChange={(e) => setSelectAll(e.target.checked)}
                                    sx={{
                                        color: 'grey',
                                        '&.Mui-checked': {
                                            color: '#DC3545!important',
                                        },
                                    }} />}
                                label="Select All"
                            />
                        </Grid>


                        <Grid item xs={12} sm={2} md={1.5} lg={1}>
                            <Button
                                fullWidth
                                sx={{
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
                                onClick={fetchData}
                            >
                                Show
                            </Button>
                        </Grid>



                        <Grid item xs={12} sm={2} md={1.5} lg={1}>
                            <Button
                                fullWidth
                                sx={{
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
                                onClick={handlePrint}
                            >
                                Print
                            </Button>
                        </Grid>


                        <Grid
                            item
                            xs={12}
                            sm={2}
                            md={2.8}
                            lg={0.6}
                            xl={0.7}
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center"
                            }}
                        >
                            <Tooltip title="Whatsapp" arrow>
                                <img
                                    src={whatsapp}
                                    alt="whatsapp"
                                    onClick={handleWhatsApp}
                                    style={{
                                        height: "40px",
                                        marginLeft: "5px",
                                        cursor: "pointer",
                                        animation: "blink 1.4s infinite"
                                    }}
                                />
                            </Tooltip>

                            <style>
                                {`
            @keyframes blink {
                0% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.3; transform: scale(1.1); }
                100% { opacity: 1; transform: scale(1); }
            }
        `}
                            </style>
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
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Ticket#</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>DateTime</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>Customer</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '7%', fontWeight: 'bold' }}>Description</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Priority</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Status</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>Completed Date</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>Started By</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>Completed By</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>

                                        {getData?.length > 0 ? (
                                            getData.map((row, index) => (

                                                <TableRow key={index}
                                                    sx={{
                                                        height: "32px",
                                                        "&:hover": {
                                                            backgroundColor: "#fde2e5"
                                                        }
                                                    }} >

                                                    <TableCell >
                                                        {index + 1}
                                                    </TableCell>

                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <span
                                                            onClick={() => handleOpenTicket(row)}
                                                            style={{
                                                                textDecoration: "none",
                                                                color: "#1976d2",
                                                                fontWeight: 500,
                                                                cursor: "pointer"
                                                            }}
                                                        >
                                                            {row.Tkt_No}
                                                        </span>
                                                    </TableCell>

                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.Start_Date} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.Start_Date}</span>
                                                        </Tooltip>
                                                    </TableCell>

                                                    <TableCell
                                                        sx={{

                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: 150
                                                        }}
                                                        title={row.Tkt_CustName}
                                                    >
                                                        <Tooltip title={row.Tkt_CustName} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.Tkt_CustName}</span>
                                                        </Tooltip>
                                                    </TableCell>

                                                    <TableCell
                                                        sx={{

                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: 200
                                                        }}
                                                        title={row.Tkt_Description}>
                                                        <Tooltip title={row.Tkt_Description} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}> {row.Tkt_Description}</span>
                                                        </Tooltip>
                                                    </TableCell>

                                                    <TableCell>
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
                                                        />
                                                    </TableCell>

                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.Tkt_Status} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>   {row.Tkt_Status}</span>
                                                        </Tooltip>
                                                    </TableCell>

                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.CompletedDate || ''} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.CompletedDate || ''}</span>
                                                        </Tooltip>
                                                    </TableCell>

                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {row.StartedBy || ''}
                                                    </TableCell>

                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.CompletedBy || ''} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.CompletedBy || ''}
                                                            </span>
                                                        </Tooltip>
                                                    </TableCell>

                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={10} align="center" sx={{ fontSize: '0.9rem', padding: 2 }}>
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

            <NewTicket

                visible={openTicketModal}
                setVisible={setOpenTicketModal}
                selectedRow={selectedRow} />


            <ToastContainer autoClose={1000} hideProgressBar={true} position='top-center' theme='colored' transition={Bounce} />
            {isLoading && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.28)',
                    zIndex: 9999,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div>
                        <img
                            src={loadinggif}
                            alt="Loading..."
                            style={{ width: 100, height: 100 }}
                        />
                        {/* <div style={{ marginTop: 12, textAlign: 'center' }}>Loading  PDF...</div> */}
                    </div>
                </div>
            )}


            <ToastContainer autoClose={1000} hideProgressBar={true} position='top-center' theme='colored' transition={Bounce} />


        </div >


    )
}

export default OverAllworkReports
