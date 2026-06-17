import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogTitle, TextField, DialogContent, Grid, InputAdornment, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import getReduxState from '../../../ReduxState';
import loadinggif from '../../../assets/images/load.gif'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssessmentIcon from "@mui/icons-material/Assessment";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import EngineeringIcon from "@mui/icons-material/Engineering";
import DescriptionIcon from "@mui/icons-material/Description";
import HistoryIcon from "@mui/icons-material/History";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CustomerListPrdWise from './CustomerListPrdWise';
import LoginIcon from '@mui/icons-material/Login';

function AllReports() {

    const navigate = useNavigate()

    const { role, deptid, name, empId, BrnchKey, dept } = getReduxState()

    const [openPrintDialog, setOpenPrintDialog] = useState(false);
    const [openPrintCustAlphaDialog, setOpenPrintCustAlphaDialog] = useState(false);

    const [openPrintAmcRptDialog, setOpenPrintAmcRptDialog] = useState(false);
    const [openAmcConfirmDialog, setOpenAmcConfirmDialog] = useState(false);

    const [openPrintLogRptDialog, setOpenPrintLogRptDialog] = useState(false);
    const [openLogConfirmDialog, setOpenLogConfirmDialog] = useState(false);

    const [openPrintUserLoginRptDialog, setOpenPrintUserLoginRptDialog] = useState(false);
    const [openUserLoginConfirmDialog, setOpenUserLoginConfirmDialog] = useState(false);

    const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]); // from date
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);// to date

    // Date
    const frmDate = fromDate ? format(fromDate, 'yyyy-MM-dd') : null
    const todate = toDate ? format(toDate, 'yyyy-MM-dd') : null


    const [visible, setVisible] = useState(false)
    const [allProducts, setAllProducts] = useState([]);

    const [fromLogDate, setFromLogDate] = useState(new Date().toISOString().split('T')[0]); // from date
    const [toLogDate, setToLogDate] = useState(new Date().toISOString().split('T')[0]);// to date

    // Date
    const frmLogDate = fromDate ? format(fromLogDate, 'yyyy-MM-dd') : null
    const toLogdate = toDate ? format(toLogDate, 'yyyy-MM-dd') : null

    const [isLoading, setIsLoading] = useState(false);
    const [selectAllChecked, setSelectAllChecked] = useState(false); // State for "Select All" checkbox
    const [checkedItems, setCheckedItems] = useState([]); // State to hold the selected items


    const [fromUserLoginDate, setFromUserLoginDate] = useState(new Date().toISOString().split('T')[0]); // from date
    const [toUserLoginDate, setToUserLoginDate] = useState(new Date().toISOString().split('T')[0]);// to date

    // Date
    const frmUserLoginDate = fromDate ? format(fromUserLoginDate, 'yyyy-MM-dd') : null
    const toUserLoginate = toDate ? format(toUserLoginDate, 'yyyy-MM-dd') : null

    const handleSelectAllChange = (event) => {
        const checked = event.target.checked;

        setSelectAllChecked(checked);

        if (checked) {
            setCheckedItems(allProducts.map(item => item.mstr_key));
        } else {
            setCheckedItems([]);
        }
    };

    const handleCheckboxChange = (event, item) => {
        const checked = event.target.checked;

        setCheckedItems(prev => {
            let updatedItems;

            if (checked) {
                updatedItems = [...prev, item.mstr_key];
            } else {
                updatedItems = prev.filter(id => id !== item.mstr_key);

                // Uncheck Select All when any item is unchecked
                setSelectAllChecked(false);
            }

            // Check Select All when all items are selected
            if (updatedItems.length === allProducts.length) {
                setSelectAllChecked(true);
            }

            return updatedItems;
        });
    };

    // CustomersList Product Wise Print Function
    const handleCustListPrdWisrPrint = async () => {

        const checkedItem = checkedItems

        try {

            setIsLoading(true);

            const url = `/CustListPrdWise/Print`
            const printResponseDate = await axiosInstance.post(url, checkedItem);

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
        } finally {
            setIsLoading(false);
        }
    };


    // Fetch Products
    const fetchProducts = async () => {
        try {

            const fetchResponse = await axiosInstance.get(`/ProductsAPI/GetAll`);

            if (fetchResponse.data?.products) {

                // FILTER ONLY PRODUCT TYPE
                const filteredProducts = fetchResponse.data.products.filter(
                    (item) => item?.mstr_type === "Product"
                );
                setAllProducts(filteredProducts);
            }

        } catch (error) {
            console.log("error while fetching all data", error);
        }
    };

    useEffect(() => {
        fetchProducts()
    }, [])

    // Print Cust List function
    const handleCustListPrint = async () => {

        try {

            const url = `/RprtCustListAPI`
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

    const handleOpenPrintDialog = () => {
        setOpenPrintDialog(true);
    };

    const handleClosePrintDialog = () => {
        setOpenPrintDialog(false);
    };

    const handleConfirmPrint = async () => {
        setOpenPrintDialog(false);

        // call print function here
        await handleCustListPrint();
    };




    // Print Cust Alpha function
    const handleCustAlphaPrint = async () => {

        try {

            const url = `/AlphaCustListAPI`
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


    const resetAmcDates = () => {
        const today = new Date();
        setFromDate(today);
        setToDate(today);
    };


    const handleOpenPrintCustAlphaDialog = () => {
        setOpenPrintCustAlphaDialog(true);
    };

    const handleClosePrintCustAlphaDialog = () => {
        setOpenPrintCustAlphaDialog(false);
    };

    const handleConfirmCustAlphaPrint = async () => {
        setOpenPrintCustAlphaDialog(false);

        // call print function here
        await handleCustAlphaPrint();
    };

    // Print Amc Rpt function
    const handleAmcRptPrint = async () => {

        try {

            const url = `/amc/print?FromDate=${frmDate}&ToDate=${todate}`
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
            await resetAmcDates()
        } catch (error) {
            console.error('API Error:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred while processing the request.';
            toast.error(errorMessage);
        }
    }

    const handleOpenPrintAmcRptDialog = () => {
        setOpenPrintAmcRptDialog(true);
    };

    const handleClosePrintAmcRptDialog = () => {
        setOpenPrintAmcRptDialog(false);
    };

    const handleConfirmAmcRptPrint = async () => {
        setOpenPrintAmcRptDialog(false);

        // call print function here
        await handleAmcRptPrint();

        resetAmcDates()
    };

    // Print Log Report function
    const handleLogReportsPrint = async () => {

        try {
            setIsLoading(true);
            const url = `/logreport/print?FromDate=${frmLogDate}&ToDate=${toLogdate}`
            const printResponseDate = await axiosInstance.get(url);
            // clg

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
            await resetLogDates()

        } catch (error) {
            console.error('API Error:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred while processing the request.';
            toast.error(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    };

    const resetLogDates = () => {
        const today = new Date();
        setFromLogDate(today);
        setToLogDate(today);
    };


    const handleOpenPrintLogRptDialog = () => {
        setOpenPrintLogRptDialog(true);
    };

    const handleClosePrintLogRptDialog = () => {
        setOpenPrintLogRptDialog(false);
    };

    const handleConfirmLogRptPrint = async () => {
        setOpenPrintLogRptDialog(false);

        // call print function here
        await handleLogReportsPrint();

        resetLogDates()
    };

    const resetUserLogDates = () => {
        const today = new Date();
        setFromUserLoginDate(today);
        setToUserLoginDate(today);
    };



    // Print Log Report function
    const handleuserLoginRpt = async () => {

        try {
            setIsLoading(true);
            const url = `/Login/Print?FromDate=2026-06-16&ToDate=2026-06-16`
            const printResponseDate = await axiosInstance.get(url);
            // clg

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

            await resetUserLogDates()
        } catch (error) {
            console.error('API Error:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred while processing the request.';
            toast.error(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleOpenPrintUserLoginDialog = () => {
        setOpenPrintUserLoginRptDialog(true);
    };

    const handleClosePrintUserLoginDialog = () => {
        setOpenPrintUserLoginRptDialog(false);
    };

    const handleConfirmUserLoginPrint = async () => {
        setOpenPrintUserLoginRptDialog(false);

        await handleuserLoginRpt();
    };


    const reportCardStyle = {
        height: 200,
        borderRadius: "24px",
        background: "linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)",
        border: "1px solid #ffd5db",
        boxShadow: "0 8px 25px rgba(220,53,69,0.12)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "all .3s ease",

        "&::before": {
            content: '""',
            position: "absolute",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(220,53,69,0.08)",
            top: -40,
            right: -40,
        },

        "&:hover": {
            transform: "translateY(-10px)",
            boxShadow: "0 15px 35px rgba(220,53,69,0.25)",
        },
    };

    return (
        <>
            {/* <Card>
                <CardContent>
                    <Grid container spacing={1}>


                        <Grid item xs={12} sm={6} lg={2}>
                            <Box
                                onClick={() => navigate('/overAllReports')}
                                sx={{
                                    borderRadius: '12px',
                                    backgroundColor: "#f8dfdf",
                                    border: "1px solid #ec6767",
                                    height: '200px',
                                    width: '100%',
                                    maxWidth: {
                                        xs: '100%',
                                        sm: '400px',
                                        md: '450px',
                                        lg: '350px'
                                    },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',

                                    transition: 'all 0.3s ease',

                                    '&:hover': {
                                        animation: 'bounce 0.6s ease'
                                    },

                                    '@keyframes bounce': {
                                        '0%, 100%': {
                                            transform: 'translateY(0)',
                                        },
                                        '30%': {
                                            transform: 'translateY(-10px)',
                                        },
                                        '60%': {
                                            transform: 'translateY(4px)',
                                        },
                                    },
                                }}>


                                <Typography
                                    sx={{
                                        color: '#DC3545',
                                        fontWeight: 600,
                                        textAlign: 'center',
                                        fontSize: '30px'
                                    }}
                                >
                                    Work Reports
                                </Typography>


                            </Box>
                        </Grid>

                        {(dept?.toLowerCase() === "accounts" ||
                            role?.toLowerCase() === "hod") && (
                                <Grid item xs={12} sm={6} lg={2}>
                                    <Box
                                        onClick={handleOpenPrintCustAlphaDialog}

                                        sx={{
                                            borderRadius: '12px',
                                            backgroundColor: "#f8dfdf",
                                            border: "1px solid #ec6767",
                                            height: '200px',
                                            width: '100%',
                                            maxWidth: {
                                                xs: '100%',
                                                sm: '400px',
                                                md: '450px',
                                                lg: '350px'
                                            },
                                            display: 'flex',              // ✅ center
                                            alignItems: 'center',        // vertical center
                                            justifyContent: 'center',    // horizontal center
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',

                                            '&:hover': {
                                                animation: 'bounce 0.6s ease'
                                            },

                                            '@keyframes bounce': {
                                                '0%, 100%': {
                                                    transform: 'translateY(0)',
                                                },
                                                '30%': {
                                                    transform: 'translateY(-10px)',
                                                },
                                                '60%': {
                                                    transform: 'translateY(4px)',
                                                },
                                            },


                                        }}>
                                        <Typography
                                            sx={{
                                                color: '#DC3545',
                                                fontWeight: 600,
                                                textAlign: 'center',
                                                fontSize: '30px'
                                            }}>
                                            Customer List Alpha
                                        </Typography>

                                    </Box>
                                </Grid>

                            )}

                        {(dept?.toLowerCase() === "accounts" ||
                            role?.toLowerCase() === "hod") && (
                                <Grid item xs={12} sm={6} lg={2}>
                                    <Box
                                        onClick={handleOpenPrintDialog}
                                        sx={{
                                            borderRadius: '12px',
                                            backgroundColor: "#f8dfdf",
                                            border: "1px solid #ec6767",
                                            height: '200px',
                                            width: '100%',
                                            maxWidth: {
                                                xs: '100%',
                                                sm: '400px',
                                                md: '450px',
                                                lg: '350px'
                                            },
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',

                                            transition: 'all 0.3s ease',

                                            '&:hover': {
                                                animation: 'bounce 0.6s ease'
                                            },

                                            '@keyframes bounce': {
                                                '0%, 100%': {
                                                    transform: 'translateY(0)',
                                                },
                                                '30%': {
                                                    transform: 'translateY(-10px)',
                                                },
                                                '60%': {
                                                    transform: 'translateY(4px)',
                                                },
                                            },

                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: '#DC3545',
                                                fontWeight: 600,
                                                textAlign: 'center',
                                                fontSize: '30px'
                                            }}
                                        >
                                            Customer List
                                        </Typography>

                                    </Box>
                                </Grid>

                            )}



                        <Grid item xs={12} sm={6} lg={2}>
                            <Box
                                onClick={() => navigate('/serviceView')}
                                sx={{
                                    borderRadius: '12px',
                                    backgroundColor: "#f8dfdf",
                                    border: "1px solid #ec6767",
                                    height: '200px',
                                    width: '100%',
                                    maxWidth: {
                                        xs: '100%',
                                        sm: '400px',
                                        md: '450px',
                                        lg: '350px'
                                    },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',

                                    '&:hover': {
                                        animation: 'bounce 0.6s ease'
                                    },

                                    '@keyframes bounce': {
                                        '0%, 100%': {
                                            transform: 'translateY(0)',
                                        },
                                        '30%': {
                                            transform: 'translateY(-10px)',
                                        },
                                        '60%': {
                                            transform: 'translateY(4px)',
                                        },
                                    },
                                }}>
                                <Typography
                                    sx={{
                                        color: '#DC3545',
                                        fontWeight: 600,
                                        textAlign: 'center',
                                        fontSize: '30px'
                                    }}
                                >
                                    Service View
                                </Typography>


                            </Box>
                        </Grid>


                        {(dept?.toLowerCase() === "accounts" ||
                            role?.toLowerCase() === "hod") && (
                                <Grid item xs={12} sm={6} lg={2}>
                                    <Box
                                        onClick={handleOpenPrintAmcRptDialog}

                                        sx={{
                                            borderRadius: '12px',
                                            backgroundColor: "#f8dfdf",
                                            border: "1px solid #ec6767",
                                            height: '200px',
                                            width: '100%',
                                            maxWidth: {
                                                xs: '100%',
                                                sm: '400px',
                                                md: '450px',
                                                lg: '350px'
                                            },
                                            display: 'flex',              // ✅ center
                                            alignItems: 'center',        // vertical center
                                            justifyContent: 'center',    // horizontal center
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',

                                            '&:hover': {
                                                animation: 'bounce 0.6s ease'
                                            },

                                            '@keyframes bounce': {
                                                '0%, 100%': {
                                                    transform: 'translateY(0)',
                                                },
                                                '30%': {
                                                    transform: 'translateY(-10px)',
                                                },
                                                '60%': {
                                                    transform: 'translateY(4px)',
                                                },
                                            },
                                        }}>
                                        <Typography
                                            sx={{
                                                color: '#DC3545',
                                                fontWeight: 600,
                                                textAlign: 'center',
                                                fontSize: '30px'
                                            }}>
                                            AMC Report
                                        </Typography>

                                    </Box>
                                </Grid>
                            )}

                        {(role?.toLowerCase() === "administrator" ||
                            role?.toLowerCase() === "hod") && (
                                <Grid item xs={12} sm={6} lg={2}>
                                    <Box
                                        onClick={handleOpenPrintLogRptDialog}
                                        sx={{
                                            borderRadius: '12px',
                                            backgroundColor: "#f8dfdf",
                                            border: "1px solid #ec6767",
                                            height: '200px',
                                            width: '100%',
                                            maxWidth: {
                                                xs: '100%',
                                                sm: '400px',
                                                md: '450px',
                                                lg: '350px'
                                            },
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',

                                            transition: 'all 0.3s ease',

                                            '&:hover': {
                                                animation: 'bounce 0.6s ease'
                                            },

                                            '@keyframes bounce': {
                                                '0%, 100%': {
                                                    transform: 'translateY(0)',
                                                },
                                                '30%': {
                                                    transform: 'translateY(-10px)',
                                                },
                                                '60%': {
                                                    transform: 'translateY(4px)',
                                                },
                                            },
                                        }}>


                                        <Typography
                                            sx={{
                                                color: '#DC3545',
                                                fontWeight: 600,
                                                textAlign: 'center',
                                                fontSize: '30px'
                                            }}
                                        >
                                            Log Reports
                                        </Typography>


                                    </Box>
                                </Grid>
                            )}


                        {(role?.toLowerCase() === "administrator" ||
                            role?.toLowerCase() === "hod") && (
                                <Grid item xs={12} sm={6} lg={2}>
                                    <Box
                                        onClick={handleOpenPrintLogRptDialog}
                                        sx={{
                                            borderRadius: '12px',
                                            backgroundColor: "#f8dfdf",
                                            border: "1px solid #ec6767",
                                            height: '200px',
                                            width: '100%',
                                            maxWidth: {
                                                xs: '100%',
                                                sm: '400px',
                                                md: '450px',
                                                lg: '350px'
                                            },
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',

                                            transition: 'all 0.3s ease',

                                            '&:hover': {
                                                animation: 'bounce 0.6s ease'
                                            },

                                            '@keyframes bounce': {
                                                '0%, 100%': {
                                                    transform: 'translateY(0)',
                                                },
                                                '30%': {
                                                    transform: 'translateY(-10px)',
                                                },
                                                '60%': {
                                                    transform: 'translateY(4px)',
                                                },
                                            },
                                        }}>


                                        <Typography
                                            sx={{
                                                color: '#DC3545',
                                                fontWeight: 600,
                                                textAlign: 'center',
                                                fontSize: '30px'
                                            }}
                                        >
                                            Customer List ProductWise
                                        </Typography>


                                    </Box>
                                </Grid>
                            )}
                    </Grid>
                </CardContent>
            </Card> */}

            <Card
                sx={{
                    borderRadius: 4,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    border: "1px solid #f1f1f1",
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            mb: 3,
                            fontWeight: 700,
                            color: "#DC3545",
                        }}
                    >
                        All Reports
                    </Typography>

                    <Grid container spacing={3}>

                        {/* Work Reports */}
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <Card
                                sx={reportCardStyle}
                                onClick={() => navigate("/overAllReports")}
                            >
                                <AssessmentIcon
                                    sx={{ fontSize: 55, color: "#DC3545", mb: 1 }}
                                />

                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        color: "#DC3545",
                                        fontSize: "1.2rem",
                                        textAlign: "center",
                                    }}
                                >
                                    Work Reports
                                </Typography>

                                <Typography variant="caption" color="text.secondary">
                                    Employee Reports
                                </Typography>
                            </Card>
                        </Grid>

                        {/* Customer Alpha */}
                        {(dept?.toLowerCase() === "accounts" ||
                            role?.toLowerCase() === "hod" ||
                            role?.toLowerCase() === "supervisor") && (
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <Card
                                        sx={reportCardStyle}
                                        onClick={handleOpenPrintCustAlphaDialog}
                                    >
                                        <PeopleAltIcon
                                            sx={{ fontSize: 55, color: "#DC3545", mb: 1 }}
                                        />

                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                color: "#DC3545",
                                                fontSize: "1.1rem",
                                                textAlign: "center",
                                                px: 1,
                                            }}
                                        >
                                            Customer List Alpha
                                        </Typography>

                                        <Typography variant="caption" color="text.secondary">
                                            Alphabetical List
                                        </Typography>
                                    </Card>
                                </Grid>
                            )}

                        {/* Customer List */}
                        {(dept?.toLowerCase() === "accounts" ||
                            role?.toLowerCase() === "hod" ||
                            role?.toLowerCase() === "supervisor") && (
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <Card
                                        sx={reportCardStyle}
                                        onClick={handleOpenPrintDialog}
                                    >
                                        <FormatListBulletedIcon
                                            sx={{ fontSize: 55, color: "#DC3545", mb: 1 }}
                                        />

                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                color: "#DC3545",
                                                fontSize: "1.2rem",
                                                textAlign: "center",
                                            }}
                                        >
                                            Customer List
                                        </Typography>

                                        <Typography variant="caption" color="text.secondary">
                                            Complete List
                                        </Typography>
                                    </Card>
                                </Grid>
                            )}

                        {/* Service View */}
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <Card
                                sx={reportCardStyle}
                                onClick={() => navigate("/serviceView")}
                            >
                                <EngineeringIcon
                                    sx={{ fontSize: 55, color: "#DC3545", mb: 1 }}
                                />

                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        color: "#DC3545",
                                        fontSize: "1.2rem",
                                        textAlign: "center",
                                    }}
                                >
                                    Service View
                                </Typography>

                                <Typography variant="caption" color="text.secondary">
                                    Service Details
                                </Typography>
                            </Card>
                        </Grid>

                        {/* AMC Report */}
                        {(dept?.toLowerCase() === "accounts" ||
                            role?.toLowerCase() === "hod" ||
                            role?.toLowerCase() === "supervisor") && (
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <Card
                                        sx={reportCardStyle}
                                        onClick={handleOpenPrintAmcRptDialog}
                                    >
                                        <DescriptionIcon
                                            sx={{ fontSize: 55, color: "#DC3545", mb: 1 }}
                                        />

                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                color: "#DC3545",
                                                fontSize: "1.2rem",
                                                textAlign: "center",
                                            }}
                                        >
                                            AMC Report
                                        </Typography>

                                        <Typography variant="caption" color="text.secondary">
                                            AMC Summary
                                        </Typography>
                                    </Card>
                                </Grid>
                            )}

                        {/* Log Reports */}
                        {(role?.toLowerCase() === "administrator" ||
                            role?.toLowerCase() === "hod") && (
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <Card
                                        sx={reportCardStyle}
                                        onClick={handleOpenPrintLogRptDialog}
                                    >
                                        <HistoryIcon
                                            sx={{ fontSize: 55, color: "#DC3545", mb: 1 }}
                                        />

                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                color: "#DC3545",
                                                fontSize: "1.2rem",
                                                textAlign: "center",
                                            }}
                                        >
                                            Log Reports
                                        </Typography>

                                        <Typography variant="caption" color="text.secondary">
                                            Activity Logs
                                        </Typography>
                                    </Card>
                                </Grid>
                            )}

                        {/* Product Wise */}
                        {(role?.toLowerCase() === "administrator" ||
                            role?.toLowerCase() === "hod" ||
                            role?.toLowerCase() === "supervisor") && (
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <Card
                                        sx={reportCardStyle}
                                        onClick={(e) => { setVisible(true) }}
                                    >
                                        <Inventory2Icon
                                            sx={{ fontSize: 55, color: "#DC3545", mb: 1 }}
                                        />

                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                color: "#DC3545",
                                                fontSize: "1.05rem",
                                                textAlign: "center",
                                                px: 1,
                                            }}
                                        >
                                            Customer List ProductWise
                                        </Typography>

                                        <Typography variant="caption" color="text.secondary">
                                            Product Analysis
                                        </Typography>
                                    </Card>
                                </Grid>
                            )}


                        {/* User Login/Logout Report */}
                        {(role?.toLowerCase() === "administrator" ||
                            role?.toLowerCase() === "hod"
                        ) && (
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <Card
                                        sx={reportCardStyle}
                                        onClick={handleOpenPrintUserLoginDialog}
                                    >
                                        <LoginIcon
                                            sx={{ fontSize: 55, color: "#DC3545", mb: 1 }}
                                        />

                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                color: "#DC3545",
                                                fontSize: "1.05rem",
                                                textAlign: "center",
                                                px: 1,
                                            }}
                                        >
                                            User Login Report
                                        </Typography>

                                        <Typography variant="caption" color="text.secondary">
                                            Login / Logout Details
                                        </Typography>
                                    </Card>
                                </Grid>
                            )}

                    </Grid>
                </CardContent>
            </Card>

            <Dialog
                open={openPrintDialog}
                onClose={handleClosePrintDialog}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        px: 1,
                        py: 1,
                    }
                }}
            >
                <DialogContent>
                    Do you want to Print?
                </DialogContent>

                <DialogActions sx={{ mt: -1 }}>
                    <Button
                        onClick={handleClosePrintDialog}
                        sx={{ textTransform: 'none' }}
                    >
                        No
                    </Button>

                    <Button
                        onClick={handleConfirmPrint}
                        color="error"
                        variant="contained"
                        sx={{ textTransform: 'none' }}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* --------------------------------------------------------------------------- */}

            <Dialog
                open={openPrintCustAlphaDialog}
                onClose={handleClosePrintCustAlphaDialog}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        px: 1,
                        py: 1,
                    }
                }}
            >
                <DialogContent>
                    Do you want to Print?
                </DialogContent>

                <DialogActions sx={{ mt: -1 }}>
                    <Button
                        onClick={handleClosePrintCustAlphaDialog}
                        sx={{ textTransform: 'none' }}
                    >
                        No
                    </Button>

                    <Button
                        onClick={handleConfirmCustAlphaPrint}
                        color="error"
                        variant="contained"
                        sx={{ textTransform: 'none' }}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>




            {/* --------------------------------------------------------------------------- */}

            <Dialog
                open={openPrintAmcRptDialog}
                // onClose={handleClosePrintAmcRptDialog}
                onClose={(event, reason) => {
                    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
                    handleClosePrintAmcRptDialog();
                }}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        // p: 1
                    }
                }}
            >

                <DialogTitle
                    sx={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "#DC3545",
                        pb: 0
                    }}
                >
                    Please Select Date!
                </DialogTitle>
                <DialogContent>

                    <Grid container spacing={2} sx={{ mt: 0.5 }}>

                        {/* FROM DATE */}
                        <Grid item xs={12} sm={6}>

                            <DatePicker
                                selected={fromDate}
                                onChange={(date) => setFromDate(date)}
                                dateFormat="dd-MMM-yyyy"
                                popperPlacement="bottom-start"
                                portalId="root-portal"
                                customInput={
                                    <TextField
                                        label="From Date"
                                        size="small"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <CalendarTodayIcon
                                                        sx={{
                                                            fontSize: "18px",
                                                            color: "#DC3545"
                                                        }}
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                height: '32px', // reduce height
                                                fontSize: '13px',
                                            },

                                            '& .MuiInputBase-input': {
                                                padding: '6px 10px',
                                            },

                                            '& .MuiInputLabel-root': {
                                                fontSize: '13px',
                                            },

                                            '& input:focus': {
                                                backgroundColor: 'var(--focus-bg-color)',
                                            }
                                        }}
                                    />
                                }
                            />

                        </Grid>

                        {/* TO DATE */}
                        <Grid item xs={12} sm={6}>

                            <DatePicker
                                selected={toDate}
                                onChange={(date) => setToDate(date)}
                                dateFormat="dd-MMM-yyyy"
                                popperPlacement="bottom-start"
                                portalId="root-portal"
                                customInput={
                                    <TextField
                                        label="To Date"
                                        size="small"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <CalendarTodayIcon
                                                        sx={{
                                                            fontSize: "18px",
                                                            color: "#DC3545"
                                                        }}
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                height: '32px', // reduce height
                                                fontSize: '13px',
                                            },

                                            '& .MuiInputBase-input': {
                                                padding: '6px 10px',
                                            },

                                            '& .MuiInputLabel-root': {
                                                fontSize: '13px',
                                            },

                                            '& input:focus': {
                                                backgroundColor: 'var(--focus-bg-color)',
                                            }
                                        }}
                                    />
                                }
                            />

                        </Grid>

                    </Grid>

                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>

                    {/* <Button
                        onClick={handleClosePrintAmcRptDialog}
                        // variant="outlined"
                        sx={{
                            textTransform: "none",
                            // borderRadius: 2
                        }}
                    >
                        No
                    </Button> */}

                    <Button
                        onClick={() => {
                            setOpenPrintAmcRptDialog(false);
                            setOpenAmcConfirmDialog(true);
                        }}
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            backgroundColor: "#DC3545",
                            '&:hover': {
                                backgroundColor: "#bb2d3b"
                            }
                        }}
                    >
                        Print
                    </Button>

                </DialogActions>
            </Dialog>


            <Dialog
                open={openAmcConfirmDialog}
                onClose={() => setOpenAmcConfirmDialog(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        px: 1,
                        py: 1,
                    }
                }}
            >
                <DialogContent>
                    Do you want to print the AMC Report?
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setOpenAmcConfirmDialog(false)}
                        sx={{ textTransform: "none" }}
                    >
                        No
                    </Button>

                    <Button
                        onClick={async () => {
                            setOpenAmcConfirmDialog(false);
                            await handleAmcRptPrint();
                        }}
                        variant="contained"
                        color="error"
                        sx={{ textTransform: "none" }}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>


            {/* --------------------------------------------------------------------------- */}

            <Dialog
                open={openPrintLogRptDialog}
                // onClose={handleClosePrintAmcRptDialog}
                onClose={(event, reason) => {
                    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
                    handleClosePrintLogRptDialog();
                }}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        // p: 1
                    }
                }}
            >

                <DialogTitle
                    sx={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "#DC3545",
                        pb: 0
                    }}
                >
                    Please Select Date!
                </DialogTitle>
                <DialogContent>

                    <Grid container spacing={2} sx={{ mt: 0.5 }}>

                        {/* FROM DATE */}
                        <Grid item xs={12} sm={6}>

                            <DatePicker
                                selected={fromLogDate}
                                onChange={(date) => setFromLogDate(date)}
                                dateFormat="dd-MMM-yyyy"
                                popperPlacement="bottom-start"
                                portalId="root-portal"
                                customInput={
                                    <TextField
                                        label="From Date"
                                        size="small"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <CalendarTodayIcon
                                                        sx={{
                                                            fontSize: "18px",
                                                            color: "#DC3545"
                                                        }}
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                height: '32px', // reduce height
                                                fontSize: '13px',
                                            },

                                            '& .MuiInputBase-input': {
                                                padding: '6px 10px',
                                            },

                                            '& .MuiInputLabel-root': {
                                                fontSize: '13px',
                                            },

                                            '& input:focus': {
                                                backgroundColor: 'var(--focus-bg-color)',
                                            }
                                        }}
                                    />
                                }
                            />

                        </Grid>

                        {/* TO DATE */}
                        <Grid item xs={12} sm={6}>

                            <DatePicker
                                selected={toLogDate}
                                onChange={(date) => setToLogDate(date)}
                                dateFormat="dd-MMM-yyyy"
                                popperPlacement="bottom-start"
                                portalId="root-portal"
                                customInput={
                                    <TextField
                                        label="To Date"
                                        size="small"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <CalendarTodayIcon
                                                        sx={{
                                                            fontSize: "18px",
                                                            color: "#DC3545"
                                                        }}
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                height: '32px', // reduce height
                                                fontSize: '13px',
                                            },

                                            '& .MuiInputBase-input': {
                                                padding: '6px 10px',
                                            },

                                            '& .MuiInputLabel-root': {
                                                fontSize: '13px',
                                            },

                                            '& input:focus': {
                                                backgroundColor: 'var(--focus-bg-color)',
                                            }
                                        }}
                                    />
                                }
                            />

                        </Grid>

                    </Grid>

                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>

                    {/* <Button
                        onClick={handleClosePrintAmcRptDialog}
                        // variant="outlined"
                        sx={{
                            textTransform: "none",
                            // borderRadius: 2
                        }}
                    >
                        No
                    </Button> */}

                    <Button
                        onClick={() => {
                            setOpenPrintLogRptDialog(false);
                            setOpenLogConfirmDialog(true);
                        }}
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            backgroundColor: "#DC3545",
                            '&:hover': {
                                backgroundColor: "#bb2d3b"
                            }
                        }}
                    >
                        Print
                    </Button>

                </DialogActions>
            </Dialog>


            <Dialog
                open={openLogConfirmDialog}
                onClose={() => setOpenLogConfirmDialog(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        px: 1,
                        py: 1,
                    }
                }}
            >
                <DialogContent>
                    Do you want to print the Log Report?
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setOpenLogConfirmDialog(false)}
                        sx={{ textTransform: "none" }}
                    >
                        No
                    </Button>

                    <Button
                        onClick={async () => {
                            setOpenLogConfirmDialog(false);
                            await handleLogReportsPrint();
                        }}
                        variant="contained"
                        color="error"
                        sx={{ textTransform: "none" }}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* --------------------------------------------------------------------------- */}

            <Dialog
                open={openPrintUserLoginRptDialog}
                // onClose={handleClosePrintAmcRptDialog}
                onClose={(event, reason) => {
                    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
                    handleClosePrintUserLoginDialog();
                }}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        // p: 1
                    }
                }}
            >

                <DialogTitle
                    sx={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "#DC3545",
                        pb: 0
                    }}
                >
                    Please Select Date!
                </DialogTitle>
                <DialogContent>

                    <Grid container spacing={2} sx={{ mt: 0.5 }}>

                        {/* FROM DATE */}
                        <Grid item xs={12} sm={6}>

                            <DatePicker
                                selected={frmUserLoginDate}
                                onChange={(date) => setFromUserLoginDate(date)}
                                dateFormat="dd-MMM-yyyy"
                                popperPlacement="bottom-start"
                                portalId="root-portal"
                                customInput={
                                    <TextField
                                        label="From Date"
                                        size="small"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <CalendarTodayIcon
                                                        sx={{
                                                            fontSize: "18px",
                                                            color: "#DC3545"
                                                        }}
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                height: '32px', // reduce height
                                                fontSize: '13px',
                                            },

                                            '& .MuiInputBase-input': {
                                                padding: '6px 10px',
                                            },

                                            '& .MuiInputLabel-root': {
                                                fontSize: '13px',
                                            },

                                            '& input:focus': {
                                                backgroundColor: 'var(--focus-bg-color)',
                                            }
                                        }}
                                    />
                                }
                            />

                        </Grid>

                        {/* TO DATE */}
                        <Grid item xs={12} sm={6}>

                            <DatePicker
                                selected={toUserLoginDate}
                                onChange={(date) => setToUserLoginDate(date)}
                                dateFormat="dd-MMM-yyyy"
                                popperPlacement="bottom-start"
                                portalId="root-portal"
                                customInput={
                                    <TextField
                                        label="To Date"
                                        size="small"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <CalendarTodayIcon
                                                        sx={{
                                                            fontSize: "18px",
                                                            color: "#DC3545"
                                                        }}
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                height: '32px', // reduce height
                                                fontSize: '13px',
                                            },

                                            '& .MuiInputBase-input': {
                                                padding: '6px 10px',
                                            },

                                            '& .MuiInputLabel-root': {
                                                fontSize: '13px',
                                            },

                                            '& input:focus': {
                                                backgroundColor: 'var(--focus-bg-color)',
                                            }
                                        }}
                                    />
                                }
                            />

                        </Grid>

                    </Grid>

                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>

                    {/* <Button
                        onClick={handleClosePrintAmcRptDialog}
                        // variant="outlined"
                        sx={{
                            textTransform: "none",
                            // borderRadius: 2
                        }}
                    >
                        No
                    </Button> */}

                    <Button
                        onClick={() => {
                            setOpenPrintUserLoginRptDialog(false);
                            setOpenUserLoginConfirmDialog(true);
                        }}
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            backgroundColor: "#DC3545",
                            '&:hover': {
                                backgroundColor: "#bb2d3b"
                            }
                        }}
                    >
                        Print
                    </Button>

                </DialogActions>
            </Dialog>


            <Dialog
                open={openUserLoginConfirmDialog}
                onClose={() => setOpenUserLoginConfirmDialog(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        px: 1,
                        py: 1,
                    }
                }}
            >
                <DialogContent>
                    Do you want to print the User Login Report?
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setOpenUserLoginConfirmDialog(false)}
                        sx={{ textTransform: "none" }}
                    >
                        No
                    </Button>

                    <Button
                        onClick={async () => {
                            setOpenUserLoginConfirmDialog(false);
                            await handleuserLoginRpt();
                        }}
                        variant="contained"
                        color="error"
                        sx={{ textTransform: "none" }}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>


            {/* -------------------------------------------------------- */}
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


            <CustomerListPrdWise
                visible={visible}
                setVisible={setVisible}
                allProducts={allProducts}
                selectAllChecked={selectAllChecked}
                setSelectAllChecked={setSelectAllChecked}
                checkedItems={checkedItems}
                setCheckedItems={setCheckedItems}
                handleCheckboxChange={handleCheckboxChange}
                handleSelectAllChange={handleSelectAllChange}
                handleCustListPrdWisrPrint={handleCustListPrdWisrPrint} />

        </>
    )
}

export default AllReports
