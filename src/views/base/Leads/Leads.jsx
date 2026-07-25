import { format } from 'date-fns';
import React, { useEffect, useState } from 'react'
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Card, CardContent, Checkbox, FormControlLabel, Grid, Paper, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, IconButton, InputAdornment, MenuItem } from '@mui/material'

function Leads() {


  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [remarksDateTime, setRemarksDateTime] = useState(new Date());
  return (
    <>


      <Grid container spacing={1} >

        <Grid item xs={6} sm={4} lg={5} >
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
            Leads
          </Typography>

        </Grid>

        <Grid item xs={6} sm={4} md={4} lg={4} >
          <Typography
            variant="h6"
            component="div"
            display="flex"
            alignItems="center"
            textAlign="center"
            color="#DC3545"
            sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              marginTop: { xs: '-20px', sm: '-20px', md: "-20px", lg: "-20px", xl: "-20px" }
            }}
          >

            Date/Time: {format(new Date(), "dd-MMM-yyyy hh:mm aa")}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={4} md={4} lg={3} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography
            variant="h6"
            component="div"
            display={'flex'}
            alignItems={'center'}
            textAlign={'center'}
            color={'#DC3545'}
            sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              marginTop: { xs: '-20px', sm: '-20px', md: "-20px", lg: "-20px", xl: "-20px" }
            }}
          >
            LeadId: N/A
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Card sx={{
            backgroundColor: 'transparent',
            boxShadow: 'none',
            border: '1px solid #d1d5db', // light gray border
            borderRadius: 2,
          }}>
            <CardContent>

              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} lg={6}>

                  <TextField label="Customer Phone Number" type="text" size="small" fullWidth

                    sx={{
                      backgroundColor: '#fff',
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
                <Grid item xs={12} sm={6} lg={6}>

                  <TextField label="Customer Name" type="text" size="small" fullWidth

                    sx={{
                      backgroundColor: '#fff',
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


                <Grid item xs={12} sm={3} lg={3}>

                  <TextField label="Place" type="text" size="small" fullWidth

                    sx={{
                      backgroundColor: '#fff',
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


                <Grid item xs={12} sm={3} lg={3}>

                  <TextField label="Assigned to" type="text" size="small" fullWidth
                    select
                    sx={{
                      backgroundColor: '#fff',
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


                <Grid item xs={12} sm={3} lg={3}>

                  <TextField label="Lead Source" type="text" size="small" fullWidth
                    select
                    sx={{
                      backgroundColor: "#fff",
                      fontSize: "1rem",
                      height: 40,

                      "& .MuiOutlinedInput-root": {
                        height: 40,
                      },

                      "& .MuiOutlinedInput-root.Mui-focused": {
                        backgroundColor: "var(--focus-bg-color)",
                      },

                      "& .MuiSelect-select": {
                        padding: "8px",
                        fontSize: "0.95rem",
                      },
                    }}>

                    <MenuItem value="Dealer">Dealer</MenuItem>
                    <MenuItem value="SocialMedia">SocialMedia</MenuItem>
                  </TextField>

                </Grid>


                <Grid item xs={12} sm={3} lg={3}>

                  <TextField label="Lead Source Location" type="text" size="small" fullWidth

                    sx={{
                      backgroundColor: '#fff',
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
              </Grid>


            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12}>



          <Card sx={{
            backgroundColor: 'transparent',
            boxShadow: 'none',
            border: '1px solid #d1d5db', // light gray border
            borderRadius: 2,
          }}>
            <CardContent>


              <Grid container spacing={1}>

                <Grid item xs={12} sm={12}>
                  <Typography variant="subtitle1" sx={{ color: '#DC3545', fontWeight: 600 }}>
                    Enquired For
                  </Typography>


                </Grid>

                <Grid item sm={3} lg={3}>

                  <TextField label="Product" type="text" size="small" fullWidth

                    sx={{
                      backgroundColor: '#fff',
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

                <Grid item sm={5} lg={4.5}>

                  <TextField label="Note" type="text" size="small" fullWidth

                    sx={{
                      backgroundColor: '#fff',
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

                <Grid item sm={1} lg={1.5}>

                  <TextField label="Qty" type="text" size="small" fullWidth

                    sx={{
                      backgroundColor: '#fff',
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

                <Grid item sm={2} lg={2}>

                  <TextField label="Value" type="text" size="small" fullWidth

                    sx={{
                      backgroundColor: '#fff',
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


                <Grid item xs={12} sm={1} md={1} lg={1} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button

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


                  >
                    Add
                  </Button>
                </Grid>


                <Grid item xs={12}>

                  <TableContainer
                    component={Paper}
                    sx={{
                      height: {
                        xs: 'calc(100vh - 300px)',
                        sm: 'calc(100vh - 460px)',
                        md: 'calc(100vh - 460px)',
                        lg: 'calc(100vh - 430px)',
                        xl: 'calc(100vh - 440px)'
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
                          <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '10%', fontWeight: 'bold' }}>Product</TableCell>
                          <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '12%', fontWeight: 'bold' }}>Note</TableCell>
                          <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>Qty</TableCell>
                          <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '8%', fontWeight: 'bold' }}>Value</TableCell>
                          {/* <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}><VisibilityIcon sx={{ fontSize: 22, ml: 1 }} /></TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}><DeleteIcon sx={{ fontSize: 22, ml: 1 }} /></TableCell> */}
                        </TableRow>
                      </TableHead>

                    </Table>

                  </TableContainer>

                </Grid>

              </Grid>

            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>



          <Card sx={{
            backgroundColor: 'transparent',
            boxShadow: 'none',
            border: '1px solid #d1d5db', // light gray border
            borderRadius: 2,
          }}>
            <CardContent>

              <Grid container spacing={1}>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField label="Remarks" type="text" size="small" fullWidth
                    multiline
                    rows={2}

                    sx={{
                      backgroundColor: '#fff',


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

                <Grid item xs={12} sm={4} md={4} lg={2}>


                  <FormControlLabel
                    control={<Checkbox size="small"
                      checked={followUpRequired}
                      onChange={(e) => setFollowUpRequired(e.target.checked)}
                      sx={{
                        color: 'grey',
                        '&.Mui-checked': {
                          color: '#DC3545!important',
                        },
                      }} />}
                    label="Follow Up Required"
                  />
                </Grid>


                {followUpRequired && (
                  <Grid item xs={12} sm={4} lg={3}>

                    <DatePicker
                      selected={remarksDateTime}
                      onChange={(date) => setRemarksDateTime(date)}
                      showTimeSelect
                      timeIntervals={15}
                      dateFormat="dd-MMM-yyyy hh:mm aa"
                      popperPlacement="top-start"
                      portalId="root-portal"
                      customInput={
                        <TextField
                          label="Date Time"
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
                            backgroundColor: "#fff",
                            fontSize: "1rem",
                            height: 40,
                            "& .MuiInputBase-input": {
                              padding: "8px",
                              fontSize: "0.95rem",
                            },
                            "& .MuiOutlinedInput-root.Mui-focused": {
                              backgroundColor: "var(--focus-bg-color)",
                            },
                          }}
                        />
                      }
                    />
                  </Grid>
                )}

                <Grid item xs={12} sm={4} lg={3}>

                  <TextField label="Lead Type" type="text" size="small" fullWidth
                    select
                    sx={{
                      backgroundColor: "#fff",
                      fontSize: "1rem",
                      height: 40,

                      "& .MuiOutlinedInput-root": {
                        height: 40,
                      },

                      "& .MuiOutlinedInput-root.Mui-focused": {
                        backgroundColor: "var(--focus-bg-color)",
                      },

                      "& .MuiSelect-select": {
                        padding: "8px",
                        fontSize: "0.95rem",
                      },
                    }}
                  >
                    <MenuItem value="Organic">Organic</MenuItem>
                    <MenuItem value="Bulk">Bulk</MenuItem>
                  </TextField>

                </Grid>


                <Grid item xs={12} sm={6} md={6} lg={2}>


                  <FormControlLabel
                    control={<Checkbox size="small"

                      sx={{
                        color: 'grey',
                        '&.Mui-checked': {
                          color: '#DC3545!important',
                        },
                      }} />}
                    label="Doubt Full Lead"
                  />
                </Grid>


                <Grid item xs={12} sm={6} md={6} lg={followUpRequired ? 2 : 5} style={{ display: 'flex', justifyContent: 'flex-end' }}>

                  <Button

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

                  >
                    New
                  </Button>

                  <Button

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

                  >
                    Save
                  </Button>
                </Grid>


              </Grid>
            </CardContent>
          </Card>




        </Grid>


      </Grid>


    </>
  )
}

export default Leads


