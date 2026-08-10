import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

import {
  PeopleAltOutlined,
  PersonAddOutlined,
  EventNoteOutlined,
  GroupsOutlined,
  ArrowForwardIos,
  TrendingUpOutlined,
  PhoneOutlined,
  DescriptionOutlined,
  CheckCircleOutline,
  CancelOutlined,
  PendingActionsOutlined,
} from "@mui/icons-material";
import { PersonOffOutlined } from "@mui/icons-material";
import getReduxState from "../../ReduxState";


// ============================================================
// CRM COLORS
// ============================================================

const CRM_COLORS = {
  primary: "#294477",
  primaryLight: "#E8EEF9",
  primaryDark: "#1F365F",

  green: "#4CAF50",
  greenLight: "#EAF7EC",

  orange: "#F5A623",
  orangeLight: "#FFF4E1",

  purple: "#7B61A8",
  purpleLight: "#F2ECF8",

  red: "#E76F6F",
  redLight: "#FCECEC",

  cyan: "#2196A6",
  cyanLight: "#E7F6F8",

  background: "#F4F7FB",
  text: "#172B4D",
  secondaryText: "#718096",
  border: "#E2E8F0",
};


// ============================================================
// FOLLOW-UP STATUS DATA
// ============================================================

const followUpSummary = [
  {
    title: "Initial Contact Pending",
    value: 18,
    color: CRM_COLORS.orange,
  },
  {
    title: "Contacted",
    value: 64,
    color: CRM_COLORS.primary,
  },
  {
    title: "Requirement Collected",
    value: 42,
    color: CRM_COLORS.cyan,
  },
  {
    title: "Requirement Discussion",
    value: 31,
    color: CRM_COLORS.purple,
  },
  {
    title: "Customer Interested",
    value: 27,
    color: CRM_COLORS.green,
  },
  {
    title: "Won",
    value: 12,
    color: CRM_COLORS.green,
  },
  {
    title: "Lost",
    value: 7,
    color: CRM_COLORS.red,
  },
];


// ============================================================
// UPCOMING FOLLOW-UPS
// ============================================================

const upcomingFollowUps = [
  {
    customer: "ABC Technologies",
    staff: "Steni",
    status: "Follow-up Scheduled",
    date: "Today",
    time: "10:30 AM",
  },
  {
    customer: "XYZ Solutions",
    staff: "John",
    status: "Demo Scheduled",
    date: "Today",
    time: "11:45 AM",
  },
  {
    customer: "Global Infotech",
    staff: "Sarah",
    status: "Quotation Under Discussion",
    date: "Tomorrow",
    time: "02:00 PM",
  },
  {
    customer: "Tech World",
    staff: "Steni",
    status: "Waiting for Customer Response",
    date: "Tomorrow",
    time: "04:00 PM",
  },
];


const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  if (hour < 21) {
    return "Good evening";
  }

  return "Good night";
};

// ============================================================
// KPI CARD
// ============================================================

