import { CheckBox, HelpOutline } from '@mui/icons-material'
import { Card, Paper, CardContent, Checkbox, FormControlLabel, Grid, Radio, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, TableBody, Box, Button, Tooltip, CircularProgress, Chip, Link, Popover, MenuItem, TablePagination, Pagination, FormControl, Select } from '@mui/material'
import React, { useEffect, useRef, useState, useMemo } from 'react'
import AddIcon from '@mui/icons-material/Add';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import DetailsModal from './DetailsModal';
import TransferModal from './TransferModal';
import axiosInstance from '../../../axios';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import getReduxState from '../../../ReduxState';
import NewTicket from '../Ticket List/NewTicket';
import { useNavigate } from 'react-router-dom';
import PauseIcon from '@mui/icons-material/Pause';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

} from "@mui/material";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StopIcon from '@mui/icons-material/Stop';
import { useWorkList } from '../../../Context/WorkListContext';

function CurrentWorkList() {

    const { role, deptid, name, empId, BrnchKey } = getReduxState()

    const { setTransCount: setContextTransCount,
        setTransferData: setContextTransferData,
        selectedTransData, shouldHighlight } = useWorkList();

    const [transferData, setTransferData] = useState([]);
    const [transCount, setTransCount] = useState(0);

    const isAdmin = role === "Administrator";
    const isHOD = role === "HOD";

    const [visible1, setVisible1] = useState(false) // Details Modal
    const [visible2, setVisible2] = useState(false)// Transfer modal

    const [openTicketModal, setOpenTicketModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [deleteRow, setDeleteRow] = useState(null);
    const [confirmDeleteTicketOpen, setConfirmDeleteTicketOpen] = useState(false);

    const [isCompleted, setIsCompleted] = useState(false)
    const [isTransfered, setIsTransfered] = useState(false)

    const [getData, setGetData] = useState([])

    const [anchorEl, setAnchorEl] = useState(null);

    const [allDept, setAllDept] = useState([]);
    const [listDept, setListDept] = useState(
        isAdmin ? "All" : deptid
    );

    const [allStaff, setAllStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(empId);

    const [transferDept, setTransferDept] = useState("");
    const [transferStaff, setTransferStaff] = useState("");

    const [details, setDetails] = useState('');
    const [statusPer, setStatusPer] = useState('Doing');
    const [percentage, setPercentage] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeWork, setActiveWork] = useState(null);

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");

    const detailsInputRef = useRef(null)
    const percentageInputRef = useRef(null)
    const transStaffInputRef = useRef(null)
    const transDeptinputref = useRef(null)

    const [transferRow, setTransferRow] = useState(null)
    const [transferDetails, setTransferDetails] = useState([])

    const [completeRow, setCompleteRow] = useState(null);
    const [openCompleteDialog, setOpenCompleteDialog] = useState(false);

    const [printRow, setPrintRow] = useState(null);
    const [openPrintDialog, setOpenPrintDialog] = useState(false);

    const highlightedRowRef = useRef(null);


    useEffect(() => {

        if (
            shouldHighlight &&
            highlightedRowRef.current
        ) {

            highlightedRowRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

    }, [selectedTransData, shouldHighlight]);

    // PAGINATION
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 50;


    const [focusField, setFocusField] = useState("");

    // Close dialog box and focus field if needed
    const handleClose = () => {
        setOpenDialog(false);
        if (focusField === "percentage") {
            percentageInputRef.current?.focus();
        }

        if (focusField === "details") {
            detailsInputRef.current?.focus();
        }
    };

    const navigate = useNavigate();

    const handleOpenTicket = (row) => {
        navigate("/TicketLists", {
            state: {
                openEdit: true,
                ticketData: row,
                fromCurrentWorkList: true
            }
        });
    };


    const showDialog = (message, field = "") => {

        setFocusField(field);
        setDialogMessage(message);
        setOpenDialog(true);
    };

    const [loading, setLoading] = useState(false);

    //console.log("selectedRow", selectedRow)
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

    const getMinutes = (start, end) => {
        if (!start || !end) return 0;
        return (new Date(end) - new Date(start)) / (1000 * 60);
    };

    const formatTatHM = (totalMinutes = 0) => {
        const h = Math.floor(totalMinutes / 60);
        const m = Math.floor(totalMinutes % 60);
        return `${h} (H) ${m} (m)`;
    };

    // Fetch Table Data 
    // PAGINATION STATES


    // FETCH DATA
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
            YearId: 2627,
            UserGroup: role,
            IsCompleted: isCompleted,
            IsTransfered: isTransfered
        };

        setLoading(true);

        try {
            const fetchResponse = await axiosInstance.post(
                `/WorkListAPI/GetWorkList`,
                requestData
            );

            if (fetchResponse.data) {

                ;

                const sortedData = fetchResponse.data.sort(
                    (a, b) => new Date(b.Tkt_DateTime) - new Date(a.Tkt_DateTime)
                );


                const enrichedData = fetchResponse.data.map(item => {
                    const active = item.WorkItems?.find(
                        w => w.TktItm_CurrentlyWorking === true
                    );

                    return {
                        ...item,
                        selectedSubticket: active ? active.TktItm_WrkTitle : ""
                    };
                });

                // setGetData(enrichedData)
                setGetData(enrichedData);

                return enrichedData;

                //  setGetData(sortedData);

                // RESET TO FIRST PAGE
                setCurrentPage(1);
            }
        } catch (error) {
            console.log("Error while fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubticketChange = (row, value) => {

        const updatedData = getData.map(item => {

            if (item.TicketNo === row.TicketNo) {

                return {
                    ...item,
                    selectedSubticket: value, // UI only

                    WorkItems: item.WorkItems.map(w => ({
                        ...w,
                        // ONLY UI highlight, NOT modal logic
                        isSelected: w.TktItm_WrkTitle === value
                    }))
                };
            }

            return item;
        });

        setGetData(updatedData);
    };


    // PAGINATION LOGIC
    const totalPages = Math.ceil(getData.length / rowsPerPage);

    const paginatedData = getData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    useEffect(() => {
        fetchDepartment()
        fetchStaff()
    }, [])

    // console.log("printrow", printRow)


    // =========================
    // PAGE CHANGE
    // =========================
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // =========================
    // ROW CHANGE
    // =========================
    const handleChangeRowsPerPage = (event) => {

        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);

    };


    useEffect(() => {
        if (selectedRow?.WorkItems) {

            // item already active from DB
            const active = selectedRow.WorkItems.find(
                w => w.TktItm_CurrentlyWorking === true
            );

            setActiveWork(active || null);
        }
    }, [selectedRow]);

    useEffect(() => {
        fetchData();
    }, [selectedStaff, listDept, role, BrnchKey, isCompleted, isTransfered]);

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


    const handleOpen = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleCloseSub = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

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

    // Reset Details Modal
    const resetmodal = async () => {
        setStatusPer('Doing')
        setPercentage('')
        setSelectedItem('')
        setDetails('')
    }


    // useEffect(() => {

    //     setSelectedItem(null);

    // }, [visible1, selectedRow]);

    const isAllCompleted =
        selectedRow?.WorkItems?.length > 0 &&
        selectedRow?.WorkItems?.every(
            item => Number(item?.Tkt_Progress) === 3
        );

    // Save Function (Details Modal)
    const handleSave = async () => {

        // currently selected checkbox
        const currentSelected = selectedItem;

        //  console.log("currentSelected", currentSelected)

        // no selected work
        if (!currentSelected) {
            showDialog("Please Select a Sub Work");
            // setOpenDialog(true);
            return;
        }

        // no active work exists in DB
        if (!activeWork && (statusPer === "Paused" || statusPer === "Hold")) {
            showDialog("No active sub work found.");
            // setOpenDialog(true);
            return;
        }

        // prevent pausing/holding another subwork
        if (
            (statusPer === "Paused" || statusPer === "Hold") &&
            activeWork?.TktItm_Key !== currentSelected?.TktItm_Key
        ) {
            showDialog(
                `Only active sub work "${activeWork?.TktItm_WrkTitle}" can be Paused or Hold.`
            );

            // setOpenDialog(true);
            return;
        }

        // console.log("selectedItem", selectedItem)
        // console.log("avtive work", activeWork)

        // // SAME WORK → allow silently continue
        // const hasOtherDoingWork = getData?.some(
        //     item =>
        //         item.Tkt_Status === "Doing" &&
        //         item.Tkt_Key !== selectedRow?.Tkt_Key
        // );

        // if (hasOtherDoingWork) {
        //     setDialogMessage("Another Work is Already in Progress, Please Pause it First.");
        //     setOpenDialog(true)
        //     return;
        // }


        // Only Doing work can be completed
        // Prevent completing a paused/hold work
        if (
            statusPer === "Completed" &&
            (
                selectedRow?.WorkDetails?.Tktwrk_Status === "Paused" ||
                selectedRow?.WorkDetails?.Tktwrk_Status === "Hold"
            )
        ) {
            showDialog(
                "Paused or Hold work cannot be marked as Completed. Please resume the work first."
            );
            return;
        }
        // Completed requires 100%
        if (
            statusPer === "Completed" &&
            Number(percentage) !== 100
        ) {
            showDialog(
                "Work progress must be 100% before it can be marked as Completed.",
                "percentage"
            );
            return;
        }

        // 100% requires Completed
        if (
            Number(percentage) === 100 &&
            statusPer !== "Completed"
        ) {
            showDialog(
                "When progress reaches 100%, the status must be set to Completed."
            );
            return;
        }

        // // all sub works must be completed
        // if (statusPer === "Completed") {

        //     const hasIncompleteSubWorks = selectedRow?.WorkItems?.some(
        //         item => Number(item?.WorkItem_Percentage || 0) < 100
        //     );

        //     if (hasIncompleteSubWorks) {
        //         showDialog(
        //             "Unable to complete the ticket. Please ensure all sub-works are 100% completed."
        //         );
        //         return;
        //     }
        // }

        // Allow multiple works only for Service department
        const isServiceDept =
            String(listDept).toLowerCase() === "service" ||
            allDept?.find(d => d.mstr_key === listDept)?.desc?.toLowerCase() === "service";

        const hasOtherDoingWork = getData?.some(
            item =>
                item.Tkt_Status === "Doing" &&
                item.Tkt_Key !== selectedRow?.Tkt_Key
        );

        // Restrict for non-service departments only
        if (!isServiceDept && hasOtherDoingWork) {

            showDialog(
                "Another Work is Already in Progress, Please Pause it First."
            );
            return;
        }

        if (statusPer === "Paused" || statusPer === "Hold" || statusPer === "Completed") {

            if (!percentage) {
                showDialog("Please Enter Percentage", "percentage");
                return;
            }

            if (!details) {
                showDialog("Please Enter Details", "details");
                return;
            }
        }

        //  Prevent saving Doing again
        if (
            selectedRow?.WorkDetails?.Tktwrk_Status === "Doing" &&
            statusPer === "Doing"
        ) {
            showDialog("Work is Already in Doing Status");
            return;
        }

        //  Prevent saving Doing again
        if (
            selectedRow?.WorkDetails?.Tktwrk_Status === "Paused" &&
            statusPer === "Paused" || selectedRow?.WorkDetails?.Tktwrk_Status === "Hold" &&
            statusPer === "Hold"
        ) {
            showDialog("This Work is Not Started");
            return;
        }

        let totalMinutes = 0;

        // get previous TAT from string
        const oldTat = selectedRow?.Tkt_Tat || "0 (H) 0 (m)";

        const hourMatch = oldTat.match(/(\d+)\s*\(H\)/);
        const minuteMatch = oldTat.match(/(\d+)\s*\(m\)/);

        const oldHours = hourMatch ? Number(hourMatch[1]) : 0;
        const oldMinutes = minuteMatch ? Number(minuteMatch[1]) : 0;

        totalMinutes = (oldHours * 60) + oldMinutes;

        // calculate ONLY when paused
        if (statusPer === "Paused" || statusPer === "Hold" || statusPer === "Completed") {

            const start =
                selectedRow?.UpdatedDate;

            const end = new Date();

            const sessionTat =
                getMinutes(start, end);

            totalMinutes += sessionTat;
        }

        const requestData = {
            Tkt_Itmkey: currentSelected?.TktItm_Key || '',
            Tkt_Details: details,
            Tkt_Status: statusPer,
            Tkt_Percentage:
                percentage !== "" && percentage !== null
                    ? Number(percentage)
                    : currentSelected?.WorkItem_Percentage || 0,
            // ONLY formatted TAT
            Tkt_Tat: formatTatHM(totalMinutes),
            Tkt_CurrentlyWorking: true,

            logReason: "Work update",
            logDesc: `Work Details Enter By TicketNo:${selectedRow?.TicketNo} Created By:${selectedRow?.Tkt_CreadtedByName} Ticket Details:Customer :${selectedRow?.Tkt_CustName} Ticket details :${details} Ticket Status :${statusPer} Ticket Percentage :${percentage} Ticket Saved Date :${selectedRow?.CreatedDate}`,
            logForm: "TicketList",
            logUser: empId,
            logUserId: name
        };

        try {

            await axiosInstance.post(
                "/SaveWorkFromItem",
                requestData
            );
            //  resetmodal()
            // fetchData();
            setVisible1(false);

            const latestData = await fetchData();

            const updatedRow = latestData?.find(
                x => x.TicketNo === selectedRow?.TicketNo
            );

            resetmodal();

            if (statusPer === "Completed") {

                const allSubWorksCompleted =
                    updatedRow?.WorkItems?.every(
                        item => Number(item?.Tkt_Progress) === 3
                    );

                const allSubWorks100 =
                    updatedRow?.WorkItems?.every(
                        item => Number(item?.WorkItem_Percentage || 0) === 100
                    );

                if (allSubWorksCompleted && allSubWorks100) {

                    await handleCompleted(updatedRow);

                }
                return;
            }

        } catch (err) {
            console.log("save error", err);
        }
    };

    // Delete Ticket from Current WrkList
    const handleConfirmDeleteYes = async () => {

        let requestData = {
            ticketno: deleteRow?.TicketNo,

            logReason: "Removed from current work list",

            logDesc: `Ticket Removed From Current Work List TicketNo : ${deleteRow?.TicketNo} Customer : ${deleteRow?.Tkt_CustName} Removed By : ${name} Removed Date : ${new Date().toLocaleString()}`,

            logForm: "CurrentWorkList",
            logUser: name,
            logUserId: empId
        };

        const DeleteResponse = await axiosInstance.post(`/tickets/DeleteTicket`, requestData)

        if (DeleteResponse?.data?.status) {
            toast.success("Deleted successfully");

            setConfirmDeleteTicketOpen(false);
            setDeleteRow(null)
            fetchData();

        } else {
            toast.error(res?.data?.message || "Delete failed");
        }
    }

    const handleConfirmDeleteTicketNo = () => {
        setConfirmDeleteTicketOpen(false);
        setDeleteRow(null);
    };


    // Rest Transfer Modal
    const resetTransModal = async () => {
        setTransferDept('')
        setTransferStaff('')
        setTransferRow('')
        setTransferDetails('')

    }

    // Transfer Function
    const handleTransfer = async () => {

        if (!transferDept) {
            showDialog("Please Select Department", "department");
            return
        }

        if (!transferStaff) {
            showDialog("Please Select Staff", "staff");
            return
        }

        if (!transferDetails || transferDetails.length === 0) {
            showDialog("Please Enter Details", "details");
            return;
        }

        let requestData = {
            Ticket_no: transferRow?.TicketNo,
            EmpId: transferStaff,
            DeptId: transferDept,
            Details: transferDetails,

            logReason: "Work Transfer",
            logDesc: `Ticket Transfer in Current Work List
                  TicketNo : ${transferRow?.TicketNo} Customer : ${transferRow?.Tkt_CustName || ""} Transfer By : ${empId}, Transfer To : ${transferStaff}
                  Transfer Date : ${new Date().toLocaleString()}
                  `.trim(),
            logForm: "Current WorkList",
            logUser: name,
            logUserId: empId
        }

        try {
            const resposne = await axiosInstance.post(`/WorkListAPI/SaveTransferDetails`, requestData)
            if (resposne?.data?.status) {
                toast.success("Work Transfered successfully");

                setTransferRow(null)
                setVisible2(false)
                resetTransModal()
                fetchData();

            } else {
                toast.error(res?.data?.message || "Delete failed");
            }

        } catch (error) {
            console.log("Error while Transfer Work", error)
        }
    }

    const handleCompleted = async (row) => {

        let requestData = {
            ticketno: `${row?.TicketNo}`,
            logReason: "Ticket Completed",
            logDesc: `Completed Ticket No: ${row?.TicketNo} Completed Ticket from current Work List: Customer : ${row?.Tkt_CustName} Ticket Priority: ${row?.Tkt_Priorities}  Ticket Created By: ${row?.Tkt_CreadtedByName} Completed By: ${name}`,
            logForm: "Current WorkLIst",
            logUser: name,
            logUserId: empId
        }

        try {
            const response = await axiosInstance.post(`/tickets/CompletedTicket`, requestData)
            if (response?.data?.status) {
                toast.success("Work completed successfully");

                setOpenCompleteDialog(false)
                setCompleteRow(null)
                await fetchData();

            } else {
                toast.error(res?.data?.message || "Delete failed");
            }
        }
        catch (error) {
            console.log("Error while completing work", error)
        }
    }

    const handleConfirmComplete = async () => {
        if (!completeRow) return;
        await handleCompleted(completeRow);
        setOpenCompleteDialog(false);
        setCompleteRow(null);
    };

    const handleCloseCompleteDialog = () => {
        setOpenCompleteDialog(false);
        setCompleteRow(null);
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



    const handleConfirmPrint = async () => {
        if (!printRow) return;

        await handlePrint(printRow);
        setOpenPrintDialog(false);
        setPrintRow(null);
    };

    const handleClosePrintDialog = () => {
        setOpenPrintDialog(false);
        setPrintRow(null);
    };


    const hideLastFiveColumns = isCompleted || isTransfered;

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
                My WorkList
            </Typography>

            <Card sx={{
                //  border: '1px solid',
                height: {
                    xs: 'calc(100vh - -90px)',
                    sm: 'calc(100vh - -10px)',
                    md: 'calc(100vh - -10px)',
                    lg: 'calc(100vh - 4px)',
                    xl: 'calc(100vh - -10px)'
                },
            }}>
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

                        <Grid item xs={12} sm={4} md={4} lg={2.5}>
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

                        <Grid item xs={12} sm={4} md={4} lg={1.5}>

                            <TextField
                                label="Sort"
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
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={4} lg={2} xl={2}>

                            <FormControlLabel
                                sx={{
                                    marginLeft: { xs: '0px', sm: "0px", lg: "0px" },
                                }}
                                control={<Checkbox
                                    checked={isCompleted}
                                    onChange={(e) => setIsCompleted(e.target.checked)} name='Completeedworkitems'
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

                        <Grid item xs={12} sm={4} md={4} lg={2} xl={2}>

                            <FormControlLabel
                                sx={{
                                    marginLeft: { xs: '0px', sm: "0px", lg: "0px" },
                                }}
                                control={<Checkbox
                                    checked={isTransfered}
                                    onChange={(e) => setIsTransfered(e.target.checked)}
                                    name='transferworkitems'
                                    sx={{
                                        color: 'grey',
                                        '&.Mui-checked': {
                                            color: '#DC3545!important',   // 🔥 force override
                                        },
                                    }}
                                />}
                                label="Transfer Work Items"
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={1} lg={1} sx={{ mt: { sm: "8px" }, ml: { md: "25px" }, }}>

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

                        <Grid item xs={12} sx={{ marginBottom: "50px" }} >

                            <TableContainer
                                component={Paper}
                                sx={{

                                    height: {
                                        xs: 'calc(100vh - 300px)',
                                        sm: 'calc(100vh - 190px)',
                                        md: 'calc(100vh - 190px)',
                                        lg: 'calc(100vh - 140px)',
                                        xl: 'calc(100vh - 140px)'
                                    },
                                    width: '100%',
                                    marginTop: 1,
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
                                }}>
                                <Table striped sx={{ minWidth: 1500, tableLayout: 'fixed' }}>
                                    {/* Table Head */}
                                    <TableHead sx={{ position: 'sticky', zIndex: 1, top: 0, backgroundColor: 'var(--header-bg-color)' }}>
                                        <TableRow sx={{ height: '32px' }}>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4.5%', fontWeight: 'bold' }}>SlNo</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '8%', fontWeight: 'bold' }}>Ticket#</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '9%', fontWeight: 'bold' }}>DateTime</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '9.5%', fontWeight: 'bold' }}>Customer</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '7%', fontWeight: 'bold' }}>Priority</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '6.5%', fontWeight: 'bold' }}>Description</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '8.5%', fontWeight: 'bold' }}>SubTicket</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Status</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '7%', fontWeight: 'bold' }}>Tat</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '6%', fontWeight: 'bold' }}>CreatedBy</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '6%', fontWeight: 'bold' }}>WorkTakenBy</TableCell>
                                            {!hideLastFiveColumns && (
                                                <>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}></TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}></TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}></TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}></TableCell>
                                                    {/* <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}></TableCell> */}
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}></TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={hideLastFiveColumns ? 11 : 16} align="center">

                                                    <CircularProgress size={25} sx={{ color: "#DC3545" }} />
                                                </TableCell>
                                            </TableRow>
                                        ) : paginatedData.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={hideLastFiveColumns ? 11 : 16} align="center">
                                                    No Works Available
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedData.map((row, index) => (
                                                <TableRow
                                                    key={index}
                                                    ref={
                                                        shouldHighlight &&
                                                            selectedTransData === row.TicketNo
                                                            ? highlightedRowRef
                                                            : null
                                                    }
                                                    sx={{
                                                        height: "32px",
                                                        backgroundColor:
                                                            (shouldHighlight &&
                                                                selectedTransData === row.TicketNo)
                                                                ? "#fde2e5"
                                                                : "inherit",


                                                        "&:hover": {
                                                            backgroundColor:
                                                                (selectedTransData === row.TicketNo)
                                                                    ? "#fde2e5"
                                                                    : "rgba(0,0,0,0.04)"
                                                        },


                                                    }}>
                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>  {(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
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
                                                            {row.TicketNo}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={formatDateTime(row.Tkt_DateTime)} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{formatDateTime(row.Tkt_DateTime)}</span>
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
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.Tkt_Description} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.Tkt_Description}</span>
                                                        </Tooltip></TableCell>
                                                    <TableCell align="center" sx={{ minWidth: 180 }}>
                                                        <FormControl fullWidth size="small">
                                                            {/* <Select
                                                                value={row.selectedSubticket || ""}

                                                                disabled={!row.WorkItems || row.WorkItems.length === 0}
                                                                onChange={(e) =>
                                                                    handleSubticketChange(row, e.target.value)
                                                                }
                                                                IconComponent={KeyboardArrowDownIcon}
                                                                sx={{
                                                                    fontSize: 14,
                                                                    height: 32,
                                                                    borderRadius: "8px",
                                                                    background: "#fff",

                                                                    "&.Mui-disabled": {
                                                                        background: "#f5f5f5",
                                                                        cursor: "not-allowed"
                                                                    }
                                                                }}
                                                                renderValue={(selected) => {

                                                                    if (!row.WorkItems || row.WorkItems.length === 0) {
                                                                        return;
                                                                    }

                                                                    if (!selected) {
                                                                        return;
                                                                    }
                                                                    return selected;
                                                                }}
                                                            >
                                                                {row.WorkItems?.map((item, index) => (
                                                                    <MenuItem
                                                                        key={index}
                                                                        value={item.TktItm_WrkTitle}
                                                                    >
                                                                        {item.TktItm_WrkTitle}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select> */}


                                                            <Select
                                                                value={row.selectedSubticket || ""}

                                                                disabled={!row.WorkItems || row.WorkItems.length === 0}

                                                                onChange={(e) => {

                                                                    const selectedValue = e.target.value;

                                                                    // selected subwork
                                                                    const selectedWork = row.WorkItems?.find(
                                                                        item => item.TktItm_WrkTitle === selectedValue
                                                                    );

                                                                    //             console.log("Selected Work :", selectedWork);

                                                                    // percentage from selected subwork
                                                                    const percentage = Number(
                                                                        selectedWork?.WorkItem_Percentage || 0
                                                                    );

                                                                    // update table state
                                                                    const updatedData = getData.map(item => {

                                                                        if (item.TicketNo === row.TicketNo) {

                                                                            return {
                                                                                ...item,

                                                                                selectedSubticket: selectedValue,

                                                                                WorkDetails: {
                                                                                    ...item.WorkDetails,
                                                                                    Tktwrk_Percentage: percentage
                                                                                }
                                                                            };
                                                                        }

                                                                        return item;
                                                                    });

                                                                    setGetData(updatedData);
                                                                }}

                                                                IconComponent={KeyboardArrowDownIcon}

                                                                sx={{
                                                                    fontSize: 14,
                                                                    height: 32,
                                                                    borderRadius: "8px",
                                                                    background: "#fff",

                                                                    "&.Mui-disabled": {
                                                                        background: "#f5f5f5",
                                                                        cursor: "not-allowed"
                                                                    }
                                                                }}

                                                                renderValue={(selected) => {

                                                                    if (!row.WorkItems || row.WorkItems.length === 0) {
                                                                        return "No Sub Work";
                                                                    }

                                                                    if (!selected) {
                                                                        return "Select Sub Work";
                                                                    }

                                                                    return selected;
                                                                }}
                                                            >
                                                                {row.WorkItems?.map((item, index) => (
                                                                    <MenuItem
                                                                        key={index}
                                                                        value={item.TktItm_WrkTitle}
                                                                    >
                                                                        {item.TktItm_WrkTitle}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Box
                                                            sx={{
                                                                position: "relative",
                                                                width: 50,
                                                                height: 50,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center"
                                                            }}
                                                        >
                                                            {/* Progress Ring */}
                                                            <Box
                                                                sx={{
                                                                    width: 48,
                                                                    height: 45,
                                                                    borderRadius: "50%",
                                                                    background: `conic-gradient(
                                                                        ${row?.WorkDetails?.Tktwrk_Percentage >= 80
                                                                            ? "#DC3545"
                                                                            : row?.WorkDetails?.Tktwrk_Percentage >= 40
                                                                                ? "#DC3545"
                                                                                : "#DC3545"
                                                                        } ${row?.WorkDetails?.Tktwrk_Percentage || 0}%,
                                                                        #ececec ${row?.WorkDetails?.Tktwrk_Percentage || 0}%
                                                                    )`,
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    transition: "0.4s ease",
                                                                    boxShadow: "0 2px 6px rgba(0,0,0,0.12)"
                                                                }}
                                                            >
                                                                {/* Inner Circle */}
                                                                <Box
                                                                    sx={{
                                                                        width: 40,
                                                                        height: 40,
                                                                        borderRadius: "50%",
                                                                        backgroundColor: "#fff",
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        boxShadow: "inset 0 1px 4px rgba(0,0,0,0.12)"
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: "13px",
                                                                            fontWeight: 700,
                                                                            letterSpacing: "-0.3px",
                                                                            color:
                                                                                row?.WorkDetails?.Tktwrk_Percentage >= 80
                                                                                    ? "#DC3545"
                                                                                    : row?.WorkDetails?.Tktwrk_Percentage >= 40
                                                                                        ? "#DC3545"
                                                                                        : "#DC3545"
                                                                        }}
                                                                    >
                                                                        {`${Math.round(
                                                                            row?.WorkDetails?.Tktwrk_Percentage || 0
                                                                        )}%`}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>

                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.Tkt_Tat} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.Tkt_Tat}</span>
                                                        </Tooltip></TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.createdby} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.Tkt_CreadtedByName}</span>
                                                        </Tooltip></TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.worktakenby} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.Tkt_WorkTakenByName}</span>
                                                        </Tooltip></TableCell>

                                                    {!hideLastFiveColumns && (
                                                        <>
                                                            <TableCell align="center">
                                                                {/* 
                                                        {row?.WorkDetails?.Tktwrk_Status === "Doing" ? (

                                                            // DOING → PAUSE ICON
                                                            <PauseIcon
                                                                sx={{
                                                                    fontSize: 23,
                                                                    color: "#161616",
                                                                    cursor: "pointer"
                                                                }}
                                                                titleAccess="Pause Work"
                                                            />

                                                        ) : (

                                                            // OTHER STATUS → PLAY ICON
                                                            <PlayArrowIcon
                                                                sx={{
                                                                    fontSize: 23,
                                                                    color: "#DC3545",
                                                                    cursor: "pointer"
                                                                }}
                                                                titleAccess="Start Work"
                                                                onClick={() => handleStart(row)}
                                                            />
                                                        )} */}

                                                                {row?.WorkDetails?.Tktwrk_Status === "Doing" ? (

                                                                    // DOING
                                                                    <PauseIcon
                                                                        sx={{
                                                                            fontSize: 23,
                                                                            color: "#161616",
                                                                            cursor: "pointer"
                                                                        }}
                                                                        titleAccess="Pause Work"
                                                                    />

                                                                ) : row?.WorkDetails?.Tktwrk_Status === "Hold" ? (

                                                                    // HOLD
                                                                    <StopIcon
                                                                        sx={{
                                                                            fontSize: 23,
                                                                            color: "#f57c00",
                                                                            cursor: "pointer"
                                                                        }}
                                                                        titleAccess="Work On Hold"
                                                                    />

                                                                ) : (

                                                                    // OTHER STATUS
                                                                    <PlayArrowIcon
                                                                        sx={{
                                                                            fontSize: 23,
                                                                            color: "#DC3545",
                                                                            cursor: "pointer"
                                                                        }}
                                                                        titleAccess="Start Work"
                                                                    // onClick={() => handleStart(row)}
                                                                    />
                                                                )}

                                                            </TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    variant="contained"
                                                                    // onClick={() => {
                                                                    //     setSelectedRow(row);
                                                                    //     setVisible1(true);
                                                                    // }}
                                                                    onClick={() => {

                                                                        const allCompleted =
                                                                            row?.WorkItems?.length > 0 &&
                                                                            row.WorkItems.every(
                                                                                item => Number(item?.Tkt_Progress) === 3
                                                                            );

                                                                        if (allCompleted) {

                                                                            setCompleteRow(row);

                                                                            setOpenCompleteDialog(true);

                                                                            return;
                                                                        }

                                                                        setSelectedRow(row);

                                                                        setVisible1(true);
                                                                    }}
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
                                                                            border: "1px solid #DC3545"
                                                                        }
                                                                    }}



                                                                >
                                                                    <AddIcon sx={{ fontSize: 19 }} />
                                                                </Button>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    variant="contained"
                                                                    onClick={() => {
                                                                        if (!isAdmin && !isHOD) {
                                                                            setDialogMessage("You Are Not Allowed to Delete This Ticket");
                                                                            setOpenDialog(true);
                                                                            return;
                                                                        }

                                                                        setDeleteRow(row);
                                                                        setConfirmDeleteTicketOpen(true);
                                                                    }}

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
                                                                            backgroundColor: "#DC3545",   // green bg
                                                                            color: "#fff",                // icon becomes white
                                                                            border: "1px solid #DC3545"
                                                                        }
                                                                    }}
                                                                >
                                                                    <DeleteIcon sx={{ fontSize: 19 }}

                                                                    />

                                                                </Button>
                                                            </TableCell>

                                                            <TableCell>
                                                                <img
                                                                    src="https://cdn-icons-png.flaticon.com/128/2420/2420245.png"
                                                                    alt="Delete Icon"
                                                                    style={{
                                                                        width: "34px",
                                                                        height: "28px",
                                                                        filter: "brightness(0)"
                                                                    }}
                                                                    onClick={() => {

                                                                        // CHECK STATUS BEFORE TRANSFER
                                                                        if (row?.WorkDetails?.Tktwrk_Status === "Doing") {

                                                                            setDialogMessage(
                                                                                "You Can't Transfer This Work To Anyone. Only Paused Or Hold Work Can Be Transfer."
                                                                            );

                                                                            setOpenDialog(true);

                                                                            return;
                                                                        }

                                                                        setTransferRow(row);

                                                                        setVisible2(true);
                                                                    }}
                                                                />

                                                            </TableCell>

                                                            {/* <TableCell >
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
                                                                    backgroundColor: "#DC3545",   // green bg
                                                                    color: "#fff",                // icon becomes white
                                                                    border: "1px solid #DC3545"
                                                                }
                                                            }}
                                                        >
                                                            <ThumbUpIcon sx={{ fontSize: 19 }}
                                                                onClick={() => {

                                                                    const percentage = Number(
                                                                        row?.WorkDetails?.Tktwrk_Percentage || 0
                                                                    );

                                                                    // CHECK PERCENTAGE
                                                                    if (percentage < 100) {

                                                                        setDialogMessage(
                                                                            "You can't finish this work. The Percentage must be 100%."
                                                                        );
                                                                        setOpenDialog(true);
                                                                        return;
                                                                    }

                                                                    // CHECK ALL WORK ITEMS COMPLETED
                                                                    const hasIncompleteItems = row?.WorkItems?.some(
                                                                        item => Number(item?.Tkt_Progress) !== 3
                                                                    );

                                                                    if (hasIncompleteItems) {
                                                                        setDialogMessage("Unable to Complete Work.\n\nPlease ensure all sub work are Completed");
                                                                        setOpenDialog(true);
                                                                        return;
                                                                    }

                                                                    // OPEN CONFIRM DIALOG
                                                                    setCompleteRow(row);
                                                                    setOpenCompleteDialog(true);
                                                                }}
                                                            />

                                                        </Button>
                                                    </TableCell> */}

                                                            <TableCell >
                                                                <Button
                                                                    variant="contained"
                                                                    onClick={() => {
                                                                        setPrintRow(row.TicketNo);
                                                                        setOpenPrintDialog(true);
                                                                    }}
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
                                                                            backgroundColor: "#DC3545",   // green bg
                                                                            color: "#fff",                // icon becomes white
                                                                            border: "1px solid #DC3545"
                                                                        }
                                                                    }}>
                                                                    <VisibilityIcon sx={{ fontSize: 19 }}
                                                                    />
                                                                </Button>
                                                            </TableCell>
                                                        </>
                                                    )}
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>

                                </Table>

                            </TableContainer>

                            {/* PAGINATION */}
                            {getData.length > 50 && (

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        mt: 2,
                                        mb: 1,
                                    }}
                                >

                                    <Pagination
                                        count={Math.ceil(getData.length / rowsPerPage)}
                                        page={currentPage}
                                        onChange={(event, page) => setCurrentPage(page)}
                                        shape="rounded"
                                        siblingCount={2}
                                        boundaryCount={1}
                                        sx={{
                                            '& .MuiPaginationItem-root.Mui-selected': {
                                                backgroundColor: '#DC3545',
                                                color: '#fff',
                                            },
                                            '& .MuiPaginationItem-root.Mui-selected:hover': {
                                                backgroundColor: '#c82333',
                                            },
                                        }}
                                    />

                                </Box>

                            )}


                        </Grid>
                    </Grid>

                </CardContent>
            </Card>

            <DetailsModal
                visible1={visible1}
                setVisible1={setVisible1}
                selectedRow={selectedRow}
                details={details}
                setDetails={setDetails}
                statusPer={statusPer}
                setStatusPer={setStatusPer}
                percentage={percentage}
                setPercentage={setPercentage}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                handleSave={handleSave}
                resetmodal={resetmodal}
                detailsInputRef={detailsInputRef}
                percentageInputRef={percentageInputRef}
                setSelectedRow={setSelectedRow}
                activeWork={activeWork}
                setActiveWork={setActiveWork}
                isAllCompleted={isAllCompleted}

            />

            <TransferModal
                visible2={visible2}
                setVisible2={setVisible2}
                selectedRow={selectedRow}
                transferDept={transferDept}
                setTransferDept={setTransferDept}
                transferStaff={transferStaff}
                setTransferStaff={setTransferStaff}
                allDept={allDept}
                allStaff={allStaff}
                transferDetails={transferDetails}
                setTransferDetails={setTransferDetails}
                setTransferRow={setTransferRow}
                transferRow={transferRow}
                handleTransfer={handleTransfer}
                resetTransModal={resetTransModal}
                transStaffInputRef={transStaffInputRef}
                transDeptinputref={transDeptinputref}
                detailsInputRef={detailsInputRef}
                empId={empId}

            />

            <NewTicket
                visible={openTicketModal}
                setVisible={setOpenTicketModal}
                selectedRow={selectedRow}

            />

            {/* ------------------------------------------------------------- */}

            <Dialog
                open={confirmDeleteTicketOpen}
                onClose={handleConfirmDeleteTicketNo}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        px: 1,
                        py: 1,
                    }
                }}
            >
                <DialogContent>
                    Are you sure you want to delete this ticket?
                </DialogContent>

                <DialogActions sx={{ mt: -1 }}>
                    <Button onClick={handleConfirmDeleteTicketNo} sx={{ textTransform: 'none' }}>
                        No
                    </Button>

                    <Button
                        onClick={handleConfirmDeleteYes}
                        color="error"
                        variant="contained"
                        sx={{ textTransform: 'none' }}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ------------------------------------------------------------- */}
            <Dialog
                open={openDialog && Boolean(dialogMessage)}
                onClose={handleClose}
                disableRestoreFocus
                TransitionProps={{
                    onExited: () => {

                        setDialogMessage("");

                        if (focusField === "percentage") {
                            percentageInputRef.current?.focus();
                        }
                        else if (focusField === "details") {
                            detailsInputRef.current?.focus();
                        }
                        else if (focusField === "staff") {
                            transStaffInputRef.current?.focus();
                        }
                        else if (focusField === "department") {
                            transDeptinputref.current?.focus();
                        }

                        setFocusField("");
                    }
                }}
            >
                <DialogContent sx={{ py: 2 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 500
                            }}
                        >
                            {dialogMessage}
                        </Typography>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 2, pb: 2 }}>
                    <Button
                        onClick={() => setOpenDialog(false)}
                        variant="contained"
                        size="small"
                        sx={{
                            textTransform: 'none',
                            backgroundColor: '#DC3545',
                            borderRadius: 1.5,
                            px: 2,
                            '&:hover': {
                                backgroundColor: '#DC3545'
                            }
                        }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ------------------------------------------------------------- */}

            <Dialog
                open={openCompleteDialog}
                onClose={handleCloseCompleteDialog}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        px: 1,
                        py: 1,
                    }
                }}
            >
                <DialogContent>
                    Are you sure you want to complete this ticket?
                </DialogContent>

                <DialogActions sx={{ mt: -1 }}>
                    <Button onClick={handleCloseCompleteDialog} sx={{ textTransform: 'none' }}>
                        No
                    </Button>

                    <Button
                        onClick={handleConfirmComplete}
                        color="error"
                        variant="contained"
                        sx={{ textTransform: 'none' }}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>


            {/* ------------------------------------------------------------- */}

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
                    Are you sure you want to Print?
                </DialogContent>

                <DialogActions sx={{ mt: -1 }}>
                    <Button onClick={handleClosePrintDialog} sx={{ textTransform: 'none' }}>
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

            <ToastContainer autoClose={1000} hideProgressBar={true} position='top-center' theme='colored' transition={Bounce} />



        </div>
    )
}

export default CurrentWorkList
