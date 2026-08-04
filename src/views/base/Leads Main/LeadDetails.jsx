import React, { useEffect, useState } from "react";
import {
    Typography,
    Box,
    Card,
    Avatar,
    Divider,
    CircularProgress
} from "@mui/material";

import {
    LocationOn,
    Business,
    CalendarMonth,
    Inventory2,
    Edit,
    EventRepeat,
    History,
    Source,
    Category,
    Person
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../axios";
import Leads from "../Leads/Leads";
import FollowUp from "../Follow Up/FollowUp";
import FollowupHistory from "../Follow Up History/FollowupHistory";

// ---- Design tokens -------------------------------------------------------
const GRADIENT = "linear-gradient(135deg, #6d8ef5 0%, #4975db 50%, #3f5483 100%)";
const BASE = "#243863";
const INK = "#22315c";
const MUTED = "#8792b0";
const TINT = "#eef2ff";     // very light gradient-adjacent tint for sub-panels
const TINT_LINE = "#dde5fb";
const PAGE_BG = "#e9edfb";
const MINT = "#2FA57C";
const CORAL = "#E8604C";
const AMBER = "#D99A34";
const SKY = "#5b84e9";

const FONT = "'Plus Jakarta Sans', 'Inter', sans-serif";

const qualityToken = (quality) => {
    const q = (quality || "").toLowerCase();
    if (q === "hot") return { color: CORAL, bg: "rgba(232,96,76,.12)" };
    if (q === "warm") return { color: AMBER, bg: "rgba(217,154,52,.14)" };
    if (q === "cold") return { color: SKY, bg: "rgba(91,132,233,.14)" };
    return { color: MUTED, bg: "rgba(135,146,176,.12)" };
};

const daysSince = (date) => {
    if (!date) return null;
    const diff = Date.now() - new Date(date).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
};

function LeadDetails() {

    const { leadCode } = useParams();
    const navigate = useNavigate();

    const [openLeadModal, setOpenLeadModal] = useState(false);
    const [openFollowupModal, setOpenFollowupModal] = useState(false);
    const [openFollowupHistryModal, setOpenFollowupHistryModal] = useState(false);

    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLead();
    }, [leadCode]);

    //====== Lead Data According to LeadId ==========
    const getLead = async () => {
        try {
            const res = await axiosInstance.get(
                `/LeadSaveUpdateAPI/LeadData?LeadCode=${leadCode}`
            );
            if (res.data.status) {
                setLead(res.data.data[0]);
            }
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!openLeadModal && leadCode) {
            getLead();
        }
    }, [openLeadModal]);

    const formatDate = (date) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString(
            "en-US",
            { day: "2-digit", month: "short", year: "numeric" }
        );
    };


    const formatDateTime = (date) => {
        if (!date) return "—";
        const d = new Date(date);
        const datePart = d.toLocaleDateString(
            "en-US",
            { day: "2-digit", month: "short", year: "numeric" }
        );
        const timePart = d.toLocaleTimeString(
            "en-US",
            { hour: "2-digit", minute: "2-digit", hour12: true }
        );
        return `${datePart} · ${timePart}`;
    };


    const handleEdit = () => {
        setOpenLeadModal(true);
    };

    const handleFollowUp = () => {
        setOpenFollowupModal(true)
    };

    const handleFollowUpHistory = () => {
        setOpenFollowupHistryModal(true)
    };


    const totalBusiness = lead?.Products?.reduce(
        (sum, item) => sum + (item.Quantity * item.Rate),
        0
    );

    const quality = lead ? qualityToken(lead.LeadQuality) : null;

    if (loading) {
        return (
            <Box height="60vh" display="flex" justifyContent="center" alignItems="center" sx={{ background: PAGE_BG }}>
                <CircularProgress sx={{ color: "#5b84e9" }} thickness={4} />
            </Box>
        );
    }

    if (!lead) {
        return (
            <Box height="60vh" display="flex" alignItems="center" justifyContent="center" sx={{ background: PAGE_BG }}>
                <Typography align="center" fontFamily={FONT} color="text.secondary">
                    No lead found for this record.
                </Typography>
            </Box>
        );
    }



    return (
        <>

            <GoogleFontImports />

            <Box
                sx={{
                    // minHeight: "100vh",
                    // background: PAGE_BG,
                    fontFamily: FONT,
                    // p:{ xs:2, md:4 }
                }}
            >

                <Card
                    elevation={0}
                    sx={{
                        width: "100%",
                        borderRadius: 6,
                        overflow: "hidden",
                        boxShadow: "0 30px 60px rgba(63,84,131,.25)"
                    }}
                >


                    {/* ===================== Gradient header ===================== */}

                    <Box
                        sx={{
                            background: BASE,
                            color: "#fff",
                            p: { xs: 3, md: 1.4 },
                            position: "relative",
                            overflow: "hidden"
                        }}
                    >

                        {/* soft decorative glow circles */}
                        <Box sx={{ position: "absolute", top: -60, right: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                        <Box sx={{ position: "absolute", bottom: -80, right: 120, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

                        <Box sx={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

                                <Avatar sx={{
                                    width: 60, height: 60,
                                    bgcolor: "rgba(255,255,255,0.2)",
                                    border: "1px solid rgba(255,255,255,0.35)",
                                    fontSize: 24,
                                    fontWeight: 800
                                }}>
                                    {lead.CustomerName ? lead.CustomerName.charAt(0).toUpperCase() : "?"}
                                </Avatar>

                                <Box>
                                    <Typography fontSize={22} fontWeight={800} letterSpacing="-0.3px">
                                        {lead.CustomerName || "Unnamed Lead"}
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.4, opacity: 0.85, flexWrap: "wrap" }}>
                                        <Typography fontSize={12.5} fontWeight={600}>
                                            {lead.LeadCode}
                                        </Typography>
                                        <Box sx={{ width: 3, height: 3, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.6)" }} />
                                        <Typography fontSize={12.5}>
                                            {lead.CustomerPhone || "—"}
                                        </Typography>
                                    </Box>
                                </Box>

                            </Box>

                            <Box sx={{ display: "flex", gap: 1 }}>

                                <HeaderButton icon={<Edit sx={{ fontSize: 18 }} />} label="Edit" onClick={handleEdit} />
                                <HeaderButton icon={<EventRepeat sx={{ fontSize: 18 }} />} label="Follow Up" onClick={handleFollowUp} />
                                <HeaderButton icon={<History sx={{ fontSize: 18 }} />} label="Followup History" onClick={handleFollowUpHistory} />

                            </Box>

                        </Box>

                    </Box>

                    {/* ===================== White content body ===================== */}

                    {/* ===================== White content body ===================== */}

                    <Box sx={{ p: { xs: 2.5, md: 3 }, background: "#fff" }}>


                        {/* Stat strip */}
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 2,
                                mb: 3
                            }}
                        >

                            <StatBlock label="Business Value" value={`₹ ${(totalBusiness || 0).toLocaleString("en-IN")}`} flex={1.4} />
                            <StatBlock label="Products" value={lead.Products?.length || 0} flex={1} />
                            <StatBlock
                                label="Quality"
                                value={lead.LeadQuality || "—"}
                                flex={1}
                                color={quality.color}
                                bg={quality.bg}
                                capitalize
                            />
                            <StatBlock
                                label="Last Follow-up"
                                value={lead.IsFollowUpReq ? formatDateTime(lead.FollowUpDate) : "Not needed"}
                                sub={lead.IsFollowUpReq ? "Required" : null}
                                flex={1.6}
                                color={lead.IsFollowUpReq ? MINT : MUTED}
                                bg={lead.IsFollowUpReq ? "rgba(47,165,124,.1)" : TINT}
                                small={lead.IsFollowUpReq}
                            />

                        </Box>


                        {/* Info panels */}
                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                mb: 3,
                                flexWrap: "wrap"
                            }}
                        >

                            <Box sx={{ flex: "1 1 260px", background: TINT, border: `1px solid ${TINT_LINE}`, borderRadius: 4, p: 2.5 }}>

                                <Typography fontSize={13} fontWeight={800} color={INK} mb={1} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                                    <Person fontSize="small" sx={{ color: "#5b84e9" }} /> Customer Details
                                </Typography>

                                <DetailLine label="Name" value={lead.CustomerName} />
                                <DetailLine label="Phone" value={lead.CustomerPhone} />
                                <DetailLine label="Place" value={lead.Place} />
                                <DetailLine label="Territory" value={lead.LeadLocation} last />

                            </Box>

                            <Box sx={{ flex: "1 1 260px", background: TINT, border: `1px solid ${TINT_LINE}`, borderRadius: 4, p: 2.5 }}>

                                <Typography fontSize={13} fontWeight={800} color={INK} mb={1} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                                    <Source fontSize="small" sx={{ color: "#5b84e9" }} /> Lead Details
                                </Typography>

                                <DetailLine label="Source" value={lead.LeadSource} />
                                <DetailLine label="Type" value={lead.LeadType} />
                                <DetailLine label="Created" value={formatDate(lead.LeadDate)} last />

                            </Box>

                            <Box sx={{ flex: "1 1 260px", background: TINT, border: `1px solid ${TINT_LINE}`, borderRadius: 4, p: 2.5 }}>

                                <Typography fontSize={13} fontWeight={800} color={INK} mb={1} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                                    <Category fontSize="small" sx={{ color: "#5b84e9" }} /> Remarks
                                </Typography>

                                <Typography fontSize={13.5} color="#5a6584" lineHeight={1.7}>
                                    {lead.Remarks || "No remarks on file."}
                                </Typography>

                            </Box>

                        </Box>

                        {/* Products */}
                        <Box>

                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <Inventory2 sx={{ color: "#5b84e9", fontSize: 20 }} />
                                <Typography fontSize={17} fontWeight={800} color={INK}>
                                    Products
                                </Typography>
                            </Box>

                            <Box display="flex" flexDirection="column" gap={1.25}>

                                {lead.Products?.map((item) => (
                                    <Box
                                        key={item.EnquiryId}
                                        sx={{
                                            p: 2,
                                            borderRadius: 3,
                                            border: `1px solid ${TINT_LINE}`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 2,
                                            flexWrap: "wrap",
                                            transition: "all .15s ease",
                                            "&:hover": { background: TINT, borderColor: "#c7d4f7" }
                                        }}
                                    >

                                        <Box sx={{ minWidth: 160 }}>
                                            <Typography fontWeight={700} fontSize={14.5} color={INK}>
                                                {item.Product}
                                            </Typography>
                                            <Typography fontSize={12.5} color={MUTED}>
                                                {item.Note || "No note"}
                                            </Typography>
                                        </Box>

                                        <Box display="flex" alignItems="center" gap={2}>

                                            <Box textAlign="center">
                                                <Typography fontSize={11} color={MUTED}>Qty</Typography>
                                                <Typography fontSize={14} fontWeight={700} color={INK}>{item.Quantity}</Typography>
                                            </Box>

                                            <Box textAlign="center">
                                                <Typography fontSize={11} color={MUTED}>Rate</Typography>
                                                <Typography fontSize={14} fontWeight={700} color={INK}>₹{item.Rate.toLocaleString("en-IN")}</Typography>
                                            </Box>

                                            <Box
                                                sx={{
                                                    background: GRADIENT,
                                                    color: "#fff",
                                                    px: 1.6, py: 0.6,
                                                    borderRadius: 2,
                                                    fontWeight: 800,
                                                    fontSize: 14
                                                }}
                                            >
                                                ₹{(item.Quantity * item.Rate).toLocaleString("en-IN")}
                                            </Box>

                                        </Box>

                                    </Box>

                                ))
                                }

                            </Box>

                        </Box>


                    </Box>


                </Card>

            </Box>


            <Leads
                openLeadModal={openLeadModal}
                setOpenLeadModal={setOpenLeadModal}
                isEdited={true}
                editLead={lead}
            />


            <FollowUp
                openFollowupModal={openFollowupModal}
                setOpenFollowupModal={setOpenFollowupModal}
                editLead={lead}
            />


            <FollowupHistory
                openFollowupHistryModal={openFollowupHistryModal}
                setOpenFollowupHistryModal={setOpenFollowupHistryModal}
                editLead={lead}
            />

        </>

    );

}