const KpiCard = ({
  title,
  value,
  icon,
  color,
  lightColor,
  growth,
  // subtitle = "vs last month",
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        minHeight: 145,
        borderRadius: "18px",
        position: "relative",
        overflow: "hidden",

        background: `linear-gradient(
                    135deg,
                    #ffffff 0%,
                    ${lightColor} 100%
                )`,

        border: `1px solid ${CRM_COLORS.border}`,

        transition:
          "transform 0.25s ease, box-shadow 0.25s ease",

        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: `0 12px 30px ${color}25`,
        },

        // Top colored line
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: color,
        },

        // Decorative circle
        "&::after": {
          content: '""',
          position: "absolute",
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: color,
          opacity: 0.04,
          right: -35,
          bottom: -40,
        },
      }}
    >
      <CardContent
        sx={{
          p: "20px !important",
          height: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          {/* LEFT CONTENT */}
          <Box>

            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color:
                  CRM_COLORS.secondaryText,
                mb: 1,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: 27,
                  sm: 30,
                },
                fontWeight: 800,
                lineHeight: 1,
                color: CRM_COLORS.text,
                letterSpacing: "-0.8px",
              }}
            >
              {value}
            </Typography>


          </Box>


          {/* ICON */}
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: "15px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              background: `linear-gradient(
                                135deg,
                                ${color},
                                ${color}CC
                            )`,

              color: "#fff",

              boxShadow:
                `0 7px 18px ${color}35`,
            }}
          >
            {React.cloneElement(icon, {
              sx: {
                fontSize: 25,
                color: "#fff",
              },
            })}
          </Box>
        </Box>


        {/* Bottom decorative line */}
        <Box
          sx={{
            position: "absolute",
            left: 20,
            bottom: 12,
            width: 45,
            height: 3,
            borderRadius: 5,
            backgroundColor: color,
            opacity: 0.35,
          }}
        />
      </CardContent>
    </Card>
  );
};

// ============================================================
// STATUS PROGRESS
// ============================================================

const StatusProgress = ({
  title,
  value,
  percentage,
  color,
}) => {
  return (
    <Box sx={{ mb: 2 }}>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.7,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
          }}
        >
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: color,
            }}
          />

          <Typography
            sx={{
              fontSize: 11.5,
              color: CRM_COLORS.secondaryText,
            }}
          >
            {title}
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: 11.5,
            fontWeight: 700,
            color: CRM_COLORS.text,
          }}
        >
          {value}
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 6,
          borderRadius: 5,
          backgroundColor: "#EEF1F5",

          "& .MuiLinearProgress-bar": {
            borderRadius: 5,
            backgroundColor: color,
          },
        }}
      />
    </Box>
  );
};


// ============================================================
// DASHBOARD
// ============================================================

const Dashboard = () => {

  // --------------------------------------------------------
  // Calculate total from actual follow-up data
  // --------------------------------------------------------

  const totalFollowUps = followUpSummary.reduce(
    (total, item) => total + item.value,
    0
  );
  const { name } = getReduxState()

  const wonCount = 12;
  const lostCount = 7;

  const successRate =
    totalFollowUps > 0
      ? Math.round(
        (wonCount / totalFollowUps) * 100
      )
      : 0;


  return (
    <Box
      sx={{
        minHeight: "100%",
        backgroundColor: CRM_COLORS.background,

        p: {
          xs: 1.5,
          sm: 2,
          md: 2.5,
        },
      }}
    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}
      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {/* LEFT */}

        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: 22,
                md: 26,
              },
              fontWeight: 750,
              color: CRM_COLORS.text,
              letterSpacing: "-0.4px",
            }}
          >
            {`Hi, Welcome Back, ${name} 👋`}
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 12,
              color: CRM_COLORS.secondaryText,
            }}
          >
            Here's a quick overview of your CRM.
          </Typography>
        </Box>


        {/* RIGHT */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >

          {/* STAFF - ADMIN ONLY */}

          {/* {isAdmin && ( */}
          <FormControl
            size="small"
            sx={{
              minWidth: 170,

              "& .MuiOutlinedInput-root": {
                borderRadius: "9px",
                backgroundColor: "#fff",
                fontSize: 12,

                "& fieldset": {
                  borderColor:
                    CRM_COLORS.border,
                },

                "&:hover fieldset": {
                  borderColor:
                    CRM_COLORS.primary,
                },

                "&.Mui-focused fieldset": {
                  borderColor:
                    CRM_COLORS.primary,
                },
              },

              "& .MuiInputLabel-root": {
                fontSize: 12,
              },
            }}
          >

            <InputLabel>
              Staff
            </InputLabel>

            <Select
              // value={selectedStaff}
              label="Staff"
            // onChange={(e) =>
            //     setSelectedStaff(e.target.value)
            // }
            >

              {/* {staffList.map((staff) => (
                        <MenuItem
                            key={staff.empId}
                            value={staff.empId}
                            sx={{
                                fontSize: 12,
                            }}
                        >
                            {staff.name} */}
              {/* </MenuItem>
                    ))} */}

            </Select>

          </FormControl>
          {/* )} */}


          {/* DATE */}
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.8,
              borderRadius: "9px",
              backgroundColor: CRM_COLORS.primaryLight,
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: CRM_COLORS.green,
              }}
            />

            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: CRM_COLORS.primary,
              }}
            >
              {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Typography>
          </Box>

        </Box>

      </Box>

      {/* ================================================= */}
      {/* KPI CARDS */}
      {/* ================================================= */}

      <Grid container spacing={1.8}>

        <Grid item xs={12} sm={6} md={3}>

          <KpiCard
            title="Today's Leads"
            value="189"
            // growth="+12.5%"
            color={CRM_COLORS.primary}
            lightColor={
              CRM_COLORS.primaryLight
            }
            icon={
              <EventNoteOutlined
                sx={{ fontSize: 23 }}
              />
            }
          />

        </Grid>


        <Grid item xs={12} sm={6} md={3}>

          <KpiCard
            title="Today's Follow-ups"
            value="42"
            // growth="+8.2%"
            color={CRM_COLORS.orange}
            lightColor={
              CRM_COLORS.orangeLight
            }
            icon={
              <PendingActionsOutlined
                sx={{ fontSize: 23 }}
              />
            }
          />

        </Grid>


        <Grid item xs={12} sm={6} md={3}>

          <KpiCard
            title="Won"
            value="27"
            // growth="+15.4%"
            color={CRM_COLORS.green}
            lightColor={
              CRM_COLORS.greenLight
            }
            icon={
              <CheckCircleOutline
                sx={{ fontSize: 23 }}
              />
            }
          />

        </Grid>


        <Grid item xs={12} sm={6} md={3}>

          <KpiCard
            title="Lost"
            value="12"
            color={CRM_COLORS.red}
            lightColor={CRM_COLORS.redLight}
            icon={
              <PersonOffOutlined
                sx={{ fontSize: 23 }}
              />
            }
          />

        </Grid>

      </Grid>


      {/* ================================================= */}
      {/* STATUS OVERVIEW + QUICK SUMMARY */}
      {/* ================================================= */}

      <Grid
        container
        spacing={1.8}
        sx={{ mt: 0.2 }}
      >

        {/* ================================================= */}
        {/* FOLLOW-UP STATUS */}
        {/* ================================================= */}

        <Grid item xs={12} md={7}>

          <Card
            elevation={0}
            sx={{
              mt: 1.8,
              borderRadius: "15px",
              border:
                `1px solid ${CRM_COLORS.border}`,
            }}
          >

            <CardContent
              sx={{
                p: "20px !important",
              }}
            >

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",

                  mb: 1.5,
                }}
              >

                <Box>

                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 700,
                      color:
                        CRM_COLORS.text,
                    }}
                  >
                    Upcoming Follow-ups
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 11,
                      color:
                        CRM_COLORS.secondaryText,
                      mt: 0.3,
                    }}
                  >
                    Next customer activities
                  </Typography>

                </Box>


                <Box
                  sx={{
                    px: 1.2,
                    py: 0.6,
                    borderRadius: "7px",
                    backgroundColor:
                      CRM_COLORS.primaryLight,
                    cursor: "pointer",
                  }}
                >

                  <Typography
                    sx={{
                      fontSize: 10,
                      fontWeight: 700,
                      color:
                        CRM_COLORS.primary,
                    }}
                  >
                    View all
                  </Typography>

                </Box>

              </Box>


              <Divider />


              {upcomingFollowUps.map(
                (item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "space-between",

                      py: 1.5,

                      borderBottom:
                        index !==
                          upcomingFollowUps.length -
                          1
                          ? "1px solid #F0F2F5"
                          : "none",
                    }}
                  >

                    {/* CUSTOMER */}

                    <Box
                      sx={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: 1.2,
                        minWidth: 0,
                      }}
                    >

                      <Box
                        sx={{
                          width: 35,
                          height: 35,
                          borderRadius:
                            "10px",

                          backgroundColor:
                            index % 2 === 0
                              ? CRM_COLORS.primaryLight
                              : CRM_COLORS.greenLight,

                          color:
                            index % 2 === 0
                              ? CRM_COLORS.primary
                              : CRM_COLORS.green,

                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",

                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {item.customer
                          .charAt(0)
                          .toUpperCase()}
                      </Box>


                      <Box>

                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 600,
                            color:
                              "#344054",
                          }}
                        >
                          {
                            item.customer
                          }
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 10,
                            color:
                              "#98A2B3",
                            mt: 0.2,
                          }}
                        >
                          {item.staff}
                        </Typography>

                      </Box>

                    </Box>


                    {/* DATE */}

                    <Box
                      sx={{
                        display: {
                          xs: "none",
                          sm: "block",
                        },

                        textAlign:
                          "right",
                      }}
                    >

                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 600,
                          color:
                            "#475467",
                        }}
                      >
                        {item.date}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 10,
                          color:
                            "#98A2B3",
                        }}
                      >
                        {item.time}
                      </Typography>

                    </Box>


                    {/* STATUS */}

                    <Chip
                      label={item.status}
                      size="small"
                      sx={{
                        height: 25,

                        maxWidth: {
                          xs: 130,
                          sm: 220,
                        },

                        fontSize: 9.5,
                        fontWeight: 600,

                        backgroundColor:
                          item.status.includes(
                            "Demo"
                          )
                            ? CRM_COLORS.purpleLight
                            : item.status.includes(
                              "Quotation"
                            )
                              ? CRM_COLORS.orangeLight
                              : item.status.includes(
                                "Waiting"
                              )
                                ? CRM_COLORS.cyanLight
                                : CRM_COLORS.primaryLight,

                        color:
                          item.status.includes(
                            "Demo"
                          )
                            ? CRM_COLORS.purple
                            : item.status.includes(
                              "Quotation"
                            )
                              ? CRM_COLORS.orange
                              : item.status.includes(
                                "Waiting"
                              )
                                ? CRM_COLORS.cyan
                                : CRM_COLORS.primary,

                        "& .MuiChip-label": {
                          overflow: "hidden",
                          textOverflow:
                            "ellipsis",
                        },
                      }}
                    />


                    <ArrowForwardIos
                      sx={{
                        fontSize: 10,
                        color:
                          "#B0B7C3",
                        ml: 1,
                      }}
                    />

                  </Box>
                )
              )}

            </CardContent>

          </Card>

        </Grid>


        {/* ================================================= */}
        {/* SALES SUMMARY */}
        {/* ================================================= */}

        <Grid item xs={12} md={5}>

          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: "15px",
              border:
                `1px solid ${CRM_COLORS.border}`,
            }}
          >

            <CardContent
              sx={{
                p: "20px !important",
              }}
            >

              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 700,
                  color:
                    CRM_COLORS.text,
                }}
              >
                Follow-up Summary
              </Typography>

              <Typography
                sx={{
                  fontSize: 11,
                  color:
                    CRM_COLORS.secondaryText,
                  mt: 0.3,
                  mb: 2,
                }}
              >
                Important activities
              </Typography>

              {/* CONTACTED */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",

                  p: 1.5,

                  borderRadius: "10px",

                  backgroundColor:
                    CRM_COLORS.primaryLight,

                  borderLeft:
                    `3px solid ${CRM_COLORS.primary}`,

                  mb: 1.2,
                }}
              >

                <Box
                  sx={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: 1,
                  }}
                >

                  <PhoneOutlined
                    sx={{
                      fontSize: 20,
                      color:
                        CRM_COLORS.primary,
                    }}
                  />

                  <Box>

                    <Typography
                      sx={{
                        fontSize: 11,
                        color:
                          CRM_COLORS.secondaryText,
                      }}
                    >
                      Contacted
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 20,
                        fontWeight: 700,
                        color:
                          CRM_COLORS.primary,
                      }}
                    >
                      64
                    </Typography>

                  </Box>

                </Box>

              </Box>


              {/* REQUIREMENT */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",

                  p: 1.5,

                  borderRadius: "10px",

                  backgroundColor:
                    CRM_COLORS.cyanLight,

                  borderLeft:
                    `3px solid ${CRM_COLORS.cyan}`,

                  mb: 1.2,
                }}
              >

                <Box
                  sx={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: 1,
                  }}
                >

                  <DescriptionOutlined
                    sx={{
                      fontSize: 20,
                      color:
                        CRM_COLORS.cyan,
                    }}
                  />

                  <Box>

                    <Typography
                      sx={{
                        fontSize: 11,
                        color:
                          CRM_COLORS.secondaryText,
                      }}
                    >
                      Requirements Collected
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 20,
                        fontWeight: 700,
                        color:
                          CRM_COLORS.cyan,
                      }}
                    >
                      42
                    </Typography>

                  </Box>

                </Box>

              </Box>


              {/* WON */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",

                  p: 1.5,

                  borderRadius: "10px",

                  backgroundColor:
                    CRM_COLORS.greenLight,

                  borderLeft:
                    `3px solid ${CRM_COLORS.green}`,

                  mb: 1.2,
                }}
              >

                <Box
                  sx={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: 1,
                  }}
                >

                  <CheckCircleOutline
                    sx={{
                      fontSize: 20,
                      color:
                        CRM_COLORS.green,
                    }}
                  />

                  <Box>

                    <Typography
                      sx={{
                        fontSize: 11,
                        color:
                          CRM_COLORS.secondaryText,
                      }}
                    >
                      Won
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 20,
                        fontWeight: 700,
                        color:
                          CRM_COLORS.green,
                      }}
                    >
                      {wonCount}
                    </Typography>

                  </Box>

                </Box>

              </Box>


              {/* LOST */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",

                  p: 1.5,

                  borderRadius: "10px",

                  backgroundColor:
                    CRM_COLORS.redLight,

                  borderLeft:
                    `3px solid ${CRM_COLORS.red}`,
                }}
              >

                <Box
                  sx={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: 1,
                  }}
                >

                  <CancelOutlined
                    sx={{
                      fontSize: 20,
                      color:
                        CRM_COLORS.red,
                    }}
                  />

                  <Box>

                    <Typography
                      sx={{
                        fontSize: 11,
                        color:
                          CRM_COLORS.secondaryText,
                      }}
                    >
                      Lost
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 20,
                        fontWeight: 700,
                        color:
                          CRM_COLORS.red,
                      }}
                    >
                      {lostCount}
                    </Typography>

                  </Box>

                </Box>

              </Box>


              {/* SUCCESS RATE */}

              {/* <Box
                                sx={{
                                    mt: 2,

                                    pt: 1.5,

                                    borderTop:
                                        "1px solid #EEF1F5",

                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems: "center",
                                }}
                            >

                                <Typography
                                    sx={{
                                        fontSize: 11,
                                        color:
                                            CRM_COLORS.secondaryText,
                                    }}
                                >
                                    Current win rate
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 16,
                                        fontWeight: 700,
                                        color:
                                            CRM_COLORS.green,
                                    }}
                                >
                                    {successRate}%
                                </Typography>

                            </Box> */}

            </CardContent>

          </Card>

        </Grid>

      </Grid>


      {/* ================================================= */}
      {/* UPCOMING FOLLOW-UPS */}
      {/* ================================================= */}


    </Box>
  );
};

export default Dashboard;