import {
  Card, CardContent, Grid, Box, Typography
} from '@mui/material';
import './Dashboard.css';
import { PieChart } from '@mui/x-charts';
import CIcon from '@coreui/icons-react';
import { cilArrowTop } from '@coreui/icons';
import { CChartBar, CChartLine } from '@coreui/react-chartjs';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BiotechIcon from '@mui/icons-material/Biotech';
import GppBadIcon from '@mui/icons-material/GppBad';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

import {
  CCol, CRow,
  CWidgetStatsA
} from '@coreui/react';
import './Dashboard.css';

const Technical = ({ getTechnical, setGetTechnical }) => {

  //pie chart
  const rawData = [
    { id: 0, value: getTechnical?.Issued, label: 'Issued', color: '#00C49F' },
    { id: 1, value: getTechnical?.TimeOver, label: 'Timeover', color: '#FF6B6B' },
    { id: 2, value: getTechnical?.Canceled, label: 'Cancelled', color: '#A29BFE' },
    { id: 3, value: getTechnical?.OnProcessing, label: 'Onproccess', color: '#FFD93D' },
    { id: 4, value: getTechnical?.Urgent, label: 'Urgent', color: '#FF4E50' },
    { id: 5, value: getTechnical?.ResultUpdated, label: 'Updated', color: '#1E90FF' },
    { id: 6, value: getTechnical?.HalfVarified, label: 'Half Verified', color: '#FFB347' },
    { id: 7, value: getTechnical?.TimeOverReminder, label: 'Reminder', color: '#4BC0C0' },
  ];

  // Calculate total only from filtered values
  const total = rawData.reduce((sum, item) => sum + item.value, 0);

  return (
    <>
      <CRow>
        <CCol sm={3}>
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            value={
              <>
                {getTechnical?.Totalbillcount}
                <span className="fs-6 fw-normal">
                  {/* (40.9% <CIcon icon={cilArrowTop} />) */}
                </span>
              </>
            }
            title="Total Bills"

            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                  datasets: [
                    {
                      label: 'My First dataset',
                    backgroundColor:'var(--primary-btn-background)',
                      borderColor: 'rgba(255,255,255,.55)',
                      pointBackgroundColor: '#5856d6',
                      data: [65, 59, 84, 84, 51, 55, 40],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      border: {
                        display: false,
                      },
                      grid: {
                        display: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      min: 30,
                      max: 89,
                      display: false,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 1,
                      tension: 0.4,
                    },
                    point: {
                      radius: 4,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>
        <CCol sm={3}>
          <CWidgetStatsA
            className="mb-4"
            color="info"
            value={
              <>
                {getTechnical?.Completedcount}
                <span className="fs-6 fw-normal">
                  {/* (40.9% <CIcon icon={cilArrowTop} />) */}
                </span>
              </>
            }
            title="Completed"

            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                  datasets: [
                    {
                      label: 'My First dataset',
                    backgroundColor:'var(--primary-btn-background)',
                      borderColor: 'rgba(255,255,255,.55)',
                      pointBackgroundColor: '#39f',
                      data: [1, 18, 9, 17, 34, 22, 11],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      border: {
                        display: false,
                      },
                      grid: {
                        display: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      min: -9,
                      max: 39,
                      display: false,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 1,
                    },
                    point: {
                      radius: 4,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>
        <CCol sm={3}>
          <CWidgetStatsA
            className="mb-4"
            color="warning"
            value={
              <>
                {getTechnical?.Pendingcount}
                <span className="fs-6 fw-normal">
                  {/* (40.9% <CIcon icon={cilArrowTop} />) */}
                </span>
              </>
            }
            title="Pending"

            chart={
              <CChartLine
                className="mt-3"
                style={{ height: '70px' }}
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                  datasets: [
                    {
                      label: 'My First dataset',
                      backgroundColor: 'rgba(255,255,255,.2)',
                      borderColor: 'rgba(255,255,255,.55)',
                      data: [78, 81, 80, 45, 34, 12, 40],
                      fill: true,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      display: false,
                    },
                    y: {
                      display: false,
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 2,
                      tension: 0.4,
                    },
                    point: {
                      radius: 0,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>
        <CCol sm={3}>
          <CWidgetStatsA
            className="mb-4"
            color="danger"
            value={
              <>
                {getTechnical?.Urgent}
                <span className="fs-6 fw-normal">
                  {/* (40.9% <CIcon icon={cilArrowTop} />) */}
                </span>
              </>
            }
            title="Urgent"

            chart={
              <CChartBar
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                    'January',
                    'February',
                    'March',
                    'April',
                  ],
                  datasets: [
                    {
                      label: 'My First dataset',
                      backgroundColor: 'rgba(255,255,255,.2)',
                      borderColor: 'rgba(255,255,255,.55)',
                      data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                      barPercentage: 0.6,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                        drawTicks: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      border: {
                        display: false,
                      },
                      grid: {
                        display: false,
                        drawTicks: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            }
          />
        </CCol>
      </CRow>

      <Grid container spacing={1}>
        <Grid item xs={12} md={12} lg={6}>
          <Card sx={{ height: '95%' }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      width: '100%',
                      maxWidth: 400,
                      margin: '0 auto',
                    }}
                  >
                    <PieChart
                      series={[
                        {
                          data: rawData,
                          innerRadius: 30,
                          outerRadius: 160,
                          paddingAngle: 2,
                          cornerRadius: 4,
                          valueFormatter: ({ value }) =>
                            total > 0 ? `${((value / total) * 100).toFixed(1)}%` : '',
                          highlightScope: { fade: 'global', highlight: 'item' },
                          faded: { innerRadius: 40, additionalRadius: -30, color: 'gray' },
                        },
                      ]}
                      width={window.innerWidth < 600 ? 280 : 350}
                      height={window.innerWidth < 600 ? 300 : 400}
                    />
                    <Typography
                      variant="h6"
                      align="center"
                      fontFamily={'Segoe UI, Roboto, sans-serif'}
                      gutterBottom
                      sx={{ marginTop: -5 }}
                    >
                      Invoice Registration Status
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={6} xl={6}>
          <Card sx={{
            height: '95%'
          }}>
            <CardContent>
              <Grid container spacing={3} sx={{
                marginBottom: 4
              }}>
                <Grid item sm={6} md={6} lg={6} xl={6}>
                  <div className="customer-card">
                    <div className="customer-header">
                      <span>Referal lab</span>
                      <div className="icon-card">
                        <BiotechIcon />
                      </div>
                    </div>
                    <div className="customer-number">{getTechnical?.ReferalCount}</div>
                  </div>
                </Grid>
                <Grid item sm={6} md={6} lg={6} xl={6}>
                  <div className="customer-card">
                    <div className="customer-header">
                      <span>Cancelled Invoices</span>
                      <div className="icon-card">
                        <GppBadIcon />
                      </div>
                    </div>
                    <div className="customer-number">{getTechnical?.CancelTotal}</div>
                  </div>
                </Grid>

              </Grid>
              <Grid container spacing={3} sx={{
                marginBottom: 4
              }} >
                <Grid item sm={6} md={6} lg={6} xl={6}>
                  <div className="customer-card">
                    <div className="customer-header">
                      <span>Finished</span>
                      <div className="icon-card">
                        <CheckCircleIcon />
                      </div>
                    </div>
                    <div className="customer-number">{getTechnical?.Completedcount}</div>

                  </div>
                </Grid>
                <Grid item md={6} lg={6} xl={6}>
                  <div className="customer-card">
                    <div className="customer-header">
                      <span>Half Verified</span>
                      <div className="icon-card">
                        <HourglassBottomIcon />
                      </div>
                    </div>
                    <div className="customer-number">{getTechnical?.HalfVarified}</div>
                  </div>
                </Grid>

              </Grid>
              {/* <Grid container spacing={3} sx={{
                marginBottom: 4
              }} >
                <Grid item lg={6} xl={6}>
                  <div className="customer-card">
                    <div className="customer-header">
                      <span>data 2</span>
                      <div className="icon-card">
                        <AssessmentIcon />
                      </div>
                    </div>
                    <div className="customer-number">44,725</div>

                  </div>
                </Grid>
                <Grid item lg={6} xl={6}>
                  <div className="customer-card">
                    <div className="customer-header">
                      <span>Data 3</span>
                      <div className="icon-card">
                        <AssessmentIcon />
                      </div>
                    </div>
                    <div className="customer-number">44,725</div>
                  </div>
                </Grid>

              </Grid> */}
            </CardContent>

          </Card>
        </Grid>
      </Grid >

    </>
  )
}

export default Technical;
