import { Card, CardContent, Tab, Tabs, Box, Typography, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import LeadsView from './LeadsView';
import InFollowUp from './InFollowUp';
import Installation from './Installation';
import Leads from '../Leads/Leads';
import AddIcon from '@mui/icons-material/Add';
import axiosInstance from '../../../axios';
import getReduxState from '../../../ReduxState';

function CustomTabPanel({ children, value, index }) {
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}
const tabStyle = {
    flex: {
        xs: "0 0 auto",
        lg: 1,
    },
    minWidth: {
        xs: 100,
        sm: 140,
        lg: 120,
    },

    textTransform: "none",
    fontSize: "0.92rem",
    fontWeight: 700,

    minHeight: 48,
    borderRadius: "12px",

    color: "#64748b",
    overflow: "hidden",
    position: "relative",

    transition: "all .35s cubic-bezier(.4,0,.2,1)",

    "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        background:
            "linear-gradient(135deg, rgba(73,117,219,.08), rgba(73,117,219,.02))",
        opacity: 0,
        transition: ".35s",
        borderRadius: "12px",
    },

    "&:hover": {
        color: "#3566d6",
        transform: "translateY(-3px)",
        boxShadow: "0 10px 24px rgba(73,117,219,.18)",
    },

    "&:hover::before": {
        opacity: 1,
    },

    "&.Mui-selected": {
        color: "#fff",
        background:
            "linear-gradient(135deg, #6d8ef5 0%, #4975db 50%, #3f5483 100%)",

        boxShadow:
            "0 12px 28px rgba(73,117,219,.35), inset 0 1px 0 rgba(255,255,255,.25)",

        transform: "translateY(-2px)",
    },

    "&.Mui-selected:hover": {
        transform: "translateY(-4px) scale(1.02)",
        background:
            "linear-gradient(135deg, #7b99f8 0%, #5b84e9 50%, #3f5483 100%)",

        boxShadow:
            "0 18px 35px rgba(73,117,219,.45), inset 0 1px 0 rgba(255,255,255,.3)",
    },
};

function LeadsMain() {

    const [value, setValue] = useState(0);
    const [openLeadModal, setOpenLeadModal] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    const [ldViewsData, setLdViewsData] = useState([])

    const { role, deptid, name, empId, BrnchKey, dept } = getReduxState()
    const isAdmin = role === "Administrator";


    // Fetch Leads Data
    const fetchData = async () => {
        try {
            const fetchResponse = await axiosInstance.get(`/LeadSaveUpdateAPI/GetLeadsGroupWise?userGroup=${role}&LoginId=${empId}`)

            if (fetchResponse.data && fetchResponse.data.data) {
                setLdViewsData(fetchResponse.data.data)
            }

        } catch (error) {
            console.log("Error while fetching data", error)
        }
    }


    useEffect(() => {
        fetchData()

    }, [])

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "";

        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, "0");
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;

        return `${day}-${month}-${year} ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
    };




    const handleChange = (event, newValue) => {
        if (newValue === 5) {
            setSelectedTab(5);
            setOpenLeadModal(true);
            return;
        }

        setSelectedTab(newValue);
        setValue(newValue);
    };



    return (
        <>

            <Typography
                variant="h2"
                component="div"
                display={'flex'}
                alignItems={'center'}
                textAlign={'center'}
                color={'#3f5483'}
                sx={{
                    fontSize: '1.4rem',
                    fontWeight: 'bold',
                    marginTop: { xs: '-20px', sm: '-20px', md: "-20px", lg: "-20px", xl: "-20px" }
                }}>
                LEADS
            </Typography>

            <Card sx={{
                height: { xs: 'calc(100vh - -20px)', sm: 'calc(100vh - 5px)', md: 'calc(100vh - 2px)', lg: 'calc(100vh - -5px)', xl: 'calc(100vh - 0px)' },

            }}>
                <CardContent>


                    <Tabs
                        value={selectedTab}
                        onChange={handleChange}
                        variant="fullWidth"
                        TabIndicatorProps={{ style: { display: "none" } }}
                        // sx={{
                        //     bgcolor: "#ffffff",
                        //     borderRadius: "16px",
                        //     p: "6px",
                        //     boxShadow: "0 8px 30px rgba(15,23,42,0.08)",
                        //     border: "1px solid rgba(226,232,240,0.9)",

                        //     "& .MuiTabs-indicator": {
                        //         display: "none",
                        //     },

                        //     // "& .MuiTabs-flexContainer": {
                        //     //     gap: 8,
                        //     // },


                        // }}

                        sx={{
                            bgcolor: "#ffffff",
                            borderRadius: "16px",
                            p: "6px",
                            boxShadow: "0 8px 30px rgba(15,23,42,0.08)",
                            border: "1px solid rgba(226,232,240,0.9)",

                            "& .MuiTabs-indicator": {
                                display: "none",
                            },

                            "& .MuiTabs-flexContainer": {
                                gap: 1,
                            },

                            "& .MuiTabs-scroller": {
                                overflowX: "auto !important",
                            },
                        }}


                    >
                        <Tab
                            label={
                                <Box display="flex" alignItems="center" gap={1}>
                                    <span>Leads</span>
                                    <Box
                                        sx={{
                                            background: "#4975db",
                                            color: "#fff",
                                            borderRadius: "50%",
                                            minWidth: 22,
                                            height: 22,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {ldViewsData.length}
                                    </Box>
                                </Box>
                            }
                            {...a11yProps(0)}
                            sx={tabStyle}
                        />
                        <Tab label="In Follow Up" {...a11yProps(1)} sx={tabStyle} />
                        <Tab label="On-Installation" {...a11yProps(2)} sx={tabStyle} />
                        <Tab label="Won" {...a11yProps(3)} sx={tabStyle} />
                        <Tab label="Lost" {...a11yProps(4)} sx={tabStyle} />
                        <Tab label="Add New" {...a11yProps(5)} sx={tabStyle} />
                    </Tabs>


                    <CustomTabPanel value={value} index={0}>
                        <LeadsView
                            ldViewsData={ldViewsData}
                            setLdViewsData={setLdViewsData}
                            formatDateTime={formatDateTime}

                        />
                    </CustomTabPanel>

                    <CustomTabPanel value={value} index={1}>
                        <InFollowUp />
                    </CustomTabPanel>

                    <CustomTabPanel value={value} index={2}>
                        <Installation />
                    </CustomTabPanel>

                    <CustomTabPanel value={value} index={3}>
                        Won Content
                    </CustomTabPanel>

                    <CustomTabPanel value={value} index={4}>
                        Lost Content
                    </CustomTabPanel>

                    <CustomTabPanel value={value} index={5}>

                    </CustomTabPanel>

                </CardContent>
            </Card>


            <Leads
                openLeadModal={openLeadModal}
                setOpenLeadModal={(status) => {
                    setOpenLeadModal(status);

                    if (!status) {
                        setSelectedTab(0);
                        setValue(0);
                        fetchData()
                    }
                }}
            />
        </>
    )
}

export default LeadsMain
