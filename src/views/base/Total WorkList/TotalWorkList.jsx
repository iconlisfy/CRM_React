import React, { useEffect, useState } from 'react'
import { Card, Paper, CardContent, Checkbox, FormControlLabel, Grid, Radio, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, TableBody, Button, Box, InputAdornment, IconButton, MenuItem, Autocomplete, Chip, Tooltip } from '@mui/material'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { FixedSizeList } from 'react-window';
import axiosInstance from '../../../axios';
import getReduxState from '../../../ReduxState';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NewTicket from '../Ticket List/NewTicket';
import { useNavigate } from 'react-router-dom';
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

function TotalWorkList() {

    const { role, deptid, name, empId, BrnchKey } = getReduxState()

    const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]); // from date
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);// to date

    // Date
    const frmDate = fromDate ? format(fromDate, 'yyyy-MM-dd') : null
    const todate = toDate ? format(toDate, 'yyyy-MM-dd') : null

    const [CustomerValues, setCustomerValues] = useState([])
    const [Customer, setCustomer] = useState(null)
    const [CustomerId, setCustomerId] = useState('')
    const [customerInput, setCustomerInput] = useState("");

    const [getData, setGetData] = useState([])
    const [isCompleted, setIsCompleted] = useState(false)

    const isAdmin = role === "Administrator";

    const [openTicketModal, setOpenTicketModal] = useState(false);
    const [allDept, setAllDept] = useState([]);
    const [listDept, setListDept] = useState(
        isAdmin ? "All" : deptid
    );


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
                    outerElementType={React.forwardRef((props, ref) => (
                        <div ref={ref} {...props} />
                    ))}
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


    useEffect(() => {
        fetchAllDetails()
        fetchDepartment()
    }, [])

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
                    style={{ backgroundColor: "var(--focus-bg-color)", fontWeight: 600 }}
                >
                    {part}
                </span>
            ) : (
                part
            )
        );
    }


    const fetchData = async (custId = CustomerId) => {

        try {

            const fetchResponse = await axiosInstance.get(
                `/TotalWorklistAPI/TotalWorks?CustomerId=${Number(custId) || 0}&BrnchId=${BrnchKey}&IsCompleted=${isCompleted}&FromDate=${frmDate}&ToDate=${todate}&DeptId=${listDept === "All" ? 0 : listDept}&UsrGrp=${role}&EmpId=${empId}`
       

            );

            if (fetchResponse.data && fetchResponse.data.data) {
                setGetData(fetchResponse.data.data);
            }

        } catch (error) {
            console.log("Error while fetching data", error);
        }
    };

    useEffect(() => {
        fetchData()
    }, [])


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

    const navigate = useNavigate()
    const handleOpenTicket = (row) => {
        navigate("/TicketLists", {
            state: {
                openTotalWrkList: true,
                ticketData: row,
                fromTotalWrkList: true
            }
        });
    };

    const filteredCustomers =
        Customer
            ? [Customer]
            : CustomerValues.filter(option =>
                option?.AhMst_pName
                    ?.toLowerCase()
                    .includes(customerInput.toLowerCase())
            );

    return (
        <>
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
                Total WorkList
            </Typography>

            <Card sx={{ marginTop: "1px" }}>
                <CardContent>
                    <Grid container spacing={1}>

                        <Grid item xs={12} sm={3} md={3} lg={2}>



                            <Autocomplete
                                size="small"
                                fullWidth

                                options={filteredCustomers}

                                value={Customer}

                                inputValue={customerInput}

                                onInputChange={(event, newInputValue) => {

                                    setCustomerInput(newInputValue);

                                    // clear selection while typing
                                    if (
                                        Customer &&
                                        newInputValue !== Customer?.AhMst_pName
                                    ) {

                                        setCustomer(null);
                                        setCustomerId(0);

                                        // clear table immediately
                                        setGetData([]);
                                    }
                                }}

                                onChange={(event, newValue) => {

                                    // clear old table data
                                    setGetData([]);

                                    setCustomer(newValue);

                                    const selectedId =
                                        newValue?.AhMst_Key || 0;

                                    setCustomerId(selectedId);

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

                        <Grid item xs={12} sm={3} md={3} lg={1.7} xl={1.7}>
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

                        <Grid item xs={12} sm={3} md={3} lg={1.7} xl={1.7}>

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
                        <Grid item xs={12} sm={3} md={3} lg={1.7} xl={1.7}>

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


                        <Grid item xs={12} sm={5} md={4} lg={2.5} xl={2}>

                            <FormControlLabel
                                sx={{
                                    marginLeft: { xs: '0px', sm: "0px", lg: "0px" },
                                }}
                                control={<Checkbox
                                    value={isCompleted}
                                    onChange={(e) => { setIsCompleted(e.target.checked) }}
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


                        <Grid item xs={12} sm={4} md={4} lg={1.7} sx={{ mt: { sm: "8px" } }}>

                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: '#555',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                }}
                            >
                                Count:
                                <Box
                                    component="span"
                                    sx={{
                                        fontWeight: 700,
                                        color: '#DC3545',
                                        backgroundColor: 'rgba(179, 26, 26, 0.1)',
                                        px: 1,
                                        py: 0.2,
                                        borderRadius: '6px',
                                        minWidth: '28px',
                                        textAlign: 'center'
                                    }}
                                >
                                    {getData.length}
                                </Box>
                            </Typography>
                        </Grid>


                        <Grid item xs={12} sm={3} md={4} lg={.7} style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                                onClick={() => fetchData(CustomerId)}
                            >
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
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}>SlNo</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>Ticket#</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '8%', fontWeight: 'bold' }}>DateTime</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>Customer</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Priority</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '7%', fontWeight: 'bold' }}>Description</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Status</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Tat</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>CreatedBy</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>WorkTakenBy</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}></TableCell>

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
                                                }} >
                                                    <TableCell>{index + 1}</TableCell>
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
                                                        </span></TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.Date_Time} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.Date_Time}</span>
                                                        </Tooltip></TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.Tkt_CustName} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}> {row.Tkt_CustName}</span>
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
                                                            <span style={{ textAlign: 'center' }}> {row.Tkt_Description}</span>
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
                                                        <Tooltip title={row.StartedBy} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.StartedBy}</span>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.WorkTakenBy} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.WorkTakenBy}</span>
                                                        </Tooltip></TableCell>

                                                    <TableCell >
                                                        <VisibilityIcon
                                                            onClick={() => handlePrint(row.Tkt_No)} />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={11} sx={{ textAlign: 'center' }}>No Data Available</TableCell>
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
            />
        </>
    )
}

export default TotalWorkList
