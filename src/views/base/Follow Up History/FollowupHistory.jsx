import React, { useEffect, useState } from 'react'
import {
    Box,
    Card,
    Stack,
    Typography,
} from '@mui/material';
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import closebtn from '../../../assets/images/Saki-NuoveXT-Actions-button-cancel.ico'
import useModal from '../../../components/UseModal';
import axiosInstance from '../../../axios';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import RoomIcon from "@mui/icons-material/Room";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import PhoneMissedRoundedIcon from "@mui/icons-material/PhoneMissedRounded";
import PhoneInTalkRoundedIcon from "@mui/icons-material/PhoneInTalkRounded";
import Diversity3RoundedIcon from "@mui/icons-material/Diversity3Rounded";
import LaptopMacRoundedIcon from "@mui/icons-material/LaptopMacRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import FiberNewRoundedIcon from "@mui/icons-material/FiberNewRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import IconButton from "@mui/material/IconButton";
import FollowUp from '../Follow Up/FollowUp';

const INK = '#1f2a44';
const NAVY = '#3f5483';
const CANVAS = '#eef1f7';
const HAIRLINE = '#e6e9f2';

// ---- Status theming ----------------------------------------------------
// Every follow-up status gets its own color + icon so the timeline reads
// at a glance — a missed call looks nothing like a completed demo. Add
// new statuses here as the sales workflow grows; STATUS_FALLBACK covers
// anything unrecognised so nothing ever renders unstyled.
const STATUS_THEME = {
    "initial contact pending": {
        main: "#757575",
        soft: "#F5F5F5",
        icon: ScheduleRoundedIcon,
        label: "Initial Contact Pending",
    },
    "contacted": {
        main: "#2196F3",
        soft: "#E3F2FD",
        icon: PhoneInTalkRoundedIcon,
        label: "Contacted",
    },
    "requirement collected": {
        main: "#009688",
        soft: "#E0F2F1",
        icon: ArticleRoundedIcon,
        label: "Requirement Collected",
    },
    "requirement discussion going on": {
        main: "#3F51B5",
        soft: "#E8EAF6",
        icon: ForumRoundedIcon,
        label: "Requirement Discussion Going On",
    },
    "decision maker identified": {
        main: "#673AB7",
        soft: "#EDE7F6",
        icon: Diversity3RoundedIcon,
        label: "Decision Maker Identified",
    },
    "customer interested": {
        main: "#4CAF50",
        soft: "#E8F5E9",
        icon: CheckCircleRoundedIcon,
        label: "Customer Interested",
    },
    "customer not interested": {
        main: "#F44336",
        soft: "#FDECEA",
        icon: CancelRoundedIcon,
        label: "Customer Not Interested",
    },
    "follow-up required": {
        main: "#FF9800",
        soft: "#FFF3E0",
        icon: HistoryRoundedIcon,
        label: "Follow-up Required",
    },
    "follow-up scheduled": {
        main: "#1976D2",
        soft: "#E3F2FD",
        icon: CalendarTodayIcon,
        label: "Follow-up Scheduled",
    },
    "said to call back": {
        main: "#9C27B0",
        soft: "#F3E5F5",
        icon: PhoneInTalkRoundedIcon,
        label: "Said to Call Back",
    },
    "no response": {
        main: "#9E9E9E",
        soft: "#F5F5F5",
        icon: PhoneMissedRoundedIcon,
        label: "No Response",
    },
    "phone number not reachable": {
        main: "#E53935",
        soft: "#FDECEA",
        icon: PhoneMissedRoundedIcon,
        label: "Phone Number Not Reachable",
    },
    "purchase order awaited": {
        main: "#FB8C00",
        soft: "#FFF3E0",
        icon: ScheduleRoundedIcon,
        label: "Purchase Order Awaited",
    },
    "purchase order received": {
        main: "#2E7D32",
        soft: "#E8F5E9",
        icon: ArticleRoundedIcon,
        label: "Purchase Order Received",
    },
    "advance payment awaited": {
        main: "#F57C00",
        soft: "#FFF3E0",
        icon: ScheduleRoundedIcon,
        label: "Advance Payment Awaited",
    },
    "payment received": {
        main: "#43A047",
        soft: "#E8F5E9",
        icon: CheckCircleRoundedIcon,
        label: "Payment Received",
    },
    "follow-up later": {
        main: "#607D8B",
        soft: "#ECEFF1",
        icon: HistoryRoundedIcon,
        label: "Follow-up Later",
    },
    "waiting for customer response": {
        main: "#00ACC1",
        soft: "#E0F7FA",
        icon: ScheduleRoundedIcon,
        label: "Waiting for Customer Response",
    },
    "waiting for documents": {
        main: "#5E35B1",
        soft: "#EDE7F6",
        icon: ArticleRoundedIcon,
        label: "Waiting for Documents",
    },
    "waiting for management decision": {
        main: "#3949AB",
        soft: "#E8EAF6",
        icon: Diversity3RoundedIcon,
        label: "Waiting for Management Decision",
    },
    "customer requested callback": {
        main: "#8E24AA",
        soft: "#F3E5F5",
        icon: PhoneInTalkRoundedIcon,
        label: "Customer Requested Callback",
    },
    "customer on leave": {
        main: "#78909C",
        soft: "#ECEFF1",
        icon: ScheduleRoundedIcon,
        label: "Customer on Leave",
    },
    "customer busy": {
        main: "#EF6C00",
        soft: "#FFF3E0",
        icon: PhoneInTalkRoundedIcon,
        label: "Customer Busy",
    },
    "customer out of station": {
        main: "#00897B",
        soft: "#E0F2F1",
        icon: RoomIcon,
        label: "Customer Out of Station",
    },
    "requirement changed": {
        main: "#C2185B",
        soft: "#FCE4EC",
        icon: ForumRoundedIcon,
        label: "Requirement Changed",
    },
    "requirement on hold": {
        main: "#FFA000",
        soft: "#FFF8E1",
        icon: ScheduleRoundedIcon,
        label: "Requirement On Hold",
    },
    "project on hold": {
        main: "#8D6E63",
        soft: "#EFEBE9",
        icon: ScheduleRoundedIcon,
        label: "Project On Hold",
    },
    "future requirement": {
        main: "#1565C0",
        soft: "#E3F2FD",
        icon: HistoryRoundedIcon,
        label: "Future Requirement",
    },
};
const STATUS_FALLBACK = {
    main: NAVY, soft: '#eef1f8', icon: ArticleRoundedIcon, label: null,
};

