import { format } from 'date-fns';
import React, { useState } from 'react';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteIcon from "@mui/icons-material/Delete";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
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

function Leads({ visible, setVisible, size = 'xl' }) {



  const { modalClass } = useModal();
  // State management
  const [topDateTime, setTopDateTime] = useState(new Date());
  const [leadId, setLeadId] = useState('');

  // Customer details
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [place, setPlace] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [leadSource, setLeadSource] = useState('');
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
  const [leadType, setLeadType] = useState('');
  const [doubtfulLead, setDoubtfulLead] = useState(false);

  // Add Item to Enquired Table
  const handleAddItem = () => {
    if (!product && !note && !qty && !value) return;
    setEnquiredItems([
      ...enquiredItems,
      { id: Date.now(), product, note, qty, value }
    ]);
    setProduct('');
    setNote('');
    setQty('');
    setValue('');
  };

  const handleDeleteItem = (id) => {
    setEnquiredItems(enquiredItems.filter(item => item.id !== id));
  };

  const handleNew = () => {
    setCustomerPhone('');
    setCustomerName('');
    setPlace('');
    setAssignedTo('');
    setLeadSource('');
    setLeadSourceLocation('');
    setProduct('');
    setNote('');
    setQty('');
    setValue('');
    setEnquiredItems([]);
    setRemarks('');
    setFollowUpRequired(false);
    setFollowUpDateTime(new Date());
    setLeadType('');
    setDoubtfulLead(false);
  };

  const handleSave = () => {
    alert('Lead saved successfully!');
  };

  return (
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

      <CModalBody classmstName='c-modal-body no-scroll ' style={{
        zoom: "0.8",
        backgroundColor: "rgba(242,242,242,0.95)",
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
                        value={leadId}
                        onChange={(e) => setLeadId(e.target.value)}
                        placeholder="Auto"
                        sx={{
                          width: { xs: '100%', sm: 220 },
                          backgroundColor: '#fff',
                          '& .MuiInputBase-input': {
                            padding: '8px',
                            fontSize: '0.95rem',
                            fontWeight: 'bold'
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
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
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
                        <MenuItem value="Staff 1">Staff 1</MenuItem>
                        <MenuItem value="Staff 2">Staff 2</MenuItem>
                        <MenuItem value="Manager">Manager</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Lead Source"
                        size="small"
                        fullWidth
                        select
                        value={leadSource}
                        onChange={(e) => setLeadSource(e.target.value)}
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
                        <MenuItem value="Dealer">Dealer</MenuItem>
                        <MenuItem value="SocialMedia">Social Media</MenuItem>
                        <MenuItem value="Website">Website</MenuItem>
                        <MenuItem value="Referral">Referral</MenuItem>
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
                      <TextField
                        label="Product"
                        type="text"
                        size="small"
                        fullWidth
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
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
                        type="number"
                        size="small"
                        fullWidth
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
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

                    <Grid item xs={6} sm={2} md={2}>
                      <TextField
                        label="Value"
                        type="number"
                        size="small"
                        fullWidth
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
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

                    <Grid item xs={12} sm={1} md={1.5} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        onClick={handleAddItem}
                        variant="contained"
                        fullWidth
                        sx={{
                          textTransform: 'none',
                          height: '38px',
                          color: '#f5f7fa',
                          backgroundColor: '#6366F1',
                          '&:hover': {
                            backgroundColor: '#4F46E5',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
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
                            md: 'calc(100vh - 500px)',
                            lg: 'calc(100vh - 505px)',
                            xl: 'calc(100vh - 508px)'
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
                    <Grid item xs={12} sm={4} md={3} display="flex" alignItems="center">
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

                    <Grid item xs={12} sm={4} md={4}>
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

                    <Grid item xs={12} sm={4} md={5} />

                    {/* Row 2: Lead type & Doubt full Lead */}
                    <Grid item xs={12} sm={4} md={3}>
                      <TextField
                        label="Lead Type"
                        size="small"
                        fullWidth
                        select
                        value={leadType}
                        onChange={(e) => setLeadType(e.target.value)}
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
                        <MenuItem value="Organic">Organic</MenuItem>
                        <MenuItem value="Bulk">Bulk</MenuItem>
                        <MenuItem value="Cold">Cold</MenuItem>
                        <MenuItem value="Hot">Hot</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={4} md={4} display="flex" alignItems="center">
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
                    <Grid item xs={12} sm={4} md={5} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, alignItems: 'center' }}>
                      <Button
                        onClick={handleNew}
                        variant="contained"
                        sx={{
                          textTransform: 'none',
                          height: '38px',
                          width: '100px',
                          color: '#f5f7fa',
                          backgroundColor: '#6366F1',
                          '&:hover': {
                            backgroundColor: '#4F46E5',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                          },
                        }}
                      >
                        New
                      </Button>

                      <Button
                        onClick={handleSave}
                        variant="contained"
                        sx={{
                          textTransform: 'none',
                          height: '38px',
                          width: '100px',
                          color: '#f5f7fa',
                          backgroundColor: '#10B981',
                          '&:hover': {
                            backgroundColor: '#059669',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
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
  );
}

export default Leads;



