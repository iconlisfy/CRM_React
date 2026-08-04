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
    'call not taken': {
        main: '#e0405a', soft: '#fdecef', icon: PhoneMissedRoundedIcon, label: 'Call Not Taken',
    },
    'call taken': {
        main: '#2f9e6e', soft: '#e9f8f1', icon: PhoneInTalkRoundedIcon, label: 'Call Taken',
    },
    'on site discussion': {
        main: '#7c4fd6', soft: '#f2edfc', icon: Diversity3RoundedIcon, label: 'On Site Discussion',
    },
    'demo completed': {
        main: '#1487a8', soft: '#e6f5f9', icon: LaptopMacRoundedIcon, label: 'Demo Completed',
    },
    'under discussion': {
        main: '#3568d4', soft: '#eaf0fd', icon: ForumRoundedIcon, label: 'Under Discussion',
    },
    'contacted': {
        main: '#c9821f', soft: '#fbf1e3', icon: PhoneInTalkRoundedIcon, label: 'Contacted',
    },
    'qualified': {
        main: '#2f9e6e', soft: '#e9f8f1', icon: VerifiedRoundedIcon, label: 'Qualified',
    },
    'closed': {
        main: '#6b7280', soft: '#eef0f2', icon: LockRoundedIcon, label: 'Closed',
    },
    'open': {
        main: '#3568d4', soft: '#eaf0fd', icon: FiberNewRoundedIcon, label: 'Open',
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
    useEffect(() => {
        if (openFollowupHistryModal) {
            fetchFollowupData()
        }
    }, [openFollowupHistryModal])

    return (
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
                    Leads
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
                        <Typography variant="body2">Loading history…</Typography>
                    </Stack>
                ) : getData.length === 0 ? (
                    <Stack alignItems="center" spacing={1.2} sx={{ py: 7, color: '#9aa2b8' }}>
                        <InboxRoundedIcon sx={{ fontSize: 34, opacity: 0.5 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>No follow ups recorded yet</Typography>
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
                            {getData.map((item, index) => {
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
                                                    px: 2, py: 1.15,
                                                    borderBottom: `1px solid ${HAIRLINE}`,
                                                    bgcolor: theme.soft,
                                                }}
                                            >
                                                <Stack direction="row" spacing={1.2} alignItems="center">
                                                    <Typography sx={{ fontSize: '13.5px', fontWeight: 700, color: INK }}>
                                                        Follow Up #{getData.length - index}
                                                    </Typography>
                                                    {followUpDate && (
                                                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: '#8b93ac' }}>
                                                            <CalendarTodayIcon sx={{ fontSize: 12.5 }} />
                                                            <Typography sx={{ fontSize: '11.5px' }}>{followUpDate}</Typography>
                                                        </Stack>
                                                    )}
                                                </Stack>

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
                                                        <Typography sx={{ fontSize: '13.5px', fontWeight: 600,  color: NAVY  }}>
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
                                                        <Typography sx={{ fontSize: '13.5px', fontWeight: 600,  color: NAVY }}>
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
    )
}

export default FollowupHistory
