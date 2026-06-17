import { Card, CardContent, Grid, TextField, Typography, IconButton, InputAdornment, FormControlLabel, Checkbox, Button, Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, Autocomplete, MenuItem, TableBody, Tooltip, CircularProgress } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { FixedSizeList } from 'react-window';
import axiosInstance from '../../../axios';
import getReduxState from '../../../ReduxState';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import AddIcon from '@mui/icons-material/Add';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

} from "@mui/material";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ServiceView() {

    const { empId, role, dept, name } = getReduxState()

    const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]); // from date
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);// to date

    // Date
    const frmDate = fromDate ? format(fromDate, 'yyyy-MM-dd') : null
    const todate = toDate ? format(toDate, 'yyyy-MM-dd') : null

    const [CustomerValues, setCustomerValues] = useState([]);
    const [Customer, setCustomer] = useState(null);
    const [CustomerId, setCustomerId] = useState(0);
    const [customerInput, setCustomerInput] = useState("");

    const [ticketNo, setTicketNo] = useState('')

    const [allStaff, setAllStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(empId);

    const [allServeType, setServeType] = useState([]);
    const [selectedServeType, setSelectedServeType] = useState('All')

    const [status, setStatus] = useState('All')

    const [allPending, setAllPending] = useState(false)
    const [payableService, setPayableService] = useState('All')
    const [getData, setGetData] = useState([])

    const [openCompleteDialog, setOpenCompleteDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);


    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    const [openCreateTicketDialog, setOpenCreateTicketDialog] = useState(false);
    const [selectedCreateRow, setSelectedCreatedRow] = useState(null);

    const handleClose = () => {
        setOpenDialog(false);
    }


    const inputRef = useRef(null)

    const [loading, setLoading] = useState(false);

    // Fetch Latest Ticket No
    const fetchLatestTicketNo = async () => {
        try {
            const fetchResponse = await axiosInstance.get(`/TicketAPI/GetNextTicketNo`)
            console.log("latest ticket no", fetchResponse)

            if (fetchResponse.data && fetchResponse.data.next_ticket_no) {
                setTicketNo(fetchResponse.data.next_ticket_no);
            }
        } catch (error) {
            console.log("error while fetching all data", error)
        }
    }
    useEffect(() => {
        fetchLatestTicketNo()
    }, [])


    // Fetch Customer Name
    const fetchAllDetails = async () => {
        try {
            const fetchResponse = await axiosInstance.get(`/AccountHeadsAPI/GetAll`)

            if (fetchResponse.data && fetchResponse.data.ahmst) {
                setCustomerValues(fetchResponse.data.ahmst);
            }
        } catch (error) {
            console.log("error while fetching all data", error)
        }
    }


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

    const fetchServeType = async () => {
        try {
            const fetchResponse = await axiosInstance.get(`MasterAPI/Search?Type=ServType`)

            if (fetchResponse.data && fetchResponse.data.MasterList) {
                setServeType(fetchResponse.data.MasterList);
            }
        } catch (error) {
            console.log("error while fetching all data", error)
        }
    }


    useEffect(() => {
        fetchAllDetails()
        fetchStaff()
        fetchServeType()
    }, [])



    const LISTBOX_PADDING = 8;

    function renderRow(props) {
        const { data, index, style } = props;
        const option = data[index];

        return (
            <li {...option.props} style={style}>
                {option.label}
            </li>
        );
    }

    const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
        const { children, ...other } = props;

        const itemData = React.Children.toArray(children);

        return (
            <div ref={ref} {...other}>
                <FixedSizeList
                    height={400}
                    width="100%"
                    itemSize={36}
                    itemCount={itemData.length}
                    itemData={itemData}
                    overscanCount={5}
                >
                    {({ index, style, data }) => (
                        <div style={style}>
                            {data[index]}
                        </div>
                    )}
                </FixedSizeList>
            </div>
        );
    });

    // Highlight Text
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function highlightText(text = "", query = "") {

        if (!query) return text;

        const safeQuery = escapeRegExp(query);

        const regex = new RegExp(`(${safeQuery})`, "gi");

        const parts = text.split(regex);

        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <span
                    key={i}
                    style={{
                        backgroundColor: "var(--focus-bg-color)",
                        fontWeight: 600
                    }}
                >
                    {part}
                </span>
            ) : (
                part
            )
        );
    }
    // Format Date Time
    const formatDateTime = (dateStr) => {
        if (!dateStr) return "";

        const date = new Date(dateStr);

        const day = String(date.getDate()).padStart(2, "0");

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const month = months[date.getMonth()];
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");

        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;

        return `${day}-${month}-${year} ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
    };



    // FETCH TABLE DATA
    const fetchTableData = async () => {

        setLoading(true);

        try {

            const serviceEngineer =
                selectedStaff === "All"
                    ? 0
                    : selectedStaff;

            const serviceType =
                selectedServeType === "All"
                    ? 0
                    : selectedServeType;

            const customerId =
                CustomerId || 0;

            const response = await axiosInstance.get(
                `ServiceViewAPI/view`,
                {
                    params: {
                        ServEngr: serviceEngineer,
                        ServType: serviceType,
                        CustomerId: customerId,
                        Status: status,
                        IsAllPending: allPending,
                        ispayable: payableService,
                        FromDate: frmDate,
                        ToDate: todate
                    }
                }
            );

            console.log("Table Data :", response.data);

            if (response.data && response.data.data) {
                setGetData(response.data.data)
            }

        } catch (error) {

            console.log("Error while fetching data", error);


        } finally {
            setLoading(false);
        }
    };



    // STATUS COUNTS
    const completedCount = getData.filter(
        item => item?.Tkt_IsCompleted === true
    ).length;

    const doingCount = getData.filter(
        item => item?.Tkt_Status === "Doing"
    ).length;

    const pausedCount = getData.filter(
        item =>
            item?.Tkt_Status === "Paused" &&
            item?.Tkt_IsCompleted !== true
    ).length;

    const workNotTakenCount = getData.filter(
        item => item?.Tkt_Status == null
    ).length;



    const handleReset = () => {
        setFromDate(new Date().toISOString().split('T')[0]);
        setToDate(new Date().toISOString().split('T')[0]);
        setCustomer(null);
        setCustomerId(0);
        setCustomerInput("");
        setSelectedStaff(empId);
        setSelectedServeType("All");
        setStatus("All");
        setAllPending(false);
        setPayableService('All');
        setGetData([]);
    };

    const filteredCustomers =
        Customer
            ? [Customer]
            : CustomerValues.filter(option =>
                option?.AhMst_pName
                    ?.toLowerCase()
                    .includes(customerInput.toLowerCase())
            );


    // Print function
    const handlePrint = async () => {
        let requestData = {

            ServEngr: selectedStaff === "All"
                ? 0
                : selectedStaff,
            ServType: selectedServeType === "All"
                ? 0
                : selectedServeType,
            Status: status,
            IsAllPending: allPending,
            IsPayable: payableService,
            CustomerId: CustomerId || 0,
            FromDate: frmDate,
            ToDate: todate
        }
        console.log("requestData", requestData)
        try {

            const url = `report/printservices`;

            const printResponseDate = await axiosInstance.post(url, requestData);

            console.log("print response", printResponseDate);

            if (printResponseDate.data) {

                const data = printResponseDate.data;
                const base64PDF = data.pdf;

                const byteCharacters = atob(base64PDF);

                const byteNumbers = new Array(byteCharacters.length)
                    .fill(0)
                    .map((_, i) => byteCharacters.charCodeAt(i));

                const byteArray = new Uint8Array(byteNumbers);

                const blob = new Blob(
                    [byteArray],
                    { type: 'application/pdf' }
                );

                const blobUrl = URL.createObjectURL(blob);

                const newWindow = window.open(
                    '',
                    'newWindow',
                    'width=1000,height=1000'
                );

                if (newWindow) {

                    newWindow.document.write(`
                    <html>
                        <head>
                            <title>Service View PDF</title>
                        </head>

                        <body style="margin:0">
                            <embed
                                src="${blobUrl}"
                                type="application/pdf"
                                width="100%"
                                height="100%"
                            />
                        </body>
                    </html>
                `);

                    newWindow.document.close();

                }
            }

        } catch (error) {

            console.error('API Error:', error);

            const errorMessage =
                error.response?.data?.message ||
                'An error occurred while processing the request.';

            toast.error(errorMessage);
        }
    };



    const CompletePayServ = async (row) => {
        try {
            const requestData = {
                ticketno: row?.TicketNo,
                IsPayableServComplt: true,
                logReason: "Completed Payment",
                logDesc: `Completed payment for ticket ${row?.TicketNo}`,
                logForm: "Service View",
                logUser: name,
                logUserId: empId
            };

            const response = await axiosInstance.post(
                "/IsPayableServAPI/SaveIspayableComplt",
                requestData
            );

            console.log("Payment completed", response.data);

            if (response.data.status === true) {
                toast.success("Service Completed Successfully")
            }
            else {
                toast.error("Somethimg went wrong")
            }

            // Refresh table after success
            fetchTableData();

        } catch (error) {
            console.log("Error while completing payable service", error);
        }
    };


    const handleCloseCompleteDialog = () => {
        setOpenCompleteDialog(false);
        setSelectedRow(null);
    };

    const handleConfirmComplete = async () => {
        await CompletePayServ(selectedRow);
        handleCloseCompleteDialog();
    };


    // save new ticket and add to worklist(for Accounts only)
    const handleCreateTicketAndAddToWorkList = async (row) => {
        try {

            const payload = {
                ActionFlag: 1,
                TktKey: "",
                TicketNo: ticketNo || '',
                CustomerName: row?.Tkt_CustName || "",
                CustomerId: row?.CustomerId || 0,
                WorkThroughId: 0,
                ContactedPerson: "",
                ContactedNo: "",
                DepartmentId: 0,
                CreatedBy: name,
                CreatedById: empId,
                ServiceTypeId: row?.ServTypeId || 0,
                Description: `Ticket generated from - ${row?.TicketNo}` || "",
                TagInput: [],
                WorkThrough: "",
                TicketPriority: row?.Tkt_Priorities || "High",
                IsPayableServ: false,
                IsPayableServNote: "",

                Items: [
                    {
                        TktItm_Key: "",
                        TktItm_PrdtId: 0,
                        TktItm_WrkTitle: `Payment Collection - ${row?.TicketNo}`,
                        TktItm_WrkDetails: `Payment Collection` || "",
                        TktItm_Priority: row?.Tkt_Priorities || "High",
                        Progress: 1,
                        TktItm_CurrentlyWorking: false,

                        LatestStatus: {
                            Status: "",
                            UsrInfo: ""
                        }
                    }
                ],

                logUser: name,
                logDesc: `Created Ticket From Service Ticket ${row?.TicketNo}`,
                logReason: "Create Ticket",
                logForm: "Service View",
                logUserId: empId
            };


            console.log("payload ", payload)

            const saveResponse = await axiosInstance.post(
                "/TicketAPI/CreateTicket",
                //   "/TicketrererAPI/CreateTicket",
                payload
            );

            if (!saveResponse?.data?.status) {
                toast.error("Ticket creation failed");
                return;
            }

            console.log("Create Ticket Response", saveResponse.data);

            const generatedTktKey =
                saveResponse?.data?.Ticket_key

            if (!generatedTktKey) {
                toast.error("Generated Ticket Key not found");
                return;
            }

            const worklistPayload = {
                TktKey: generatedTktKey,
                Emp_Id: empId,
                logReason: "Work Taken",
                logDesc: `Work Taken By ${name}`,
                logForm: "Service View",
                logUser: name,
                logUserId: empId
            };

            const worklistResponse = await axiosInstance.post(
                "/WorkListAPI/UpdateWorklistTicket",
                worklistPayload
            );

            if (worklistResponse?.data?.status) {
                toast.success("Ticket created and added to WorkList");
                fetchTableData();
            } else {
                toast.error("Failed to add to WorkList");
            }

        } catch (error) {
            console.log(error);
            toast.error("Error while processing");
        }
    };

    const handleCloseCreateTicketDialog = () => {
        setOpenCreateTicketDialog(false);
        setSelectedCreatedRow(null);
    };

    const handleConfirmCreateTicket = async () => {
        await handleCreateTicketAndAddToWorkList(selectedCreateRow);
        handleCloseCreateTicketDialog();
    };

    console.log("selectedRow",selectedRow)

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
                Service View
            </Typography>

            <Card>
                <CardContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={6} lg={3.4} xl={3}>


                            <Autocomplete
                                size="small"
                                fullWidth

                                options={filteredCustomers}

                                value={Customer}

                                inputValue={customerInput}

                                onInputChange={(event, newInputValue) => {

                                    setCustomerInput(newInputValue);

                                    // clear selected item when typing
                                    if (
                                        Customer &&
                                        newInputValue !== Customer?.AhMst_pName
                                    ) {
                                        setCustomer(null);
                                        setCustomerId(0);
                                    }
                                }}

                                onChange={(event, newValue) => {

                                    setCustomer(newValue);

                                    setCustomerId(newValue?.AhMst_Key || 0);

                                    setCustomerInput(
                                        newValue?.AhMst_pName || ""
                                    );
                                }}

                                getOptionLabel={(option) =>
                                    option?.AhMst_pName || ""
                                }

                                isOptionEqualToValue={(option, value) =>
                                    option?.AhMst_Key === value?.AhMst_Key
                                }
                                renderOption={(props, option, { inputValue }) => (
                                    <li {...props}>
                                        {highlightText(
                                            option?.AhMst_pName,
                                            inputValue
                                        )}
                                    </li>
                                )}


                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Customer"
                                        size="small"
                                        fullWidth
                                        sx={{
                                            fontSize: '1rem', height: 40, '& input': {
                                                padding: '8px',
                                                fontSize: '0.95rem',
                                                '&:focus':
                                                {
                                                    backgroundColor:
                                                        'var(--focus-bg-color)',
                                                }
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Grid>


                        <Grid item xs={12} sm={3} md={3} lg={1.8} xl={2}>

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

                        <Grid item xs={12} sm={3} md={3} lg={1.8} xl={2}>

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

                        <Grid item xs={12} sm={2} lg={1.8}>

                            <TextField
                                select
                                label="Serv.Engineer"
                                size="small"
                                fullWidth
                                value={selectedStaff}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedStaff(value === "All" ? "All" : Number(value));
                                }}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        backgroundColor: 'var(--focus-bg-color)',
                                    },
                                }}>

                                <MenuItem value="All">-- All --</MenuItem>

                                {allStaff.map(staff => (
                                    <MenuItem key={staff.ahmst_key} value={staff.ahmst_key}>
                                        {staff.ahmst_pname}
                                    </MenuItem>
                                ))}

                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={2} lg={1.5}>

                            <TextField
                                select
                                label="Status"
                                size="small"
                                fullWidth
                                value={status}
                                onChange={(e) => { setStatus(e.target.value) }}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        backgroundColor: 'var(--focus-bg-color)',
                                    },
                                }}
                            >
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                                <MenuItem value="Not Completed">Not Completed</MenuItem>


                            </TextField>


                        </Grid>


                        <Grid item xs={12} sm={2} lg={1.6}>

                            <TextField
                                select
                                label="Service Type"
                                size="small"
                                fullWidth
                                value={selectedServeType}
                                onChange={(e) => setSelectedServeType(e.target.value)}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        backgroundColor: 'var(--focus-bg-color)',
                                    },
                                }}
                            >
                                <MenuItem value="All">--All--</MenuItem>
                                {allServeType
                                    ?.filter(item => item?.desc?.trim()) // remove empty names
                                    .map((item) => (
                                        <MenuItem key={item.mstr_key} value={item.mstr_key}>
                                            {item.desc.trim()}
                                        </MenuItem>
                                    ))
                                }

                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={3} md={2} lg={1.4} xl={1.4}>

                            <FormControlLabel
                                sx={{
                                    marginLeft: { xs: '0px', sm: "0px", lg: "0px" },
                                }}
                                control={<Checkbox
                                    name='allpending'
                                    checked={allPending}
                                    onChange={(e) => setAllPending(e.target.checked)}
                                    sx={{
                                        color: 'grey',
                                        '&.Mui-checked': {
                                            color: '#DC3545!important',   // 🔥 force override
                                        },
                                    }}
                                />}
                                label="All Pending"
                            />
                        </Grid>

                        <Grid item xs={12} sm={3} md={3} lg={2} xl={2}>
                            {/* 
                            <FormControlLabel
                                sx={{
                                    marginLeft: { xs: '0px', sm: "0px", lg: "0px" },
                                }}
                                control={<Checkbox
                                    checked={payableService}
                                    onChange={(e) => setPayableService(e.target.checked)}
                                    name='payableservice'
                                    sx={{
                                        color: 'grey',
                                        '&.Mui-checked': {
                                            color: '#DC3545!important',
                                        },
                                    }}
                                />}
                                label="Payable Service"
                            /> */}


                            <TextField
                                select
                                label="Payable Service"
                                size="small"
                                fullWidth
                                value={payableService}
                                onChange={(e) => setPayableService(e.target.value)}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        backgroundColor: 'var(--focus-bg-color)',
                                    },
                                }}
                            >
                                <MenuItem value="All">--All--</MenuItem>
                                <MenuItem value="Paid">Paid</MenuItem>
                                <MenuItem value="NotPaid">Payable</MenuItem>
                            </TextField>
                        </Grid>

                        {/* COMPLETED */}
                        <Grid item xs={6} sm={3} md={3} lg={1.3}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 1.5,
                                    py: 0.8,
                                    borderRadius: '10px',
                                    backgroundColor: '#eaf7ee',
                                    border: '1px solid #28a745',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 14,
                                        height: 14,
                                        borderRadius: '4px',
                                        backgroundColor: '#28a745',
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: '0.82rem',
                                        fontWeight: 600,
                                        color: '#333',
                                        flex: 1
                                    }}
                                >
                                    Completed
                                </Typography>

                                <Box
                                    sx={{
                                        minWidth: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        backgroundColor: '#28a745',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                    }}
                                >
                                    {completedCount}
                                </Box>
                            </Box>
                        </Grid>

                        {/* DOING */}
                        <Grid item xs={6} sm={3} md={3} lg={1.3}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 1.5,
                                    py: 0.8,
                                    borderRadius: '10px',
                                    backgroundColor: '#ffeafa',
                                    border: '1px solid #ec407a',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 14,
                                        height: 14,
                                        borderRadius: '4px',
                                        backgroundColor: '#ec407a',
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: '0.82rem',
                                        fontWeight: 600,
                                        color: '#333',
                                        flex: 1
                                    }}
                                >
                                    Doing
                                </Typography>

                                <Box
                                    sx={{
                                        minWidth: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        backgroundColor: '#ec407a',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                    }}
                                >
                                    {doingCount}
                                </Box>
                            </Box>
                        </Grid>

                        {/* WORK NOT TAKEN */}
                        <Grid item xs={6} sm={3} md={3} lg={1.9}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 1.5,
                                    py: 0.8,
                                    borderRadius: '10px',
                                    backgroundColor: '#fff8e1',
                                    border: '1px solid #ffd54f',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 14,
                                        height: 14,
                                        borderRadius: '4px',
                                        backgroundColor: '#ffc107',
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: '0.82rem',
                                        fontWeight: 600,
                                        color: '#333',
                                        flex: 1
                                    }}
                                >
                                    Work Not Taken
                                </Typography>

                                <Box
                                    sx={{
                                        minWidth: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        backgroundColor: '#ffc107',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                    }}
                                >
                                    {workNotTakenCount}
                                </Box>
                            </Box>
                        </Grid>

                        {/* PAUSED */}
                        <Grid item xs={6} sm={3} md={3} lg={1.3}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 1.5,
                                    py: 0.8,
                                    borderRadius: '10px',
                                    backgroundColor: '#fdeaea',
                                    border: '1px solid #fd7070',
                                    boxShadow: '0 2px 5px rgba(231, 196, 196, 0.08)',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 14,
                                        height: 14,
                                        borderRadius: '4px',
                                        backgroundColor: '#fd7070',
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: '0.82rem',
                                        fontWeight: 600,
                                        color: '#DC3545',
                                        flex: 1
                                    }}
                                >
                                    Paused
                                </Typography>

                                <Box
                                    sx={{
                                        minWidth: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        backgroundColor: '#fd7070',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                    }}
                                >
                                    {pausedCount}
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={4} md={4} lg={.9}>
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
                                onClick={handleReset}
                            >
                                New
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={4} md={4} lg={.9}>
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
                                onClick={fetchTableData}
                            >
                                Show
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={4} md={4} lg={.9}>
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

                        <Grid item xs={12} sx={{ marginBottom: { xs: '40px', sm: '30px', md: '30px' } }}>
                            <TableContainer
                                component={Paper}
                                sx={{
                                    height: {
                                        xs: 'calc(100vh - 150px)',
                                        sm: 'calc(100vh - 220px)',
                                        md: 'calc(100vh - 210px)',
                                        lg: 'calc(100vh - 180px)',
                                        xl: 'calc(100vh - 178px)'
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
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '2%', fontWeight: 'bold' }}>SlNo</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Ticket#</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '6%', fontWeight: 'bold' }}>DateTime</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '6%', fontWeight: 'bold' }}>Customer</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '7%', fontWeight: 'bold' }}>Description</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Priority</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Status</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '6%', fontWeight: 'bold' }}>Completed Date</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>StartedBy</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>CompletedBy</TableCell>
                                            {dept?.toLowerCase() === "accounts" &&
                                                (
                                                    <>
                                                        <TableCell
                                                            sx={{
                                                                fontSize: "0.85rem",
                                                                padding: "4px 8px",
                                                                width: "2%",
                                                                fontWeight: "bold"
                                                            }}
                                                        />
                                                        <TableCell
                                                            sx={{
                                                                fontSize: "0.85rem",
                                                                padding: "4px 8px",
                                                                width: "2.5%",
                                                                fontWeight: "bold"
                                                            }}
                                                        />
                                                    </>
                                                )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>

                                        {loading ? (

                                            <TableRow>
                                                <TableCell colSpan={10} align="center">
                                                    <CircularProgress
                                                        size={25}
                                                        sx={{ color: "#DC3545" }}
                                                    />
                                                </TableCell>
                                            </TableRow>

                                        ) : getData && getData.length > 0 ? (

                                            getData.map((row, index) => {

                                                // ROW COLOR BASED ON STATUS
                                                const rowBgColor =
                                                    row?.Tkt_IsCompleted === true
                                                        ? "#8fd19e"
                                                        : row?.Tkt_Status === "Doing"
                                                            ? "#f8b9ce"
                                                            : row?.Tkt_Status === "Paused"
                                                                ? "#fd7070"
                                                                : row?.Tkt_Status === null
                                                                    ? "#f3d066"
                                                                    : "#fff";
                                                return (
                                                    <TableRow
                                                        key={index}
                                                        sx={{
                                                            backgroundColor: rowBgColor,

                                                            '&:hover': {
                                                                filter: 'brightness(0.97)',
                                                            }
                                                        }}>
                                                        <TableCell>
                                                            {index + 1}
                                                        </TableCell>

                                                        <TableCell
                                                            sx={{
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }}
                                                        >
                                                            <Tooltip title={row.TicketNo} arrow>
                                                                <span>{row.TicketNo}</span>
                                                            </Tooltip>
                                                        </TableCell>

                                                        <TableCell
                                                            sx={{
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }}
                                                        >
                                                            <Tooltip
                                                                title={formatDateTime(row.Tkt_DateTime)}
                                                                arrow
                                                            >
                                                                <span>
                                                                    {formatDateTime(row.Tkt_DateTime)}
                                                                </span>
                                                            </Tooltip>
                                                        </TableCell>

                                                        <TableCell
                                                            sx={{
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }}
                                                        >
                                                            <Tooltip title={row.Tkt_CustName} arrow>
                                                                <span>{row.Tkt_CustName}</span>
                                                            </Tooltip>
                                                        </TableCell>

                                                        <TableCell
                                                            sx={{
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }}
                                                        >
                                                            <Tooltip title={row.Tkt_Description} arrow>
                                                                <span>{row.Tkt_Description}</span>
                                                            </Tooltip>
                                                        </TableCell>

                                                        <TableCell>
                                                            {row?.Tkt_Priorities || ""}
                                                        </TableCell>

                                                        <TableCell>
                                                            {row?.Tkt_Status || ""}
                                                        </TableCell>

                                                        <TableCell
                                                            sx={{
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }}
                                                        >
                                                            {row?.Tkt_CompletedDate
                                                                ? formatDateTime(row?.Tkt_CompletedDate)
                                                                : ""}
                                                        </TableCell>

                                                        <TableCell>
                                                            {row?.StartedBy || ""}
                                                        </TableCell>

                                                        <TableCell>
                                                            {row?.CompletedBy || ""}
                                                        </TableCell>

                                                        {dept?.toLowerCase() === "accounts" &&
                                                            <>
                                                                <TableCell>
                                                                    {dept?.toLowerCase() === "accounts" &&
                                                                        row?.Tkt_IsCompleted === true &&
                                                                        row?.Tkt_IsPayableCompleted !== true &&
                                                                        row?.Tkt_IsPaybleServ === true &&
                                                                        (
                                                                            <Button
                                                                                variant="contained"
                                                                                sx={{
                                                                                    minWidth: 0,
                                                                                    width: "38px",
                                                                                    height: "34px",
                                                                                    padding: "2px",
                                                                                    marginRight: 1,
                                                                                    border: "1px solid #DC3545",
                                                                                    color: "#DC3545",
                                                                                    backgroundColor: "transparent",
                                                                                    "&:hover": {
                                                                                        backgroundColor: "#DC3545",
                                                                                        color: "#fff",
                                                                                        border: "1px solid #DC3545",
                                                                                    },
                                                                                }}
                                                                                onClick={() => {
                                                                                    setSelectedCreatedRow(row);
                                                                                    setOpenCreateTicketDialog(true);
                                                                                }}                                                                            >
                                                                                <AddIcon sx={{ fontSize: 19 }} />
                                                                            </Button>
                                                                        )}
                                                                </TableCell>

                                                                <TableCell>
                                                                    {dept?.toLowerCase() === "accounts" &&
                                                                        row?.Tkt_IsCompleted === true &&
                                                                        row?.Tkt_IsPayableCompleted !== true &&
                                                                        row?.Tkt_IsPaybleServ === true && (
                                                                            <Button
                                                                                onClick={() => {
                                                                                    if (row?.Tkt_IsCompleted === true) {
                                                                                        setDialogMessage("The Work is not Completed");
                                                                                        setOpenDialog(true)
                                                                                        return;
                                                                                    }

                                                                                    setSelectedRow(row);
                                                                                    setOpenCompleteDialog(true);
                                                                                }}
                                                                                variant="contained"
                                                                                sx={{
                                                                                    minWidth: 0,
                                                                                    width: "38px",
                                                                                    height: "34px",
                                                                                    padding: "2px",
                                                                                    marginRight: 1,
                                                                                    border: "1px solid #DC3545",
                                                                                    color: "#DC3545",
                                                                                    backgroundColor: "transparent",
                                                                                    "&:hover": {
                                                                                        backgroundColor: "#DC3545",
                                                                                        color: "#fff",
                                                                                        border: "1px solid #DC3545",
                                                                                    },
                                                                                }}
                                                                            >
                                                                                <ThumbUpIcon sx={{ fontSize: 19 }} />
                                                                            </Button>
                                                                        )}
                                                                </TableCell>
                                                            </>
                                                        }

                                                    </TableRow>
                                                );
                                            })

                                        ) : (

                                            <TableRow>
                                                <TableCell
                                                    colSpan={dept?.toLowerCase() === "accounts" ? 12 : 10}
                                                    align="center"
                                                >
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


            {/* ------------------------------------------------------------------- */}

            <Dialog
                open={openCompleteDialog}
                onClose={handleCloseCompleteDialog}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        px: 1,
                        py: 1,
                    },
                }}
            >
                <DialogContent>
                    Are you sure you want to complete this service?
                </DialogContent>

                <DialogActions sx={{ mt: -1 }}>
                    <Button
                        onClick={handleCloseCompleteDialog}
                        sx={{ textTransform: "none" }}
                    >
                        No
                    </Button>

                    <Button
                        onClick={handleConfirmComplete}
                        color="error"
                        variant="contained"
                        sx={{ textTransform: "none" }}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ------------------------------------------------------------------- */}

            <Dialog open={openDialog}
                onClose={handleClose}

                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        px: 1,
                        py: 1,
                        // minWidth: 300
                    }
                }}>
                <DialogContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* //   <WarningAmberIcon sx={{ color: '#f59e0b', fontSize: 22 }} /> */}
                        <Typography variant="body1" sx={{ fontWeight: 500 }}
                        >                {dialogMessage}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 1, pb: 1 }}>
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        size="small"
                        sx={{
                            textTransform: 'none',
                            backgroundColor: '#DC3545',
                            borderRadius: 1.5,
                            px: 2,
                            '&:hover': { backgroundColor: '#DC3545' }
                        }}
                    >            OK
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ------------------------------------------------------------------- */}
            <Dialog
                open={openCreateTicketDialog}
                onClose={handleCloseCreateTicketDialog}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        px: 1,
                        py: 1,
                    },
                }}
            >
                <DialogContent>
                    Are you sure you want to create a New ticket for this service ?
                </DialogContent>

                <DialogActions sx={{ mt: -1 }}>
                    <Button
                        onClick={handleCloseCreateTicketDialog}
                        sx={{ textTransform: "none" }}
                    >
                        No
                    </Button>

                    <Button
                        onClick={handleConfirmCreateTicket}
                        color="error"
                        variant="contained"
                        sx={{ textTransform: "none" }}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer autoClose={1000} hideProgressBar={true} position='top-center' theme='colored' transition={Bounce} />


        </div>
    )
}

export default ServiceView
