import { Card, CardContent, Checkbox, FormControlLabel, Grid, Table, TableContainer, TableHead, TableRow, TextField, Typography, TableCell, Paper, TableBody, Box, Tooltip, Button, MenuItem, Autocomplete } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

} from "@mui/material";
import axiosInstance from '../../../axios';
import getReduxState from '../../../ReduxState';

function ServicesandSolutions() {

    const { name } = getReduxState()

    const [image, setImage] = useState(null);

    const [errorDescription, setErrorrDescription] = useState('')
    const [errrorTableData, setErrorTableData] = useState([]);

    const [openImage, setOpenImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const [services, SetServices] = useState([])

    const [selectedService, setSelectedService] = useState(null);

    const [serviceId, setServiceId] = useState("");
    const [serviceName, setServiceName] = useState("");
    const [serviceDescription, setServiceDescription] = useState("");

    const [solutionTableData, setSolutionTableData] = useState([]);
    const [solutionText, setSolutionText] = useState("");

    // ADD THESE STATES
    const [reportDay, setReportDay] = useState("");
    const [reportTimeDays, setReportTimeDays] = useState("");
    const [notActive, setNotActive] = useState(false);
    const [userInfo, setUserInfo] = useState(name || "");

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    const solutionInputRef = useRef()
    const serviceNameInputRef = useRef()

    // Close dialog box and focus field if needed
    const handleClose = () => {
        setOpenDialog(false);

        setTimeout(() => {
            if (dialogMessage === "Please Enter Solution") {
                solutionInputRef.current?.focus();
            } else if (dialogMessage === "Please Enter Service Name") {
                serviceNameInputRef.current?.focus();
            }
            // Clear dialog state after focusing
            setDialogMessage("");
        }, 100);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file)); // preview
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
    };

    const handleAdd = () => {

        if (!image) {
            setDialogMessage("No Image Found")
            setOpenDialog(true)
            return
        }

        const newRow = {
            id: Date.now(),
            description: errorDescription,
            image: image
        };

        setErrorTableData((prev) => [...prev, newRow]);

        // clear fields
        setErrorrDescription('');
        setImage(null);

        document.getElementById("upload-image").value = "";
    };

    const handleDeleteRow = (id) => {

        setErrorTableData((prev) =>
            prev.filter((row) => row.id !== id)
        );
    };

    const fetchServices = async () => {
        try {
            const fetchServicesResponse = await axiosInstance.get(`servicesolutions`)
            console.log('response', fetchServicesResponse);
            if (fetchServicesResponse.data && fetchServicesResponse.data.data) {
                SetServices(fetchServicesResponse.data.data);
            }
        } catch (err) {
            console.error('Error fetching', err)
        }
    }


    const fetchLatestServiceId = async () => {
        try {
            const fetchResponse = await axiosInstance.get(`/servicesolutions/GetServiceId`)
            if (fetchResponse.data && fetchResponse.data.ServiceId) {
                setServiceId(fetchResponse.data.ServiceId)
            }
        } catch (error) {
            console.log("error while fteching latest serviceId", error)
        }
    }

    useEffect(() => {
        fetchServices()
        fetchLatestServiceId()
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


    const handleAddSolution = () => {

        if (!solutionText.trim()) {
            setDialogMessage("Please Enter Solution");
            setOpenDialog(true)
            return;
        }

        const newRow = {
            id: Date.now(),
            solution: solutionText,
            orderBy: solutionTableData.length + 1
        };

        setSolutionTableData((prev) => [...prev, newRow]);

        setSolutionText("");
    };

    console.log("service name", serviceName)

    const handleDeleteSolution = (id) => {

        const updatedData = solutionTableData
            .filter((row) => row.id !== id)
            .map((row, index) => ({
                ...row,
                orderBy: index + 1
            }));

        setSolutionTableData(updatedData);
    };


    // RESET FUNCTION
    const handleReset = () => {

        // MAIN DATA
        setSelectedService(null);
        setServiceName("");
        setServiceDescription("");

        // FETCH NEW SERVICE ID
        fetchLatestServiceId();

        // TAT
        setReportDay("");
        setReportTimeDays("");

        // CHECKBOX
        setNotActive(false);

        // USER INFO
        setUserInfo(name || "");

        // SOLUTIONS
        setSolutionText("");
        setSolutionTableData([]);

        // ERROR IMAGE SECTION
        setErrorrDescription("");
        setErrorTableData([]);

        // IMAGE PREVIEW
        setImage(null);

        // IMAGE DIALOG
        setOpenImage(false);
        setSelectedImage(null);

        // CLEAR FILE INPUT
        const fileInput = document.getElementById("upload-image");

        if (fileInput) {
            fileInput.value = "";
        }
    };

    // SAVE FUNCTION
    const handleSave = async () => {


        // VALIDATION
        if (!serviceName?.trim() && !selectedService?.trim()) {
            setDialogMessage("Please Enter Service Name");
            setOpenDialog(true)
            return;
        }

        try {



            // CONVERT IMAGE URL TO BASE64
            const convertImageToBase64 = async (imageUrl) => {

                if (!imageUrl) return "";

                // already base64
                if (imageUrl.startsWith("data:image")) {
                    return imageUrl.split(",")[1];
                }

                const response = await fetch(imageUrl);

                const blob = await response.blob();

                return await new Promise((resolve) => {

                    const reader = new FileReader();

                    reader.onloadend = () => {

                        const base64String = reader.result.split(",")[1];

                        resolve(base64String);
                    };

                    reader.readAsDataURL(blob);
                });
            };

            // ERROR IMAGE DATA
            const formattedImages = await Promise.all(

                (errrorTableData || []).map(async (item) => ({

                    Img_Image: item?.image
                        ? await convertImageToBase64(item.image)
                        : "",

                    Img_Description: item?.description || ""
                }))
            );

            // SOLUTION DATA
            const formattedSolutions = (solutionTableData || []).map((item, index) => ({

                ServSolDet_Orderset: index + 1,

                ServSolDet_SolDesc: item?.solution || ""
            }));

            // CURRENT DATE TIME
            // const currentDateTime = new Date().toLocaleString("en-GB", {
            //     day: "2-digit",
            //     month: "2-digit",
            //     year: "numeric",
            //     hour: "2-digit",
            //     minute: "2-digit",
            //     second: "2-digit",
            //     hour12: true
            // });

            // USER INFO
            const userInfoValue = `${name}`;

            // PAYLOAD
            const payload = {

                // SEND THIS ONLY FOR UPDATE
                ...(serviceId ? { SrvSol_Key: serviceId } : {}),

                SrvSol_ServNme: serviceName || selectedService || '',

                SrvSol_Des: serviceDescription,

                SrvSol_RptTmeDays: Number(reportTimeDays) || 0,

                SrvSol_RptDay: reportDay,

                SrvSol_NotActive: notActive ? 1 : 0,

                SrvSol_UserInfo: userInfoValue,

                SolutionData: formattedSolutions,

                ErrorimgData: formattedImages
            };

            console.log("save payload", payload);

            // API
            const response = await axiosInstance.post(
                `/servicesolutions/SaveDtls`,
                payload
            );

            console.log("save response", response);

            if (response.data?.status) {

                alert("Saved Successfully");

                fetchServices();
                fetchLatestServiceId();
                handleReset()
            }

        } catch (error) {

            console.log("save error", error);

            alert("Save Failed");
        }
    };

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
                Services and Solutions

            </Typography>

            <Grid container spacing={1}>
                <Grid item lg={6}>

                    <Card>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={4} md={4} lg={4}>

                                    <TextField
                                        label="Service ID"
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        value={serviceId}
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

                                <Grid item xs={12} sm={8} md={8} lg={8}>
                                    <Autocomplete
                                        freeSolo
                                        value={selectedService || ""}
                                        inputValue={serviceName}

                                        onInputChange={(event, newInputValue) => {

                                            setServiceName(newInputValue);

                                        }}

                                        onChange={async (event, newValue) => {

                                            setSelectedService(newValue || "");
                                            setServiceName(newValue || "");

                                            const service = services.find(
                                                (srv) => srv.SrvSol_ServNme === newValue
                                            );

                                            if (!service?.SrvSol_Key) {
                                                return;
                                            }

                                            try {

                                                const response = await axiosInstance.get(
                                                    `/servicesolutions/GetServiceDet?serviceid=${service.SrvSol_Key}`
                                                );

                                                if (response.data?.data) {

                                                    const data = response.data.data;

                                                    setServiceId(data?.SrvSol_Key || "");
                                                    setServiceDescription(data?.SrvSol_Des || "");
                                                    setReportDay(data?.SrvSol_RptDay || "");
                                                    setReportTimeDays(data?.SrvSol_RptTmeDays || "");
                                                    setNotActive(data?.SrvSol_NotActive || false);
                                                    // FORMAT DATE TIME
                                                    const formatDateTime = (dateValue) => {

                                                        if (!dateValue) return "";

                                                        const date = new Date(dateValue);

                                                        return date.toLocaleString("en-GB", {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            second: "2-digit",
                                                            hour12: true
                                                        });
                                                    };

                                                    // USER INFO DISPLAY
                                                    const userName = data?.SrvSol_UserInfo || "";
                                                    const updatedDate = data?.SrvSol_Date || data?.SrvSol_UpdDate || "";

                                                    setUserInfo(
                                                        userName && updatedDate
                                                            ? `${userName} - ${formatDateTime(updatedDate)}`
                                                            : userName || ""
                                                    );

                                                    // SOLUTIONS
                                                    if (Array.isArray(data?.Details)) {

                                                        const formattedSolutions = data.Details.map((item, index) => ({
                                                            id: index + 1,
                                                            solution: item.ServSolDet_SolDesc,
                                                            orderBy: item.ServSolDet_Orderset
                                                        }));

                                                        setSolutionTableData(formattedSolutions);

                                                    } else {
                                                        setSolutionTableData([]);
                                                    }

                                                    // IMAGES
                                                    if (Array.isArray(data?.Images)) {

                                                        const formattedImages = data.Images.map((item, index) => ({
                                                            id: index + 1,
                                                            description: item.ImageDescription || "",
                                                            image: item.Image
                                                                ? `data:image/jpeg;base64,${item.Image}`
                                                                : null
                                                        }));

                                                        setErrorTableData(formattedImages);

                                                    } else {
                                                        setErrorTableData([]);
                                                    }
                                                }

                                            } catch (error) {
                                                console.log("error fetching service details", error);
                                            }
                                        }}

                                        options={
                                            Array.isArray(services)
                                                ? services
                                                    .filter(Boolean)
                                                    .map((srv) => srv?.SrvSol_ServNme || "")
                                                : []
                                        }

                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Service Name"
                                                size="small"
                                                fullWidth
                                                inputRef={serviceNameInputRef}
                                                sx={{
                                                    fontSize: '1rem',
                                                    height: 40,
                                                    '& input': {
                                                        padding: '8px',
                                                        fontSize: '0.95rem',
                                                        '&:focus': {
                                                            backgroundColor:
                                                                'var(--focus-bg-color)'
                                                        }
                                                    }
                                                }}
                                            />
                                        )}

                                        renderOption={(props, option, state) => (
                                            <li {...props}>
                                                {highlightText(option, state.inputValue)}
                                            </li>
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={12} lg={12}>

                                    <TextField
                                        multiline
                                        rows={2}
                                        label="Description"
                                        size="small"
                                        value={serviceDescription}
                                        onChange={(e) =>
                                            setServiceDescription(e.target.value)
                                        }
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

                                <Grid item xs={12} sm={4} md={4} lg={4}>

                                    <TextField

                                        label="Work TAT"
                                        size="small"
                                        fullWidth
                                        value={reportTimeDays || ''}
                                        onChange={(e) => setReportTimeDays(e.target.value)}
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

                                <Grid item xs={12} sm={4} md={4} lg={4}>

                                    <TextField
                                        select
                                        label=""
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        value={reportDay || ''}
                                        onChange={(e) => setReportDay(e.target.value)}
                                        sx={{
                                            '@media (max-width: 320px)': {
                                                width: '100%', // Ensure full width on small screens
                                            },
                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                backgroundColor: 'var( --focus-bg-color)', // Set background color on focus
                                            },
                                        }}
                                    >
                                        <MenuItem value="Minutes">Minutes</MenuItem>
                                        <MenuItem value="Hours">Hours</MenuItem>
                                        <MenuItem value="Day">Day</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} sm={4} md={4} lg={3} xl={3}>

                                    <FormControlLabel
                                        sx={{
                                            marginLeft: { xs: '0px', sm: "0px", lg: "0px" },
                                        }}
                                        control={<Checkbox
                                            checked={notActive}
                                            onChange={(e) => setNotActive(e.target.checked)}
                                            name='itemDiscItem'
                                            sx={{
                                                color: 'grey',
                                                '&.Mui-checked': {
                                                    color: '#DC3545!important',   // 🔥 force override
                                                },
                                            }}
                                        />}
                                        label="Not Active"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={10} md={10} lg={10}>

                                    <TextField
                                        multiline
                                        rows={2}
                                        label="Solutions"
                                        size="small"
                                        value={solutionText}
                                        onChange={(e) => setSolutionText(e.target.value)}
                                        fullWidth
                                        inputRef={solutionInputRef}
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

                                <Grid item xs={12} sm={2} md={2} lg={2} style={{ display: 'flex', justifyContent: 'flex-end' }} sx={{
                                    marginTop: { sm: '20px' }
                                }}>
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
                                        onClick={handleAddSolution}
                                    >
                                        Add
                                    </Button>

                                </Grid>

                                <Grid item xs={12} sx={{ marginBottom: { xs: '40px', sm: '30px', md: '30px' } }}>

                                    <TableContainer
                                        component={Paper}
                                        sx={{
                                            height: {
                                                xs: 'calc(100vh - 450px)',
                                                sm: 'calc(100vh - 450px)',
                                                md: 'calc(100vh - 400px)',
                                                lg: 'calc(100vh - 400px)',
                                                xl: 'calc(100vh - 403px)'
                                            }, overflowX: "auto",

                                            overflowY: 'scroll',
                                            '&::-webkit-scrollbar': {
                                                width: '0px',
                                                background: 'transparent',
                                            },
                                            scrollbarWidth: 'thin',
                                            marginTop: 1,
                                        }}
                                    >
                                        <Table striped sx={{ minWidth: 300, tableLayout: 'fixed' }}>
                                            {/* Table Head */}
                                            <TableHead sx={{ position: 'sticky', zIndex: 1, top: 0, backgroundColor: 'var(--header-bg-color)' }}>

                                                <TableRow sx={{ height: '32px' }}>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}>SlNo</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '14%', fontWeight: 'bold' }}>Solution</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}>Order</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}></TableCell>




                                                </TableRow>
                                            </TableHead>

                                            <TableBody>

                                                {solutionTableData.length > 0 ? (

                                                    solutionTableData.map((row, index) => (

                                                        <TableRow key={row.id}>

                                                            <TableCell>
                                                                {index + 1}
                                                            </TableCell>

                                                            <TableCell sx={{
                                                                whiteSpace: 'normal',
                                                                wordBreak: 'break-word'
                                                            }}>
                                                                {row.solution}
                                                            </TableCell>

                                                            <TableCell>
                                                                {row.orderBy}
                                                            </TableCell>

                                                            <TableCell>

                                                                <DeleteIcon
                                                                    sx={{
                                                                        cursor: 'pointer',
                                                                    }}
                                                                    onClick={() => handleDeleteSolution(row.id)}
                                                                />

                                                            </TableCell>

                                                        </TableRow>
                                                    ))

                                                ) : (

                                                    <TableRow>
                                                        <TableCell colSpan={4} align="center">
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

                <Grid item lg={6}>

                    <Card>
                        <CardContent>
                            <Grid container spacing={1}>


                                <Grid item xs={10} sm={6} md={6} lg={6}>

                                    <Typography sx={{ color: '#DC3545', fontWeight: 600 }}>Error:</Typography>

                                    <Box
                                        sx={{
                                            border: '1px solid #DC3545',
                                            height: '200px',
                                            width: '100%',
                                            maxWidth: {
                                                xs: '100%',
                                                sm: '400px',
                                                md: '450px',
                                                lg: '350px'
                                            },
                                            margin: '0 auto', // center
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {image ? (
                                            <img
                                                src={image}
                                                alt="preview"
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '100%',
                                                    objectFit: 'contain'
                                                }}
                                            />
                                        ) : (
                                            <span style={{ fontSize: '12px', color: '#999' }}>
                                                No Image Selected
                                            </span>
                                        )}
                                    </Box>

                                </Grid>
                                <Grid item xs={1} sm={.6} md={.6} lg={.6} >


                                    <Tooltip title="Upload Error">
                                        <Box
                                            onClick={() => document.getElementById('upload-image').click()}
                                            sx={{
                                                cursor: 'pointer',
                                                width: '30px',
                                                height: '30px',
                                                borderRadius: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginTop: '100px',
                                            }}
                                        >
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/128/4992/4992029.png"
                                                alt="Upload"
                                                style={{
                                                    width: "25px",
                                                    height: "26px",
                                                    filter: "brightness(0) saturate(100%) invert(19%) sepia(91%) saturate(7486%) hue-rotate(353deg) brightness(92%) contrast(97%)"
                                                }}
                                            />
                                        </Box>
                                    </Tooltip>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="upload-image"
                                        style={{ display: 'none' }}
                                        onChange={handleImageChange}
                                    />
                                </Grid>


                                <Grid item xs={1} sm={.6} md={.6} lg={.6} >

                                    <Tooltip title="Remove Error">
                                        <Box
                                            sx={{
                                                cursor: 'pointer',
                                                width: '30px',
                                                height: '30px',
                                                borderRadius: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginTop: '100px',
                                            }}

                                        >
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/128/3964/3964013.png"
                                                alt="Contract Icon"
                                                style={{
                                                    width: "28px",
                                                    height: "26px",
                                                    filter: "brightness(0) saturate(100%) invert(19%) sepia(91%) saturate(7486%) hue-rotate(353deg) brightness(92%) contrast(97%)"

                                                }}
                                                onClick={handleRemoveImage} // Attach the remove function

                                            />
                                        </Box>
                                    </Tooltip>


                                </Grid>


                                <Grid item xs={12} sm={4.7} lg={4.7}>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>

                                        <TextField
                                            multiline
                                            rows={4}
                                            label="Description"
                                            size="small"
                                            value={errorDescription || ''}
                                            onChange={(e) => setErrorrDescription(e.target.value)}
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


                                    <Grid item xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'flex-end' }}


                                        sx={{
                                            marginTop: { xs: '10px', sm: '75px' }
                                        }}>
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
                                            onClick={handleAdd}

                                        >
                                            Add
                                        </Button>

                                    </Grid>

                                </Grid>
                                <Grid item xs={12} sx={{ marginBottom: { xs: '40px', sm: '30px', md: '30px' } }}>

                                    <TableContainer
                                        component={Paper}
                                        sx={{
                                            height: {
                                                xs: 'calc(100vh - 450px)',
                                                sm: 'calc(100vh - 450px)',
                                                md: 'calc(100vh - 400px)',
                                                lg: 'calc(100vh - 400px)',
                                                xl: 'calc(100vh - 399px)'
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
                                            marginTop: 2,
                                        }}
                                    >
                                        <Table striped sx={{ minWidth: 300, tableLayout: 'fixed' }}>
                                            {/* Table Head */}
                                            <TableHead sx={{ position: 'sticky', zIndex: 1, top: 0, backgroundColor: 'var(--header-bg-color)' }}>

                                                <TableRow sx={{ height: '32px' }}>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}>SlNo</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '7%', fontWeight: 'bold' }}>Description</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '8%', fontWeight: 'bold' }}>Image</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}></TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}></TableCell>

                                                </TableRow>
                                            </TableHead>
                                            <TableBody>

                                                {errrorTableData.length > 0 ? (

                                                    errrorTableData.map((row, index) => (

                                                        <TableRow key={row.id}>

                                                            <TableCell>
                                                                {index + 1}
                                                            </TableCell>

                                                            <TableCell>
                                                                {row.description}
                                                            </TableCell>

                                                            <TableCell>

                                                                {row.image ? (
                                                                    <img
                                                                        src={row.image}
                                                                        alt="error"
                                                                        style={{
                                                                            width: "160px",
                                                                            height: "70px",
                                                                            objectFit: "contain",
                                                                            borderRadius: "5px",
                                                                            border: "1px solid #ddd"
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    "-"
                                                                )}

                                                            </TableCell>
                                                            <TableCell>

                                                                <VisibilityIcon
                                                                    sx={{
                                                                        cursor: "pointer"
                                                                    }}
                                                                    onClick={() => {

                                                                        if (!row.image) return;

                                                                        const newWindow = window.open(
                                                                            "",
                                                                            "_blank",
                                                                            "width=1000,height=800"
                                                                        );

                                                                        if (newWindow) {

                                                                            newWindow.document.write(`
                                                                      <html>

                                                                         <head>
                                                                          <title>Image Preview</title>

                                                                           <style>
                                                                             body{
                                                                              margin:0;
                                                                             display:flex;
                                                                             justify-content:center;
                                                                             align-items:center;
                                                                             height:100vh;
                                                                             background:#f5f5f5;
                                                                              }

                                                                              img{
                                                                             max-width:95%;
                                                                             max-height:95%;
                                                                             object-fit:contain;
                                                                             border-radius:8px;
                                                                             box-shadow:0 0 10px rgba(0,0,0,0.2);
                                                                                    }
                                                                           </style>
                                                                    </head>
                                                               <body>
                                                            <img src="${row.image}" alt="Preview" />
                                                             </body>
                                                                      </html>
                                                                           `);

                                                                            newWindow.document.close();
                                                                        }
                                                                    }}
                                                                />

                                                            </TableCell>
                                                            <TableCell><DeleteIcon onClick={() => handleDeleteRow(row.id)}
                                                            /></TableCell>

                                                        </TableRow>
                                                    ))

                                                ) : (

                                                    <TableRow>
                                                        <TableCell colSpan={5} align="center">
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

                <Grid item xs={12}>
                    <Card>
                        <CardContent>

                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} lg={6}>

                                    <TextField

                                        label="UserInfo"
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        value={userInfo}
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

                                <Grid item xs={12} sm={6} lg={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>

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
                                        onClick={handleReset}
                                    >
                                        New
                                    </Button>

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
                                        onClick={handleSave}
                                    >
                                        Save
                                    </Button>

                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>


            <Dialog
                open={openImage}
                onClose={() => setOpenImage(false)}
                maxWidth="md"
            >

                <DialogTitle>
                    Image Preview
                </DialogTitle>

                <DialogContent>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: 1
                        }}
                    >
                        <img
                            src={selectedImage}
                            alt="Preview"
                            style={{
                                maxWidth: "100%",
                                maxHeight: "500px",
                                objectFit: "contain"
                            }}
                        />
                    </Box>

                </DialogContent>

            </Dialog>



            {/* ----------------------------------------------------------- */}

            <Dialog open={openDialog}
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
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        //   px: 2,
                        //   py: 1,
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


        </>
    )
}

export default ServicesandSolutions
