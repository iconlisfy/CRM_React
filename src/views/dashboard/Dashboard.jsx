import * as React from 'react';
import PropTypes from 'prop-types';
import './Dashboard.css';
import axiosInstance from '../../axios';
import getReduxState from '../../ReduxState';
import commonDefault from '../../assets/images/trans2.png'; // Ensure correct import path
import { Card, CardContent, Grid, Box, Typography, TextField, MenuItem, } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Dashboard() {

  const { empId, BrnchKey, role, deptid } = getReduxState()

  const [value, setValue] = React.useState(0);
  const [avatarSrc, setAvatarSrc] = React.useState(commonDefault);

  const [getDashBrdData, setGetDashBrdData] = React.useState([]) // technical dashboard data


  //  4 cards
  const widgetsData = [
    {
      title: 'Completed Works',
      value: `${getDashBrdData?.total_wrkcompleted ?? 0}`,
      // desc: 'Billed Amount',
      color: 'blue',
      graphType: 'polyline',
      graphData: {
        points: '0,28 40,22 80,36 120,20 160,40 200,28 240,36 280,2 320,26 360,10',
        fillPoints:
          '0,40 0,28 40,22 80,36 120,20 160,40 200,28 240,36 280,2 320,26 360,10 360,40',
      },
    },
    {
      title: 'Paused Works',
      value: `${getDashBrdData?.total_wrkpaused ?? 0 }`,
      // desc: `${getFinancial?.Patientsummry?.[0]?.Pendingcount || 0} Bills`,
      color: 'red',
      graphType: 'path-cubic',
      graphData: {
        d: 'M0,30 C60,10 120,50 180,20 S300,30 360,10',
      },
    },

    {
      title: 'Pending Works',
      value: `${getDashBrdData?.total_wrkpending ?? 0}`,
      desc: '',
      color: 'orange',
      graphType: 'path-step',
      graphData: {
        d: 'M0,30 L60,30 L60,20 L120,20 L120,10 L180,10 L180,30 L240,30 L240,20 L300,20 L300,10 L360,10',
      },
    },
    {
      title: 'Transfer Works',
      value: `${getDashBrdData?.total_wrktransferred ?? 0}`,
      color: 'green',
      graphType: 'polyline',
      graphData: {
        points: '0,20 60,22 100,36 120,20 180,40 200,28 240,36 280,2 300,26 360,10',
        fillPoints:
          '0,40 0,20 60,22 100,36 120,20 180,40 200,28 240,36 280,2 300,26 360,10 360,40',
      },
    },
  ];


  // Get the values from API
  const todayRequested = getDashBrdData?.TodayRequested || 0;
  const todayAccepted = getDashBrdData?.TodayAccepted || 0;
  const todayCompleted = getDashBrdData?.TodayCompleted || 0;

  // Total for percentage calculation
  const totalCount = todayRequested + todayAccepted + todayCompleted || 1; // avoid division by 0

  // Prepare pie chart data with percentage
  const pieData = [
    //{ id: 0, label: '', value: (todayRequested / totalCount) * 100 },
    // { id: 1, label: '', value: (todayAccepted / totalCount) * 100 },
    //{ id: 2, label: '', value: (todayCompleted / totalCount) * 100 },
  ];


  const [allStaff, setAllStaff] = React.useState([]);
  const [selectedStaff, setSelectedStaff] = React.useState(empId);

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

  React.useEffect(() => {
    fetchStaff()
  }, [])

  const isAdmin = role === "Administrator";
  const isHOD = role === "HOD";


  // Filter Staff According to Dept
  const filteredStaff = (() => {

    // Admin -> All Staff
    if (isAdmin) {
      return allStaff;
    }

    // HOD -> Only staff belonging to HOD's department
    if (isHOD) {
      return allStaff.filter(
        s => Number(s.Dept_id) === Number(deptid)
      );
    }

    // Normal User -> Only self
    return allStaff.filter(
      s => Number(s.ahmst_key) === Number(empId)
    );

  })();
  React.useEffect(() => {

    if (allStaff.length === 0) return;

    if (selectedStaff === "All") return;

    const staffExists = filteredStaff.some(
      staff => Number(staff.ahmst_key) === Number(selectedStaff)
    );

    if (!staffExists) {

      if (isAdmin) {
        setSelectedStaff("All");
      } else {
        setSelectedStaff(empId);
      }

    }

  }, [filteredStaff, allStaff, selectedStaff, isAdmin, empId]);


  React.useEffect(() => {
    const getDashBoardData = async () => {
      try {

        const dashboardEmpId =
          selectedStaff === "All"
            ? 0
            : selectedStaff;

        console.log("selectedStaff", selectedStaff);
        console.log("dashboardEmpId", dashboardEmpId);

        const apiurl = `DashboardAPI/Dashboard?EmpId=${empId}&BrnchId=${BrnchKey}&UsrGrp=${role}&FilterEmpId=${dashboardEmpId}`
        console.log("apiurl", apiurl);

        const res = await axiosInstance.get(apiurl);

        console.log("dashboard response", res.data);

        if (res.data?.data) {
          setGetDashBrdData(res.data.data);
        }

      } catch (error) {
        console.log(error);
      }
    };

    getDashBoardData();

  }, [selectedStaff, BrnchKey, empId, role]);
  return (
    <div >

      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Left Side */}
        <Grid item xs={12} md={6}>
          <div className="dashboard-header">
            <div className="dashboard-header-left">
              <div className="dashboard-header-title typewriter">
                Hi, welcome back!
              </div>
              <div className="dashboard-header-desc"></div>
            </div>
          </div>
        </Grid>

        {(isAdmin || isHOD) && (
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Staff"
              value={selectedStaff}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedStaff(value === "All" ? "All" : Number(value));
              }}
              sx={{
                mt: { xs: 2, md: 0 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
                "& .MuiOutlinedInput-root.Mui-focused": {
                  backgroundColor: "var(--focus-bg-color)",
                },
              }}
            >
              <MenuItem value="All">
                -- All --
              </MenuItem>

              {filteredStaff.map((staff) => (
                <MenuItem
                  key={staff.ahmst_key}
                  value={staff.ahmst_key}
                >
                  {staff.ahmst_pname}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}
      </Grid>
      <Grid container spacing={1} sx={{
        marginBottom: 1
      }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}  >
          <div className="dashboard-widgets">
            {widgetsData.map((widget, idx) => (
              <div
                key={idx}
                className={`widget ${widget.color}`}
                style={{
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0px 15px 35px rgba(3, 1, 1, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <div className="widget-title">{widget.title}</div>
                <div className="widget-value">{widget.value}</div>
                <div className="widget-desc">{widget.desc}</div>
                <div className="widget-footer">
                  <span className="icon">{widget.icon}</span>{widget.footer}
                </div>
                <svg className="widget-graph" viewBox="0 0 360 40" preserveAspectRatio="none">
                  {widget.graphType === 'polyline' && (
                    <>
                      <polygon
                        fill="rgba(255, 255, 255, 0.2)"
                        points={widget.graphData.fillPoints}
                      />
                      <polyline
                        fill="none"
                        stroke="#fff"
                        strokeWidth="1.5"
                        points={widget.graphData.points}
                      />
                    </>
                  )}

                  {widget.graphType === 'path-cubic' && (
                    <>
                      <path
                        d={`M0,40 ${widget.graphData.d.slice(1)} L360,40 Z`}
                        fill="rgba(255,255,255,0.2)"
                        className='ploy'
                      />
                      <path
                        d={widget.graphData.d}
                        fill="none"
                        stroke="#fff"
                        strokeWidth="1.5"
                        className='poly'
                      />
                    </>
                  )}

                  {widget.graphType === 'path-quadratic' && (
                    <>
                      <path
                        d={`M0,40 ${widget.graphData.d.slice(1)} L360,40 Z`}
                        fill="rgba(255,255,255,0.2)"
                        className='ploy'
                      />
                      <path
                        d={widget.graphData.d}
                        fill="none"
                        stroke="#fff"
                        strokeWidth="1.5"
                        className='poly'
                      />
                    </>
                  )}

                  {widget.graphType === 'path-step' && (
                    <>
                      <path
                        d={`M0,40 ${widget.graphData.d.slice(1)} L360,40 Z`}
                        fill="rgba(255,255,255,0.2)"
                        className='ploy'
                      />
                      <path
                        d={widget.graphData.d}
                        fill="none"
                        stroke="#fff"
                        strokeWidth="1.5"
                        className='poly'
                      />
                    </>
                  )}


                </svg>

              </div>
            ))}
          </div>

        </Grid>

      </Grid>



    </div>

  );
}
