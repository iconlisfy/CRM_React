import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteIcon from "@mui/icons-material/Delete";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SearchIcon from '@mui/icons-material/Search';
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
  Typography
} from '@mui/material';
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import closebtn from '../../../assets/images/Saki-NuoveXT-Actions-button-cancel.ico'
import useModal from '../../../components/UseModal';
import axiosInstance from '../../../axios';
import getReduxState from '../../../ReduxState';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

function Leads({ openLeadModal, setOpenLeadModal, size = 'xl' }) {

  const { modalClass } = useModal();


  const { role, deptid, name, empId, BrnchKey, dept, branch } = getReduxState()

  const isAdmin = role === "Administrator";

  // State management
  const [topDateTime, setTopDateTime] = useState(new Date());
  const [leadId, setLeadId] = useState('');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  // Customer details
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [place, setPlace] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [leadSourceLocation, setLeadSourceLocation] = useState('');

  // Enquired for inputs & table
  const [product, setProduct] = useState('');
  const [note, setNote] = useState('');
  const [qty, setQty] = useState('');
  const [value, setValue] = useState('');
  const [enquiredItems, setEnquiredItems] = useState([]);

  // Remarks & Follow up
  const [remarks, setRemarks] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDateTime, setFollowUpDateTime] = useState(new Date());
  const [doubtfulLead, setDoubtfulLead] = useState(false)

  const [allProducts, setAllProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productSearch, setProductSearch] = useState('');

  const [selectedLeadType, setSelectedLeadType] = useState('')
  const [selectedLeadSource, setSelectedLeadSource] = useState('')
  const [selectedLeadQuality, setSelectedLeadQuality] = useState('')

  const [allStaff, setAllStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(empId);

  const [leadSourceList, setLeadSourceList] = useState([]);
  const [leadTypeList, setLeadTypeList] = useState([]);
  const [leadQualityList, setLeadQualityList] = useState([])


  //===== Fetch latest Lead Id =====
  const fetchLatestId = async () => {
    try {
      const fetchResponse = await axiosInstance.get(`LeadSaveUpdateAPI/GetLeadNo`)


      if (fetchResponse.data && fetchResponse.data.next_LeadNo)
        setLeadId(fetchResponse.data.next_LeadNo)
    } catch (error) {
      console.log("Error while fetching latestId", error)
    }
  }

  //===== Add Item to Enquired Table =====
  const handleAddItem = () => {
    if (!selectedProduct) return;

    setEnquiredItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        productKey: selectedProduct?.mstr_key,
        product: selectedProduct?.desc || "",
        note,
        qty,
        value,
      },
    ]);

    // Clear inputs
    setSelectedProduct(null);
    setProductSearch("");
    setNote("");
    setQty("");
    setValue("");
  };

  const handleDeleteItem = (id) => {
    setDeleteItemId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteItem = () => {

    setEnquiredItems((prev) =>
      prev.filter(item => item.id !== deleteItemId)
    );

    setDeleteDialogOpen(false);
    setDeleteItemId(null);
  };


  const cancelDeleteItem = () => {
    setDeleteDialogOpen(false);
    setDeleteItemId(null);
  };


  //===== Reset Function ======
  const handleNew = () => {

    setCustomerPhone('');
    setCustomerName('');
    setPlace('');
    setSelectedStaff(isAdmin ? '' : empId);
    setSelectedLeadSource('');
    setLeadSourceLocation('');
    setSelectedProduct(null);
    setProductSearch('');
    setNote('');
    setQty('');
    setValue('');
    setEnquiredItems([]);
    setRemarks('');
    setFollowUpRequired(false);
    setFollowUpDateTime(new Date());
    setSelectedLeadType('');
    setSelectedLeadQuality('');
    setDoubtfulLead(false);
    setTopDateTime(new Date());
    fetchLatestId();
  };

  // Fetch Products
  const fetchProducts = async () => {
    try {

      const fetchResponse = await axiosInstance.get(`/ProductsAPI/GetAll`);

      if (fetchResponse.data?.products) {
        console.log("fetchResponse", fetchResponse)
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

  //===== Fetch Masters Data =====
  const fetchMasters = async () => {
    try {
      const fetchLeadSource = await axiosInstance.get(
        `MasterAPI/Search?Type=LeadSource`
      );

      if (fetchLeadSource.data?.MasterList) {
        setLeadSourceList(fetchLeadSource.data.MasterList);
      }


      const fetchLeadType = await axiosInstance.get(
        `MasterAPI/Search?Type=LeadType`
      );

      if (fetchLeadType.data?.MasterList) {
        setLeadTypeList(fetchLeadType.data.MasterList);
      }

      const fetchLeadQuality = await axiosInstance.get(
        `MasterAPI/Search?Type=LeadQlty`
      );

      if (fetchLeadQuality.data?.MasterList) {
        setLeadQualityList(fetchLeadQuality.data.MasterList);
      }

    } catch (error) {
      console.log("error while fetching all data", error);
    }
  };

  console.log("leadqua", leadQualityList)

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

  const filteredStaff = (() => {

    if (isAdmin) {
      return allStaff;
    }

    // Normal user
    return allStaff.filter(
      s => Number(s.ahmst_key) === Number(empId)
    );

  })();

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
    if (openLeadModal) {
      fetchProducts()
      fetchMasters()
      fetchStaff()
      fetchLatestId()
    }

  }, [openLeadModal])


  const generateLeadId = (key, prefix = branch) => {
    if (!key) return "";

    const keyStr = String(key);

    const totalLength = 6; // required numeric length
    const zeroCount = Math.max(totalLength - keyStr.length, 0);

    const zeros = "0".repeat(zeroCount);

    return prefix + zeros + keyStr;
  };

  //===== Save / Update Function =====
  const handleSaveUpdate = async () => {
    try {
      const requestData = {
        IsEdited: false,
        LeadNo: leadId,
        LeadCode: generateLeadId(leadId),
        LeadDate: format(topDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
        CustPhNo: customerPhone,
        CustName: customerName,
        Place: place,
        AssignTo: selectedStaff,
        LeadSourceId: selectedLeadSource,
        LeadLocation: leadSourceLocation,
        Remarks: remarks,
        IsFollowUpReq: followUpRequired,
        LeadTypeId: selectedLeadType,
        IsDoubtFull: doubtfulLead,
        FollowUpDate: followUpRequired
          ? format(followUpDateTime, "yyyy-MM-dd'T'HH:mm:ss")
          : null,

        LeadQuality: selectedLeadQuality,
        UserInfo: name,
        Products: enquiredItems.map((item) => ({
          Product: item.product,
          Note: item.note,
          Quantity: Number(item.qty || 0),
          Rate: Number(item.value || 0),
          UserInfo: name,
        })),
      };

      console.log("Request", requestData);

      const response = await axiosInstance.post(
        "/LeadSaveUpdateAPI/LeadSaveUpdate",
        requestData
      );

      console.log(response.data);

      if (response.data.status === true) {
        toast.success("Saved Succesfully" || response.data.message)
      }
      else {
        toast.error(response.data.message)
      }
      handleNew();
    } catch (error) {
      console.error("Error saving lead", error);
      toast.error("Failed to save lead");
    }
  };

  return (


    <>

      <CModal
        size={size}
        backdrop='static'
        classmstName={`${modalClass} modal custom-modal-close custom-modal-width custom-centered-modal`}  // Concatenate class mstNames correctly
        alignment="center"
        visible={openLeadModal}
        onClose={() => setOpenLeadModal(false)}
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
            Leads
          </CModalTitle>

          <button
            onClick={() => setOpenLeadModal(false)}
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


          <Box >
            {/* Top Header Title */}
            {/* <Typography
            variant="h5"
            sx={{
              color: '#4F46E5',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              // mb: 3,
              mt: -3
            }}
          >
            Leads
          </Typography> */}

            {/* Main Form Grid */}
            <Grid container spacing={1}>
              {/* Customer & Lead Source Details Card */}
              <Grid item xs={12}>
                <Card
                  sx={{
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    border: '1px solid #d1d5db',
                    borderRadius: 2,
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Grid container spacing={1.5}>
                      {/* Row 1: Date Time Picker (Left) & Lead Id (Right) */}
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ maxWidth: 300 }}>
                          <DatePicker
                            selected={topDateTime}
                            onChange={(date) => setTopDateTime(date)}
                            showTimeSelect
                            timeIntervals={15}
                            dateFormat="dd-MMM-yyyy hh:mm aa"
                            customInput={
                              <TextField
                                label="Date Time"
                                size="small"
                                fullWidth
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <CalendarTodayIcon sx={{ fontSize: 18, color: '#666' }} />
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
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <TextField
                          label="Lead Id"
                          size="small"
                          value={generateLeadId(leadId)}
                          // onChange={(e) => setLeadId(e.target.value)}
                          sx={{

                            width: { xs: '100%', sm: 220 },
                            backgroundColor: '#fff',
                            '& .MuiInputBase-input': {
                              padding: '8px',
                              fontSize: '0.95rem',
                              textAlign: 'right',
                            },
                            '& .MuiOutlinedInput-root.Mui-focused': {
                              backgroundColor: 'var(--focus-bg-color)',
                            },
                          }}
                        />
                      </Grid>

                      {/* Row 2: Customer Phone & Name */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Customer Phone Number"
                          type="text"
                          size="small"
                          fullWidth
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
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

                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Customer Name"
                          type="text"
                          size="small"
                          fullWidth
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
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

                      {/* Row 3: Place, Assign to, Lead Source, Lead Source location */}
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          label="Place"
                          type="text"
                          size="small"
                          fullWidth
                          value={place}
                          onChange={(e) => setPlace(e.target.value)}
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

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          label="Assign to"
                          size="small"
                          fullWidth
                          select
                          value={selectedStaff}
                          onChange={(e) => setSelectedStaff(e.target.value)}
                          sx={{
                            backgroundColor: '#fff',
                            '& .MuiOutlinedInput-root.Mui-focused': {
                              backgroundColor: 'var(--focus-bg-color)',
                            },
                            '& .MuiSelect-select': {
                              padding: '8px',
                              fontSize: '0.95rem',
                            },
                          }}
                        >

                          {filteredStaff.map(staff => (
                            <MenuItem key={staff.ahmst_key} value={staff.ahmst_key}>
                              {staff.ahmst_pname}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          label="Lead Source"
                          size="small"
                          fullWidth
                          select
                          value={selectedLeadSource}
                          onChange={(e) => setSelectedLeadSource(e.target.value)}
                          sx={{
                            backgroundColor: '#fff',
                            '& .MuiOutlinedInput-root.Mui-focused': {
                              backgroundColor: 'var(--focus-bg-color)',
                            },
                            '& .MuiSelect-select': {
                              padding: '8px',
                              fontSize: '0.95rem',
                            },
                          }}
                        >
                          {leadSourceList
                            ?.filter(item => item?.desc?.trim()) // remove empty names
                            .map((item) => (
                              <MenuItem key={item.mstr_key} value={item.mstr_key}>
                                {item.desc.trim()}
                              </MenuItem>
                            ))
                          }
                        </TextField>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          label="Lead Source Location"
                          type="text"
                          size="small"
                          fullWidth
                          value={leadSourceLocation}
                          onChange={(e) => setLeadSourceLocation(e.target.value)}
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
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Enquired For Card */}
              <Grid item xs={12}>
                <Card
                  sx={{
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    border: '1px solid #d1d5db',
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ color: '#4F46E5', fontWeight: 600, }}>
                          Enquired for
                        </Typography>
                      </Grid>

                      {/* Input Controls for Enquired Table */}
                      <Grid item xs={12} sm={3}>
                        <Autocomplete
                          size="small"
                          fullWidth
                          options={allProducts || []}
                          value={selectedProduct || null}

                          inputValue={productSearch}
                          onInputChange={(e, value) => setProductSearch(value)}

                          onChange={(e, value) => {
                            setSelectedProduct(value);
                          }}

                          getOptionLabel={(option) => option?.desc || ""}

                          isOptionEqualToValue={(option, value) =>
                            option?.mstr_key === value?.mstr_key
                          }
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              boxShadow: 'inset 4px 0 0 0 var(--search-side-color)',
                              '& .MuiAutocomplete-input': {
                                paddingLeft: '16px',
                              }
                            }
                          }}
                          renderOption={(props, option) => (
                            <li {...props}>
                              {highlightText(option.desc, productSearch)}
                            </li>
                          )}

                          renderInput={(params) => (
                            <TextField {...params} label="Select Product"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    <InputAdornment position="end">
                                      <SearchIcon />
                                    </InputAdornment>
                                    {params.InputProps.endAdornment} {/* keep dropdown arrow */}
                                  </>
                                ),
                              }}
                              sx={{
                                backgroundColor: '#fff',
                                fontSize: '1rem',
                                '& input': {
                                  padding: '8px',
                                  fontSize: '0.95rem',
                                  '&:focus': {
                                    backgroundColor: 'var(--focus-bg-color)',
                                  },
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Note"
                          type="text"
                          size="small"
                          fullWidth
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
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

                      <Grid item xs={6} sm={2} md={1.5}>
                        <TextField
                          label="Qty"
                          type="text"
                          size="small"
                          fullWidth
                          value={qty}

                          onChange={(e) => {
                            const value = e.target.value;

                            // allow only numbers
                            if (/^\d*$/.test(value)) {
                              setQty(value);
                            }
                          }}
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

                      <Grid item xs={6} sm={2} md={2.5}>
                        <TextField
                          label="Value"
                          type="text"
                          size="small"
                          fullWidth
                          value={value}

                          onChange={(e) => {
                            const value = e.target.value;

                            // allow only numbers
                            if (/^\d*$/.test(value)) {
                              setValue(value);
                            }
                          }}
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

                      <Grid item xs={12} sm={1} md={1} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                          onClick={handleAddItem}
                          variant="contained"
                          fullWidth
                          sx={{
                            textTransform: 'none',
                            height: '38px',
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
                          Add
                        </Button>
                      </Grid>

                      {/* Table displaying Enquired Items */}
                      <Grid item xs={12}>
                        <TableContainer
                          component={Paper}
                          sx={{
                            height: {
                              xs: 'calc(100vh - 400px)',
                              sm: 'calc(100vh - 550px)',
                              md: '170px',
                              lg: '170px',
                              xl: '170px'
                            },
                            width: '100%',
                            overflowX: 'auto',
                            overflowY: 'auto',
                            border: '1px solid #e0e0e0',
                            boxShadow: 'none',
                            '&::-webkit-scrollbar': { width: '6px' },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '3px' },
                            '&::-webkit-scrollbar-track': { backgroundColor: '#f0f0f0' },
                          }}
                        >
                          <Table stickyHeader size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '60px' }}>SlNo</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '650px' }}>Product</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '880px' }}>Note</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '450px' }}>Qty</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '400px' }}>Value</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '260px', textAlign: 'center' }}></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {enquiredItems.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={6} align="center" sx={{ color: '#888', py: 2 }}>
                                    No items added to enquiry yet.
                                  </TableCell>
                                </TableRow>
                              ) : (
                                enquiredItems.map((item, index) => (
                                  <TableRow key={item.id} hover>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.product}</TableCell>
                                    <TableCell>{item.note}</TableCell>
                                    <TableCell>{item.qty}</TableCell>
                                    <TableCell>{item.value}</TableCell>
                                    <TableCell align="center">
                                      <IconButton size="small" onClick={() => handleDeleteItem(item.id)} color="error">
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
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
              </Grid>

              {/* Remarks & Options Section */}
              <Grid item xs={12}>
                <Card
                  sx={{
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    border: '1px solid #d1d5db',
                    borderRadius: 2,
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Grid container spacing={1.5}>
                      <Grid item xs={12}>
                        <TextField
                          label="Remarks"
                          type="text"
                          size="small"
                          fullWidth
                          multiline
                          rows={2}
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          sx={{
                            backgroundColor: '#fff',
                            '& .MuiOutlinedInput-root.Mui-focused textarea': {
                              backgroundColor: 'var(--focus-bg-color)',
                            },
                          }}
                        />
                      </Grid>

                      {/* Followup & Date picker row */}
                      <Grid item xs={12} sm={6} md={3} display="flex" alignItems="center">
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              checked={followUpRequired}
                              onChange={(e) => setFollowUpRequired(e.target.checked)}
                              sx={{
                                color: 'grey',
                                '&.Mui-checked': {
                                  color: '#6366F1!important',
                                },
                              }}
                            />
                          }
                          label="Follow Up Required"
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <DatePicker
                          selected={followUpDateTime}
                          onChange={(date) => setFollowUpDateTime(date)}
                          showTimeSelect
                          timeIntervals={15}
                          dateFormat="dd-MMM-yyyy hh:mm aa"
                          disabled={!followUpRequired}
                          customInput={
                            <TextField
                              label="Date Time"
                              size="small"
                              fullWidth
                              disabled={!followUpRequired}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <CalendarTodayIcon sx={{ fontSize: 18, color: followUpRequired ? '#666' : '#ccc' }} />
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

                      <Grid item xs={12} sm={6} md={5} />

                      {/* Row 2: Lead type & Doubt full Lead */}
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          label="Lead Type"
                          size="small"
                          fullWidth
                          select
                          value={selectedLeadType}
                          onChange={(e) => setSelectedLeadType(e.target.value)}
                          sx={{
                            backgroundColor: '#fff',
                            '& .MuiOutlinedInput-root.Mui-focused': {
                              backgroundColor: 'var(--focus-bg-color)',
                            },
                            '& .MuiSelect-select': {
                              padding: '8px',
                              fontSize: '0.95rem',
                            },
                          }}
                        >
                          {leadTypeList
                            ?.filter(item => item?.desc?.trim()) // remove empty names
                            .map((item) => (
                              <MenuItem key={item.mstr_key} value={item.mstr_key}>
                                {item.desc.trim()}
                              </MenuItem>
                            ))
                          }
                        </TextField>
                      </Grid>


                      <Grid item xs={12} sm={6} md={2.5}>
                        <TextField
                          label="Lead Quality"
                          size="small"
                          fullWidth
                          select
                          value={selectedLeadQuality}
                          onChange={(e) => setSelectedLeadQuality(e.target.value)}
                          sx={{
                            backgroundColor: '#fff',
                            '& .MuiOutlinedInput-root.Mui-focused': {
                              backgroundColor: 'var(--focus-bg-color)',
                            },
                            '& .MuiSelect-select': {
                              padding: '8px',
                              fontSize: '0.95rem',
                            },
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


                      <Grid item xs={12} sm={6} md={4} display="flex" alignItems="center">
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              checked={doubtfulLead}
                              onChange={(e) => setDoubtfulLead(e.target.checked)}
                              sx={{
                                color: 'grey',
                                '&.Mui-checked': {
                                  color: '#6366F1!important',
                                },
                              }}
                            />
                          }
                          label="Doubt Full Lead"
                        />
                      </Grid>

                      {/* Bottom Right Buttons */}
                      <Grid item xs={12} sm={12} md={2.5} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, alignItems: 'center' }}>
                        <Button
                          onClick={handleNew}
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
                          New
                        </Button>

                        <Button
                          onClick={handleSaveUpdate}
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
              </Grid>
            </Grid>
          </Box>


        </CModalBody>

      </CModal>

      <ToastContainer autoClose={1000} hideProgressBar={true} position='top-center' theme='colored' transition={Bounce} />



      {/* ======================================================================== */}


      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDeleteItem}
      >


        <DialogContent>
          Are you sure you want to delete this item?
        </DialogContent>

        <DialogActions>
          <Button
            onClick={cancelDeleteItem}
            variant="outlined"
            sx={{
              textTransform: 'none'
            }}
          >
            No
          </Button>

          <Button
            onClick={confirmDeleteItem}
            variant="contained"
            color="error"
            sx={{
              textTransform: 'none'
            }}
          >
            Yes
          </Button>
        </DialogActions>

      </Dialog>

    </>

  );
}

export default Leads;



