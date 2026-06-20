import React, { useEffect, useRef, useState } from 'react'
import { Card, Paper, CardContent, Checkbox, FormControlLabel, FormControl, Select, Grid, Radio, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, TableBody, Button, Box, Tooltip, Chip, MenuItem, CircularProgress } from '@mui/material'
import NewTicket from './NewTicket';
import axiosInstance from '../../../axios';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

} from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Popover } from '@mui/material';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import getReduxState from '../../../ReduxState';
import { useLocation, useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { useAsyncLock } from '../../../UseAsyncLock';

function TicketList() {

    const { branch, empId, name, deptid, role, SuperAdmin, dept } = getReduxState()

    const navigate = useNavigate();

    const [visible, setVisible] = useState(false) // New ticket
    const [visibleUpt, setVisibleUpt] = useState(false) //Update

    const [dateTime, setDateTime] = useState('');
    const [ticketNo, setTicketNo] = useState('')

    const [allProducts, setAllProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [productSearch, setProductSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');

    const [allCustomers, setAllCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [searchValue, setSearchValue] = useState('');
    const [SearchBy, setSearchBy] = useState('RegName');

    const [customerDetails, setCustomerDetails] = useState(null);
    const [customerName, setCustomerName] = useState('');

    const [allServeType, setServeType] = useState([]);
    const [selectedServeType, setSelectedServeType] = useState('');

    const [allDept, setAllDept] = useState([]);
    const [selectedDept, setSelectedDept] = useState('');
    const [listDept, setListDept] = useState("All");

    const [rows, setRows] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    const [work, setWork] = useState('');
    const [details, setDetails] = useState('');
    const [priority, setPriority] = useState('High');
    const [contactedPerson, setContactedPerson] = useState('');
    const [contactedPersonNo, setContactedPersonNo] = useState('');
    const [description, setDescription] = useState('')

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingEdit, setPendingEdit] = useState(null);

    const [allStaff, setAllStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState([]);
    const [selectedStaffKey, setSelectedStaffKey] = useState([]);

    const [editingTicket, setEditingTicket] = useState(null);

    // delete row in new ticket
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [pendingDeleteRow, setPendingDeleteRow] = useState(null);
    const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);

    // delete row in ticket list
    const [confirmDeleteTicketOpen, setConfirmDeleteTicketOpen] = useState(false);
    const [pendingDeleteTicketRow, setPendingDeleteTicketRow] = useState(null);

    const [listSearchBy, setListSearchBy] = useState('Customer');
    const [listSearchValue, setListSearchValue] = useState('');
    const [listPriority, setListPriority] = useState('All');
    const [selectedStaffSearch, setSelectedStaffSearch] = useState("");

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    const [createdByName, setCreatedByName] = useState('');
    const [wrkThrgh, setWrkThrgh] = useState('')

    const [confirmWorkOpen, setConfirmWorkOpen] = useState(false);
    const [pendingWorkRow, setPendingWorkRow] = useState(null);

    const [loading, setLoading] = useState(false);

    const [deleteReason, setDeleteReason] = useState('');
    const [openDeleteReasonDialog, setOpenDeleteReasonDialog] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);

    const [fullData, setfullData] = useState([])

    const [note, setNote] = useState('')
    const [pendingUpdateIndex, setPendingUpdateIndex] = useState(null);
    const [logReason, setLogReason] = useState('');

    const [status, setStatus] = useState(1);
    const [userInfo, setUserInfo] = useState(null);

    const [supportType, setSupportType] = useState('');
    const [works, setWorks] = useState([])

    const [isPayableService, setIsPayableService] = useState(false);
    const [payableNote, setPayableNote] = useState('');

    const [isVerified, setisVerified] = useState(0)
    const [amcInfo, setAmcInfo] = useState({
        from: null,
        to: null
    });

    const [withLock, isSaving] = useAsyncLock();

    const [focusField, setFocusField] = useState("");

    const [openEditReasonDialog, setOpenEditReasonDialog] = useState(false);
    const DescrInputRef = useRef(null)
    const WrkTitleInputRef = useRef(null)
    const WrkDetailsInputRef = useRef(null)
    const contactedPersonInputRef = useRef(null)
    const DeleteReasonInputRef = useRef(null)
    const EditReasonInputRef = useRef(null)

    const location = useLocation();

    // Close dialog box and focus field if needed
    const handleClose = () => {
        setOpenDialog(false);

        // setTimeout(() => {
        //     if (dialogMessage === "Please Enter Description") {
        //         DescrInputRef.current?.focus();
        //     } else if (dialogMessage === "Please Enter Work Title") {
        //         WrkTitleInputRef.current?.focus();
        //     } else if (dialogMessage === "Please Enter Work Details") {
        //         WrkDetailsInputRef.current?.focus();
        //     } else if (dialogMessage === "Please Enter Contacted Person") {
        //         contactedPersonInputRef.current?.focus();
        //     } else if (dialogMessage === "Please Enter Delete Reason") {
        //         DeleteReasonInputRef.current?.focus();
        //     } else if (dialogMessage === "Please Enter Edit Reason") {
        //         EditReasonInputRef.current?.focus();
        //     }
        //     // Clear dialog state after focusing
        //     setDialogMessage("");
        // }, 100);
    };

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

    // Fetch Customer Name
    const fetchAllDetails = async () => {
        try {
            const fetchResponse = await axiosInstance.get(`/AccountHeadsAPI/GetAll`)

            if (fetchResponse.data && fetchResponse.data.ahmst) {
                const cleanedCustomers = fetchResponse.data.ahmst.map((item) => ({
                    ...item,
                    AhMst_pName: item.AhMst_pName?.trim() || "",
                    AhMst_DisplayName: item.AhMst_DisplayName?.trim() || "",
                }));

                const sortedCustomers = cleanedCustomers.sort((a, b) => {
                    const valueA =
                        SearchBy === "DispName"
                            ? a.AhMst_DisplayName
                            : a.AhMst_pName;

                    const valueB =
                        SearchBy === "DispName"
                            ? b.AhMst_DisplayName
                            : b.AhMst_pName;

                    return valueA.localeCompare(valueB, undefined, {
                        sensitivity: "base",
                    });
                });

                setAllCustomers(sortedCustomers);


            }
        } catch (error) {
            console.log("error while fetching all data", error)
        }
    }


    useEffect(() => {
        if (!name) return;

        setCreatedByName(name);
        setSelectedDept(deptid);
    }, [name, deptid]);


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

    // Fetch ServeCustType
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

    const fetchWork = async () => {
        try {
            const fetchWorkResponse = await axiosInstance.get(`servicesolutions`)
            //    console.log('response', fetchWorkResponse);
            if (fetchWorkResponse.data && fetchWorkResponse.data.data) {
                setWorks(fetchWorkResponse.data.data);
            }
        } catch (err) {
            console.error('Error fetching', err)
        }
    }


    // Date Time
    useEffect(() => {
        if (!visible) return;

        const updateTime = () => {
            const now = new Date();

            const day = String(now.getDate()).padStart(2, "0");
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = months[now.getMonth()];
            const year = now.getFullYear();

            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, "0");

            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12 || 12;

            setDateTime(`${day}-${month}-${year} ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`);
        };

        updateTime(); // initial call

        const interval = setInterval(updateTime, 1000); // every second

        return () => clearInterval(interval);
    }, [visible]);


    // fetch customer data by key
    const fetchCustomerByKey = async (key) => {
        try {
            const res = await axiosInstance.get(
                `/CustomerAPI/GetData?AhmstKey=${key}`
            );

            console.log("resp", res)

            const data = res.data.getUsrdet;

            // store only name
            setCustomerName(data?.AhMst_pName || '');
            setAllProducts(res?.data?.Productlist || []);

            // support type
            setSupportType(data?.AhMst_SupportType || '');

            setisVerified(Number(data?.AhMst_Verified || 0));

            setAmcInfo({
                from: data?.AhMst_CurAMCfrm,
                to: data?.AhMst_CurAMCTo
            });

        } catch (err) {
            console.log(err);
        }
    };

    const parseAMCDate = (str) => {
        const cleaned = str
            .replace(/\s+/g, " ")
            .replace(/(\d)(AM|PM)/, "$1 $2");

        return new Date(cleaned);
    };

    const checkAMCExpired = () => {
        if (!amcInfo?.to) return false;

        const amcTo = parseAMCDate(amcInfo.to);

        return !isNaN(amcTo) && new Date() > amcTo;
    };
    useEffect(() => {
        if (allServeType?.length > 0 && !editingTicket) {

            const normalSupport = allServeType.find(
                item => item.desc?.trim() === "NORMAL SUPPORT"
            );

            if (normalSupport) {
                setSelectedServeType(normalSupport.mstr_key);
            }
        }
    }, [allServeType]);

    // Filter Data
    useEffect(() => {
        const input = searchValue?.toLowerCase().trim() || '';

        const filtered = allCustomers.filter((item) => {
            const value =
                SearchBy === 'RegName'
                    ? item.AhMst_pName
                    : item.AhMst_DisplayName;

            // remove empty / null / whitespace
            if (!value || !value.trim()) return false;

            // apply search
            return value.toLowerCase().includes(input);
        });

        setFilteredCustomers(filtered);
    }, [searchValue, SearchBy, allCustomers]);

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

    useEffect(() => {
        fetchAllDetails()
        fetchServeType()
        fetchDepartment()
        fetchStaff()
        fetchLatestTicketNo()
        fetchWork()
    }, [])

    // Add Row(New Ticket)
    // const handleAdd = () => {

    //     if (!String(work).trim()) {
    //         setDialogMessage("Please Enter Work Title");
    //         setOpenDialog(true);
    //         return;
    //     }

    //     const newRow = {
    //         product: selectedProduct || '',
    //         work,
    //         details,
    //         priority
    //     };

    //     if (editIndex !== null) {
    //         //  UPDATE
    //         const updated = [...rows];
    //         updated[editIndex] = newRow;
    //         setRows(updated);
    //         setEditIndex(null);
    //     } else {
    //         //  ADD
    //         setRows(prev => [...prev, newRow]);
    //     }

    //     handleClearFields();
    // };

    const handleAdd = () => {

        if (!String(work).trim()) {
            setDialogMessage("Please Enter Work Title", "WorkTitle");
            setFocusField("WorkTitle")
            setOpenDialog(true);
            return;
        }

        if (editIndex !== null) {

            const updated = [...rows];

            updated[editIndex] = {
                ...updated[editIndex], // preserve TktItm_Key and other fields
                product: selectedProduct || '',
                work,
                details,
                priority
            };

            setRows(updated);
            setEditIndex(null);

        } else {

            const newRow = {
                TktItm_Key: '',
                product: selectedProduct || '',
                work,
                details,
                priority,
                progress: 1,
                latestStatus: '',
                userinfo: '',
                currentlyWorkig: false
            };

            setRows(prev => [...prev, newRow]);
        }

        handleClearFields();
    };

    const handleClearFields = () => {
        setSelectedProduct(null);
        setProductSearch('');
        setWork('');
        setDetails('');
        setPriority('High');
    };

    // Update Row(New Ticket)
    const handleEdit = (row, index) => {

        // prevent editing closed work
        if (row?.progress === 3) {
            setDialogMessage("The Work is Already Closed!")
            setOpenDialog(true)
            return;
        }

        setSelectedProduct(row.product);
        setWork(row.work);
        setDetails(row.details);
        setPriority(row.priority);

        setEditIndex(index);
    };

    const handleCloseModal = () => {
        setVisible(false);
        // navigate back to CurrentWorkList
        if (location.state?.fromCurrentWorkList) {
            navigate("/CurrentWrkList");
        }

        if (location.state?.fromRepotsDetails) {
            navigate("/overAllReports");
        }

        if (location.state?.fromTransferWorkList) {
            navigate("/TransferDetails");
        }

        if (location.state?.fromTagList) {
            navigate("/TagList");
        }

        if (location.state?.fromTotalWrkList) {
            navigate("/SortCusList");
        }
        if (location.state?.fromWrkStatus) {
            navigate("/WorkStatus");
        }
    };

    // Reset Table(New Ticket)
    const handleNew = () => {
        // customer section
        setSelectedCustomer(null);
        setSearchValue('');
        setCustomerName('');
        setAllProducts([]);

        setSelectedProduct(null);
        setProductSearch('');
        setWork('');
        setDetails('');
        setPriority('High');
        setContactedPerson('')
        setContactedPersonNo('')
        setAmcInfo({
            from: null,
            to: null
        })

        // RESET TO NORMAL SUPPORT
        const normalSupport = allServeType.find(
            item => item.desc?.trim() === "NORMAL SUPPORT"
        );

        setSelectedServeType(normalSupport?.mstr_key || '');
        setDescription('')

        setRows([]);
        setEditIndex(null);
        setEditingTicket(null)

        setPendingEdit(null);
        setConfirmOpen(false);
        fetchLatestTicketNo()

        setSelectedStaff([])
        setSelectedStaffKey([])

        setWrkThrgh('')
        setSupportType('')
        setPayableNote('')
        setIsPayableService(false)
        setSearchBy('RegName')
        setisVerified(0)
    };

    // Update TicketList
    const handleEditTicket = async (row) => {
        try {
            const res = await axiosInstance.get(
                `/TicketAPI/GetTicket?ticketNo=${row.ticketno || row.TicketNo || row.Tkt_No}`
            );

            const fullData = res.data;

            setEditingTicket(fullData);  //  full API response
            setVisible(true);

        } catch (err) {
            console.log("Error fetching ticket", err);
        }
    };

    // save Status
    const handleSaveNote = ({ note, status }) => {
        if (pendingUpdateIndex == null) return;

        const currentItem =
            editingTicket;

        //     console.log("currentItem", currentItem)

        // if trying to close
        if (Number(status) === 3) {

            const currentStatus =
                currentItem?.TicketStatus || "";

            const currentPercentage =
                Number(editingTicket?.Percentage || 0);

            if (
                currentStatus.toLowerCase() !== "paused" ||
                currentPercentage !== 100
            ) {

                setDialogMessage(
                    "Before closing work, Ticket Status must be Paused and Percentage must be 100%"
                );

                setOpenDialog(true);
                return;
            }
        }

        const prevRow = rows[pendingUpdateIndex];

        const changed =
            (prevRow.latestStatus || "") !== (note || "") ||
            prevRow.progress !== status;

        const updatedRows = [...rows];

        if (updatedRows[pendingUpdateIndex]?.progress === 3) {
            setDialogMessage("This work is already closed!!!");
            setOpenDialog(true)
            return;
        }

        updatedRows[pendingUpdateIndex] = {
            ...prevRow,
            latestStatus: note,
            progress: status,

            // THIS IS IMPORTANT
            userinfo: changed
                ? `${name} ${dateTime}`
                : prevRow.userinfo
        };

        setRows(updatedRows);
        setPendingUpdateIndex(null);
    };

    const PRIORITY_RANK = {
        High: 3,
        Medium: 2,
        Low: 1
    };

    const getFinalPriority = (rows) => {
        if (!rows || rows.length === 0) return "Low";

        // normalize
        const priorities = rows.map(r => r.priority || "Low");

        // count frequency
        const freq = {};
        priorities.forEach(p => {
            freq[p] = (freq[p] || 0) + 1;
        });

        // find max frequency
        const maxCount = Math.max(...Object.values(freq));

        // get candidates with max frequency
        const candidates = Object.keys(freq).filter(p => freq[p] === maxCount);

        // if only one → return it
        if (candidates.length === 1) return candidates[0];

        // if multiple → return highest priority
        return candidates.sort((a, b) => PRIORITY_RANK[b] - PRIORITY_RANK[a])[0];
    };

    // Save Ticket
    // const handleSaveTicket = () => {
    //     withLock(async () => {
    //         // if (!description) {
    //         //     setDialogMessage("Please Enter Description")
    //         //     setOpenDialog(true)
    //         //     return;
    //         // }

    //         if (rows.length === 0) {
    //             setDialogMessage("Please Add Atleast One Work Item");
    //             setOpenDialog(true);
    //             return;
    //         }

    //         if (dept === "Service") {

    //             if (!contactedPerson) {
    //                 setDialogMessage("Please Enter Contacted Person")
    //                 setOpenDialog(true)
    //                 return
    //             }
    //         }

    //         const isEdit = !!editingTicket;

    //         // 👇 block edit save first time
    //         if (isEdit && !logReason) {
    //             setPendingTicketPayload(true); // just a trigger flag
    //             setOpenEditReasonDialog(true);
    //             return;
    //         }


    //         const finalPriority = getFinalPriority(rows);

    //         const payload = {
    //             ActionFlag: editingTicket ? 2 : 1,
    //             TktKey: editingTicket?.TicketKey || "",
    //             TicketNo: ticketNo || '',
    //             CustomerName: customerName,
    //             CustomerId: selectedCustomer?.AhMst_Key || 0,
    //             WorkThroughId: 0,
    //             ContactedPerson: contactedPerson || '',
    //             ContactedNo: contactedPersonNo || '',
    //             DepartmentId: selectedDept || 0,
    //             CreatedBy: createdByName,
    //             CreatedById: empId,
    //             ServiceTypeId: selectedServeType || 0,
    //             Description: description || '',
    //             TagInput: selectedStaffKey || [],
    //             WorkThrough: wrkThrgh || '',
    //             TicketPriority: finalPriority || 'High',
    //             IsPayableServ: isPayableService,
    //             IsPayableServNote: payableNote,

    //             Items: rows.map(r => ({
    //                 TktItm_Key: r.TktItm_Key || '',
    //                 TktItm_PrdtId: r.product?.Prcode || 0,
    //                 TktItm_WrkTitle: r.work || '',
    //                 TktItm_WrkDetails: r.details || '',
    //                 TktItm_Priority: r.priority || "High",
    //                 Progress: r.progress || 1,
    //                 TktItm_CurrentlyWorking: r.currentlyWorkig || false,


    //                 LatestStatus: {
    //                     Status: r.latestStatus || "",
    //                     UsrInfo: r.userinfo || ""
    //                 }
    //             })),
    //             logUser: name,
    //             logDesc: editingTicket
    //                 ? `Updated Ticket Details: Ticket No: ${ticketNo}`
    //                 : `Created Ticket Details: New Ticket No: ${ticketNo}`,
    //             logReason: logReason || `Ticket Updated`,
    //             logForm: "Ticket List",
    //             logUserId: empId
    //         };

    //         console.log("payload", payload)

    //         try {
    //             const res = await axiosInstance.post("/TicketAPI/CreateTicket", payload);
    //             console.log("save response", res)
    //             const data = res.data;

    //             if (res?.data?.status === true) {
    //                 toast.success(
    //                     editingTicket
    //                         ? "Updated Successfully"
    //                         : "Saved Successfully"
    //                 );
    //                 await fetchFullData();
    //                 setVisible(false)
    //                 handleNew()
    //             } else {
    //                 toast.error(res?.data?.message || "Save failed");
    //             }
    //         } catch (err) {
    //             console.log("Save error:", err);
    //         }
    //     })
    // };


    const now = new Date();

    const formatted = now.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });


    const handleSaveTicket = () => {
        const isEdit = !!editingTicket;

        // 🔴 Block edit save until reason is provided
        if (isEdit && !logReason) {
            setOpenEditReasonDialog(true);
            return;
        }

        withLock(async () => {

            if (!description) {
                setDialogMessage("Please Enter Description")
                setOpenDialog(true)
                setFocusField("Description")
                return;
            }

            if (rows.length === 0) {
                setDialogMessage("Please Add Atleast One Work Item");
                setOpenDialog(true);
                return;
            }

            if (dept === "Service") {
                if (!contactedPerson) {
                    setDialogMessage("Please Enter Contacted Person", "Contacted");
                    setFocusField("Contacted")
                    setOpenDialog(true);
                    return;
                }
            }

            const finalPriority = getFinalPriority(rows);

            const payload = {
                ActionFlag: editingTicket ? 2 : 1,
                TktKey: editingTicket?.TicketKey || "",
                TicketNo: ticketNo || '',
                CustomerName: customerName,
                CustomerId: selectedCustomer?.AhMst_Key || 0,
                WorkThroughId: 0,
                ContactedPerson: contactedPerson || '',
                ContactedNo: contactedPersonNo || '',
                DepartmentId: selectedDept || 0,
                CreatedBy: createdByName,
                CreatedById: empId,
                ServiceTypeId: selectedServeType || 0,
                Description: description || '',
                TagInput: selectedStaffKey || [],
                WorkThrough: wrkThrgh || '',
                TicketPriority: finalPriority || 'High',
                IsPayableServ: isPayableService,
                IsPayableServNote: payableNote,
                UpdateDate: formatted,

                Items: rows.map(r => ({
                    TktItm_Key: r.TktItm_Key || '',
                    TktItm_PrdtId: r.product?.Prcode || 0,
                    TktItm_WrkTitle: r.work || '',
                    TktItm_WrkDetails: r.details || '',
                    TktItm_Priority: r.priority || "High",
                    Progress: r.progress || 1,
                    TktItm_CurrentlyWorking: r.currentlyWorkig || false,

                    LatestStatus: {
                        Status: r.latestStatus || "",
                        UsrInfo: r.userinfo || ""
                    }
                })),

                logUser: name,
                logDesc: editingTicket
                    ? `Updated Ticket Details: Ticket No: ${ticketNo}`
                    : `Created Ticket Details: New Ticket No: ${ticketNo}`,

                logReason: logReason || `Ticket Created`,
                logForm: "Ticket List",
                logUserId: empId
            };

            try {
                const res = await axiosInstance.post("/TicketAPI/CreateTicket", payload);

                if (res?.data?.status === true) {
                    toast.success(
                        editingTicket
                            ? "Updated Successfully"
                            : "Saved Successfully"
                    );

                    await fetchFullData();
                    setVisible(false);
                    handleNew();
                    setLogReason(''); // reset after save
                } else {
                    toast.error(res?.data?.message || "Save failed");
                }

            } catch (err) {
                console.log("Save error:", err);
            }
        });
    };

    console.log("editiing", editingTicket)

    useEffect(() => {
        if (!editingTicket) return;

        const init = async () => {
            //  FIRST load products for that customer
            if (editingTicket.CustomerId) {
                await fetchCustomerByKey(editingTicket.CustomerId);
            }

            // THEN map everything
            setCustomerName(editingTicket.CustomerName || '');
            setContactedPerson(editingTicket.ContactedPerson || '');
            setContactedPersonNo(editingTicket.ContactedNo || '');
            setDescription(editingTicket.Description || '')
            setTicketNo(editingTicket.TicketNo);
            setIsPayableService(editingTicket.IsPayableServ || false);
            setPayableNote(editingTicket.IsPayableServNote || '');

            setSelectedDept(editingTicket.DepartmentId || '');
            setSelectedServeType(editingTicket.ServiceTypeId || '');
            setWrkThrgh(editingTicket.WorkThrough || '')

            const customerObj = allCustomers.find(
                c => c.AhMst_Key === editingTicket.CustomerId
            );
            setSelectedCustomer(customerObj || null);

            // TAGS
            const tagKeys = editingTicket.TagInput
                ? editingTicket.TagInput.split(',').map(Number)
                : [];

            setSelectedStaffKey(tagKeys);

            const staffNames = allStaff
                .filter(s => tagKeys.includes(s.ahmst_key))
                .map(s => s.ahmst_pname);

            setSelectedStaff(staffNames);

            const createdStaff = allStaff.find(
                s => s.ahmst_key === editingTicket.CreatedById
            );

            setCreatedByName(createdStaff?.ahmst_pname || '');

            // WORK ITEMS
            const mappedRows = (editingTicket.WorkItems || []).map(item => {
                const productObj = allProducts.find(
                    p => p.Prcode === item.TktItm_PrdtId
                );
                console.log("productObj", productObj)

                return {
                    TktItm_Key: item.TktItm_Key || item.TktItm_key,
                    product: productObj || {
                        Prcode: item.Prcode || item.TktItm_PrdtId,
                        Productname: item.TktItm_ProductName,
                        PrdAMCFrom: item.AMCDetails?.AMCFrom || null,
                        PrdAMCTo: item.AMCDetails?.AMCTo || null,

                    },
                    work: item.TktItm_WrkTitle || '',
                    details: item.TktItm_WrkDetails || '',
                    priority: item.TktItm_Priority || 'High',
                    latestStatus: item.LatestStatus?.Status,
                    progress: item.Progress,
                    userinfo: item.LatestStatus?.UsrInfo,
                    currentlyWorkig: item.TktItm_CurrentlyWorking,
                    statuskey: item.TktItm_StatusKey
                };

            });
            setRows(mappedRows);
        };

        init();

    }, [editingTicket]);


    console.log("rows", rows)

    useEffect(() => {
        //     console.log("location.state?.ticketData", location.state?.ticketData);
        const state = location.state;

        if (
            state?.ticketData &&
            (
                state?.openEdit ||
                state?.openReportsEdit ||
                state?.opentransEdit ||
                state?.openTagEdit ||
                state?.openTotalWrkList ||
                state?.openWrkStatusEdit
            )
        ) {
            setVisible(true);
            handleEditTicket(state.ticketData);
        }

    }, [location.state]);

    const handleConfirmDeleteYes = () => {
        setConfirmDeleteTicketOpen(false);

        const isSameUser =
            Number(pendingDeleteTicketRow?.createdby_id) === Number(empId);
        console.log("isSameUser", isSameUser)

        //  check redux SuperAdmin value
        const isSuperAdmin = SuperAdmin === true;


        const isAdmin = role === "Administrator";
        const isHOD = role === "HOD";

        const canDelete =
            isSuperAdmin ||
            isAdmin ||
            isHOD ||
            isSameUser;

        console.log("canDelete", canDelete)

        if (canDelete) {
            setOpenDeleteReasonDialog(true);
        } else {
            setDialogMessage(
                "You are not allowed to Delete this Ticket"
            );
            setOpenDialog(true);
        }
    };

    // Delete Row Validation(Contatct Table)
    const handleConfirmDeleteYesRow = () => {
        if (pendingDeleteIndex !== null) {
            const updated = rows.filter((_, i) => i !== pendingDeleteIndex);
            setRows(updated);
        }

        setConfirmDeleteOpen(false);
        setPendingDeleteRow(null);
        setPendingDeleteIndex(null);
    };

    const handleConfirmDeleteNo = () => {
        setConfirmDeleteOpen(false);
        setPendingDeleteRow(null);
        setPendingDeleteIndex(null);
    };

    //Fetch Full TickeLiist API
    const fetchFullData = async () => {
        const finalDeptId =
            role === "Administrator"
                ? (listDept === "All" ? 0 : listDept)
                : deptid;

        const finalStaffId =
            role === "Administrator"
                ? (selectedStaff === "All" ? 0 : selectedStaff)
                : empId;

        setLoading(true);

        try {

            const apiurl = `TicketListAPI?userGroup=${role}&deptId=${finalDeptId}`
            //  console.log("apiurl", apiurl)

            const res = await axiosInstance.get(apiurl)
            // console.log("res", res)

            if (res.data?.TktList) {

                // Show only records where IsCancelled is false
                const filteredData = res.data.TktList.filter(
                    item => item.IsCancelled === false
                );

                setfullData(filteredData);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!role || !deptid) return;

        fetchFullData();
    }, [deptid, role, listDept]);

    const filteredStaff =
        listDept === "All"
            ? allStaff
            : allStaff.filter(
                (staff) => Number(staff.Dept_id) === Number(listDept)
            );

    // filter data
    // const filteredRows = fullData.filter(row => {
    //     //  search filter
    //     let matchesSearch = true;

    //     if (listSearchValue.trim()) {
    //         const search = listSearchValue.toLowerCase();

    //         if (listSearchBy === 'Customer') {
    //             matchesSearch = row.customer?.toLowerCase().includes(search);
    //         } else if (listSearchBy === 'Description') {
    //             matchesSearch = row.description?.toLowerCase().includes(search);
    //         }
    //     }

    //     //  priority filter
    //     let matchesPriority = true;

    //     if (listPriority !== 'All') {
    //         matchesPriority = row.priority === listPriority;
    //     }

    //     return matchesSearch && matchesPriority;
    // });

    const filteredRows = fullData.filter((row) => {
        let matchesSearch = true;

        if (listSearchBy === "Customer" && listSearchValue.trim()) {
            matchesSearch = row.customer
                ?.toLowerCase()
                .includes(listSearchValue.toLowerCase());
        }

        else if (listSearchBy === "Description" && listSearchValue.trim()) {
            matchesSearch = row.description
                ?.toLowerCase()
                .includes(listSearchValue.toLowerCase());
        }

        else if (
            listSearchBy === "Staff" &&
            selectedStaffSearch &&
            selectedStaffSearch !== "All"
        ) {
            matchesSearch = row.createdby
                ?.toLowerCase()
                .includes(selectedStaffSearch.toLowerCase());
        }

        let matchesPriority = true;

        if (listPriority !== "All") {
            matchesPriority = row.priority === listPriority;
        }

        return matchesSearch && matchesPriority;
    });

    // Delete Row Validation(New Ticket)
    const handleConfirmDeleteTicketNo = () => {
        setConfirmDeleteTicketOpen(false);
        setPendingDeleteTicketRow(null);
    };



    const handleDeleteWithReason = async () => {
        if (!deleteReason.trim()) {
            setDialogMessage("Please Enter Delete Reason", "deleteReason");
            setFocusField("deleteReason")
            setOpenDialog(true)
            return;
        }

        try {
            const requestData = {
                ticketno: pendingDeleteTicketRow.ticketno,
                logReason: deleteReason,
                logUser: name,
                logUserId: empId,
                logDesc: `Deleted Ticket No: ${pendingDeleteTicketRow.ticketno}`,
                logForm: "Ticket List"
            };

            const res = await axiosInstance.post(
                "/TicketListDeleteAPI",
                requestData
            );

            if (res?.data?.status) {
                toast.success("Deleted successfully");

                setOpenDeleteReasonDialog(false);
                setDeleteReason("");
                setPendingDeleteTicketRow(null);

                await fetchFullData();

            } else {
                toast.error(res?.data?.message || "Delete failed");
            }
        } catch (err) {
            console.log(err);
            toast.error("Error deleting ticket");
        }

        setOpenDeleteReasonDialog(false);
        setPendingDeleteTicketRow(null);
        setDeleteReason('');
    };


    const handleOpen = (event, row) => {
        if (!row?.subticket || row.subticket.length === 0) return; // ❌ prevent open

        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleCloseSub = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    const handleSubticketChange = (row, value) => {

        const updated = fullData.map((item) =>
            item.ticketno === row.ticketno
                ? {
                    ...item,
                    selectedSubticket: value
                }
                : item
        );

        setfullData(updated);
    };

    // Add to workList
    const handleAddToWorkList = async (row) => {
        if (!row) return;

        const logDesc = `Work Taken By TicketNo ${row.ticketno} Taken By ${createdByName} Ticket Details: Customer : ${row.customer} , Ticket Priority : ${row.priority}`;

        const requestData = {
            TktKey: row.tktKey,
            Emp_Id: empId,
            logReason: "Work Taken",
            logDesc: logDesc,
            logForm: "Ticket List",
            logUser: name,
            logUserId: empId
        };

        try {
            const response = await axiosInstance.post(
                "/WorkListAPI/UpdateWorklistTicket",
                requestData
            );

            if (response?.data?.status) {
                toast.success("Added to WorkList");
            } else {
                toast.error(response?.data?.message || "Failed");
            }
            handleNew()
            await fetchFullData()
        } catch (error) {
            console.log("Error while adding work list", error);
            toast.error("Error while adding to WorkList");
        }
    };

    const handleConfirmWorkYes = () => {
        if (pendingWorkRow) {
            handleAddToWorkList(pendingWorkRow);
        }
        setConfirmWorkOpen(false);
        setPendingWorkRow(null);
    };

    const handleConfirmWorkNo = () => {
        setConfirmWorkOpen(false);
        setPendingWorkRow(null);
    };

    useEffect(() => {
        if (role === "Administrator") {
            setListDept("All");
        } else {
            setListDept(deptid); // logged user's dept
        }
    }, [role, deptid]);


    const handleCloseEditReasonDialog = (event, reason) => {
        // prevent accidental close
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;

        // ❌ block closing if reason is empty
        if (!logReason.trim()) {
            return;
        }

        setOpenEditReasonDialog(false);
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
                Ticket List
            </Typography>

            <Card

                sx={{
                    marginTop: "1px",
                    // border: '1px solid',
                    height: {
                        xs: 'calc(100vh - -200px)',
                        sm: 'calc(100vh - 0px)',
                        md: 'calc(100vh - 0px)',
                        lg: 'calc(100vh - 5px)',
                        xl: 'calc(100vh - 8px)'
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
                                {/*  Show "All" only for Admin */}
                                {role === "Administrator" && (
                                    <MenuItem value="All">-- All --</MenuItem>
                                )}

                                {/*  If Admin → show all departments */}
                                {/*  If NOT Admin → show only logged user's dept */}
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
                                label="Search By"
                                size="small"
                                fullWidth
                                variant="outlined"
                                value={listSearchBy}
                                onChange={(e) => setListSearchBy(e.target.value)}
                                sx={{
                                    fontSize: '1rem',
                                    height: 40,
                                    //  select text styling
                                    '& .MuiSelect-select': {
                                        padding: '8px',
                                        fontSize: '0.95rem',
                                    },
                                    '& .MuiInputBase-input': {
                                        borderLeft: '5px solid #DC3545',
                                        paddingLeft: '12px',
                                        backgroundColor: 'var(--input-bg-color)',
                                        padding: '8px',
                                        fontSize: '0.95rem',
                                    },
                                    //  focus background
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        backgroundColor: 'var(--focus-bg-color)',
                                    },
                                }}
                            >
                                <MenuItem value="Customer">Customer</MenuItem>
                                <MenuItem value="Description">Description</MenuItem>
                                {(role === "Administrator" || role === "HOD") && (
                                    <MenuItem value="Staff">Staff</MenuItem>
                                )}

                            </TextField>
                        </Grid>


                        {/* <TextField
                                label={listSearchBy === "Customer" ? "Search By Customer Name" : "Search By Description"}
                                size="small"
                                fullWidth
                                value={listSearchValue}
                                onChange={(e) => setListSearchValue(e.target.value)}
                                variant="outlined"
                                sx={{
                                    fontSize: '1rem',
                                    height: 40,
                                    //  select text styling
                                    '& .MuiSelect-select': {
                                        padding: '8px',
                                        fontSize: '0.95rem',
                                    },
                                    '& .MuiInputBase-input': {
                                        borderLeft: '5px solid #DC3545',
                                        paddingLeft: '12px',
                                        backgroundColor: 'var(--input-bg-color)',
                                        padding: '8px',
                                        fontSize: '0.95rem',
                                    },
                                    //  focus background
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        backgroundColor: 'var(--focus-bg-color)',
                                    },
                                }}
                            /> */}

                        <Grid item xs={12} sm={4} md={4} lg={2.5} xl={3}>
                            {listSearchBy === "Staff" &&
                                (role === "Administrator" || role === "HOD") ? (
                                <TextField
                                    select
                                    label="Staff"
                                    size="small"
                                    fullWidth
                                    value={selectedStaffSearch}
                                    onChange={(e) => setSelectedStaffSearch(e.target.value)}
                                    sx={{
                                        fontSize: '1rem',
                                        height: 40,
                                        //  select text styling
                                        '& .MuiSelect-select': {
                                            padding: '8px',
                                            fontSize: '0.95rem',
                                        },
                                        '& .MuiInputBase-input': {
                                            borderLeft: '5px solid #DC3545',
                                            paddingLeft: '12px',
                                            backgroundColor: 'var(--input-bg-color)',
                                            padding: '8px',
                                            fontSize: '0.95rem',
                                        },
                                        //  focus background
                                        '& .MuiOutlinedInput-root.Mui-focused': {
                                            backgroundColor: 'var(--focus-bg-color)',
                                        },
                                    }}
                                >
                                    <MenuItem value="All">-- All --</MenuItem>

                                    {filteredStaff.map((staff) => (
                                        <MenuItem
                                            key={staff.ahmst_key}
                                            value={staff.ahmst_pname}
                                        >
                                            {staff.ahmst_pname}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            ) : (
                                <TextField
                                    label={
                                        listSearchBy === "Customer"
                                            ? "Search By Customer Name"
                                            : "Search By Description"
                                    }
                                    size="small"
                                    fullWidth
                                    sx={{
                                        fontSize: '1rem',
                                        height: 40,
                                        //  select text styling
                                        '& .MuiSelect-select': {
                                            padding: '8px',
                                            fontSize: '0.95rem',
                                        },
                                        '& .MuiInputBase-input': {
                                            borderLeft: '5px solid #DC3545',
                                            paddingLeft: '12px',
                                            backgroundColor: 'var(--input-bg-color)',
                                            padding: '8px',
                                            fontSize: '0.95rem',
                                        },
                                        //  focus background
                                        '& .MuiOutlinedInput-root.Mui-focused': {
                                            backgroundColor: 'var(--focus-bg-color)',
                                        },
                                    }}
                                    value={listSearchValue}
                                    onChange={(e) => setListSearchValue(e.target.value)}
                                />
                            )}
                        </Grid>

                        <Grid item xs={12} sm={4} md={4} lg={2.5} xl={2} >

                            <TextField
                                label="Priority"
                                size="small"
                                value={listPriority}
                                onChange={(e) => setListPriority(e.target.value)}
                                fullWidth
                                select
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
                                <MenuItem value="All">--All--</MenuItem>
                                <MenuItem value="High">High</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="Low">Low</MenuItem>


                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={4} md={4} lg={1} sx={{ mt: { md: "8px" }, ml: { md: "20px" }, }}>

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
                                    {filteredRows.length}
                                </Box>
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={4} md={3.7} lg={1.1} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                            <Button
                                fullWidth
                                sx={{
                                    textTransform: 'none',
                                    marginRight: 3,
                                    height: '32px',
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
                                onClick={() => setVisible(true)}
                            >
                                New
                            </Button>

                        </Grid>


                        <Grid item xs={12} sx={{ marginBottom: { xs: '40px', sm: '10px', md: '30px' } }}>

                            <TableContainer
                                component={Paper}
                                sx={{
                                    height: {
                                        xs: 'calc(100vh - 150px)',
                                        sm: 'calc(100vh - 190px)',
                                        md: 'calc(100vh - 170px)',
                                        lg: 'calc(100vh - 139px)',
                                        xl: 'calc(100vh - 148px)'
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
                                <Table striped sx={{ minWidth: 1000, tableLayout: 'fixed' }}>
                                    {/* Table Head */}
                                    <TableHead sx={{ position: 'sticky', zIndex: 1, top: 0, backgroundColor: 'var(--header-bg-color)' }}>

                                        <TableRow sx={{ height: '32px' }}>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}>SlNo</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>Ticket#</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '7.5%', fontWeight: 'bold' }}>DateTime</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5.5%', fontWeight: 'bold' }}>Customer</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>Priority</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '8%', fontWeight: 'bold' }}>Description</TableCell>
                                            {/* <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Details</TableCell> */}
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>Sub Ticket</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>CreatedBy</TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '2%', fontWeight: 'bold' }}></TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '2%', fontWeight: 'bold' }}></TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '6%', fontWeight: 'bold' }}></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={11} align="center">

                                                    <CircularProgress size={25} sx={{ color: "#DC3545" }} />
                                                </TableCell>
                                            </TableRow>
                                        ) : filteredRows.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={11} align="center">
                                                    No Tickets Available
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredRows.map((row, index) => (
                                                <TableRow key={index}
                                                    sx={{
                                                        height: "32px",
                                                        "&:hover": {
                                                            backgroundColor: "#fde2e5"
                                                        }
                                                    }}   >
                                                    <TableCell >{index + 1}</TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.ticketno} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.ticketno}</span>
                                                        </Tooltip></TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={formatDateTime(row.datetime)} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{formatDateTime(row.datetime)}</span>
                                                        </Tooltip></TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.customer} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.customer}</span>
                                                        </Tooltip></TableCell>

                                                    <TableCell>
                                                        <Chip
                                                            label={row.priority || "High"}
                                                            size="medium"
                                                            sx={{
                                                                width: 90,                //  fixed width
                                                                justifyContent: "center", //  center text
                                                                fontWeight: 600,
                                                                fontSize: '0.8rem',
                                                                height: 28,
                                                                borderRadius: '6px',

                                                                backgroundColor:
                                                                    row.priority === "High"
                                                                        ? "rgba(214, 54, 54, 0.12)"
                                                                        : row.priority === "Medium"
                                                                            ? "rgba(250, 173, 20, 0.12)"
                                                                            : "rgba(78, 202, 16, 0.12)",

                                                                color:
                                                                    row.priority === "High"
                                                                        ? "#cf1322"
                                                                        : row.priority === "Medium"
                                                                            ? "#d48806"
                                                                            : "#389e0d",

                                                                border:
                                                                    row.priority === "High"
                                                                        ? "1px solid #ef5350"
                                                                        : row.priority === "Medium"
                                                                            ? "1px solid #f9a825"
                                                                            : "1px solid #4caf50",

                                                                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                                                            }}
                                                        />
                                                    </TableCell>

                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.description} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.description}</span>
                                                        </Tooltip></TableCell>
                                                    <TableCell align="center" sx={{ minWidth: 180 }}>
                                                        <FormControl fullWidth size="small">
                                                            <Select
                                                                value={row.selectedSubticket || ""}
                                                                displayEmpty
                                                                disabled={!row.subticket || row.subticket.length === 0}
                                                                onChange={(e) =>
                                                                    handleSubticketChange(row, e.target.value)
                                                                }
                                                                IconComponent={KeyboardArrowDownIcon}
                                                                sx={{
                                                                    fontSize: 12,
                                                                    height: 32,
                                                                    borderRadius: "8px",
                                                                    background: "#fff",

                                                                    "&.Mui-disabled": {
                                                                        background: "#f5f5f5",
                                                                        cursor: "not-allowed"
                                                                    }
                                                                }}
                                                                renderValue={(selected) => {

                                                                    // no subticket
                                                                    if (!row.subticket || row.subticket.length === 0) {
                                                                        return;
                                                                    }

                                                                    // default text
                                                                    if (!selected) {
                                                                        return;
                                                                    }

                                                                    return selected;
                                                                }}
                                                            >
                                                                {row.subticket?.map((item, index) => (
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
                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Tooltip title={row.createdby} arrow placement="bottom">
                                                            <span style={{ textAlign: 'center' }}>{row.createdby}</span>
                                                        </Tooltip></TableCell>

                                                    <TableCell >
                                                        <Box
                                                            sx={{
                                                                height: '20px',
                                                                borderRadius: 1,
                                                                textAlign: 'center',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <img
                                                                src="https://cdn-icons-png.flaticon.com/128/10747/10747217.png"
                                                                style={{
                                                                    width: 24,
                                                                    height: 24,
                                                                    filter:
                                                                        "invert(24%) sepia(91%) saturate(7487%) hue-rotate(355deg) brightness(100%) contrast(105%)" // red cross
                                                                }}
                                                                onClick={() => handleEditTicket(row)}

                                                            />
                                                        </Box>
                                                    </TableCell>

                                                    <TableCell style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Box
                                                            sx={{
                                                                height: '20px',
                                                                borderRadius: 1,
                                                                textAlign: 'center',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <img
                                                                src="https://cdn-icons-png.flaticon.com/128/3964/3964013.png"
                                                                style={{
                                                                    width: 24,
                                                                    height: 24,
                                                                    filter:
                                                                        "invert(24%) sepia(91%) saturate(7487%) hue-rotate(355deg) brightness(100%) contrast(105%)" // red cross
                                                                }}
                                                                onClick={() => {
                                                                    setPendingDeleteTicketRow(row);
                                                                    setConfirmDeleteTicketOpen(true);
                                                                }}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button size="small"
                                                            fullWidth sx={{
                                                                textTransform: 'none',
                                                                marginRight: 1,

                                                                width: {
                                                                    xs: '100%',
                                                                    sm: "auto"
                                                                },
                                                                border: '#DC3545',
                                                                color: '#f5f7fa',
                                                                backgroundColor: '#DC3545',
                                                                '&:hover': {
                                                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                                                },
                                                            }}
                                                            variant="contained"
                                                            onClick={() => {
                                                                setPendingWorkRow(row);
                                                                setConfirmWorkOpen(true);
                                                            }}                                                        >
                                                            Add to WorkList
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>

                                </Table>

                            </TableContainer>

                        </Grid>


                    </Grid>

                </CardContent>
            </Card>

            <NewTicket
                visible={visible}
                setVisible={setVisible}

                dateTime={dateTime}
                setDateTime={setDateTime}
                allProducts={allProducts}
                setAllProducts={setAllProducts}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                productSearch={productSearch}
                setProductSearch={setProductSearch}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}

                allCustomers={allCustomers}
                setAllCustomers={setAllCustomers}
                filteredCustomers={filteredCustomers}
                setFilteredCustomers={setFilteredCustomers}
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}

                SearchBy={SearchBy}
                setSearchBy={setSearchBy}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                allServeType={allServeType}
                setServeType={setServeType}
                selectedServeType={selectedServeType}
                setSelectedServeType={setSelectedServeType}
                customerDetails={customerDetails}
                setCustomerDetails={setCustomerDetails}
                customerName={customerName}
                setCustomerName={setCustomerName}
                allDept={allDept}
                setAllDept={setAllDept}
                selectedDept={selectedDept}
                setSelectedDept={setSelectedDept}
                rows={rows}
                setRows={setRows}
                editIndex={editIndex}
                setEditIndex={setEditIndex}

                work={work}
                setWork={setWork}
                details={details}
                setDetails={setDetails}
                priority={priority}
                setPriority={setPriority}
                confirmOpen={confirmOpen}
                setConfirmOpen={setConfirmOpen}
                pendingEdit={pendingEdit}
                setPendingEdit={setPendingEdit}
                contactedPerson={contactedPerson}
                setContactedPerson={setContactedPerson}
                contactedPersonNo={contactedPersonNo}
                setContactedPersonNo={setContactedPersonNo}
                description={description}
                setDescription={setDescription}

                allStaff={allStaff}
                setAllStaff={setAllStaff}
                selectedStaff={selectedStaff}
                setSelectedStaff={setSelectedStaff}
                selectedStaffKey={selectedStaffKey}
                setSelectedStaffKey={setSelectedStaffKey}

                fetchAllDetails={fetchAllDetails}
                fetchStaff={fetchStaff}
                fetchServeType={fetchServeType}
                fetchDepartment={fetchDepartment}
                fetchCustomerByKey={fetchCustomerByKey}
                highlightText={highlightText}

                handleAdd={handleAdd}
                handleClearFields={handleClearFields}
                handleEdit={handleEdit}
                handleNew={handleNew}
                handleSaveTicket={handleSaveTicket}

                ticketNo={ticketNo}

                confirmDeleteOpen={confirmDeleteOpen}
                setConfirmDeleteOpen={setConfirmDeleteOpen}
                pendingDeleteRow={pendingDeleteRow}
                setPendingDeleteRow={setPendingDeleteRow}
                pendingDeleteIndex={pendingDeleteIndex}
                setPendingDeleteIndex={setPendingDeleteIndex}
                handleConfirmDeleteNo={handleConfirmDeleteNo}
                handleConfirmDeleteYesRow={handleConfirmDeleteYesRow}
                DescrInputRef={DescrInputRef}
                createdByName={createdByName}
                wrkThrgh={wrkThrgh}
                setWrkThrgh={setWrkThrgh}

                visibleUpt={visibleUpt}
                setVisibleUpt={setVisibleUpt}

                note={logReason}
                setNote={setLogReason}
                pendingUpdateIndex={pendingUpdateIndex}
                setPendingUpdateIndex={setPendingUpdateIndex}
                onSave={handleSaveNote}
                status={status}
                setStatus={setStatus}
                setTicketNo={setTicketNo}
                handleCloseModal={handleCloseModal}
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                WrkTitleInputRef={WrkTitleInputRef}
                WrkDetailsInputRef={WrkDetailsInputRef}
                name={name}
                setSelectedRow={setSelectedRow}
                editingTicket={editingTicket}

                supportType={supportType}
                setSupportType={setSupportType}
                works={works}
                formatDateTime={formatDateTime}
                contactedPersonInputRef={contactedPersonInputRef}

                isPayableService={isPayableService}
                setIsPayableService={setIsPayableService}
                payableNote={payableNote}
                setPayableNote={setPayableNote}

                isVerified={isVerified}
                checkAMCExpired={checkAMCExpired}
                amcInfo={amcInfo}
                isSaving={isSaving}
            />


            {/* ---------------------------------------------- */}
            <Dialog open={openDialog}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        px: 1,
                        py: 1,
                        //   minWidth: 300
                    }
                }}
                disableRestoreFocus
                TransitionProps={{
                    onExited: () => {

                        setDialogMessage("");

                        if (focusField === "Description") {
                            DescrInputRef.current?.focus();
                        }
                        else if (focusField === "WorkTitle") {
                            WrkTitleInputRef.current?.focus();
                        }
                        else if (focusField === "WorkDetails") {
                            WrkDetailsInputRef.current?.focus();
                        }
                        else if (focusField === "deleteReason") {
                            DeleteReasonInputRef.current?.focus();
                        }
                        else if (focusField === "Contacted") {
                            contactedPersonInputRef.current?.focus();
                        }
                        else if (focusField === "editreason") {
                            EditReasonInputRef.current?.focus();
                        }

                        setFocusField("");
                    }
                }}>
                <DialogContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* //  <WarningAmberIcon sx={{ color: '#f59e0b', fontSize: 22 }} /> */}
                        <Typography variant="body1" sx={{ fontWeight: 500 }}
                        >                {dialogMessage}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 2, pb: 1 }}>
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

            {/* ---------------------------------------------- */}

            <Dialog open={confirmDeleteTicketOpen} onClose={handleConfirmDeleteTicketNo}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        px: 1,
                        py: 1,
                    }
                }}>

                <DialogContent>
                    Are you sure you want to delete this ticket?
                </DialogContent>

                <DialogActions sx={{ mt: -1 }}>
                    <Button onClick={handleConfirmDeleteTicketNo} sx={{
                        textTransform: 'none',
                        //   fontSize: "0.8rem"
                    }}>No</Button>
                    <Button onClick={handleConfirmDeleteYes} color="error" variant="contained"
                        sx={{
                            textTransform: 'none',
                            //   fontSize: "0.8rem"
                        }}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ---------------------------------------------- */}

            <Dialog
                open={openDeleteReasonDialog}
                onClose={(event, reason) => {
                    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
                    handleConfirmDeleteTicketNo();
                }}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        py: 1.5,
                    }
                }}>

                <DialogContent sx={{ pt: 1 }}>
                    <TextField
                        placeholder="Enter reason for deletion..."
                        fullWidth
                        label="Reason"
                        multiline
                        rows={4}
                        value={deleteReason}
                        onChange={(e) => setDeleteReason(e.target.value)}
                        inputRef={DeleteReasonInputRef}
                        size="small"

                        InputLabelProps={{
                            sx: {
                                fontSize: "0.85rem",
                                lineHeight: 1,
                            }
                        }}

                        InputProps={{
                            sx: {
                                fontSize: "0.8rem",
                                lineHeight: 1.4,
                                padding: "8px 10px"
                            }
                        }}

                        sx={{
                            mt: 0.5,
                            width: '300px',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                            },
                            '& .MuiOutlinedInput-root.Mui-focused': {
                                backgroundColor: 'var(--focus-bg-color)',
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 1.5, pb: 1, mt: -2 }}>
                    <Button
                        onClick={() => setOpenDeleteReasonDialog(false)}
                        size="small"
                        sx={{
                            textTransform: 'none',
                            //   fontSize: "0.8rem"
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleDeleteWithReason}
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{
                            textTransform: 'none',
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ---------------------------------------------- */}

            <Dialog open={confirmWorkOpen} onClose={handleConfirmWorkNo}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        px: 1,
                        py: 1,
                    }
                }}>

                <DialogContent >
                    <Typography>
                        Do You Want To Add This WorkList?
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ px: 1.5, pb: 1, mt: -2 }}>
                    <Button onClick={handleConfirmWorkNo} sx={{
                        textTransform: 'none'
                    }}>
                        No
                    </Button>
                    <Button sx={{
                        height: '32px',
                        textTransform: 'none'
                    }}
                        onClick={handleConfirmWorkYes}
                        variant="contained"
                        color="error"
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ---------------------------------------------- */}


            <Dialog open={openEditReasonDialog} onClose={handleCloseEditReasonDialog}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        py: 1.5,
                    }
                }}
            >
                <DialogContent sx={{ pt: 1 }}>
                    {/* <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Reason for editing ticket"
                        value={logReason}
                        onChange={(e) => setLogReason(e.target.value)}
                        InputLabelProps={{
                            sx: {
                                fontSize: "0.85rem",
                                lineHeight: 1,
                            }
                        }}

                        InputProps={{
                            sx: {
                                fontSize: "0.8rem",
                                lineHeight: 1.4,
                                padding: "8px 10px"
                            }
                        }}

                        sx={{
                            mt: 0.5,
                            width: '300px',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                            },
                            '& .MuiOutlinedInput-root.Mui-focused': {
                                backgroundColor: 'var(--focus-bg-color)',
                            }
                        }}
                    /> */}

                    <TextField
                        fullWidth
                        multiline
                        required
                        // error={!logReason.trim()}
                        // helperText={!logReason.trim() ? "Reason is required" : ""}
                        rows={4}
                        label="Reason for Editing Ticket"
                        value={logReason}
                        onChange={(e) => setLogReason(e.target.value)}
                        inputRef={EditReasonInputRef}
                        InputLabelProps={{
                            sx: {
                                fontSize: "0.85rem",
                                lineHeight: 1,
                            }
                        }}
                        InputProps={{
                            sx: {
                                fontSize: "0.8rem",
                                lineHeight: 1.4,
                                padding: "8px 10px"
                            }
                        }}

                        sx={{
                            mt: 0.5,
                            width: '300px',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                            },
                            '& .MuiOutlinedInput-root.Mui-focused': {
                                backgroundColor: 'var(--focus-bg-color)',
                            }
                        }}
                    />
                </DialogContent>

                <DialogActions sx={{ px: 1.5, pb: 1, mt: -2 }}>
                    <Button
                        size="small"
                        onClick={() => {
                            setLogReason('');
                            setOpenEditReasonDialog(false);
                        }}
                        sx={{
                            textTransform: 'none',
                            //   fontSize: "0.8rem"
                        }}>
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        size="small"

                        onClick={() => {

                            if (!logReason.trim()) {
                                setDialogMessage("Please Enter Edit Reason", "editreason");
                                setFocusField("editreason")
                                setOpenDialog(true);
                                return;
                            }

                            setOpenEditReasonDialog(false);
                            handleSaveTicket();
                        }}
                        sx={{
                            textTransform: 'none',
                        }}
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer autoClose={1000} hideProgressBar={true} position='top-center' theme='colored' transition={Bounce} />


        </div>
    )
}

export default TicketList

