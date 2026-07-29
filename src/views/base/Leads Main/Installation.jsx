import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React from 'react'

function Installation() {
  return (
    <div>
        <Grid container spacing={1}>
      
                      <Grid item xs={12}>
      
                          <TableContainer
                              component={Paper}
                              sx={{
                                  height: {
                                      xs: 'calc(100vh - 400px)',
                                      sm: 'calc(100vh - 550px)',
                                      md: 'calc(100vh - 500px)',
                                      lg: 'calc(100vh - 135px)',
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
                                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '6%', }}>SlNo</TableCell>
                                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '8%', }}>Date</TableCell>
                                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '6%', }}>LeadId</TableCell>
                                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '12%', }}>CustName</TableCell>
                                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '10%', }}>PhnNo</TableCell>
                                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '10%', }}>Bussiness Val</TableCell>
                                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '10%', }}>LeadQuality</TableCell>
                                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '10%', }}>Assigning</TableCell>
                                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '10%', }}>Last Followup</TableCell>
                                      </TableRow>
                                  </TableHead>
                                  <TableBody>
                                   
                                  </TableBody>
                              </Table>
                          </TableContainer>
      
      
                      </Grid>
      
                  </Grid>
    </div>
  )
}

export default Installation
