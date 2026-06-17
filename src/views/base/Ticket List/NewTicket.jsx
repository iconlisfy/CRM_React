import React, { useEffect, useState } from 'react'
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import { Tooltip, Link, TableBody, TableCell, TableRow, TableHead, Table, Paper, TableContainer, FormControlLabel, MenuItem, Checkbox, Button, TextField, Grid, Card, CardContent, Typography, Autocomplete, InputAdornment, Chip, Box } from '@mui/material';
import closebtn from '../../../assets/images/Saki-NuoveXT-Actions-button-cancel.ico'
import useModal from '../../../components/UseModal';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axiosInstance from '../../../axios';
import { FixedSizeList } from 'react-window';
import {
    Dialog,
    DialogContent,
    DialogActions,

} from "@mui/material";
import Updatemodal from './Updatemodal';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import verified from '../../../assets/images/verified.png'

function NewTicket({ visible, setVisible, size = 'xl', dateTime, setDateTime, allProducts, setAllProducts,
    selectedProducts, setSelectedProducts, productSearch, setProductSearch, selectedProduct,
    setSelectedProduct, allCustomers, setAllCustomers, filteredCustomers, setFilteredCustomers,
    selectedCustomer, setSelectedCustomer, searchValue, setSearchValue, SearchBy, setSearchBy, customerDetails,
    setCustomerDetails, customerName, setCustomerName, allServeType, setServeType, selectedServeType, setSelectedServeType,
    allDept, setAllDept, selectedDept, setSelectedDept, rows, setRows, editIndex, setEditIndex, work, setWork,
    details, setDetails, priority, setPriority, confirmOpen, setConfirmOpen, pendingEdit, setPendingEdit, allStaff,
    setAllStaff, selectedStaff, setSelectedStaff, selectedStaffKey, setSelectedStaffKey, fetchAllDetails,
    fetchStaff, fetchServeType, fetchDepartment, fetchCustomerByKey, highlightText, handleAdd, handleClearFields,
    handleEdit, handleNew, handleSaveTicket, contactedPerson, setContactedPerson, contactedPersonNo,
    setContactedPersonNo, ticketNo, setTicketNo, description, setDescription, confirmDeleteOpen, setConfirmDeleteOpen, pendingDeleteIndex,
    setPendingDeleteIndex, handleConfirmDeleteYesRow, handleConfirmDeleteNo, pendingDeleteRow, setPendingDeleteRow,
    DescrInputRef, createdByName, wrkThrgh, setWrkThrgh, visibleUpt, setVisibleUpt, note, setNote, pendingUpdateIndex,
    setPendingUpdateIndex, onSave, status, setStatus, selectedRow, handleCloseModal, latestStatus, setLatestStatus,
    userInfo, setUserInfo, WrkTitleInputRef, WrkDetailsInputRef, name, isProductExpired, setSelectedRow,
    editingTicket, supportType, setSupportType, works, formatDateTime, contactedPersonInputRef, payableNote, setPayableNote,
    isPayableService, setIsPayableService, isVerified, checkAMCExpired, amcInfo,isSaving
}) {

    const { modalClass } = useModal();

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


    const isReadOnly = editingTicket?.IsCompleted === true;

    // Print function
    const handlePrint = async (ticketNo, statusKey) => {

        try {

            const url = `/ticket/print?TicketNo=${ticketNo}&StatusKey=${statusKey}`;

            const printResponseDate = await axiosInstance.get(url);

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
                            <title>Ticket PDF</title>
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



    return (
        <>

            <CModal
                size={size}
                backdrop='static'
                className={`${modalClass} modal custom-modal-close custom-modal-width custom-centered-modal`}  // Concatenate class names correctly
                alignment="center"
                visible={visible}
                onClose={handleCloseModal}
                aria-labelledby="VerticallyCenteredExample"
            >
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
                        }}
                    >
                        Ticket Create
                    </CModalTitle>

                    <button
                        onClick={() => {
                            handleCloseModal();
                            handleNew();
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <img
                            src={closebtn}
                            alt="Close"
                            width="22"   // 🔽 smaller icon
                            height="22"

                        />
                    </button>
                </CModalHeader>

                <CModalBody className='c-modal-body no-scroll ' style={{ zoom: '0.8' }}>

                    <Grid container spacing={1} >

                        <Grid item xs={12} >

                            <Grid container spacing={1} justifyContent="space-between" alignItems="center">


                                <Grid item sm={.1} lg={.1} >

                                </Grid>

                                <Grid item xs={5} sm={6} md={9.3} lg={9.9}>
                                    <Typography
                                        sx={{
                                            fontSize: "0.95rem",
                                            fontWeight: "bold",
                                        }}
                                    >
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
                                            TICKET # : {ticketNo}
                                        </Box>
                                    </Typography>
                                </Grid>

                                <Grid item xs={5} sm={5.8} md={2.5} lg={2} >
                                    <Typography
                                        sx={{
                                            fontSize: "0.95rem",
                                            fontWeight: "bold"
                                        }}>
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
                                            {
                                                editingTicket?.CreatedDate
                                                    ? formatDateTime(editingTicket.CreatedDate)
                                                    : dateTime
                                            }
                                        </Box>
                                    </Typography>
                                </Grid>


                            </Grid>

                        </Grid>

                        <Grid item xs={12} lg={12}>

                            <Card
                                sx={{
                                    height: { xs: '165px', sm: '120px', md: '70px', lg: "70px" },
                                    marginTop: { lg: '-5px' },
                                }}>
                                <CardContent>

                                    <Grid container spacing={1} >

                                        <Grid item xs={12} sm={5} md={2} lg={3} >
                                            <TextField
                                                select
                                                label="Search By"
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                value={SearchBy}
                                                onChange={(e) => {
                                                    setSearchBy(e.target.value);
                                                    setSearchValue(''); // reset search
                                                }}
                                                InputProps={{
                                                    readOnly: isReadOnly
                                                }}
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
                                                }}>
                                                <MenuItem value="RegName">Reg Name</MenuItem>
                                                <MenuItem value="DispName">Display Name</MenuItem>


                                            </TextField>
                                        </Grid>

                                        <Grid item xs={12} sm={7} md={5} lg={6}>

                                            <Autocomplete
                                                size="small"
                                                fullWidth
                                                options={filteredCustomers}
                                                value={selectedCustomer || null}
                                                inputValue={searchValue}
                                                onInputChange={(e, value) => setSearchValue(value)}
                                                onChange={(e, value) => {
                                                    setSelectedCustomer(value);

                                                    if (value?.AhMst_Key) {
                                                        fetchCustomerByKey(value.AhMst_Key);
                                                    }
                                                }}
                                                isOptionEqualToValue={(option, value) =>
                                                    option?.ahmst_key === value?.ahmst_key
                                                }
                                                getOptionLabel={(option) =>
                                                    SearchBy === "DispName"
                                                        ? option.AhMst_DisplayName || ""
                                                        : option.AhMst_pName || ""
                                                }
                                                renderOption={(props, option) => {
                                                    const label = SearchBy === "DispName" ?
                                                        option.AhMst_DisplayName || "" :
                                                        option.AhMst_pName || "";
                                                    return (<li {...props}>
                                                        {highlightText(label, searchValue)} </li>
                                                    );
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root':
                                                            {
                                                                height: 40, paddingLeft: 0,
                                                                position: 'relative',
                                                                '& .MuiInputBase-input'
                                                                    : {
                                                                    fontSize: '0.95rem',
                                                                    padding: '8px 8px 8px 12px',
                                                                    position: 'relative',
                                                                    zIndex: 1,
                                                                }, '&::before':
                                                                {
                                                                    content: '""',
                                                                    position: 'absolute',
                                                                    left: 0,
                                                                    top: 0,
                                                                    bottom: 0,
                                                                    width: '4px',
                                                                    backgroundColor: '#DC3545',
                                                                    borderTopLeftRadius: '4px',
                                                                    borderBottomLeftRadius: '4px',
                                                                    zIndex: 2,
                                                                },
                                                                '&.Mui-focused':
                                                                {
                                                                    backgroundColor:
                                                                        'var(--focus-bg-color) !important',
                                                                },
                                                                // '&.Mui-focused fieldset':
                                                                //     { borderColor: '#DC3545', },
                                                            },
                                                        }}
                                                        label={SearchBy === "DispName" ? "Display Name" : "Reg Name"}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        {supportType === "No Support" && (
                                            <Grid
                                                item
                                                xs={4}
                                                sm={3}
                                                md={3}
                                                lg={2}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: {
                                                        xs: 'flex-end',
                                                        sm: 'flex-end'
                                                    },
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        px: 1.5,
                                                        py: 0.6,
                                                        borderRadius: '14px',
                                                        position: 'relative',

                                                        background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                                                        border: '1px solid rgba(220,53,69,0.35)',
                                                        boxShadow: '0 4px 12px rgba(220,53,69,0.18)',

                                                        animation: 'pulseGlow 1.8s infinite ease-in-out',

                                                        '@keyframes pulseGlow': {
                                                            '0%': {
                                                                transform: 'scale(1)',
                                                                boxShadow: '0 4px 12px rgba(220,53,69,0.18)',
                                                            },
                                                            '50%': {
                                                                transform: 'scale(1.03)',
                                                                boxShadow: '0 6px 18px rgba(220,53,69,0.28)',
                                                            },
                                                            '100%': {
                                                                transform: 'scale(1)',
                                                                boxShadow: '0 4px 12px rgba(220,53,69,0.18)',
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 10,
                                                            height: 10,
                                                            borderRadius: '50%',
                                                            backgroundColor: '#DC3545',
                                                            boxShadow: '0 0 10px rgba(220,53,69,0.7)',
                                                            animation: 'dotBlink 1s infinite',
                                                        }}
                                                    />

                                                    <Typography
                                                        sx={{
                                                            color: '#B71C1C',
                                                            fontWeight: 800,
                                                            fontSize: '1rem',
                                                            letterSpacing: '0.4px',
                                                            textTransform: 'uppercase',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        No Support
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        )}

                                        <Grid
                                            item
                                            xs={7.5}
                                            sm={8}
                                            md={2}
                                            lg={1}
                                            sx={{
                                                display: "flex",
                                                justifyContent: {
                                                    xs: "flex-end",
                                                    sm: "flex-end"
                                                },
                                                alignItems: "center"
                                            }}
                                        >
                                            {Number(isVerified) === 1 ? (
                                                <Tooltip title="Verified Customer" arrow>
                                                    <Box
                                                        sx={{
                                                            animation: "blink 1.5s linear infinite",
                                                            "@keyframes blink": {
                                                                "0%": { opacity: 1 },
                                                                "50%": { opacity: 0.3 },
                                                                "100%": { opacity: 1 }
                                                            }
                                                        }}
                                                    >
                                                        <img
                                                            src={verified}
                                                            alt="verified"
                                                            style={{
                                                                width: 35,
                                                                height: 35
                                                            }}
                                                        />
                                                    </Box>
                                                </Tooltip>

                                            ) : checkAMCExpired?.() ? (

                                                <Tooltip
                                                    title={
                                                        <>
                                                            <div>Customer Not Verified</div>
                                                            <div>AMC From: {amcInfo?.from || "-"}</div>
                                                            <div>AMC To: {amcInfo?.to || "-"}</div>
                                                            <div>Status: AMC Expired</div>
                                                        </>
                                                    }
                                                    arrow
                                                >
                                                    <Box
                                                        sx={{
                                                            animation: "blink 1s linear infinite",
                                                            "@keyframes blink": {
                                                                "0%": { opacity: 1 },
                                                                "50%": { opacity: 0.3 },
                                                                "100%": { opacity: 1 }
                                                            }
                                                        }}
                                                    >
                                                        <img
                                                            src="https://cdn-icons-png.flaticon.com/128/564/564619.png"
                                                            alt="warning"
                                                            style={{
                                                                width: 28,
                                                                height: 28
                                                            }}
                                                        />
                                                    </Box>
                                                </Tooltip>

                                            ) : null}
                                        </Grid>
                                    </Grid>



                                </CardContent>
                            </Card>


                        </Grid>



                        <Grid item xs={12} lg={12}>

                            <Card sx={{
                                height: { sm: '370px', md: '276px', lg: '275px' }
                            }} >
                                <CardContent>

                                    <Grid container spacing={1} >

                                        <Grid item xs={12} md={12} lg={12}>
                                            <TextField label="Customer Name" type="text" size="small" fullWidth
                                                value={customerName}
                                                InputProps={{
                                                    readOnly: isReadOnly
                                                }}

                                                sx={{
                                                    fontSize: '1rem',
                                                    height: 40,
                                                    '& input': {
                                                        padding: '8px', fontSize: '0.95rem',
                                                        '&:focus': {
                                                            backgroundColor: 'var(--focus-bg-color)'
                                                        }
                                                    }
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4} lg={4}>
                                            {/* <TextField label="Work Through" type="text" size="small" fullWidth
                                                select
                                                value={wrkThrgh}
                                                onChange={(e) => setWrkThrgh(e.target.value)}
                                                sx={{
                                                    fontSize: '1rem',
                                                    height: 39,
                                                    //  select text styling
                                                    '& .MuiSelect-select': {
                                                        padding: '8px',
                                                        fontSize: '0.95rem',
                                                    },

                                                    //  focus background
                                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                                        backgroundColor: 'var(--focus-bg-color)',
                                                    },
                                                }}
                                            >
                                                <MenuItem value="Phone">Phone</MenuItem>
                                                <MenuItem value="Disscussion">Disscussion</MenuItem>
                                            </TextField> */}

                                            <Autocomplete
                                                freeSolo
                                                disabled={isReadOnly}
                                                options={['Phone', 'Discussion']}
                                                value={wrkThrgh}
                                                onInputChange={(event, newValue) => {
                                                    setWrkThrgh(newValue);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Work Through"
                                                        size="small"
                                                        fullWidth
                                                        sx={{
                                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                                backgroundColor: 'var(--focus-bg-color)',
                                                            },
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4} lg={4}>
                                            <TextField label="Contacted Person" type="text" size="small" fullWidth
                                                value={contactedPerson || ''}
                                                onChange={(e) => setContactedPerson(e.target.value)}
                                                InputProps={{
                                                    readOnly: isReadOnly
                                                }}
                                                inputRef={contactedPersonInputRef}
                                                sx={{
                                                    fontSize: '1rem',
                                                    height: 40,
                                                    '& input': {
                                                        padding: '8px', fontSize: '0.95rem',
                                                        '&:focus': {
                                                            backgroundColor: 'var(--focus-bg-color)'
                                                        }
                                                    }
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4} lg={4}>
                                            <TextField label="Contacted No" type="text" size="small" fullWidth
                                                value={contactedPersonNo || ''}
                                                onChange={(e) => setContactedPersonNo(e.target.value)}
                                                InputProps={{
                                                    readOnly: isReadOnly
                                                }}
                                                sx={{
                                                    fontSize: '1rem',
                                                    height: 40,
                                                    '& input': {
                                                        padding: '8px', fontSize: '0.95rem',
                                                        '&:focus': {
                                                            backgroundColor: 'var(--focus-bg-color)'
                                                        }
                                                    }
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4} lg={4}>
                                            <TextField label="Department" type="text" size="small" fullWidth
                                                select
                                                value={selectedDept}
                                                onChange={(e) => setSelectedDept(e.target.value)}
                                                InputProps={{
                                                    readOnly: isReadOnly
                                                }}
                                                sx={{
                                                    fontSize: '1rem',
                                                    height: 40,
                                                    //  select text styling
                                                    '& .MuiSelect-select': {
                                                        padding: '8px',
                                                        fontSize: '0.95rem',
                                                    },
                                                    //  focus background
                                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                                        backgroundColor: 'var(--focus-bg-color)',
                                                    },
                                                }}
                                            >
                                                {allDept
                                                    ?.filter(item => item?.desc?.trim()) // remove empty names
                                                    .map((item) => (
                                                        <MenuItem key={item.mstr_key} value={item.mstr_key}>
                                                            {item.desc.trim()}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4} lg={4}>
                                            <TextField label="Created By" type="text" size="small" fullWidth
                                                value={createdByName || ''}
                                                InputProps={{
                                                    readOnly: isReadOnly
                                                }}
                                                sx={{
                                                    fontSize: '1rem',
                                                    height: 40,
                                                    '& input': {
                                                        padding: '8px', fontSize: '0.95rem',
                                                        '&:focus': {
                                                            backgroundColor: 'var(--focus-bg-color)'
                                                        }
                                                    }
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4} lg={4}>
                                            <TextField label="Service Type" type="text" size="small" fullWidth
                                                select
                                                value={selectedServeType}
                                                onChange={(e) => setSelectedServeType(e.target.value)}
                                                InputProps={{
                                                    readOnly: isReadOnly
                                                }}
                                                sx={{
                                                    fontSize: '1rem',
                                                    height: 40,
                                                    //  select text styling
                                                    '& .MuiSelect-select': {
                                                        padding: '8px',
                                                        fontSize: '0.95rem',
                                                    },

                                                    //  focus background
                                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                                        backgroundColor: 'var(--focus-bg-color)',
                                                    },
                                                }}
                                            >
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

                                        <Grid item xs={12} sm={6} md={6} lg={6} >
                                            <TextField label="Description" type="text" size="small" fullWidth
                                                multiline
                                                rows={2}
                                                value={description || ''}
                                                onChange={(e) => setDescription(e.target.value)}
                                                inputRef={DescrInputRef}
                                                InputProps={{
                                                    readOnly: isReadOnly
                                                }}
                                                sx={{
                                                    '& .MuiInputBase-root': {
                                                        height: '58px',
                                                    },

                                                    '& textarea': {
                                                        height: '100% !important',
                                                        overflow: 'auto',
                                                    },

                                                    //  Background on focus (for multiline textarea)
                                                    '& .MuiOutlinedInput-root.Mui-focused textarea': {
                                                        backgroundColor: 'var(--focus-bg-color)',
                                                    },


                                                }}

                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <Autocomplete
                                                multiple
                                                limitTags={2}
                                                size="small"
                                                disabled={isReadOnly}
                                                options={(allStaff || []).filter(item =>
                                                    !selectedStaffKey.includes(item.ahmst_key)
                                                )}

                                                getOptionLabel={(option) => option?.ahmst_pname || ''}

                                                value={(allStaff || []).filter(item =>
                                                    selectedStaffKey.includes(item.ahmst_key)
                                                )}

                                                onChange={(event, newValue) => {
                                                    setSelectedStaff(newValue.map(i => i.ahmst_pname));
                                                    setSelectedStaffKey(newValue.map(i => i.ahmst_key));
                                                }}

                                                isOptionEqualToValue={(option, value) =>
                                                    option.ahmst_key === value.ahmst_key
                                                }

                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => (
                                                        <Chip
                                                            label={option.ahmst_pname}
                                                            {...getTagProps({ index })}
                                                            size="small"
                                                            sx={{
                                                                height: "20px",
                                                                fontSize: "12px",
                                                                backgroundColor: "#2bbbad",
                                                                color: "#fff",
                                                                borderRadius: "4px",
                                                                '& .MuiChip-deleteIcon': {
                                                                    color: "#fff",
                                                                },
                                                            }}
                                                        />
                                                    ))
                                                }

                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            readOnly: isReadOnly
                                                        }}
                                                        label="Tags Input"
                                                        size="small"
                                                    />
                                                )}
                                                sx={{
                                                    marginTop: '-1px',
                                                    '& .MuiAutocomplete-inputRoot': {
                                                        flexWrap: 'wrap',
                                                        alignItems: 'flex-start',
                                                        minHeight: '59px',
                                                        maxHeight: '62px',
                                                        overflowY: 'auto',
                                                        padding: '4px',
                                                    },

                                                    '& .MuiAutocomplete-input': {
                                                        minWidth: '80px',
                                                        fontSize: '13px',
                                                    },

                                                    '& .MuiChip-root': {
                                                        margin: '2px',
                                                    },

                                                    '& .MuiOutlinedInput-root': {
                                                        backgroundColor: 'white',
                                                        padding: '2px',


                                                        '&:hover fieldset': {
                                                            borderColor: '#ccc',
                                                        },

                                                        '&.Mui-focused': {
                                                            backgroundColor: 'var(--focus-bg-color)',
                                                        },

                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#2bbbad',
                                                        },
                                                    },
                                                }}
                                            />
                                        </Grid>


                                        <Grid item xs={12} sm={4} md={3} lg={2}>


                                            <FormControlLabel
                                                control={<Checkbox size="small"
                                                    checked={isPayableService}
                                                    onChange={(e) => setIsPayableService(e.target.checked)}
                                                    sx={{
                                                        color: 'grey',
                                                        '&.Mui-checked': {
                                                            color: '#DC3545!important',
                                                        },
                                                    }} />}
                                                label="Payable Service"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={8} md={10} lg={10}>
                                            <TextField label="Note" type="text" size="small" fullWidth
                                                InputProps={{
                                                    readOnly: isReadOnly
                                                }}
                                                value={payableNote}
                                                onChange={(e) => setPayableNote(e.target.value)}
                                                sx={{
                                                    fontSize: '1rem',
                                                    height: 40,
                                                    '& input': {
                                                        padding: '8px', fontSize: '0.95rem',
                                                        '&:focus': {
                                                            backgroundColor: 'var(--focus-bg-color)'
                                                        }
                                                    }
                                                }}
                                            /></Grid>


                                    </Grid>

                                </CardContent>
                            </Card>


                        </Grid>

                        <Grid item xs={12} sm={12} lg={12}>

                            <Card sx={{
                                height: { lg: '315px' },
                            }}>
                                <CardContent>
                                    <Grid container spacing={1}>

                                        <Grid item xs={12} sm={6} md={3} lg={3}>

                                            <Autocomplete
                                                size="small"
                                                fullWidth
                                                readOnly={isReadOnly}
                                                options={allProducts || []}
                                                value={selectedProduct || null}

                                                inputValue={productSearch}
                                                onInputChange={(e, value) => setProductSearch(value)}

                                                onChange={(e, value) => {
                                                    setSelectedProduct(value);
                                                }}

                                                //  filter logic
                                                filterOptions={(options, { inputValue }) => {
                                                    const search = inputValue.toLowerCase();
                                                    return options.filter(opt =>
                                                        opt.Productname?.toLowerCase().includes(search)
                                                    );
                                                }}

                                                getOptionLabel={(option) => option?.Productname || ""}

                                                isOptionEqualToValue={(option, value) =>
                                                    option?.Prcode === value?.Prcode
                                                }

                                                renderOption={(props, option) => (
                                                    <li {...props}>
                                                        {highlightText(option.Productname, productSearch)}
                                                    </li>
                                                )}

                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        boxShadow: 'inset 4px 0 0 0 var(--search-side-color)',
                                                        '& .MuiAutocomplete-input': {
                                                            paddingLeft: '16px',
                                                        }
                                                    }
                                                }}

                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        sx={{
                                                            fontSize: '1rem',
                                                            '& input': {
                                                                padding: '8px',
                                                                fontSize: '0.95rem',
                                                                '&:focus': {
                                                                    backgroundColor: 'var(--focus-bg-color)',
                                                                },
                                                            },
                                                        }}
                                                        label="Select Product"
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: (
                                                                <>
                                                                    <InputAdornment position="end">
                                                                        <SearchIcon />
                                                                    </InputAdornment>
                                                                    {params.InputProps.endAdornment}
                                                                </>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={3} lg={3}>
                                            <Autocomplete
                                                freeSolo
                                                fullWidth
                                                size="small"
                                                options={works}

                                                value={null}
                                                inputValue={work}

                                                filterOptions={(options, { inputValue }) =>
                                                    options.filter((option) =>
                                                        option?.SrvSol_ServNme
                                                            ?.toLowerCase()
                                                            .includes(inputValue.toLowerCase())
                                                    )
                                                }

                                                onChange={(event, newValue) => {
                                                    if (typeof newValue === "string") {
                                                        setWork(newValue);

                                                    } else if (newValue && typeof newValue === "object") {
                                                        setWork(newValue.SrvSol_ServNme || "");
                                                    }
                                                }}

                                                onInputChange={(event, newInputValue, reason) => {

                                                    if (reason !== "reset") {
                                                        setWork(newInputValue || "");
                                                    }
                                                }}

                                                getOptionLabel={(option) =>
                                                    typeof option === "string"
                                                        ? option
                                                        : option.SrvSol_ServNme || ""
                                                }

                                                renderOption={(props, option, { inputValue }) => (
                                                    <li {...props}>
                                                        {highlightText(
                                                            option?.SrvSol_ServNme,
                                                            inputValue
                                                        )}
                                                    </li>
                                                )}

                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Work"
                                                        size="small"
                                                        inputRef={WrkTitleInputRef}
                                                        sx={{
                                                            fontSize: "1rem",

                                                            "& input": {
                                                                padding: "8px",
                                                                fontSize: "0.95rem",

                                                                "&:focus": {
                                                                    backgroundColor: "var(--focus-bg-color)"
                                                                }
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={3} lg={3}>
                                            <TextField label="Details" type="text" size="small" fullWidth
                                                value={details || ''}
                                                onChange={(e) => setDetails(e.target.value)}
                                                inputRef={WrkDetailsInputRef}
                                                InputProps={{
                                                    readOnly: isReadOnly
                                                }}
                                                sx={{
                                                    fontSize: '1rem',
                                                    height: 40,
                                                    '& input': {
                                                        padding: '8px', fontSize: '0.95rem',
                                                        '&:focus': {
                                                            backgroundColor: 'var(--focus-bg-color)'
                                                        }
                                                    }
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={5} md={2} lg={2}>
                                            <TextField label="Priority" type="text" size="small" fullWidth
                                                select
                                                value={priority || ''}
                                                onChange={(e) => setPriority(e.target.value)}
                                                InputProps={{
                                                    readOnly: isReadOnly
                                                }}
                                                sx={{
                                                    fontSize: '1rem',
                                                    height: 40,
                                                    //  select text styling
                                                    '& .MuiSelect-select': {
                                                        padding: '8px',
                                                        fontSize: '0.95rem',
                                                    },

                                                    //  focus background
                                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                                        backgroundColor: 'var(--focus-bg-color)',
                                                    },
                                                }}
                                            >
                                                <MenuItem value="High">High</MenuItem>
                                                <MenuItem value="Medium">Medium</MenuItem>
                                                <MenuItem value="Low">Low</MenuItem>
                                            </TextField>
                                        </Grid>

                                        <Grid item xs={12} sm={1} md={1} lg={1} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                disabled={isReadOnly}
                                                sx={{
                                                    textTransform: 'none',
                                                    marginRight: 1,
                                                    height: '35px',
                                                    width: {
                                                        xs: '100%',
                                                        sm: "100px"
                                                    },
                                                    color: '#f5f7fa',
                                                    backgroundColor: '#DC3545',
                                                    '&:hover': {
                                                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                                    },
                                                    '&.Mui-disabled': {
                                                        backgroundColor: '#DC3545',
                                                        color: '#f5f7fa',
                                                        //    opacity: 0.6
                                                    }
                                                }}
                                                variant="contained"

                                                onClick={handleAdd}
                                            >
                                                {editIndex !== null ? 'Update' : 'Add'}
                                            </Button>
                                        </Grid>

                                        <Grid item xs={12} >

                                            <TableContainer
                                                component={Paper}
                                                sx={{
                                                    height: {
                                                        xs: 'calc(100vh - 400px)',
                                                        sm: '180px',
                                                        md: '180px',
                                                        lg: '180px',
                                                        xl: '180px'
                                                    },

                                                    width: '100%',
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
                                                <Table striped sx={{ minWidth: 900, tableLayout: 'fixed' }}>
                                                    {/* Table Head */}
                                                    <TableHead sx={{ position: 'sticky', zIndex: 1, top: 0, backgroundColor: 'var(--header-bg-color)' }}>

                                                        <TableRow sx={{ height: '32px' }}>
                                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}>SlNo</TableCell>
                                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '11%', fontWeight: 'bold' }}>Product</TableCell>
                                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '8%', fontWeight: 'bold' }}>Work</TableCell>
                                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '8%', fontWeight: 'bold' }}>Details</TableCell>
                                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '6%', fontWeight: 'bold', textAlign: 'center' }}>Priority</TableCell>
                                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '7%', fontWeight: 'bold', textAlign: 'center' }}>Add Update</TableCell>
                                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '8%', fontWeight: 'bold', }}>Status</TableCell>
                                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}><VisibilityIcon sx={{ fontSize: 22, ml: 1 }} /></TableCell>
                                                            <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}><DeleteIcon sx={{ fontSize: 22, ml: 1 }} /></TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {(rows || []).length === 0 ? (<TableRow>
                                                            <TableCell colSpan={9} align="center">
                                                                No Data Available

                                                            </TableCell>
                                                        </TableRow>
                                                        ) : (
                                                            rows.map((row, index) => (
                                                                <TableRow
                                                                    key={index}
                                                                    onDoubleClick={() => {
                                                                        setPendingEdit({ row, index });
                                                                        setConfirmOpen(true);
                                                                    }}
                                                                    sx={{ cursor: 'pointer' }}
                                                                >
                                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{index + 1}</TableCell>
                                                                    <TableCell
                                                                        sx={{
                                                                            whiteSpace: 'nowrap',
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                        }}
                                                                    >
                                                                        <Tooltip
                                                                            //title={row.product?.Productname}
                                                                            arrow
                                                                            placement="bottom"
                                                                        >
                                                                            <span
                                                                                style={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'space-between',
                                                                                    width: '100%',
                                                                                    gap: '10px',
                                                                                }}
                                                                            >

                                                                                {/* PRODUCT NAME */}
                                                                                <Box
                                                                                    sx={{
                                                                                        flex: 1,
                                                                                        overflow: 'hidden',
                                                                                        textOverflow: 'ellipsis',
                                                                                        whiteSpace: 'nowrap',
                                                                                    }}
                                                                                >
                                                                                    {row.product?.Productname}
                                                                                </Box>

                                                                                {/* AMC STATUS */}
                                                                                <Box
                                                                                    sx={{
                                                                                        display: 'flex',
                                                                                        alignItems: 'center',
                                                                                        minWidth: 'fit-content',
                                                                                    }}
                                                                                >
                                                                                    {(() => {

                                                                                        const today = new Date();

                                                                                        const amcFrom = row.product?.PrdAMCFrom
                                                                                            ? new Date(row.product.PrdAMCFrom)
                                                                                            : null;

                                                                                        const amcTo = row.product?.PrdAMCTo
                                                                                            ? new Date(row.product.PrdAMCTo)
                                                                                            : null;

                                                                                        const isAMCActive =
                                                                                            amcFrom &&
                                                                                            amcTo &&
                                                                                            today >= amcFrom &&
                                                                                            today <= amcTo;

                                                                                        const amcExpired =
                                                                                            amcTo && today > amcTo;

                                                                                        const isAMCNotAvailable =
                                                                                            !amcFrom && !amcTo;

                                                                                        return (
                                                                                            <>
                                                                                                {/* ACTIVE AMC */}
                                                                                                {isAMCActive && row.product?.Productname && (
                                                                                                    <Tooltip
                                                                                                        arrow
                                                                                                        placement="top"
                                                                                                        title={`AMC Active Till ${amcTo.toLocaleDateString(
                                                                                                            'en-GB',
                                                                                                            {
                                                                                                                day: '2-digit',
                                                                                                                month: 'short',
                                                                                                                year: 'numeric',
                                                                                                            }
                                                                                                        )}`}
                                                                                                    >
                                                                                                        <Typography
                                                                                                            variant="caption"
                                                                                                            sx={{
                                                                                                                fontWeight: 700,
                                                                                                                color: 'green',
                                                                                                                fontSize: '0.82rem',
                                                                                                            }}
                                                                                                        >
                                                                                                            AMC ACTIVE
                                                                                                        </Typography>
                                                                                                    </Tooltip>
                                                                                                )}

                                                                                                {/* EXPIRED AMC */}
                                                                                                {amcExpired && row.product?.Productname && (
                                                                                                    <Tooltip
                                                                                                        arrow
                                                                                                        placement="top"
                                                                                                        title={`AMC Expired On ${amcTo.toLocaleDateString(
                                                                                                            'en-GB',
                                                                                                            {
                                                                                                                day: '2-digit',
                                                                                                                month: 'short',
                                                                                                                year: 'numeric',
                                                                                                            }
                                                                                                        )}`}
                                                                                                    >
                                                                                                        <Typography
                                                                                                            variant="caption"
                                                                                                            sx={{
                                                                                                                fontWeight: 700,
                                                                                                                color: 'red',
                                                                                                                fontSize: '0.82rem',
                                                                                                            }}
                                                                                                        >
                                                                                                            AMC EXPIRED
                                                                                                        </Typography>
                                                                                                    </Tooltip>
                                                                                                )}

                                                                                                {/* NO AMC */}
                                                                                                {isAMCNotAvailable && row.product?.Productname && (
                                                                                                    <Tooltip
                                                                                                        arrow
                                                                                                        placement="top"
                                                                                                        title="No AMC Available"
                                                                                                    >
                                                                                                        <Typography
                                                                                                            variant="caption"
                                                                                                            sx={{
                                                                                                                fontWeight: 700,
                                                                                                                color: 'red',
                                                                                                                fontSize: '0.82rem',
                                                                                                            }}
                                                                                                        >
                                                                                                            NO AMC
                                                                                                        </Typography>
                                                                                                    </Tooltip>
                                                                                                )}
                                                                                            </>
                                                                                        );
                                                                                    })()}
                                                                                </Box>
                                                                            </span>
                                                                        </Tooltip>
                                                                    </TableCell>
                                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                        <Tooltip title={row.work} arrow placement="bottom">
                                                                            <span style={{ textAlign: 'center' }}>{row.work}</span>
                                                                        </Tooltip></TableCell>
                                                                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                        <Tooltip title={row.details} arrow placement="bottom">
                                                                            <span style={{ textAlign: 'center' }}>{row.details}</span>
                                                                        </Tooltip></TableCell>

                                                                    <TableCell sx={{ textAlign: 'center' }}>
                                                                        <Chip
                                                                            label={row.priority || "Low"}
                                                                            size="medium"
                                                                            sx={{
                                                                                width: 90,
                                                                                justifyContent: "center",
                                                                                fontWeight: 600,
                                                                                fontSize: '0.8rem',
                                                                                height: 28,
                                                                                borderRadius: '6px',
                                                                                backgroundColor:
                                                                                    row.priority === "High"
                                                                                        ? "rgba(255, 77, 79, 0.12)"
                                                                                        : row.priority === "Medium"
                                                                                            ? "rgba(250, 173, 20, 0.12)"
                                                                                            : "rgba(82, 196, 26, 0.12)",
                                                                                color:
                                                                                    row.priority === "High"
                                                                                        ? "#cf1322"
                                                                                        : row.priority === "Medium"
                                                                                            ? "#d48806"
                                                                                            : "#389e0d",
                                                                                border:
                                                                                    row.priority === "High"
                                                                                        ? "1px solid rgba(255, 77, 79, 0.3)"
                                                                                        : row.priority === "Medium"
                                                                                            ? "1px solid rgba(250, 173, 20, 0.3)"
                                                                                            : "1px solid rgba(82, 196, 26, 0.3)",
                                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                                                                            }}
                                                                        />
                                                                    </TableCell>

                                                                    <TableCell sx={{ textAlign: 'center' }}>
                                                                        <Button
                                                                            disabled={isReadOnly}
                                                                            fullWidth
                                                                            sx={{
                                                                                textTransform: 'none',
                                                                                height: '28px',
                                                                                whiteSpace: 'nowrap',
                                                                                width: { xs: '100%', sm: "100px" },
                                                                                color: '#fff',
                                                                                backgroundColor: '#DC3545',
                                                                                '&.Mui-disabled': {
                                                                                    backgroundColor: '#DC3545',
                                                                                    color: '#f5f7fa',
                                                                                    // opacity: 0.6
                                                                                }
                                                                            }}

                                                                            onClick={() => {
                                                                                setPendingUpdateIndex(index);   // 🔥 store row index
                                                                                setNote(row.latestStatus || "");        // optional: preload existing note
                                                                                setStatus(row.progress || 1);
                                                                                setUserInfo(row.userinfo)
                                                                                setVisibleUpt(true);
                                                                            }}                                                                        >
                                                                            Add Update
                                                                        </Button>
                                                                    </TableCell>

                                                                    <TableCell sx={{
                                                                        whiteSpace: 'normal',        // allow wrapping
                                                                        wordBreak: 'break-word',     // break long words
                                                                        overflowWrap: 'break-word',  // fallback for long text
                                                                    }}>
                                                                        <Tooltip title={row.latestStatus}>
                                                                            <span>
                                                                                {row.latestStatus}
                                                                            </span>
                                                                        </Tooltip>
                                                                    </TableCell>

                                                                    <TableCell><VisibilityIcon sx={{ fontSize: 22 }}
                                                                        onClick={() => {
                                                                            handlePrint(editingTicket?.TicketNo, row.statuskey)
                                                                        }} /></TableCell>

                                                                    <TableCell>
                                                                        <DeleteIcon
                                                                            sx={{
                                                                                cursor: 'pointer',
                                                                                fontSize: 22
                                                                            }}
                                                                            onClick={() => {
                                                                                setPendingDeleteRow(row);
                                                                                setPendingDeleteIndex(index);
                                                                                setConfirmDeleteOpen(true);
                                                                            }}
                                                                        />
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        )}
                                                    </TableBody>
                                                </Table>

                                            </TableContainer>
                                        </Grid>


                                        <Grid item xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>

                                            <Button
                                                disabled={isReadOnly}
                                                sx={{
                                                    textTransform: 'none',
                                                    marginTop: 1,
                                                    marginRight: 1,
                                                    height: '35px',
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
                                                    '&.Mui-disabled': {
                                                        backgroundColor: '#DC3545',
                                                        color: '#f5f7fa',
                                                        // opacity: 0.6
                                                    }
                                                }}
                                                variant="contained"
                                                onClick={handleNew}
                                            >
                                                New
                                            </Button>

                                            <Button
                                                disabled={isReadOnly || isSaving}
                                                sx={{
                                                    textTransform: 'none',
                                                    marginTop: 1,
                                                    marginRight: 1,
                                                    height: '35px',
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
                                                    '&.Mui-disabled': {
                                                        backgroundColor: '#DC3545',
                                                        color: '#f5f7fa',
                                                        cursor: 'not-allowed',
                                                        pointerEvents: 'auto'
                                                    }
                                                }}
                                                variant="contained"
                                                onClick={handleSaveTicket}
                                            >
                                                Save
                                            </Button>
                                        </Grid>

                                    </Grid>
                                </CardContent>
                            </Card>

                        </Grid>

                    </Grid>


                </CModalBody>

            </CModal>

            <Updatemodal

                visibleUpt={visibleUpt}
                setVisibleUpt={setVisibleUpt}
                dateTime={dateTime}
                note={note}
                setNote={setNote}
                pendingUpdateIndex={pendingUpdateIndex}
                setPendingUpdateIndex={setPendingUpdateIndex}
                onSave={onSave}
                status={status}
                setStatus={setStatus}
                userInfo={userInfo}
                rows={rows}
                name={name}
            />

            {/* ---------------------------------------------- */}

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        px: 1,
                        py: 1,
                    }
                }}>

                <DialogContent>
                    Are you sure you want to update this row?
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {
                        setConfirmOpen(false);
                        setPendingEdit(null);
                    }}>
                        No
                    </Button>

                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#DC3545' }}
                        onClick={() => {
                            if (pendingEdit) {
                                handleEdit(pendingEdit.row, pendingEdit.index);
                            }
                            setConfirmOpen(false);
                            setPendingEdit(null);
                        }}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ---------------------------------------------- */}

            <Dialog open={confirmDeleteOpen} onClose={handleConfirmDeleteNo}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        px: 1,
                        py: 1,
                    }
                }}>

                <DialogContent>
                    Are you sure you want to delete this row?
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleConfirmDeleteNo}>No</Button>
                    <Button onClick={handleConfirmDeleteYesRow} color="error" variant="contained"
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    )
}

export default NewTicket
