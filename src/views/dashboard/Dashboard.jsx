import React, { useEffect, useState, useRef } from "react";
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
  Select, MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
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
  HourglassEmptyOutlined,
  FileDownloadOutlined,
} from "@mui/icons-material";
import { PersonOffOutlined } from "@mui/icons-material";
import getReduxState from "../../ReduxState";
import axiosInstance from "../../axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, startOfMonth, subDays, isSameDay } from "date-fns";
import { GlobalStyles } from "@mui/material";
import { CalendarMonthOutlined, EastRounded } from "@mui/icons-material";

// CRM COLORS
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



// KPI CARD
const KpiCard = ({
  title,
  value,
  icon,
  color,
  lightColor,
  growth,
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
// TOTAL SUMMARY DONUT CHART
// ============================================================

// Donut geometry
const DONUT_SIZE = 170;
const DONUT_STROKE = 22;
const DONUT_R = (DONUT_SIZE - DONUT_STROKE) / 2;
const DONUT_C = 2 * Math.PI * DONUT_R;
const DONUT_GAP = 3; // small gap between slices

const TotalSummaryChart = ({ data, colors }) => {
  const [animated, setAnimated] = useState(false);
  const [active, setActive] = useState(null);

  // API values may come as strings
  const total = Number(data?.TotalLeadCount) || 0;
  const followups = Number(data?.TotalLeadFollowup) || 0;
  const won = Number(data?.TotalLeadfollowupWon) || 0;
  const lost = Number(data?.TotalLeadfollowupLost) || 0;
  const open = Math.max(total - won - lost, 0);

  const segments = [
    {
      key: "won",
      label: "Won",
      value: won,
      color: colors.green,
      light: colors.greenLight,
    },
    {
      key: "open",
      label: "In progress",
      value: open,
      color: colors.orange,
      light: colors.orangeLight,
    },
    {
      key: "lost",
      label: "Lost",
      value: lost,
      color: colors.red,
      light: colors.redLight,
    },
  ];

  const sum = segments.reduce((a, s) => a + s.value, 0);
  const nonZero = segments.filter((s) => s.value > 0).length;
  const pct = (v) => (sum ? ((v / sum) * 100).toFixed(1) : "0.0");
  const winRate = total ? ((won / total) * 100).toFixed(1) : "0.0";

  // Pre-compute slice lengths and offsets
  let running = 0;
  const slices = segments.map((s) => {
    const len = sum ? (s.value / sum) * DONUT_C : 0;
    const dash = nonZero > 1 && len > DONUT_GAP * 2 ? len - DONUT_GAP : len;
    const slice = { ...s, dash, offset: running };
    running += len;
    return slice;
  });

  // Replay the draw animation whenever the numbers change
  useEffect(() => {
    setAnimated(false);
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnimated(true))
    );
    return () => cancelAnimationFrame(id);
  }, [won, lost, open]);

  const activeSeg = segments.find((s) => s.key === active);

  return (
    <Card
      elevation={0}
      sx={{
        height: "410px",
        borderRadius: "15px",
        border: `1px solid ${colors.border}`,
      }}
    >
      <CardContent
        sx={{
          p: "20px !important",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: colors.text }}>
          Total Summary
        </Typography>
        <Typography
          sx={{ fontSize: 11, color: colors.secondaryText, mt: 0.3, mb: 1.5 }}
        >
          Lead outcomes for the selected period
        </Typography>

        {/* DONUT + LEGEND */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 2.5,
            flexWrap: { xs: "wrap", sm: "nowrap" },
            justifyContent: "center",
          }}
        >
          {/* DONUT */}
          <Box
            sx={{
              position: "relative",
              width: DONUT_SIZE,
              height: DONUT_SIZE,
              flexShrink: 0,
            }}
          >
            <svg
              width={DONUT_SIZE}
              height={DONUT_SIZE}
              viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
              style={{ transform: "rotate(-90deg)", overflow: "visible" }}
            >
              {/* Track */}
              <circle
                cx={DONUT_SIZE / 2}
                cy={DONUT_SIZE / 2}
                r={DONUT_R}
                fill="none"
                stroke={colors.border}
                strokeOpacity={0.6}
                strokeWidth={DONUT_STROKE}
              />

              {slices.map((s) =>
                s.value > 0 ? (
                  <circle
                    key={s.key}
                    cx={DONUT_SIZE / 2}
                    cy={DONUT_SIZE / 2}
                    r={DONUT_R}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={active === s.key ? DONUT_STROKE + 6 : DONUT_STROKE}
                    strokeDasharray={`${animated ? s.dash : 0} ${DONUT_C}`}
                    strokeDashoffset={-s.offset}
                    onMouseEnter={() => setActive(s.key)}
                    onMouseLeave={() => setActive(null)}
                    style={{
                      cursor: "pointer",
                      opacity: active && active !== s.key ? 0.35 : 1,
                      transition:
                        "stroke-dasharray 0.9s ease, stroke-width 0.2s ease, opacity 0.2s ease",
                    }}
                  />
                ) : null
              )}
            </svg>

            {/* CENTER LABEL */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <Typography
                sx={{
                  fontSize: 11,
                  color: colors.secondaryText,
                  fontWeight: 600,
                }}
              >
                {activeSeg ? activeSeg.label : "Total leads"}
              </Typography>
              <Typography
                sx={{
                  fontSize: 28,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: activeSeg ? activeSeg.color : colors.text,
                  letterSpacing: "-0.6px",
                }}
              >
                {activeSeg ? activeSeg.value : total}
              </Typography>
              {activeSeg && (
                <Typography
                  sx={{ fontSize: 11, fontWeight: 700, color: activeSeg.color }}
                >
                  {pct(activeSeg.value)}%
                </Typography>
              )}
            </Box>
          </Box>

          {/* LEGEND */}
          <Box
            sx={{
              flex: 1,
              minWidth: 150,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {segments.map((s) => (
              <Box
                key={s.key}
                onMouseEnter={() => setActive(s.key)}
                onMouseLeave={() => setActive(null)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.2,
                  py: 0.9,
                  borderRadius: "10px",
                  cursor: "pointer",
                  backgroundColor: active === s.key ? s.light : "transparent",
                  transition: "background-color 0.2s ease",
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "3px",
                    backgroundColor: s.color,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#344054",
                    flex: 1,
                  }}
                >
                  {s.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: colors.text,
                    minWidth: 24,
                    textAlign: "right",
                  }}
                >
                  {s.value}
                </Typography>
                <Box
                  sx={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: s.color,
                    backgroundColor: s.light,
                    borderRadius: "6px",
                    px: 0.8,
                    py: 0.2,
                    minWidth: 44,
                    textAlign: "center",
                  }}
                >
                  {pct(s.value)}%
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* BOTTOM STATS */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1.2,
            mt: 1.5,
          }}
        >
          {[
            {
              label: "Total follow-ups",
              value: followups,
              color: colors.cyan,
              light: colors.cyanLight,
              icon: <PendingActionsOutlined />,
            },
            {
              label: "Win rate",
              value: `${winRate}%`,
              color: colors.primary,
              light: colors.primaryLight,
              icon: <TrendingUpOutlined />,
            },
          ].map((tile) => (
            <Box
              key={tile.label}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 1.3,
                borderRadius: "10px",
                backgroundColor: tile.light,
                borderLeft: `3px solid ${tile.color}`,
              }}
            >
              {React.cloneElement(tile.icon, {
                sx: { fontSize: 20, color: tile.color },
              })}
              <Box>
                <Typography sx={{ fontSize: 11, color: colors.secondaryText }}>
                  {tile.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: tile.color,
                    lineHeight: 1.2,
                  }}
                >
                  {tile.value}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// ============================================================
// EXECUTIVE-WISE LEADS TABLE
// ============================================================
const ExecutiveWiseLeads = ({ rows = [] }) => {
  const LEAD_COLUMNS = [
    {
      key: "new",
      label: "New",
      field: "LeadFollowupNewTdy",
      color: "#1976D2",
    },
    {
      key: "cold",
      label: "Cold",
      field: "LeadFollowupColdTdy",
      color: "#094480",
    },
    {
      key: "warm",
      label: "Warm",
      field: "LeadFollowupWarmTdy",
      color: "#E89B00",
    },
    {
      key: "hot",
      label: "Hot",
      field: "LeadFollowupHotTdy",
      color: "#ff0d0d",
    },
    {
      key: "won",
      label: "Won",
      field: "LeadfollowupWonTdy",
      color: "#079c4a",
    },
    {
      key: "lost",
      label: "Lost",
      field: "LeadfollowupLostTdy",
      color: "#E53935",
    },
  ];

  const FOLLOWUP_COLUMNS = [
    {
      key: "today",
      label: "Today",
      field: "TotalfollowupTdy",
      color: "#1976D2",
      lightColor: "#EAF3FF",
    },
    {
      key: "delayed",
      label: "Delayed",
      field: "TotalfollowupDlyd",
      color: "#E53935",
      lightColor: "#FDECEC",
    },
    {
      key: "upcoming",
      label: "Upcoming",
      field: "TotalfollowupUpcmng",
      color: "#7B61A8",
      lightColor: "#F3EEFA",
    },
  ];

  const getLeadTotal = (employee) =>
    LEAD_COLUMNS.reduce(
      (sum, column) =>
        sum + Number(employee?.[column.field] || 0),
      0
    );

  const getColumnTotal = (field) =>
    rows.reduce(
      (sum, employee) =>
        sum + Number(employee?.[field] || 0),
      0
    );

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: "12px",
        border: "1px solid #E2E5EA",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* TITLE */}
      <Box
        sx={{
          height: "48px",
          display: "flex",
          alignItems: "center",
          px: 2.5,
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E2E5EA",
        }}
      >
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: 600,
            color: "#303642",
          }}
        >
          Executive-Wise Leads
        </Typography>
      </Box>

      <Table
        size="small"
        sx={{
          minWidth: 1050,
          borderCollapse: "collapse",

          "& .MuiTableCell-root": {
            borderRight: "1px solid #E3E5E8",
            borderBottom: "1px solid #E3E5E8",
          },
        }}
      >
        <TableHead>

          {/* MAIN HEADER */}
          <TableRow>
            <TableCell
              rowSpan={2}
              sx={{
                width: "195px",
                backgroundColor: "#F3F5F7",
                color: "#343A40",
                fontWeight: 600,
                fontSize: "13px",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              Executive Name
            </TableCell>

            <TableCell
              colSpan={7}
              align="center"
              sx={{
                backgroundColor: "#F3F5F7",
                color: "#343A40",
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              Leads
            </TableCell>

            <TableCell
              colSpan={3}
              align="center"
              sx={{
                backgroundColor: "#F3F5F7",
                color: "#343A40",
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              Leads in Follow-up
            </TableCell>

            <TableCell
              rowSpan={2}
              align="center"
              sx={{
                minWidth: "145px",
                backgroundColor: "#F3F5F7",
                color: "#343A40",
                fontWeight: 600,
                fontSize: "13px",
                verticalAlign: "middle",
              }}
            >
              Target Achieved
            </TableCell>
          </TableRow>

          {/* SECOND HEADER */}
          <TableRow>
            {LEAD_COLUMNS.map((column) => (
              <TableCell
                key={column.key}
                align="center"
                sx={{
                  backgroundColor: "#FAFBFC",
                  color: "#596273",
                  fontSize: "12px",
                  fontWeight: 600,
                  height: "42px",
                }}
              >
                {column.label}
              </TableCell>
            ))}

            <TableCell
              align="center"
              sx={{
                backgroundColor: "#FAFBFC",
                color: "#596273",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              Total
            </TableCell>
            {FOLLOWUP_COLUMNS.map((column) => (
              <TableCell
                key={column.key}
                align="center"
                sx={{
                  backgroundColor: column.lightColor,
                  color: column.color,
                  fontSize: "12px",
                  fontWeight: 700,
                  height: "42px",
                  borderTop: `3px solid ${column.color}`,
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((employee, index) => {
              const total = getLeadTotal(employee);

              return (
                <TableRow
                  key={employee?.EmpId || index}
                  sx={{
                    backgroundColor:
                      index % 2 === 0
                        ? "#FFFFFF"
                        : "#FAFBFC",

                    "&:hover": {
                      backgroundColor: "#F4F7FB",
                    },
                  }}
                >
                  {/* EMPLOYEE */}
                  <TableCell
                    sx={{
                      color: "#303642",
                      fontSize: "13px",
                      fontWeight: 600,
                      padding: "11px 12px",
                    }}
                  >
                    {employee?.EmployeeName
                      ? employee.EmployeeName.toUpperCase()
                      : "-"}
                  </TableCell>

                  {/* LEADS */}
                  {LEAD_COLUMNS.map((column) => {
                    const value = Number(
                      employee?.[column.field] || 0
                    );

                    return (
                      <TableCell
                        key={column.key}
                        align="center"
                        sx={{
                          color:
                            value === 0
                              ? "#1976D2"
                              : column.color,
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                      >
                        {value}
                      </TableCell>
                    );
                  })}

                  {/* TOTAL */}
                  <TableCell
                    align="center"
                    sx={{
                      color: "#303642",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    {total}
                  </TableCell>

                  {/* FOLLOW UPS */}
                  {FOLLOWUP_COLUMNS.map((column) => {
                    const value = Number(employee?.[column.field] || 0);

                    return (
                      <TableCell
                        key={column.key}
                        align="center"
                        sx={{
                          backgroundColor: column.lightColor,
                          color: column.color,
                          fontSize: "13px",
                          fontWeight: 700,
                        }}
                      >
                        {value}
                      </TableCell>
                    );
                  })}
                  {/* TARGET */}
                  <TableCell
                    align="right"
                    sx={{
                      color: "#303642",
                      fontSize: "13px",
                      fontWeight: 500,
                      paddingRight: "14px",
                      textAlign: 'center'
                    }}
                  >
                    {Number(employee?.TotaltargetAchieved || 0)}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={12}
                align="center"
                sx={{
                  padding: "35px",
                  color: "#8A929E",
                  fontSize: "13px",
                }}
              >
                No employee data found
              </TableCell>
            </TableRow>
          )}

          {/* TOTAL ROW */}
          {rows.length > 0 && (
            <TableRow
              sx={{
                backgroundColor: "#F8F9FA",
              }}
            >
              <TableCell
                sx={{
                  color: "#303642",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                Total
              </TableCell>

              {LEAD_COLUMNS.map((column) => (
                <TableCell
                  key={column.key}
                  align="center"
                  sx={{
                    color: column.color,
                    fontSize: "13px",
                    fontWeight: 700,

                  }}
                >
                  {getColumnTotal(column.field)}
                </TableCell>
              ))}

              <TableCell
                align="center"
                sx={{
                  color: "#303642",
                  fontSize: "13px",
                  fontWeight: 700,

                }}
              >
                {rows.reduce(
                  (sum, employee) =>
                    sum + getLeadTotal(employee),
                  0
                )}
              </TableCell>
              {FOLLOWUP_COLUMNS.map((column) => (
                <TableCell
                  key={column.key}
                  align="center"
                  sx={{
                    backgroundColor: column.lightColor,
                    color: column.color,
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  {getColumnTotal(column.field)}
                </TableCell>
              ))}

              <TableCell
                align="right"
                sx={{
                  color: "#303642",
                  fontSize: "13px",
                  fontWeight: 700,
                  paddingRight: "14px",
                  textAlign: 'center'
                }}
              >
                {rows.reduce(
                  (sum, employee) =>
                    sum +
                    Number(
                      employee?.TargetAchieved || 0
                    ),
                  0
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
// ============================================================
// DATE BUTTON (custom input for react-datepicker)
// ============================================================

const DateButton = React.forwardRef(({ value, onClick, label }, ref) => (
  <Box
    ref={ref}
    onClick={onClick}
    sx={{
      cursor: "pointer",
      px: 1.2,
      py: 0.4,
      borderRadius: "8px",
      transition: "background-color 0.2s ease",
      "&:hover": { backgroundColor: CRM_COLORS.primaryLight },
    }}
  >
    <Typography
      sx={{
        fontSize: 9.5,
        fontWeight: 700,
        letterSpacing: "0.6px",
        textTransform: "uppercase",
        color: CRM_COLORS.secondaryText,
        lineHeight: 1.2,
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontSize: 13,
        fontWeight: 700,
        color: CRM_COLORS.text,
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </Typography>
  </Box>
));

// ============================================================
// DATE RANGE FILTER
// ============================================================
const DateRangeFilter = ({ fromDate, toDate, setFromDate, setToDate }) => {
  const fromPickerRef = useRef(null);

  const isActive = (preset) => {
    const [f, t] = preset.get();
    return isSameDay(f, fromDate) && isSameDay(t, toDate);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
      {/* Calendar theme */}
      <GlobalStyles
        styles={{
          ".crm-datepicker": {
            fontFamily: "inherit",
            fontSize: "11px",
            border: `1px solid ${CRM_COLORS.border}`,
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 10px 26px rgba(41,68,119,0.18)",
          },
          ".crm-datepicker .react-datepicker__header": {
            background: `linear-gradient(135deg, ${CRM_COLORS.primary}, ${CRM_COLORS.primaryDark})`,
            borderBottom: "none",
            paddingTop: "6px",
            paddingBottom: "2px",
          },
          ".crm-datepicker .react-datepicker__current-month": {
            color: "#fff",
            fontSize: "11.5px",
            marginBottom: "2px",
          },
          ".crm-datepicker .react-datepicker__day-name, .crm-datepicker .react-datepicker__day": {
            width: "1.6rem",
            lineHeight: "1.6rem",
            margin: "1px",
            fontSize: "10.5px",
          },
          ".crm-datepicker .react-datepicker__day-name": {
            color: "#fff",
          },
          ".crm-datepicker .react-datepicker__month": {
            margin: "4px 6px",
          },
          ".crm-datepicker .react-datepicker__navigation": {
            top: "3px",
          },
          ".crm-datepicker .react-datepicker__navigation-icon::before": {
            borderColor: "#fff",
            borderWidth: "2px 2px 0 0",
            height: "6px",
            width: "6px",
          },
        }}
      />

      {/* Presets */}
      <Box
        sx={{
          display: "flex",
          p: 0.4,
          borderRadius: "10px",
          backgroundColor: "#fff",
          border: `1px solid ${CRM_COLORS.border}`,
        }}
      >
        {/* {DATE_PRESETS.map((preset) => {
          const active = isActive(preset);
          return (
            <Box
              key={preset.label}
              onClick={() => {
                const [f, t] = preset.get();
                setFromDate(f);
                setToDate(t);
              }}
              sx={{
                px: 1.3,
                py: 0.6,
                borderRadius: "7px",
                cursor: "pointer",
                fontSize: 11.5,
                fontWeight: 600,
                transition: "all 0.2s ease",
                color: active ? "#fff" : CRM_COLORS.secondaryText,
                background: active
                  ? `linear-gradient(135deg, ${CRM_COLORS.primary}, ${CRM_COLORS.primaryDark})`
                  : "transparent",
                boxShadow: active ? `0 3px 8px ${CRM_COLORS.primary}40` : "none",
                "&:hover": {
                  color: active ? "#fff" : CRM_COLORS.primary,
                },
              }}
            >
              {preset.label}
            </Box>
          );
        })} */}
      </Box>

      {/* From → To pill */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          pl: 0.6,
          pr: 0.8,
          py: 0.5,
          borderRadius: "12px",
          backgroundColor: "#fff",
          border: `1px solid ${CRM_COLORS.border}`,
          boxShadow: "0 2px 8px rgba(41,68,119,0.06)",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            borderColor: CRM_COLORS.primary,
            boxShadow: `0 4px 14px ${CRM_COLORS.primary}20`,
          },
        }}
      >
        <Box
          onClick={() => fromPickerRef.current?.setOpen(true)}
          sx={{
            width: 96,
            height: 36,
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg, ${CRM_COLORS.primary}, ${CRM_COLORS.primary}CC)`,
            boxShadow: `0 4px 10px ${CRM_COLORS.primary}35`,
          }}
        >
          <CalendarMonthOutlined sx={{ fontSize: 18, color: "#fff" }} />
        </Box>

        <DatePicker

          ref={fromPickerRef}
          selected={fromDate}
          onChange={(date) => date && setFromDate(date)}
          selectsStart
          startDate={fromDate}
          endDate={toDate}
          maxDate={toDate}
          dateFormat="dd MMM yyyy"
          calendarClassName="crm-datepicker"
          portalId="datepicker-portal"
          popperProps={{ strategy: "fixed" }}
          customInput={<DateButton label="From" />}
        />

        <EastRounded sx={{ fontSize: 16, color: CRM_COLORS.secondaryText }} />

        <DatePicker
          selected={toDate}
          onChange={(date) => date && setToDate(date)}
          selectsEnd
          startDate={fromDate}
          endDate={toDate}
          // minDate={fromDate}
          // maxDate={new Date()}
          dateFormat="dd MMM yyyy"
          calendarClassName="crm-datepicker"
          portalId="datepicker-portal"
          popperProps={{ strategy: "fixed" }}
          customInput={<DateButton label="To" />}
        />
      </Box>
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

  const { role, deptid, name, empId, BrnchKey, dept, branch } = getReduxState()

  const isAdmin = role === "Administrator";

  const [allStaff, setAllStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(empId);
  const [dashBoardData, setDashBoardData] = useState([])
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  // Date
  const frmDate = fromDate ? format(fromDate, 'yyyy-MM-dd') : null
  const todate = toDate ? format(toDate, 'yyyy-MM-dd') : null

  //===== Fetch Staff Data =====
  const fetchStaff = async () => {
    try {
      const res = await axiosInstance.get("/AcctMstStaffAPI/GetAll");


      const staffData = res?.data?.staff;

      if (Array.isArray(staffData)) {
        const filteredStaff = staffData.filter(
          (staff) =>
            staff.DeptName?.toLowerCase() === "sales" ||
            staff.UserGroup?.toLowerCase() === "administrator"
        );

        setAllStaff(filteredStaff);
      } else {
        setAllStaff([]);
      }
    } catch (err) {
      console.log("Error fetching staff", err);
      setAllStaff([]);
    }
  }

  //===== Fetch Dashboard Data =====
  const fetchData = async () => {
    try {
      const filterEmpId =
        selectedStaff === "All" ? 0 : selectedStaff;

      const fetchResponse = await axiosInstance.get(
        `DashboardAPI/Dashboard?EmpId=${empId}&UsrGrp=${role}&FilterEmpId=${filterEmpId}&FromDate=${frmDate}&ToDate=${todate}`);

      const data = fetchResponse?.data?.data;

      const formattedData = {
        ...data,

        UpcomingFollowups: Array.isArray(data?.UpcomingFollowups)
          ? data.UpcomingFollowups.map((item) => ({
            ...item,

            customer: item.CustomerName || "",
            // staff: item.StaffName || "",
            date: item.NextFollowUp_Date
              ? new Date(item.NextFollowUp_Date).toLocaleDateString("en-IN")
              : "",
            time: item.NextFollowUp_Date
              ? new Date(item.NextFollowUp_Date).toLocaleTimeString(
                "en-IN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )
              : "",
            status: item.FollowUp_StatusName || "",
          }))
          : [],
      };

      setDashBoardData(formattedData);

      // console.log("fetchResponse", fetchResponse);
    } catch (error) {
      console.error("Error while fetching dashboard data:", error);
    }
  };

  const formatFollowUpDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };


  // Removed the duplicate useEffects that were calling the APIs twice
  useEffect(() => {
    fetchData();
  }, [selectedStaff, empId, role, fromDate, toDate]);

  useEffect(() => {
    fetchStaff()
  }, [])


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

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          {/* STAFF - ADMIN ONLY */}
          {isAdmin && (
            <FormControl
              size="small"
              sx={{
                minWidth: 220,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "9px",
                  backgroundColor: "#fff",
                  fontSize: 14,

                  "& fieldset": {
                    borderColor: CRM_COLORS.border,
                  },

                  "&:hover fieldset": {
                    borderColor: CRM_COLORS.primary,
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: CRM_COLORS.primary,
                  },
                },

                "& .MuiInputLabel-root": {
                  fontSize: 14,
                },

                "& .MuiSelect-select": {
                  minHeight: "20px",
                  padding: "9px 14px",
                  fontSize: 14,
                },
              }}
            >
              <InputLabel>Staff</InputLabel>

              <Select
                value={selectedStaff}
                onChange={(e) =>
                  setSelectedStaff(e.target.value)
                }
                label="Staff"
              >
                <MenuItem
                  value="All"
                  sx={{
                    fontSize: 14,
                    py: 1,
                    fontWeight: 600,
                  }}
                >
                  --All--
                </MenuItem>

                {allStaff.map((staff) => (
                  <MenuItem
                    key={staff.ahmst_key}
                    value={staff.ahmst_key}
                    sx={{
                      fontSize: 14,
                      py: 1,
                    }}
                  >
                    {staff.ahmst_pname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* DATE - ALL USERS */}
          <DateRangeFilter
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
          />
        </Box>

      </Box>

      {/* ================================================= */}
      {/* KPI CARDS */}
      {/* ================================================= */}

      <Grid container spacing={1.8}>

        <Grid item xs={12} sm={6} md={3}>

          <KpiCard
            title="Today's Leads"
            value={dashBoardData?.LeadCountTdy}
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
            value={dashBoardData?.LeadFollowupTdy}
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
            value={dashBoardData?.LeadfollowupWonTdy}
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
            value={dashBoardData?.LeadfollowupLostTdy}
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
              height: "410px",
              borderRadius: "15px",
              border: `1px solid ${CRM_COLORS.border}`,
              overflow: "hidden",
            }}
          >
            <CardContent
              sx={{
                p: "20px !important",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* HEADER */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1.5,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: CRM_COLORS.text,
                    }}
                  >
                    Upcoming Follow-ups
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 11,
                      color: CRM_COLORS.secondaryText,
                      mt: 0.3,
                    }}
                  >
                    Next customer activities
                  </Typography>
                </Box>

                {/* FOLLOW-UP COUNT */}
                <Box
                  sx={{
                    minWidth: 52,
                    height: 42,
                    px: 1,
                    borderRadius: "10px",
                    backgroundColor: CRM_COLORS.primaryLight,
                    border: `1px solid ${CRM_COLORS.primary}25`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 700,
                      lineHeight: 1,
                      color: CRM_COLORS.primary,
                    }}
                  >
                    {dashBoardData?.UpcomingFollowups?.length ?? 0}
                  </Typography>

                </Box>
              </Box>

              <Divider />
              {/* SCROLLABLE LIST */}

              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",

                  // Hide scrollbar
                  scrollbarWidth: "none",

                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {dashBoardData?.UpcomingFollowups?.length > 0 ? (
                  dashBoardData.UpcomingFollowups.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 120px 120px",
                        alignItems: "center",
                        gap: 1.5,
                        py: 1.5,

                        borderBottom:
                          index !==
                            (dashBoardData?.UpcomingFollowups?.length || 0) - 1
                            ? "1px solid #F0F2F5"
                            : "none",
                      }}
                    >
                      {/* CUSTOMER */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.2,
                          minWidth: 0,
                        }}
                      >
                        <Box
                          sx={{
                            width: 35,
                            height: 35,
                            minWidth: 35,
                            borderRadius: "10px",

                            backgroundColor:
                              index % 2 === 0
                                ? CRM_COLORS.primaryLight
                                : CRM_COLORS.greenLight,

                            color:
                              index % 2 === 0
                                ? CRM_COLORS.primary
                                : CRM_COLORS.green,

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          {(item.CustomerName || "N").charAt(0).toUpperCase()}
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#344054",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.CustomerName || "Unknown Customer"}
                          </Typography>
                        </Box>
                      </Box>

                      {/* DATE */}
                      <Box sx={{ textAlign: "right" }}>
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#475467",
                          }}
                        >
                          {formatFollowUpDate(item.NextFollowUp_Date)}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "#98A2B3",
                          }}
                        >
                          {item.NextFollowUp_Date
                            ? new Date(item.NextFollowUp_Date).toLocaleTimeString(
                              "en-IN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                            : ""}
                        </Typography>
                      </Box>

                      {/* STATUS */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Chip
                          label={item.FollowUp_StatusName || "No Status"}
                          size="small"
                          sx={{
                            height: 30,
                            width: 125,
                            fontSize: 11,
                            fontWeight: 600,

                            backgroundColor:
                              (item.FollowUp_StatusName || "").includes("Demo")
                                ? CRM_COLORS.purpleLight
                                : (item.FollowUp_StatusName || "").includes("Quotation")
                                  ? CRM_COLORS.orangeLight
                                  : (item.FollowUp_StatusName || "").includes("Waiting")
                                    ? CRM_COLORS.cyanLight
                                    : CRM_COLORS.primaryLight,

                            color:
                              (item.FollowUp_StatusName || "").includes("Demo")
                                ? CRM_COLORS.purple
                                : (item.FollowUp_StatusName || "").includes("Quotation")
                                  ? CRM_COLORS.orange
                                  : (item.FollowUp_StatusName || "").includes("Waiting")
                                    ? CRM_COLORS.cyan
                                    : CRM_COLORS.primary,

                            "& .MuiChip-label": {
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      py: 5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "#98A2B3",
                        fontWeight: 500,
                      }}
                    >
                      No upcoming follow-ups
                    </Typography>
                  </Box>
                )}
              </Box>


            </CardContent>
          </Card>
        </Grid>


        {/* ================================================= */}
        {/* TOTAL SUMMARY (DONUT CHART) */}
        {/* ================================================= */}

        <Grid item xs={12} md={5}>
          <TotalSummaryChart data={dashBoardData} colors={CRM_COLORS} />
        </Grid>

      </Grid>

      {/* ================================================= */}
      {/* EXECUTIVE-WISE LEADS */}
      {/* ================================================= */}
      {isAdmin && (
        <Box sx={{ mt: 1.8 }}>
          <ExecutiveWiseLeads
            rows={
              Array.isArray(dashBoardData?.Employees)
                ? dashBoardData.Employees
                : []
            }
          />

        </Box>
      )}
    </Box >
  );
};

export default Dashboard;