const themeFor = (status) => {
    const key = (status || '').toString().trim().toLowerCase();
    return STATUS_THEME[key] || { ...STATUS_FALLBACK, label: status || 'Unknown' };
};

const QualityStyle = {
    hot: { color: '#e0405a' },
    warm: { color: '#c9821f' },
    cold: { color: '#3568d4' },
};

const QualityValue = ({ value }) => {
    const n = Number(value);
    if (Number.isFinite(n) && n >= 0 && n <= 5) {
        return (
            <Stack direction="row" spacing={0.1}>
                {Array.from({ length: 5 }).map((_, i) =>
                    i < n ? (
                        <StarRoundedIcon key={i} sx={{ fontSize: 17, color: '#e0a521' }} />
                    ) : (
                        <StarBorderRoundedIcon key={i} sx={{ fontSize: 17, color: '#dfe3ee' }} />
                    )
                )}
            </Stack>
        );
    }
    const key = (value || '').toString().trim().toLowerCase();
    const style = QualityStyle[key];
    return (
        <Typography sx={{ fontSize: '13.5px', fontWeight: 700, color: style ? style.color : INK }}>
            {value || '—'}
        </Typography>
    );
};

const formatDate = (value, withTime = true) => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    });
};

const Field = ({ icon: Icon, iconColor, iconBg, label, children }) => (
    <Stack direction="row" spacing={1.1} alignItems="flex-start">
        <Box
            sx={{
                width: 30,
                height: 30,
                borderRadius: '9px',
                bgcolor: iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }}
        >
            <Icon sx={{ fontSize: 16, color: iconColor }} />
        </Box>
        <Stack spacing={0.15}>
            <Typography sx={{ fontSize: '10.5px', fontWeight: 600, color: '#9aa2b8' }}>
                {label}
            </Typography>
            {children}
        </Stack>
    </Stack>
);

