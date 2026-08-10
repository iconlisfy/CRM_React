import React, { useEffect, useRef, useState } from 'react'
import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import closebtn from '../../../assets/images/Saki-NuoveXT-Actions-button-cancel.ico'
import useModal from '../../../components/UseModal';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axiosInstance from '../../../axios';
import getReduxState from '../../../ReduxState';
import { format } from 'date-fns';
import { toast } from "react-toastify";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import ClearIcon from "@mui/icons-material/Clear";

function FollowUp({ openFollowupModal, setOpenFollowupModal, size = 'md', editLead = null, followUpId,
    editFollowUp = null
}) {

    const { modalClass } = useModal()

    const { role, deptid, name, empId, BrnchKey, dept, branch } = getReduxState()

    const [nextFollowUp, setNextFollowUp] = useState(false);
    const [followUpDateTime, setFollowUpDateTime] = useState(new Date());

    const [LeadSourceLoc, setLeadSourceLoc] = useState('')
    const [selectedLeadQuality, setSelectedLeadQuality] = useState('')
    const [selectedFollowUpSts, setSelectedFollowUpSts] = useState('')

    const [leadQualityList, setLeadQualityList] = useState([])
    const [demoStgList, setDemoStgList] = useState([])
    const [quotationStgList, setQuotationStgList] = useState([])
    const [custStgList, setCustStgList] = useState([])
    const [FollowUpStsList, setFollowUpStsList] = useState([])
    const [description, setDescription] = useState("");

    const [selectedDemoStg, setSelectedDemoStg] = useState('')
    const [selectedQuotationStg, setSelectedQuotatioStg] = useState('')
    const [selectedCustStg, setSelectedCustStg] = useState('')

    const [focusField, setFocusField] = useState("");
    const [validationDialogOpen, setValidationDialogOpen] = useState(false);
    const [validationMessage, setValidationMessage] = useState("");

    const follwupDate = followUpDateTime
        ? format(followUpDateTime, "yyyy-MM-dd HH:mm:ss")
        : null;

    const FollowupStsInputRef = useRef(null)
    const NextFollowupInputRef = useRef(null)
    const DescInputRef = useRef(null)
    const LeadQuaInputRef = useRef(null)

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

    //===== Fetch Masters Data =====
    const fetchMasters = async () => {
        try {

            const fetchLeadQuality = await axiosInstance.get(
                `MasterAPI/Search?Type=LeadQlty`
            );

            if (fetchLeadQuality.data?.MasterList) {
                setLeadQualityList(fetchLeadQuality.data.MasterList);
            }

            const fetchFollowUpStatus = await axiosInstance.get(
                `MasterAPI/Search?Type=FLUPSts`
            );

            if (fetchFollowUpStatus.data?.MasterList) {
                setFollowUpStsList(fetchFollowUpStatus.data.MasterList);
            }

            const fetchDemoStages = await axiosInstance.get(
                `MasterAPI/Search?Type=DemoStg`
            );

            if (fetchDemoStages.data?.MasterList) {
                setDemoStgList(fetchDemoStages.data.MasterList);
            }

            const fetchQuotationStages = await axiosInstance.get(
                `MasterAPI/Search?Type=QTNSts`
            );

            if (fetchQuotationStages.data?.MasterList) {
                setQuotationStgList(fetchQuotationStages.data.MasterList);
            }


            const fetchCustomerStages = await axiosInstance.get(
                `MasterAPI/Search?Type=CustDecSts`
            );

            if (fetchCustomerStages.data?.MasterList) {
                setCustStgList(fetchCustomerStages.data.MasterList);
            }



        } catch (error) {
            console.log("error while fetching all data", error);
        }
    };

    useEffect(() => {
        fetchMasters()
    }, [])

    const businessValue =
        (
            editLead?.Products?.reduce(
                (total, item) => total + (item.Quantity * item.Rate),
                0
            ) || 0
        ).toFixed(2);


    //=========== Reset Function =============
    const resetFollowUpForm = () => {
        setSelectedFollowUpSts("");
        setSelectedLeadQuality("");
        setDescription("");
        setNextFollowUp(false);
        setFollowUpDateTime(new Date());
        setLeadSourceLoc("");

        // Reset other fields if they are used later
        setSelectedDemoStg("");
        setSelectedQuotatioStg("");
        setSelectedCustStg("");

        // Reset validation state
        setValidationMessage("");
        setFocusField("");
        setValidationDialogOpen(false);
    };


    useEffect(() => {
        if (!editFollowUp) return;

        console.log("Loading FollowUp:", editFollowUp);

        setSelectedFollowUpSts(editFollowUp?.FollowUpStatusId ?? "");
        setSelectedLeadQuality(
            editFollowUp.FollowUpQualityId === 0
                ? ""
                : editFollowUp.FollowUpQualityId
        );
        setDescription(editFollowUp.FollowUpDescription ?? "");
        setLeadSourceLoc(editFollowUp.FollowUpLeadSourceLocation ?? "");
        setNextFollowUp(!!editFollowUp.FollowUp_IsRequired);

        setFollowUpDateTime(
            editFollowUp.NextFollowUp_Date
                ? new Date(editFollowUp.NextFollowUp_Date)
                : new Date()
        );
    }, [editFollowUp]);


    //========== Save Follow Up ============
    const handleSaveFollowUp = async () => {

        if (!selectedFollowUpSts) {
            setValidationMessage("Please select Follow Up Status");
            setFocusField("FollowupSts")
            setValidationDialogOpen(true)
            return;
        }

        // if (!selectedLeadQuality) {
        //     setValidationMessage("Please select Lead Quality");
        //     setFocusField("LeadQua")
        //     setValidationDialogOpen(true)
        //     return;
        // }

        // if (!description.trim()) {
        //     setValidationMessage("Please enter Follow Up Description");
        //     setFocusField("Desc")
        //     setValidationDialogOpen(true)
        //     return;
        // }

        // if (!nextFollowUp) {
        //     setValidationMessage("Please select Next Follow Up Date");
        //     setFocusField("NextFollowup")
        //     setValidationDialogOpen(true)
        //     return;
        // }

        // if (!LeadSourceLoc.trim()) {
        //     toast.error("Please enter Lead Source Location");
        //     return;
        // }


        try {

            const requestData = {
                IsEdit: !!editFollowUp,
                LeadCode: editLead?.LeadCode || editFollowUp?.LeadCode,

                // Only send FollowUp_Id while editing
                ...(editFollowUp?.FollowUp_Id
                    ? { FollowUp_Id: editFollowUp.FollowUp_Id }
                    : {}),

                FollowUp_Status: selectedFollowUpSts || "",
                FollowUp_Desc: description,
                FollowUp_Quality: selectedLeadQuality || '',
                NextFollowUp_Date: nextFollowUp
                    ? follwupDate
                    : '',
                FollowUp_IsRequired: nextFollowUp,
                FollowUp_LeadSrcLoc: LeadSourceLoc,
                logReason: "Follow Up",
                logDesc: `FollowUp added for LeadId:${editLead?.LeadCode || editFollowUp?.LeadCode} `,
                logForm: "FollowUp",
                logUser: name,
                logUserId: empId
            };

            console.log(requestData);

            const response = await axiosInstance.post(
                "/FollowUpAPI/FollowUpDetails",
                requestData
            );

            if (response.data) {
                toast.success
                    (editFollowUp ? "Follow Up Updated Successfully" :
                        "Follow Up Saved Successfully");
                setOpenFollowupModal(false);
                resetFollowUpForm();
            }
            resetFollowUpForm()
        } catch (error) {
            console.error("Error saving follow up:", error);
            toast.error("Failed to save follow up");
        }
    };


    return (
        <>

            <CModal
                size={size}
                backdrop='static'
                classmstName={`${modalClass} modal custom-modal-close custom-modal-width custom-centered-modal`}  // Concatenate class mstNames correctly
                alignment="center"
                visible={openFollowupModal}
                onClose={() => setOpenFollowupModal(false)}
                aria-labelledby="VerticallyCenteredExample">

                <CModalHeader
                    closeButton={false}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#3f5483',
                        color: '#fff',
                        padding: '2px 8px',
                        height: '32px',
                        minHeight: '32px',
                        lineHeight: '1',
                    }}>
                    <CModalTitle
                        id="VerticallyCenteredExample"
                        style={{
                            color: '#fff',
                            fontSize: '12.5px',
                            margin: 0,
                            lineHeight: '1',
                            padding: 0
                        }}>
                        Follow Up
                    </CModalTitle>

                    <button
                        onClick={() => setOpenFollowupModal(false)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                        <img
                            src={closebtn}
                            alt="Close"
                            width="22"
                            height="22"
                        />
                    </button>
                </CModalHeader>

                <CModalBody classmstName='c-modal-body no-scroll '
                    style={{
                        zoom: "0.8",
                        backgroundColor: "#f8fafc",
                        backgroundImage:
                            "linear-gradient(135deg, #f8fafc 0%, #eef4ff 50%, #dbeafe 100%)",
                    }}>

                    <Card sx={{
                        backgroundColor: 'transparent !important',
                        boxShadow: 'none',

                        border: '1px solid #d1d5db', // light gray border   // darker, more visible gray
                        borderRadius: 2,
                    }}>
                        <CardContent>
                            <Grid container spacing={1}>

                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            borderBottom: "1px solid #eee",
                                            pb: 1,
                                            mb: 1
                                        }}
                                    >
                                        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: "#243863" }}>
                                            Lead Id:
                                        </Typography>

                                        <Box
                                            sx={{
                                                fontWeight: 700,
                                                color: "#243863",
                                                backgroundColor: "#dde5f7",
                                                border: "1px solid #243863",
                                                px: 1.5,
                                                py: 0.3,
                                                borderRadius: "6px",
                                                fontSize: "14px"
                                            }}
                                        >
                                            {editLead?.LeadCode || editFollowUp?.LeadCode || "-"}
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            backgroundColor: "#dde5f7",
                                            border: "1px solid #243863",
                                            borderRadius: "8px",
                                            p: 1.5
                                        }}
                                    >
                                        <Grid container spacing={2}>

                                            <Grid item xs={12}>
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                    <Typography
                                                        sx={{
                                                            width: 140, // Same width for all labels
                                                            fontSize: "13px",
                                                            color: "#243863",
                                                            fontWeight: 600,
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        CUSTOMER NAME
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            width: 12,
                                                            textAlign: "center",
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        :
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            fontSize: "14px",
                                                            fontWeight: 600,
                                                            color: "#333",
                                                        }}
                                                    >
                                                        {editLead?.CustomerName || editFollowUp?.CustomerName || "-"}
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                    <Typography
                                                        sx={{
                                                            width: 140, // Same width
                                                            fontSize: "13px",
                                                            color: "#243863",
                                                            fontWeight: 600,
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        CUSTOMER PHNO
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            width: 12,
                                                            textAlign: "center",
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        :
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            fontSize: "14px",
                                                            fontWeight: 600,
                                                            color: "#333",
                                                        }}
                                                    >
                                                        {editLead?.CustomerPhone || editFollowUp?.CustomerPhno || "-"}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>


                                <Grid item xs={12}>
                                    <Autocomplete
                                        size="small"
                                        fullWidth
                                        options={FollowUpStsList?.filter(item => item?.desc?.trim()) || []}
                                        getOptionLabel={(option) => option?.desc?.trim() || ""}
                                        value={
                                            FollowUpStsList?.find(
                                                item => item.mstr_key === selectedFollowUpSts
                                            ) || null
                                        }
                                        onChange={(event, newValue) => {
                                            setSelectedFollowUpSts(newValue ? newValue.mstr_key : "");
                                        }}
                                        isOptionEqualToValue={(option, value) =>
                                            option.mstr_key === value.mstr_key
                                        }
                                        renderOption={(props, option, { inputValue }) => (
                                            <li {...props}>
                                                {highlightText(option.desc.trim(), inputValue)}
                                            </li>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Follow Up Status"
                                                inputRef={FollowupStsInputRef}
                                                sx={{
                                                    backgroundColor: '#fff',
                                                    '& input': {
                                                        padding: '8px',
                                                        fontSize: '0.95rem',
                                                        '&:focus': {
                                                            backgroundColor: 'var(--focus-bg-color)'
                                                        }
                                                    }
                                                }}
                                            />
                                        )}
                                        slotProps={{
                                            paper: {
                                                sx: {
                                                    // maxHeight: 250,
                                                    "& .MuiAutocomplete-option": {
                                                        // minHeight: "32px",
                                                        padding: "4px 12px",
                                                        fontSize: "0.9rem",
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} lg={6}>
                                    <TextField
                                        label="Lead Quality"
                                        type="text"
                                        size="small"
                                        fullWidth
                                        value={selectedLeadQuality}
                                        onChange={(e) => { setSelectedLeadQuality(e.target.value) }}
                                        select
                                        sx={{
                                            backgroundColor: '#fff',
                                            '& input': {
                                                padding: '8px',
                                                fontSize: '0.95rem',
                                                '&:focus': {
                                                    backgroundColor: 'var(--focus-bg-color)'
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            endAdornment: selectedLeadQuality && (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent menu from opening
                                                            setSelectedLeadQuality("");
                                                        }}
                                                    >
                                                        <ClearIcon fontSize="small" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    >

                                        {leadQualityList
                                            ?.filter(item => item?.desc?.trim()) // remove empty names
                                            .map((item) => (
                                                <MenuItem key={item.mstr_key} value={item.mstr_key}>
                                                    {item.desc.trim()}
                                                </MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </Grid>
                                {/* 

                                <Grid item xs={12} sm={6} lg={6}>
                                    <TextField
                                        label="Demo Stages"
                                        select
                                        size="small"
                                        fullWidth
                                        value={selectedDemoStg}
                                        onChange={(e) => setSelectedDemoStg(e.target.value)}
                                        sx={{
                                            backgroundColor: "#fff",
                                            "& input": {
                                                padding: "8px",
                                                fontSize: "0.95rem",
                                                "&:focus": {
                                                    backgroundColor: "var(--focus-bg-color)",
                                                },
                                            },
                                        }}
                                        InputProps={{
                                            endAdornment: selectedDemoStg && (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent menu from opening
                                                            setSelectedDemoStg("");
                                                        }}
                                                    >
                                                        <ClearIcon fontSize="small" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    >

                                        {demoStgList
                                            ?.filter((item) => item?.desc?.trim())
                                            .map((item) => (
                                                <MenuItem key={item.mstr_key} value={item.mstr_key}>
                                                    {item.desc.trim()}
                                                </MenuItem>
                                            ))}
                                    </TextField>
                                </Grid>


                                <Grid item xs={12} sm={6} lg={12}>
                                    <TextField
                                        label="Quotation / Commercial Stages"
                                        type="text"
                                        size="small"
                                        fullWidth
                                        value={selectedQuotationStg}
                                        onChange={(e) => { setSelectedQuotatioStg(e.target.value) }}
                                        select
                                        sx={{
                                            backgroundColor: '#fff',
                                            '& input': {
                                                padding: '8px',
                                                fontSize: '0.95rem',
                                                '&:focus': {
                                                    backgroundColor: 'var(--focus-bg-color)'
                                                }
                                            }
                                        }}

                                        InputProps={{
                                            endAdornment: selectedQuotationStg && (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent menu from opening
                                                            setSelectedQuotatioStg("");
                                                        }}
                                                    >
                                                        <ClearIcon fontSize="small" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    >
                                        {quotationStgList
                                            ?.filter(item => item?.desc?.trim()) // remove empty names
                                            .map((item) => (
                                                <MenuItem key={item.mstr_key} value={item.mstr_key}>
                                                    {item.desc.trim()}
                                                </MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </Grid> */}




                                <Grid item lg={6} xs={12} sm={6}>
                                    <TextField
                                        label="Bussiness Value"
                                        type="text"
                                        size="small"
                                        fullWidth
                                        value={businessValue}

                                        sx={{
                                            backgroundColor: '#fff',
                                            '& input': {
                                                padding: '8px',
                                                fontSize: '0.95rem',
                                                '&:focus': {
                                                    backgroundColor: 'var(--focus-bg-color)'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>

                                    <TextField
                                        label="Description"
                                        type="text"
                                        size="small"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        inputRef={DescInputRef}
                                        sx={{
                                            backgroundColor: '#fff',
                                            '& .MuiOutlinedInput-root.Mui-focused textarea': {
                                                backgroundColor: 'var(--focus-bg-color)',
                                            },
                                        }}
                                    />
                                </Grid>


                                {/* Followup & Date picker row */}
                                <Grid item xs={12} sm={6} md={6} display="flex" alignItems="center">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={nextFollowUp}
                                                onChange={(e) => setNextFollowUp(e.target.checked)}
                                                sx={{
                                                    color: 'grey',
                                                    '&.Mui-checked': {
                                                        color: '#6366F1!important',
                                                    },
                                                }}
                                            />
                                        }
                                        label="Next Follow Up Date"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6}>
                                    <DatePicker
                                        selected={followUpDateTime}
                                        onChange={(date) => setFollowUpDateTime(date)}
                                        showTimeSelect
                                        timeIntervals={15}
                                        dateFormat="dd-MMM-yyyy hh:mm aa"
                                        disabled={!nextFollowUp}
                                        customInput={
                                            <TextField
                                                label="Date Time"
                                                size="small"
                                                fullWidth
                                                disabled={!nextFollowUp}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <CalendarTodayIcon sx={{ fontSize: 18, color: nextFollowUp ? '#666' : '#ccc' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    backgroundColor: '#fff',
                                                    '& .MuiInputBase-input': {
                                                        padding: '8px',
                                                        fontSize: '0.95rem',
                                                    },
                                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                                        backgroundColor: 'var(--focus-bg-color)',
                                                    },
                                                }}
                                            />
                                        }
                                    />
                                </Grid>

                                {/* 
                                <Grid item xs={12} sm={6} lg={12}>
                                    <TextField
                                        label=" Customer Decision / Installation Stages"
                                        type="text"
                                        size="small"
                                        fullWidth
                                        value={selectedCustStg}
                                        onChange={(e) => { setSelectedCustStg(e.target.value) }}
                                        select
                                        sx={{
                                            backgroundColor: '#fff',
                                            '& input': {
                                                padding: '8px',
                                                fontSize: '0.95rem',
                                                '&:focus': {
                                                    backgroundColor: 'var(--focus-bg-color)'
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            endAdornment: selectedCustStg && (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent menu from opening
                                                            setSelectedCustStg("");
                                                        }}
                                                    >
                                                        <ClearIcon fontSize="small" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    >

                                        {custStgList
                                            ?.filter(item => item?.desc?.trim()) // remove empty names
                                            .map((item) => (
                                                <MenuItem key={item.mstr_key} value={item.mstr_key}>
                                                    {item.desc.trim()}
                                                </MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </Grid> */}

                                <Grid item xs={12}>
                                    {/* <TextField
                                        label="Lead Source Location"
                                        type="text"
                                        size="small"
                                        fullWidth
                                        value={LeadSourceLoc}
                                        onChange={(e) => { setLeadSourceLoc(e.target.value) }}

                                        sx={{
                                            backgroundColor: '#fff',
                                            '& input': {
                                                padding: '8px',
                                                fontSize: '0.95rem',
                                                '&:focus': {
                                                    backgroundColor: 'var(--focus-bg-color)'
                                                }
                                            }
                                        }}
                                    >

                                    </TextField> */}

                                    <Autocomplete
                                        size="small"
                                        fullWidth
                                        freeSolo
                                        options={["Kerala", "Tamil Nadu"]}
                                        value={LeadSourceLoc || ""}
                                        onChange={(event, newValue) => {
                                            setLeadSourceLoc(newValue || "");
                                        }}
                                        onInputChange={(event, newInputValue) => {
                                            setLeadSourceLoc(newInputValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Lead Source Location"
                                                sx={{
                                                    backgroundColor: "#fff",
                                                    "& input": {
                                                        padding: "8px",
                                                        fontSize: "0.95rem",
                                                        "&:focus": {
                                                            backgroundColor: "var(--focus-bg-color)",
                                                        },
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Bottom Right Buttons */}
                                <Grid item xs={12} sm={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, alignItems: 'center' }}>

                                    <Button
                                        onClick={handleSaveFollowUp}
                                        variant="contained"
                                        sx={{
                                            textTransform: 'none',
                                            height: '38px',
                                            width: '100px',
                                            color: '#f5f7fa',
                                            background:
                                                "linear-gradient(135deg, #6d8ef5 0%, #4975db 50%, #3f5483 100%)",
                                            boxShadow: "0 4px 10px rgba(73,117,219,0.35)",
                                            '&:hover': {
                                                background:
                                                    "linear-gradient(135deg, #7b99f8 0%, #5b84e9 50%, #4a618f 100%)",
                                                boxShadow: "0 6px 14px rgba(73,117,219,0.45)",
                                            },
                                        }}
                                    >
                                        Save
                                    </Button>
                                </Grid>


                            </Grid>
                        </CardContent>
                    </Card>

                </CModalBody>

            </CModal>

            {/* =========================================== */}

            <Dialog
                open={validationDialogOpen}
                onClose={() => setValidationDialogOpen(false)}
                disableRestoreFocus
                TransitionProps={{
                    onExited: () => {

                        setValidationMessage("");

                        if (focusField === "FollowupSts") {
                            FollowupStsInputRef.current?.focus();
                        } else if (focusField === "LeadQua") {
                            LeadQuaInputRef.current?.focus();
                        } else if (focusField === "Desc") {
                            DescInputRef.current?.focus();
                        } else if (focusField === "NextFollowup") {
                            NextFollowupInputRef.current?.focus();
                        }
                        setFocusField("");
                    }
                }}
            >
                <DialogContent>
                    {validationMessage}
                </DialogContent>

                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={() => setValidationDialogOpen(false)}
                        sx={{ textTransform: "none" }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>





        </>
    )
}

export default FollowUp
