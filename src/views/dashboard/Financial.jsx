import { Card, CardContent, Grid, Box, Typography, } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
// import { PieChart } from '@mui/x-charts';
import { PieChart } from '@mui/x-charts/PieChart';
const Financial = ({ getFinancial, avatarSrc }) => {

  //console.log("getFinancial", getFinancial);
  // console.log("getFinancial?.Patientsummry?.[0]?.totalNetAmts" , getFinancial?.Patientsummry?.[0]?.totalNetAmts);


  // const formatCurrency = (v) =>
  //   new Intl.NumberFormat('en-IN', {
  //     style: 'currency',
  //     currency: 'INR',
  //     maximumFractionDigits: 0,
  //   }).format(v || 0);


  //  4 cards
  const widgetsData = [

    {
      title: 'Total Requested',
      value: `${getFinancial?.Patientsummry?.[0]?.totalNetAmts || 0}`,
      desc: 'Billed Amount',
      // footer: '+427',
      // icon: '⏫',
      color: 'blue',
      graphType: 'polyline',
      graphData: {
        points: '0,28 40,22 80,36 120,20 160,40 200,28 240,36 280,2 320,26 360,10',
        fillPoints: '0,40 0,28 40,22 80,36 120,20 160,40 200,28 240,36 280,2 320,26 360,10 360,40'
      }
    },
    {
      title: 'Totally Accepted',
      value: `${getFinancial?.Patientsummry?.[0]?.PendingNetAmts || 0}`,
      desc: `${getFinancial?.Patientsummry?.[0]?.Pendingcount || 0} Bills`,
      // footer: '-23.09%',
      // icon: '⏬',
      color: 'red',
      graphType: 'path-cubic',
      graphData: {
        d: 'M0,30 C60,10 120,50 180,20 S300,30 360,10'
      }
    },
    {
      title: 'Total Completed',
      value: `${getFinancial?.Patientsummry?.[0]?.Totalbillcount || 0}`,
      desc: 'Bills',
      // footer: '52.09%',
      // icon: '⏫',
      color: 'green',
      graphType: 'path-quadratic',
      graphData: {
        d: 'M0,30 Q90,10 180,30 T360,10'
      }
    },
    {
      title: 'Total Amount',
      value: `${getFinancial?.Patientsummry?.[0]?.TotalExpense || 0}`,
      desc: '',
      // footer: '-152.3',
      // icon: '⏬',
      color: 'orange',
      graphType: 'path-step',
      graphData: {
        d: 'M0,30 L60,30 L60,20 L120,20 L120,10 L180,10 L180,30 L240,30 L240,20 L300,20 L300,10 L360,10'
      }
    },

    {
      title: 'Total Patient',
      value: `${getFinancial?.Patientsummry?.[0]?.totalNetAmts || 0}`,
      desc: 'Billed Amount',
      // footer: '+427',
      // icon: '⏫',
      color: 'green',
      graphType: 'polyline',
      graphData: {
        points: '0,28 40,22 80,36 120,20 160,40 200,28 240,36 280,2 320,26 360,10',
        fillPoints: '0,40 0,28 40,22 80,36 120,20 160,40 200,28 240,36 280,2 320,26 360,10 360,40'
      }
    },

    {
      title: 'Current due',
      value: `$${getFinancial?.Patientsummry?.[0]?.totalNetAmts || 0}`,
      desc: 'Billed Amount',
      footer: '+427',
      icon: '⏫',
      color: 'darkred',
      graphType: 'polyline',
      graphData: {
        points: '0,28 40,22 80,36 120,20 160,40 200,28 240,36 280,2 320,26 360,10',
        fillPoints: '0,40 0,28 40,22 80,36 120,20 160,40 200,28 240,36 280,2 320,26 360,10 360,40'
      }
    },

  ];


  // bar chart
  const TodaychartSettings = {
    yAxis: [
      {
        label: 'Daily Collection(₹)',
        width: 100,
      },
    ],
    height: 400,
    margin: { top: 40, bottom: 30, left: 8, right: 30 },
  };



  // second chart
  const todayData = [
    {
      name: 'Today',
      totalCollectedAmount: getFinancial?.Patientsummry?.[0]?.DlyColctAmt,
      cashCollection: getFinancial?.Patientsummry?.[0]?.DlyCashAmt,
      cardupiCollection: getFinancial?.Patientsummry?.[0]?.DlyCardUPIAmt,
      credit: getFinancial?.Patientsummry?.[0]?.DlyCorpAmt,
    },
  ];

  // const dataset = [
  //   { month: 'Jan', totalCollectedAmount: 0, cashCollection: 0, cardupiCollection: 0, credit: 0 },
  //   { month: 'Feb', totalCollectedAmount: 0, cashCollection: 0, cardupiCollection: 0, credit: 0 },
  //   { month: 'Mar', totalCollectedAmount: 0, cashCollection: 0, cardupiCollection: 0, credit: 0 },
  //   { month: 'Apr', totalCollectedAmount: 0, cashCollection: 0, cardupiCollection: 0, credit: 0 },
  //   { month: 'May', totalCollectedAmount: 0, cashCollection: 0, cardupiCollection: 0, credit: 0 },
  //   { month: 'Jun', totalCollectedAmount: 0, cashCollection: 0, cardupiCollection: 0, credit: 0 },
  //   { month: 'Jul', totalCollectedAmount: getFinancial?.Patientsummry?.[0]?.mlyColctAmt, cashCollection: getFinancial?.Patientsummry?.[0]?.mlyCashAmt, cardupiCollection: getFinancial?.Patientsummry?.[0]?.mlyCardUPIAmt, credit: getFinancial?.Patientsummry?.[0]?.mlyCorpAmt },
  //   { month: 'Aug', totalCollectedAmount: 0, cashCollection: 0, cardupiCollection: 0, credit: 0 },
  //   { month: 'Sep', totalCollectedAmount: 0, cashCollection: 0, cardupiCollection: 0, credit: 0 },
  //   { month: 'Oct', totalCollectedAmount: 0, cashCollection: 0, cardupiCollection: 0, credit: 0 },
  //   { month: 'Nov', totalCollectedAmount: 0, cashCollection: 0, cardupiCollection: 0, credit: 0 },
  //   { month: 'Dec', totalCollectedAmount: 0, cashCollection: 0, cardupiCollection: 0, credit: 0 },
  // ];


  const dataset = [
    {
      month: 'Jul',
      totalCollectedAmount: getFinancial?.Patientsummry?.[0]?.mlyColctAmt || 0,
      cashCollection: getFinancial?.Patientsummry?.[0]?.mlyCashAmt || 0,
      cardupiCollection: getFinancial?.Patientsummry?.[0]?.mlyCardUPIAmt || 0,
      credit: getFinancial?.Patientsummry?.[0]?.mlyCorpAmt || 0,
    }
  ];

  const valueFormatter = (value) => `₹${value}`;
  const Todayvalue = (value) => `₹${value}`;

  const monthychartsettings = {
    yAxis: [
      {
        label: 'Monthly Collection (₹)',
        width: 100,
      },
    ],
    height: 400,
    margin: { top: 40, bottom: 30, left: 8, right: 30 },
  };



  // doctor 
  // const Doctors = [
  //   {
  //     avatar: '',
  //     name: getFinancial?.listdr?.[0]?.Drname,
  //     info: `Bills : ${getFinancial?.listdr?.[0]?.DrBillcount}  | Bill Amount : ${getFinancial?.listdr?.[0]?.TotalBillAmt}`,
  //     usage: 15,
  //     usageColor: '#4caf50',

  //   },
  //   {
  //     avatar: '',
  //     name: 'Doc 2',
  //     info: 'Bills :15  | Bill Amount : 1500',

  //     usage: 10,
  //     usageColor: '#2196f3',
  //   },
  //   {
  //     avatar: '',
  //     name: 'Doc 3',
  //     info: 'Bills :15  | Bill Amount : 1500',
  //     usage: 74,
  //     usageColor: '#ff9800',

  //   },
  //   {
  //     avatar: '',
  //     name: 'Doc 4',
  //     info: 'Bills :15  | Bill Amount : 1500',

  //     usage: 98,
  //     usageColor: '#f44336',
  //   },
  //   {
  //     avatar: '',
  //     name: 'Doc 5',
  //     info: 'Bills :15  | Bill Amount : 1500',
  //     usage: 22,
  //     usageColor: '#2196f3'
  //   },
  //   {
  //     avatar: '',
  //     name: 'Doc 6',
  //     info: 'Bills :15  | Bill Amount : 1500',

  //     usage: 43,
  //     usageColor: '#4caf50',
  //   },

  // ];




  // user 
  // const users = [
  //   {
  //     avatar: '',
  //     name: getFinancial?.listUser?.[0]?.Usrname,
  //     info: `Bills : ${getFinancial?.listUser?.[0]?.UsrBillcount} | Bill Amount : ${getFinancial?.listUser?.[0]?.UsrTotalBillAmt}`,
  //     usage: 15,
  //     usageColor: '#4caf50',

  //   },
  //   {
  //     avatar: '',
  //     name: 'User 2',
  //     info: 'Bills :15  | Bill Amount : 1500',

  //     usage: 10,
  //     usageColor: '#2196f3',
  //   },
  //   {
  //     avatar: '',
  //     name: 'User 3',
  //     info: 'Bills :15  | Bill Amount : 1500',
  //     usage: 74,
  //     usageColor: '#ff9800',

  //   },
  //   {
  //     avatar: '',
  //     name: 'User 4',
  //     info: 'Bills :15  | Bill Amount : 1500',

  //     usage: 98,
  //     usageColor: '#f44336',
  //   },
  //   {
  //     avatar: '',
  //     name: 'User 5',
  //     info: 'Bills :15  | Bill Amount : 1500',
  //     usage: 22,
  //     usageColor: '#2196f3'
  //   },
  //   {
  //     avatar: '',
  //     name: 'User 6',
  //     info: 'Bills :15  | Bill Amount : 1500',

  //     usage: 43,
  //     usageColor: '#4caf50',
  //   },

  // ];

  const totalBills = getFinancial?.listdr?.reduce((acc, user) => acc + (user.DrBillcount || 0), 0);
  const totalUserBills = getFinancial?.listUser?.reduce((acc, user) => acc + (user.UsrBillcount || 0), 0);

  // const total = rawData.reduce((sum, item) => sum + item.value, 0);



  // Calculate total only from filtered values
  //   const rawData = [
  //   {
  //     id: 0,
  //     label: 'Completed',
  //     value: Number(getFinancial?.Patientsummry?.[0]?.CompletedCount) || 0,
  //   },
  //   {
  //     id: 1,
  //     label: 'Pending',
  //     value: Number(getFinancial?.Patientsummry?.[0]?.Pendingcount) || 0,
  //   },
  //   {
  //     id: 2,
  //     label: 'Rejected',
  //     value: Number(getFinancial?.Patientsummry?.[0]?.RejectedCount) || 0,
  //   },
  // ];
  // const total = 100;

  const rawData = [
    { id: 0, label: 'Completed', value: 60 },
    { id: 1, label: 'Pending', value: 25 },
    { id: 2, label: 'Rejected', value: 15 },
  ];



  const total = rawData.reduce((sum, item) => sum + item.value, 0);
  return (
    <div >
      <Grid container  >
        <Grid item xl={12}>

          <div className="dashboard-header">
            <div className="dashboard-header-left">
              <div className="dashboard-header-title typewriter" >Hi, welcome back!</div>
              <div className="dashboard-header-desc"></div>
            </div>
            <div className="dashboard-header-right">
              <div className="ratings">
                <span>Customer Ratings</span>
                <span className="stars">★ ★ ★ ★ ☆</span>
                <span className="rating-count">(14,873)</span>
              </div>
              <div className="stat blue-border">New Patients <b>{getFinancial?.Patientsummry?.[0]?.NewPatCount}</b></div>
              <div className="stat green-border">Existing Patients <b>{getFinancial?.Patientsummry?.[0]?.ExistingPatCount}</b></div>
            </div>
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={1} sx={{
        marginBottom: 1
      }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}  >
          <div className="dashboard-widgets">
            {widgetsData.map((widget, idx) => (

              <div key={idx} className={`widget ${widget.color}`}>
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
      <Grid container spacing={1} sx={{
        marginBottom: 1
      }}>
        <Grid item xs={12} sm={12} lg={6} xl={6}  >
          <Card sx={{ height: '95%' }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} >
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
                          innerRadius: 40,
                          outerRadius: 140,
                          paddingAngle: 2,
                          cornerRadius: 4,
                          valueFormatter: ({ value }) => `${value}%`,
                        },
                      ]}
                      width={350}
                      height={350}
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

        {/* <Grid item sm={12} lg={6} xl={6}  >
          <Card sx={{
            borderRadius: '12px'
          }}>
            <CardContent>
              <BarChart
                dataset={dataset}
                xAxis={[{ dataKey: 'month' }]}

                series={[
                  {
                    dataKey: 'totalCollectedAmount',
                    label: 'Total Collected Amount',
                    valueFormatter,
                  },
                  {
                    dataKey: 'cashCollection',
                    label: 'Cash Collection',
                    valueFormatter,
                  },
                  {
                    dataKey: 'cardupiCollection',
                    label: 'Card/UpiCollection',
                    valueFormatter,
                  },
                  {
                    dataKey: 'credit',
                    label: 'Corporate Bill',
                    valueFormatter,
                  },
                ]}
                {...monthychartsettings}
              />
            </CardContent>
          </Card>

        </Grid> */}
      </Grid>

      <Grid container spacing={1} >
        <Grid item sm={12} lg={6} xl={6} >
          {/* <Card sx={{
            borderRadius: '12px',
            height: "500px"

          }}>
            <CardContent>
              <div className="user-table-container">
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>Doctor</th>
                      <th>Activity</th>
                    </tr>
                  </thead>

                 {getFinancial?.listdr?.map((user, index) => {
                    const percentage = totalBills > 0 ? ((user.DrBillcount / totalBills) * 100).toFixed(1) : 0;

                    return (
                      <tr key={index}>
                        <td className="user-info">
                          <img src={user.DrImage || avatarSrc} alt={user.DrImage} className="avatar" />
                          <div>
                            <div className="user-name">{user.Drname}</div>
                            <div className="user-meta">
                              Bills: {user.DrBillcount} | Bill Amount: {user.TotalBillAmt}
                            </div>
                          </div>
                        </td>
                        <td className="usage-cell">
                          <div className="usage-bar-bg">
                            <div
                              className="usage-bar"
                              style={{ width: `${percentage}%`, background: '#4caf50' }}
                            />
                            <div className="usage-label">{percentage}%</div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}


                </table>
              </div>
            </CardContent>
          </Card> */}


        </Grid>

        <Grid item sm={12} lg={6} xl={6}
          sx={{ marginBottom: 1 }}>

          {/* <Card sx={{
            borderRadius: '12px',
            height: "500px"
          }}>
            <CardContent>
              <div className="user-table-container">
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Activity</th>
                    </tr>
                  </thead>
                 

                  {getFinancial?.listUser?.map((user, index) => {
                    const usage = totalUserBills > 0 ? ((user.UsrBillcount / totalUserBills) * 100).toFixed(1) : 0;

                    return (
                      <tr key={index}>
                        <td className="user-info">
                          <img src={user.UsrImage || avatarSrc} alt={user.UsrImage} className="avatar" />
                          <div>
                            <div className="user-name">{user.Usrname}</div>
                            <div className="user-meta">
                              {user.UsrBillcount} | Bill Amount : {user.UsrTotalBillAmt}
                            </div>
                          </div>
                        </td>
                        <td className="usage-cell">
                          <div className="usage-bar-bg">
                            <div
                              className="usage-bar"
                              style={{ width: `${usage}%`, background: '#2196f3' }}
                            />
                            <div className="usage-label">{usage}%</div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}


                </table>
              </div>

            </CardContent>
          </Card> */}

        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          {/* <Card sx={{

            borderRadius: '12px',
            height: "500px"

          }}>
            <CardContent>
              <div className='user-table-container'>
                <table className='user-table'>
                  <thead>
                    <tr>
                      <th style={{ width: '60%', textAlign: 'left' }}>Branch</th>
                      <th style={{ width: '20%', textAlign: 'right' }}>Total Bill Amount</th>
                      <th style={{ width: '20%', textAlign: 'center' }}>Total Bills</th>
                    </tr>
                  </thead>

                  {getFinancial?.listBrnchamt?.sort((a, b) => b.BrnchNetAmt - a.BrnchNetAmt).map((branch, index) => {
                    return (
                      <tr key={index}>
                        <td className="">

                          {branch.BrnchName}
                        </td>
                        <td className="" style={{
                          textAlign: 'right'
                        }} >
                          <div className="" >{`₹${branch.BrnchNetAmt}`}</div>

                        </td>
                        <td className="" style={{
                          textAlign: 'center'
                        }}>
                          <div className="">{branch.BrnchInvNo}</div>
                        </td>
                      </tr>
                    )
                  })}



                </table>
              </div>

            </CardContent>
          </Card> */}
        </Grid>
      </Grid>
    </div>
  );
}



export default Financial