// ---------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------

function GoogleFontImports() {
    return (
        <style>
            {`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');`}
        </style>
    );
}


function HeaderButton({ icon, label, onClick }) {
    return (
        <Box
            component="button"
            onClick={onClick}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.7,
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 3,
                px: 1.6, py: 0.9,
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "background .15s ease",
                "&:hover": { bgcolor: "rgba(255,255,255,0.26)" }
            }}
        >
            {icon}
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                {label}
            </Box>
        </Box>
    );
}

function HeaderPill({ icon, text }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.7,
                bgcolor: "rgba(255,255,255,0.16)",
                border: "1px solid rgba(255,255,255,0.25)",
                px: 1.4, py: 0.55,
                borderRadius: 5,
                fontSize: 12.5,
                fontWeight: 600
            }}
        >
            {icon}
            {text}
        </Box>
    );
}


function StatBlock({ label, value, sub, flex, color, bg, capitalize, small }) {
    return (
        <Box
            sx={{
                flex: `${flex} 1 160px`,
                background: bg || TINT,
                border: `1px solid ${TINT_LINE}`,
                borderRadius: 4,
                p: 2
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                <Typography fontSize={11} fontWeight={700} letterSpacing="0.5px" color={MUTED} sx={{ textTransform: "uppercase" }}>
                    {label}
                </Typography>
                {sub && (
                    <Typography
                        fontSize={10}
                        fontWeight={800}
                        letterSpacing="0.4px"
                        sx={{
                            color: color || INK,
                            bgcolor: "rgba(255,255,255,0.7)",
                            px: 0.8, py: 0.15,
                            borderRadius: 3,
                            textTransform: "uppercase"
                        }}
                    >
                        {sub}
                    </Typography>
                )}
            </Box>
            <Typography
                fontSize={small ? 15 : 20}
                fontWeight={800}
                sx={{
                    color: color || INK,
                    textTransform: capitalize ? "capitalize" : "none"
                }}
            >
                {value}
            </Typography>
        </Box>
    );
}


function DetailLine({ label, value, last }) {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            py={1}
            sx={{ borderBottom: last ? "none" : `1px dashed ${TINT_LINE}` }}
        >
            <Typography fontSize={13} color={MUTED}>
                {label}
            </Typography>
            <Typography fontSize={13.5} fontWeight={700} color={INK}>
                {value || "—"}
            </Typography>
        </Box>




    );
}



export default LeadDetails;