function FollowupHistory({ openFollowupHistryModal, setOpenFollowupHistryModal, size = 'lg', editLead = null }) {

    const { modalClass } = useModal()

    const [getData, setGetData] = useState([])
    const [loading, setLoading] = useState(false)

    const [openFollowupModal, setOpenFollowupModal] = useState(false);

    const handleFollowUp = async () => {
        setOpenFollowupHistryModal(false)
        setOpenFollowupModal(true)
    };

    const [selectedFollowUp, setSelectedFollowUp] = useState(null);

    const fetchFollowupData = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(
                `/FollowUpAPI/FollowUpHistory?leadCode=${editLead?.LeadCode}`
            );
            setGetData(response.data || []);
        } catch (error) {
            console.log("Error while fetching data", error);
        } finally {
            setLoading(false)
        }
    };


    const fetchfollowuudatabyId = async (followUpId) => {
        try {

            const response = await axiosInstance.get(
                `/FollowUpAPI/FollowUpData?FollowUpId=${followUpId}`
            );

            setSelectedFollowUp(response.data[0]);
        } catch (error) {
            console.error("Error fetching follow-up by ID:", error);

        }
    };


    useEffect(() => {
        if (openFollowupHistryModal) {
            fetchFollowupData()
        }
    }, [openFollowupHistryModal])

    return (
        <>
            <CModal
                size={size}
                backdrop='static'
                classmstName={`${modalClass} modal custom-modal-close custom-modal-width custom-centered-modal`}
                alignment="center"
                visible={openFollowupHistryModal}
                onClose={() => setOpenFollowupHistryModal(false)}
                aria-labelledby="VerticallyCenteredExample">

                <style>{`
                @keyframes fu-rise {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fu-card { animation: fu-rise 0.35s ease both; }
            `}</style>

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
                        Follow Up History
                    </CModalTitle>

                    <button
                        onClick={() => setOpenFollowupHistryModal(false)}
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

                <CModalBody
                    style={{
                        background: CANVAS,
                        maxHeight: "72vh",
                        overflowY: "auto",
                        padding: "24px 22px",
                    }}
                >
                    {loading ? (
                        <Stack alignItems="center" spacing={1.2} sx={{ py: 7, color: '#9aa2b8' }}>
                            <ScheduleRoundedIcon sx={{ fontSize: 30, opacity: 0.5 }} />
                            <Typography variant="body2">Loading history...</Typography>
                        </Stack>
                    ) : !Array.isArray(getData) || getData.length === 0 ? (
                        <Stack
                            alignItems="center"
                            justifyContent="center"
                            spacing={1.5}
                            sx={{ py: 8, color: "#9aa2b8" }}
                        >
                            <InboxRoundedIcon sx={{ fontSize: 42, opacity: 0.5 }} />
                            <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                                No Follow Up Found
                            </Typography>
                        </Stack>
                    ) : (

                        <Box sx={{ position: 'relative', pl: 5.5 }}>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: 21.5,
                                    top: 4,
                                    bottom: 4,
                                    width: '2px',
                                    background: `linear-gradient(${CANVAS}, ${HAIRLINE} 8%, ${HAIRLINE} 92%, ${CANVAS})`,
                                }}
                            />

                            <Stack spacing={2.75}>
                                {(Array.isArray(getData) ? getData : []).map((item, index) => {
                                    const theme = themeFor(item.FollowUpStatus);
                                    const StatusIcon = theme.icon;
                                    const followUpDate = formatDate(item.FollowUp_Date);
                                    const nextDate = formatDate(item.NextFollowUp_Date);

                                    return (
                                        <Box
                                            key={item.FollowUp_Id}
                                            className="fu-card"
                                            sx={{ position: 'relative', animationDelay: `${Math.min(index, 6) * 0.05}s` }}
                                        >
                                            {/* Timeline node — filled with the status color/icon so the
                                            rail itself previews what happened at each step */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    left: -44,
                                                    top: 14,
                                                    width: 34,
                                                    height: 34,
                                                    borderRadius: '50%',
                                                    bgcolor: theme.main,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: `0 0 0 4px ${CANVAS}, 0 2px 8px ${theme.main}55`,
                                                }}
                                            >
                                                <StatusIcon sx={{ fontSize: 17, color: '#fff' }} />
                                            </Box>

                                            <Card
                                                elevation={0}
                                                sx={{
                                                    borderRadius: '14px',
                                                    border: `1px solid ${HAIRLINE}`,
                                                    boxShadow: '0 1px 3px rgba(31,42,68,0.05)',
                                                    overflow: 'hidden',
                                                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: `0 8px 20px ${theme.main}22`,
                                                    },
                                                }}
                                            >
                                                {/* Header strip tinted with the status color */}
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    sx={{
                                                        px: 2,
                                                        py: 1.15,
                                                        borderBottom: `1px solid ${HAIRLINE}`,
                                                        bgcolor: theme.soft,
                                                    }}
                                                >
                                                    <Stack direction="row" spacing={1.2} alignItems="center">
                                                        <Typography sx={{ fontSize: '13.5px', fontWeight: 700, color: INK }}>
                                                            Follow Up #{getData.length - index}
                                                        </Typography>
                                                    </Stack>

                                                    <Stack direction="row" spacing={0.8} alignItems="center">
                                                        {/* Edit Icon */}
                                                        <IconButton
                                                            size="small"
                                                            onClick={async () => {
                                                                const data = await fetchfollowuudatabyId(item.FollowUp_Id);
                                                                // console.log(data);

                                                                handleFollowUp();
                                                            }}
                                                            sx={{
                                                                width: 28,
                                                                height: 28,
                                                                bgcolor: '#fff',
                                                                border: `1px solid ${HAIRLINE}`,
                                                                color: theme.main,
                                                                '&:hover': {
                                                                    bgcolor: theme.soft,
                                                                },
                                                            }}
                                                        >
                                                            <EditRoundedIcon sx={{ fontSize: 16 }} />
                                                        </IconButton>

                                                        {/* Status */}
                                                        <Stack
                                                            direction="row"
                                                            spacing={0.6}
                                                            alignItems="center"
                                                            sx={{
                                                                bgcolor: theme.main,
                                                                color: '#fff',
                                                                borderRadius: '999px',
                                                                px: 1.4,
                                                                py: 0.5,
                                                                boxShadow: `0 2px 6px ${theme.main}55`,
                                                            }}
                                                        >
                                                            <StatusIcon sx={{ fontSize: 14 }} />
                                                            <Typography sx={{ fontSize: '11px', fontWeight: 700 }}>
                                                                {theme.label}
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Stack>

                                                <Box sx={{ px: 2, py: 1.7 }}>
                                                    <Stack
                                                        direction="row"
                                                        flexWrap="wrap"
                                                        columnGap={4}
                                                        rowGap={1.6}
                                                        sx={{ mb: item.FollowUpDescription ? 1.8 : 0 }}
                                                    >
                                                        <Field icon={StarRoundedIcon} iconColor="#e0a521" iconBg="#fdf3df" label="LEAD QUALITY">
                                                            <QualityValue value={item.FollowUpQuality} />
                                                        </Field>

                                                        <Field icon={RoomIcon} iconColor="#3568d4" iconBg="#eaf0fd" label="LOCATION">
                                                            <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: NAVY }}>
                                                                {item.FollowUpLeadSourceLocation || '—'}
                                                            </Typography>
                                                        </Field>

                                                        <Field icon={CalendarTodayIcon} iconColor="#7c4fd6" iconBg="#f2edfc" label="NEXT FOLLOW UP">
                                                            <Typography sx={{ fontSize: '13.5px', fontWeight: 700, color: NAVY }}>
                                                                {nextDate || '—'}
                                                            </Typography>
                                                        </Field>

                                                        <Field
                                                            icon={item.FollowUp_IsRequired ? CheckCircleRoundedIcon : CancelRoundedIcon}
                                                            iconColor={item.FollowUp_IsRequired ? '#2f9e6e' : '#e0405a'}
                                                            iconBg={item.FollowUp_IsRequired ? '#e9f8f1' : '#fdecef'}
                                                            label="REQUIRED"
                                                        >
                                                            <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: NAVY }}>
                                                                {item.FollowUp_IsRequired ? 'Yes' : 'No'}
                                                            </Typography>
                                                        </Field>
                                                    </Stack>

                                                    {item.FollowUpDescription && (
                                                        <Stack direction="row" spacing={1.1} alignItems="flex-start">
                                                            <Box
                                                                sx={{
                                                                    width: 30, height: 30, borderRadius: '9px',
                                                                    bgcolor: theme.soft,
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                <ArticleRoundedIcon sx={{ fontSize: 16, color: theme.main }} />
                                                            </Box>
                                                            <Box
                                                                sx={{
                                                                    flex: 1,
                                                                    bgcolor: theme.soft,
                                                                    borderLeft: `3px solid ${theme.main}`,
                                                                    borderRadius: '0 8px 8px 0',
                                                                    px: 1.5,
                                                                    py: 0.9,
                                                                }}
                                                            >
                                                                <Typography sx={{ fontSize: '11px', fontWeight: 700, color: theme.main, mb: 0.2 }}>
                                                                    Description
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ color: '#565f7a', lineHeight: 1.5 }}>
                                                                    {item.FollowUpDescription}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    )}
                                                </Box>
                                            </Card>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        </Box>
                    )}
                </CModalBody>
            </CModal>


            <FollowUp
                openFollowupModal={openFollowupModal}
                setOpenFollowupModal={setOpenFollowupModal}
                editFollowUp={selectedFollowUp}
            />
        </>

    )
}

export default FollowupHistory
