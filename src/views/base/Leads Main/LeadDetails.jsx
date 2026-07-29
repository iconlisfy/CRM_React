import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress
} from "@mui/material";

import {
    Person,
    Phone,
    LocationOn,
    Business,
    CalendarMonth,
    Inventory2
} from "@mui/icons-material";

import { useParams } from "react-router-dom";
import axiosInstance from "../../../axios";


function LeadDetails() {

    const { leadCode } = useParams();

    const [lead,setLead] = useState(null);
    const [loading,setLoading] = useState(true);


    useEffect(()=>{
        getLead();
    },[leadCode]);


    const getLead = async()=>{

        try{

            const res = await axiosInstance.get(
                `/LeadSaveUpdateAPI/LeadData?LeadCode=${leadCode}`
            );

            if(res.data.status){
                setLead(res.data.data[0]);
            }

        }
        catch(err){
            console.log(err);
        }
        finally{
            setLoading(false);
        }

    };



    const formatDate=(date)=>{

        if(!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                day:"2-digit",
                month:"short",
                year:"numeric"
            }
        );

    };



    const totalBusiness = lead?.Products?.reduce(
        (sum,item)=>sum + (item.Quantity * item.Rate),
        0
    );



    if(loading){

        return(
            <Box
                height="50vh"
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <CircularProgress sx={{color:"#3f5483"}}/>
            </Box>
        );

    }



    if(!lead){

        return(
            <Typography align="center" mt={5}>
                No Lead Found
            </Typography>
        );

    }



return(

<Box
p={3}
sx={{
    background:"#f7f9fc",
    minHeight:"100vh"
}}
>


<Card
sx={{
    borderRadius:4,
    background:"#3f5483",
    color:"#fff",
    mb:2
}}
>

<CardContent>

<Typography
fontSize="22px"
fontWeight={800}
>
Lead Details
</Typography>

<Typography fontSize="13px">
Customer enquiry information
</Typography>


</CardContent>

</Card>





<Card
sx={{
    borderRadius:4,
    boxShadow:"0 8px 25px rgba(63,84,131,.1)"
}}
>


<CardContent sx={{p:3}}>


<Title text="Lead Information"/>



<Grid container spacing={3}>


<Grid item xs={12} md={4}>


<Typography
fontWeight={800}
color="#3f5483"
mb={1}
>
Customer Details
</Typography>



<InfoRow icon={<Person/>}
label="Name"
value={lead.CustomerName}
/>


<InfoRow icon={<Phone/>}
label="Phone"
value={lead.CustomerPhone}
/>


<InfoRow icon={<LocationOn/>}
label="Place"
value={lead.Place}
/>


<InfoRow icon={<Business/>}
label="Location"
value={lead.LeadLocation}
/>



<Typography
fontSize="13px"
fontWeight={700}
color="#3f5483"
mt={1}
>
Remarks
</Typography>


<Paper
sx={{
p:1,
mt:.5,
background:"#f1f4fa",
fontSize:"13px",
borderRadius:2
}}
>
{lead.Remarks || "-"}
</Paper>



</Grid>






<Grid item xs={12} md={4}>


<Typography
fontWeight={800}
color="#3f5483"
mb={1}
>
Lead Information
</Typography>


<InfoRow
label="Lead Code"
value={lead.LeadCode}
/>


<InfoRow
label="Lead Date"
value={formatDate(lead.LeadDate)}
/>


<InfoRow
label="Source"
value={lead.LeadSource}
/>


<InfoRow
label="Type"
value={lead.LeadTypeId}
/>


<InfoRow
label="Quality"
value={lead.LeadQuality}
/>


</Grid>







<Grid item xs={12} md={4}>


<Typography
fontWeight={800}
color="#3f5483"
mb={1}
>
Summary
</Typography>


<Box
sx={{
background:"#3f5483",
color:"#fff",
p:2,
borderRadius:3,
mb:2
}}
>

<Typography fontSize="13px">
Business Value
</Typography>


<Typography
fontSize="25px"
fontWeight={900}
>
$ {totalBusiness?.toLocaleString("en-US")}
</Typography>


</Box>




<InfoRow
icon={<CalendarMonth/>}
label="Follow Up"
value={formatDate(lead.FollowUpDate)}
/>



<InfoRow
label="Follow Up Required"
value={lead.IsFollowUpReq?"Yes":"No"}
/>



</Grid>


</Grid>





<Box mt={3}>

<Title
icon={<Inventory2/>}
text="Products"
/>



<TableContainer
component={Paper}
sx={{
borderRadius:3,
boxShadow:"none",
border:"1px solid #ddd"
}}
>


<Table size="small">


<TableHead>

<TableRow>


{
["Product","Qty","Rate","Total","Note"]
.map(x=>(

<TableCell
key={x}
sx={{
background:"#3f5483",
color:"#fff",
fontWeight:800
}}
>
{x}
</TableCell>

))
}


</TableRow>

</TableHead>




<TableBody>

{
lead.Products?.map(item=>(

<TableRow key={item.EnquiryId}>


<TableCell>
{item.Product}
</TableCell>


<TableCell>
{item.Quantity}
</TableCell>


<TableCell>
$ {item.Rate.toLocaleString("en-US")}
</TableCell>


<TableCell>
$ {(item.Quantity*item.Rate)
.toLocaleString("en-US")}
</TableCell>


<TableCell>
{item.Note || "-"}
</TableCell>


</TableRow>


))
}


</TableBody>


</Table>


</TableContainer>


</Box>



</CardContent>

</Card>



</Box>

);

}







function Title({icon,text}){

return(

<Typography
sx={{
display:"flex",
alignItems:"center",
gap:1,
fontWeight:800,
fontSize:"18px",
color:"#3f5483",
mb:2
}}
>

{icon}

{text}

</Typography>

);

}




function InfoRow({icon,label,value}){

return(

<Box
display="flex"
justifyContent="space-between"
alignItems="center"
py={1}
sx={{
borderBottom:"1px dashed #ddd"
}}
>


<Box
display="flex"
gap={1}
alignItems="center"
>

<Box sx={{color:"#3f5483"}}>
{icon}
</Box>


<Typography
fontSize="14px"
color="#7b8794"
>
{label}
</Typography>


</Box>



<Typography
fontWeight={700}
fontSize="14px"
>
{value || "-"}
</Typography>


</Box>

);

}



export default LeadDetails;