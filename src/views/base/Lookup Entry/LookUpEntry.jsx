import React, { useEffect, useState } from 'react'
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import { Tooltip, Link, TableBody, TableCell, TableRow, TableHead, Table, Paper, TableContainer, FormControlLabel, MenuItem, Checkbox, Button, TextField, Grid, Card, CardContent, Typography, Box } from '@mui/material';
import closebtn from '../../../assets/images/Saki-NuoveXT-Actions-button-cancel.ico'
import useModal from '../../../components/UseModal';
import axiosInstance from '../../../axios';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getReduxState from '../../../ReduxState';

function LookUpEntry({ visible, setVisible, size = 'lg' }) {

    const { modalClass } = useModal();
    const { role, deptid, name, empId, BrnchKey } = getReduxState()

    const [getData, setGetData] = useState([])
    const [selectedType, setSelectedType] = useState(null);

    const [code, setCode] = useState("");
    const [mstName, setMstName] = useState("");
    const [details, setDetails] = useState("");
    const [value, setValue] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);

    const [editFlag, setEditFlag] = useState(false)

    const fetchAllData = async () => {
        try {
            const fetchResponse = await axiosInstance.get(
                `/MasterAPI/Search?Type=All`
            );

            if (fetchResponse.data?.MasterList) {
                const data = fetchResponse.data.MasterList;

                setGetData(data);


                setSelectedType(null);

                setEditFlag(true)
            }
        } catch (error) {
            console.log("Error while fetching data", error);
        }
    };

    const uniqueTypes = [
        ...new Map(
            getData.map(item => [item.type, item])
        ).values()
    ].sort((a, b) =>
        (a.type || "").localeCompare(b.type || "")
    );


    const filteredData = selectedType
        ? getData.filter(item => item.type === selectedType)
        : [];

    useEffect(() => {
        setSelectedRow(null);

        setCode("");
        setMstName("");
        setDetails("");
        setValue("");

        setEditFlag(false);
    }, [selectedType]);

    useEffect(() => {
        if (visible) {
            fetchAllData();
        }
    }, [visible]);

    console.log("selectedrow", selectedRow)

    const handleRowDoubleClick = (row) => {
        setSelectedRow(row);

        setCode(row.code || "");
        setMstName(row.desc || "");
        setDetails(row.details || "");
        setValue(row.value || "");

        setEditFlag(true);
    };


    const handleNew = () => {
        setSelectedRow(null);

        setCode("");
        setMstName("");
        setDetails("");
        setValue("");

        setEditFlag(false);


    };

    const getChanges = () => {
        if (!selectedRow) return "";

        const changes = [];

        if ((selectedRow.code || "") !== code) {
            changes.push(`Code: '${selectedRow.code}' → '${code}'`);
        }

        if ((selectedRow.desc || "") !== mstName) {
            changes.push(`Name: '${selectedRow.desc}' → '${mstName}'`);
        }

        if ((selectedRow.details || "") !== details) {
            changes.push(`Details: '${selectedRow.details}' → '${details}'`);
        }

        if ((selectedRow.value || "") !== value) {
            changes.push(`Value: '${selectedRow.value}' → '${value}'`);
        }

        return changes.join(", ");
    };

    const handleSave = async () => {

        const changeLog = getChanges();

        const requestData = {
            MstrKey: editFlag ? selectedRow?.mstr_key : "",
            MstrType: selectedType || "",
            MstrCode: code,
            MstrDesc: mstName,
            MstrDetails: details,
            MstrValue: value,
            SaveEditFlag: editFlag,

            ...(editFlag && {

                "logDesc": changeLog || "No changes made",
                "logForm": "Masters",
                "logUser": name,
                "logSystem": "",
                "logUserId": empId,
                "logReason": "Updated masters Details",
                "LogEmpId": empId,
            })
        };
        try {
            const saveResponse = await axiosInstance.post(`/MastersSaveUpdateAPI/SaveUpdate`, requestData)

            if (saveResponse.data?.Success === true) {

                if (editFlag) {
                    toast.success("Updated successfully");
                } else {
                    toast.success("Saved successfully");
                }

                fetchAllData();
                handleNew()
                setSelectedType(null); // clears table
            } else {
                toast.error(saveResponse.data?.Message || "Operation failed");
            }

        } catch (err) {
            console.log("Error while saving data", err);
            toast.error("Error while saving data");
        }
    }

    return (
        <>
            <CModal
                size={size}
                backdrop='static'
                classmstName={`${modalClass} modal custom-modal-close custom-modal-width custom-centered-modal`}  // Concatenate class mstNames correctly
                alignment="center"
                visible={visible}
                onClose={() => {
                    setVisible(false);
                    //  resetmodal();
                }}
                aria-labelledby="VerticallyCenteredExample">
                <CModalHeader
                    closeButton={false}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#DC3545',
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
                        Lookup Entry
                    </CModalTitle>

                    <button
                        onClick={() => setVisible(false)}
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

                <CModalBody classmstName='c-modal-body no-scroll ' style={{ zoom: '0.8' }}>


                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={4} md={3}>
                            <Card
                                sx={{
                                    height: "540px",
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                    backgroundColor: "#f7eaea",
                                    border: "1px solid #ec9c9c",
                                }}
                            >
                                {/* Header */}
                                <Box
                                    sx={{

                                        color: "#DC3545",
                                        py: 1.5,
                                        px: 2,
                                        fontWeight: 600,
                                        fontSize: "14px",
                                        letterSpacing: "0.5px",
                                    }}
                                >
                                    MASTER TYPES
                                </Box>

                                {/* Content */}
                                <CardContent
                                    sx={{
                                        p: 1,
                                        height: "95%",
                                        overflowY: "auto",

                                        '&::-webkit-scrollbar': {
                                            width: '5px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: '#DC3545',
                                            borderRadius: '10px',
                                        },
                                    }}
                                >
                                    {uniqueTypes.map((item) => (
                                        <Box
                                            key={item.type}
                                            onClick={() => setSelectedType(item.type)}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                px: 1.5,
                                                py: 1.2,
                                                mb: 0.8,
                                                cursor: "pointer",
                                                borderRadius: 2,
                                                transition: "all .2s ease",

                                                backgroundColor:
                                                    selectedType === item.type
                                                        ? "#DC3545"
                                                        : "#ffffff",

                                                color:
                                                    selectedType === item.type
                                                        ? "#ffffff"
                                                        : "#374151",

                                                border:
                                                    selectedType === item.type
                                                        ? "1px solid #DC3545"
                                                        : "1px solid #f1f1f1",

                                                boxShadow:
                                                    selectedType === item.type
                                                        ? "0 4px 12px rgba(220,53,69,0.25)"
                                                        : "0 1px 4px rgba(0,0,0,0.05)",

                                                '&:hover': {
                                                    transform: "translateX(4px)",
                                                    backgroundColor:
                                                        selectedType === item.type
                                                            ? '#DC3545'
                                                            : "#fff5f5",
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: "50%",
                                                    backgroundColor:
                                                        selectedType === item.type
                                                            ? "#fff"
                                                            : "#df7781",
                                                }}
                                            />

                                            <Typography
                                                sx={{
                                                    fontSize: "13px",
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {item.type}
                                            </Typography>
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={8} md={9} >
                            <Card sx={{
                                height: '540px'
                            }}>
                                <CardContent>

                                    <Grid container spacing={1}>
                                        <Grid item xs={12} >

                                            <TableContainer
                                                component={Paper}
                                                sx={{
                                                    height: {
                                                        xs: '200px',
                                                        sm: '270px',
                                                        md: '270px',
                                                        lg: '270px',

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

                                                }}
                                            >
                                                <Table striped sx={{ minWidth: 500, tableLayout: 'fixed' }}>
                                                    {/* Table Head */}
                                                    <TableHead sx={{ position: 'sticky', zIndex: 1, top: 0, backgroundColor: 'var(--header-bg-color)' }}>

                                                        <TableRow sx={{ height: '32px' }}>
                                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '2%', fontWeight: 'bold' }}>SlNo</TableCell>
                                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Code</TableCell>
                                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '7%', fontWeight: 'bold' }}>Name</TableCell>
                                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '6%', fontWeight: 'bold' }}>Details</TableCell>
                                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>Value</TableCell>

                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {filteredData && filteredData.length > 0 ? (
                                                            filteredData.map((row, index) => (
                                                                <TableRow

                                                                    key={index}
                                                                    hover
                                                                    onDoubleClick={() => handleRowDoubleClick(row)}
                                                                    sx={{
                                                                        cursor: "pointer",
                                                                        backgroundColor:
                                                                            selectedRow?.mstr_key === row.mstr_key
                                                                                ? "#fde2e5"
                                                                                : "inherit"
                                                                    }}
                                                                >
                                                                    <TableCell>{index + 1}</TableCell>

                                                                    <TableCell>
                                                                        {row.code}
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        {row.desc}
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        {row.details}
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        {row.value}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (

                                                            <TableRow>
                                                                <TableCell sx={{ textAlign: 'center' }} colSpan={5}>No Data Available</TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>

                                                </Table>

                                            </TableContainer>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4} lg={4}>
                                            <TextField
                                                value={code}
                                                onChange={(e) => setCode(e.target.value)}
                                                label="Code"
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                                        backgroundColor: 'var(--focus-bg-color)',
                                                    },
                                                }}>

                                            </TextField>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={8} lg={8}>
                                            <TextField
                                                value={mstName}
                                                onChange={(e) => setMstName(e.target.value)}
                                                label="mstName"
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                                        backgroundColor: 'var(--focus-bg-color)',
                                                    },
                                                }}>

                                            </TextField>
                                        </Grid>

                                        <Grid item xs={12} md={12} lg={12}>
                                            <TextField
                                                label="Details"
                                                size="small"
                                                fullWidth
                                                multiline
                                                rows={3}
                                                variant="outlined"
                                                value={details}
                                                onChange={(e) => setDetails(e.target.value)}
                                                sx={{
                                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                                        backgroundColor: 'var(--focus-bg-color)',
                                                    },
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={4} md={4} lg={4}>
                                            <TextField
                                                label="Value"
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                value={value}
                                                onChange={(e) => setValue(e.target.value)}
                                                sx={{
                                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                                        backgroundColor: 'var(--focus-bg-color)',
                                                    },
                                                }}>

                                            </TextField>
                                        </Grid>

                                        <Grid container spacing={1} sx={{ marginTop: '5px' }}>
                                            <Grid item xs={12} sm={4} md={8} lg={8} xl={8}

                                                sx={{ marginLeft: { xs: '0px', sm: '8px' } }}
                                            >
                                                <Button
                                                    fullWidth
                                                    sx={{
                                                        textTransform: 'none',
                                                        //    marginRight: 3,
                                                        //    height: '32px',
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
                                                >
                                                    Delete
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={2} lg={2} xl={2}>
                                                <Button
                                                    fullWidth
                                                    sx={{
                                                        textTransform: 'none',
                                                        //  marginRight: 3,
                                                        //  height: '32px',
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
                                                    color="success"
                                                    onClick={handleNew}
                                                >
                                                    New
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12} sm={3} md={1} lg={1} xl={1}>
                                                <Button
                                                    fullWidth
                                                    sx={{
                                                        textTransform: 'none',
                                                        //  marginRight: 3,
                                                        //  height: '32px',
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
                                                    color="success"
                                                    onClick={handleSave}
                                                >Save
                                                </Button>
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                </CModalBody>

            </CModal>

            <ToastContainer autoClose={1000} hideProgressBar={true} position='top-center' theme='colored' transition={Bounce} />

        </>
    )
}

export default LookUpEntry
