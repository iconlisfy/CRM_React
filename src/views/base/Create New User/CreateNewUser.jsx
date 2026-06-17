import { Box, Grid, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import Card1 from './card1'
import Card2 from './card2'
import axiosInstance from '../../../axios';
import getReduxState from '../../../ReduxState';
import { format } from 'date-fns';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@mui/material";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function CreateNewUser() {

    const { empId, role, dept, deptid, name } = getReduxState()

    const [DobDate, setDobDate] = useState(new Date().toISOString().split('T')[0]); // from date
    const [WedDate, setWedDate] = useState(new Date().toISOString().split('T')[0]);// to date

    const [allDept, setAllDept] = useState([]);
    const [selectedDept, setSelectedDept] = useState(deptid || "");

    // Date
    const dobDate = DobDate ? format(DobDate, 'yyyy-MM-dd') : null
    const weddate = WedDate ? format(WedDate, 'yyyy-MM-dd') : null

    const [allStaff, setAllStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [selectedStaffKey, setSelectedStaffKey] = useState(null);

    const [SearchBy, setSearchBy] = useState("name");

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [staffName, setStaffName] = useState("");
    const [gender, setGender] = useState("");
    const [designation, setDesignation] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [note, setNote] = useState("");
    const [userName, setUserName] = useState("");
    const [superAdmin, setSuperAdmin] = useState(false)
    const [userCategory, setUserCategory] = useState("Staff");
    const userCategories = [
        "Administrator",
        "HOD",
        "Supervisor",
        "Staff"
    ];
    const [isActive, setIsActive] = useState(true);

    const [editFlag, setEditFlag] = useState(false);

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    const [originalData, setOriginalData] = useState(null);

    const nameInputRef = useRef(null)
    const usernameInputRef = useRef(null)
    const pwdInputRef = useRef(null)
    const confirmInputRef = useRef(null)

    // Close dialog box and focus field if needed
    const handleClose = () => {
        setOpenDialog(false);

        setTimeout(() => {
            if (dialogMessage === "Please Enter Name") {
                nameInputRef.current?.focus();
            } else if (dialogMessage === "Enter User Name") {
                usernameInputRef.current?.focus();
            }
            else if (dialogMessage === "Enter Password") {
                pwdInputRef.current?.focus();
            }
            else if (dialogMessage === "Password and Confirm Password do not match") {
                confirmInputRef.current?.focus();
            }
            // Clear dialog state after focusing
            setDialogMessage("");
        }, 100);
    };



    const [openPhoto, setOpenPhoto] = useState({
        preview: null,
        photo: null
    });

    const fileInputRef = useRef(null);

    const [openSignature, setOpenSignature] = useState({
        preview: null,
        signature: null
    });

    const fileInputRefSignature = useRef(null);

    // OPEN FILE PICKER
    const triggerFileInputSignature = () => {

        if (fileInputRefSignature.current) {

            fileInputRefSignature.current.value = null;

            fileInputRefSignature.current.click();
        }
    };


    // HANDLE SIGNATURE CHANGE
    const handleSignatureChange = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        const preview = URL.createObjectURL(file);

        const reader = new FileReader();

        reader.onloadend = () => {
            setOpenSignature({
                preview,
                signature: reader.result // Base64
            });
        };

        reader.readAsDataURL(file);

        event.target.value = null;
    };

    // REMOVE SIGNATURE
    const handleRemoveSignature = () => {

        setOpenSignature({
            signature: null
        });
    };



    const triggerFileInputPhoto = () => {

        if (fileInputRef.current) {
            fileInputRef.current.value = null;
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        const preview = URL.createObjectURL(file);

        const reader = new FileReader();

        reader.onloadend = () => {
            setOpenPhoto({
                preview,
                photo: reader.result // Base64
            });
        };

        reader.readAsDataURL(file);

        event.target.value = null;
    };


    // REMOVE PHOTO
    const handleRemovePhoto = () => {
        setOpenPhoto({
            photo: null
        });
    };


    // Fetch Staff
    const fetchStaff = async () => {
        try {

            const res = await axiosInstance.get("/AcctMstStaffAPI/GetAll");

            const staffData = res?.data?.staff || [];

            let filteredStaff = [];

            if (role === "Administrator") {

                filteredStaff = staffData;

            } else {

                filteredStaff = staffData.filter(
                    item => Number(item?.Dept_id) === Number(deptid)
                );
            }

            setAllStaff(filteredStaff);

        } catch (err) {

            console.log("Error fetching staff", err);
            setAllStaff([]);

        }
    };

    // Fetch Department
    const fetchDepartment = async () => {
        try {
            const fetchResponse = await axiosInstance.get(`MasterAPI/Search?Type=Dept`)

            if (fetchResponse.data && fetchResponse.data.MasterList) {
                setAllDept(fetchResponse.data.MasterList);
            }
        } catch (error) {
            console.log("error while fetching all data", error)
        }
    }

    console.log("alldept", allDept)

    useEffect(() => {
        fetchStaff()
        fetchDepartment()
    }, [])



    const filteredStaff = allStaff.filter(
        item => Number(item?.Dept_id) === Number(selectedDept)
    );

    console.log("filteredStaff", filteredStaff)


    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState([]);
    const [selectedBranchKey, setSelectedBranchKey] = useState([]);

    //Branchnameget
    useEffect(() => {
        const fetchbraches = async () => {
            try {
                const response = await axiosInstance.get('/BranchNameGet')
                //console.log('response', response);
                const data = response.data;
                if (data.Success && Array.isArray(data.brnch_dlts)) {
                    let apiBranches = data.brnch_dlts;

                    // Only filter when config is loaded
                    // if (config?.branchlist) {
                    //   const list = config.branchlist;

                    //   // If branchlist = [0] -> show ALL branches, do NOT filter
                    //   if (!(list.length === 1 && list[0] === 0)) {
                    //     // Filter branches based on key
                    //     apiBranches = apiBranches.filter(branch =>
                    //       list.includes(branch.BranchKey)
                    //     );
                    //   }
                    // }

                    setBranches(apiBranches);

                    // // auto select first branch
                    // if (apiBranches.length > 0) {

                    //     setBranch(apiBranches[0].DisplayName);
                    //     setBranchKey(apiBranches[0].BranchKey);
                    // }
                } else {
                    console.error("Unexpected API response", data);
                }
            } catch (error) {
                console.error('Error fetching branches:', error);
            }
        }
        fetchbraches();
    }, [])



    const fetchUserDetails = async (empId) => {
        try {
            const res = await axiosInstance.get(
                `/CreateUserAPI/GetUserDetails?empId=${empId}`
            );

            const data = res?.data?.Data;

            if (!data) return;
            setEditFlag(true);

            // User Details
            setUserName(data.User_Name || "");
            setPassword(data.User_Password || "");
            setConfirmPassword(data.User_Password || "");
            setUserCategory(data.User_grp || "");
            setSuperAdmin(data.User_SuperAdmin || false)

            console.log("data.user_Sign", data.user_Sign)

            // Account Head
            const account = data.AccountHead;

            setStaffName(account?.AhMst_pName || "");
            setGender(
                account?.AhMst_Ismale === "M"
                    ? "Male"
                    : account?.AhMst_Ismale === "F"
                        ? "Female"
                        : account?.AhMst_Ismale === "O"
                            ? "Other"
                            : account?.AhMst_Ismale
                                ? account.AhMst_Ismale.charAt(0).toUpperCase() +
                                account.AhMst_Ismale.slice(1).toLowerCase()
                                : ""
            );
            setDesignation(account?.AhMst_drEdDet || "");
            setAddress(account?.AhMst_Address || "");
            setPhone(account?.AhMst_Phno || "");
            setMobile(account?.AhMst_mobile || "");
            setEmail(account?.AhMst_Email || "");
            setNote(account?.AhMst_Note || "");
            setSelectedDept(account?.AhMst_DeptId || "");
            setIsActive(account?.AhMst_IsActive === 1);
            setOpenPhoto({
                preview: null,
                photo: `data:image/jpeg;base64,${account.AhMst_Image}`
            });
            setOpenSignature({
                preview: null,
                signature: `data:image/jpeg;base64,${data.user_Sign}`
            });
            // Dates
            setDobDate(
                account?.AhMst_Dob
                    ? new Date(account.AhMst_Dob)
                    : null
            );

            setWedDate(
                account?.AhMst_WedAnn
                    ? new Date(account.AhMst_WedAnn)
                    : null
            );

            // Branches
            setSelectedBranchKey(
                data.Branches?.map(item => item.Ubl_BrnchId) || []
            );

            setOriginalData(data);

        } catch (err) {
            console.log(err);
        }
    };

    const getChangedFields = () => {
        if (!originalData) return [];

        const changes = [];
        const account = originalData.AccountHead || {};

        const originalGender =
            account.AhMst_Ismale === "M"
                ? "Male"
                : account.AhMst_Ismale === "F"
                    ? "Female"
                    : account.AhMst_Ismale === "O"
                        ? "Other"
                        : "";

        if (gender !== originalGender) {
            changes.push(
                `Gender changed from '${originalGender}' to '${gender}'`
            );
        }

        if (designation !== (account.AhMst_drEdDet || "")) {
            changes.push(
                `Designation changed from '${account.AhMst_drEdDet || ""}' to '${designation}'`
            );
        }

        if (staffName !== (account.AhMst_pName || "")) {
            changes.push(
                `Name changed from '${account.AhMst_pName || ""}' to '${staffName}'`
            );
        }

        if (mobile !== (account.AhMst_mobile || "")) {
            changes.push(
                `Mobile changed from '${account.AhMst_mobile || ""}' to '${mobile}'`
            );
        }

        if (email !== (account.AhMst_Email || "")) {
            changes.push(
                `Email changed from '${account.AhMst_Email || ""}' to '${email}'`
            );
        }

        if (password !== (originalData.User_Password || "")) {
            changes.push("Password Changed");
        }

        return changes;
    };
    //Reset Function
    const handleNew = () => {
        setEditFlag(false);

        setSelectedStaff(null);
        setSelectedStaffKey(null);

        setStaffName("");
        setGender("");
        setDesignation("");
        setAddress("");
        setPhone("");
        setMobile("");
        setEmail("");
        setNote("");
        setUserName("");
        setPassword("");
        setConfirmPassword("");
        setUserCategory("Staff"); // default value
        setSelectedBranch([]);
        setSelectedBranchKey([]);
        setSuperAdmin(false)

        setDobDate(new Date().toISOString().split('T')[0]);
        setWedDate(new Date().toISOString().split('T')[0]);

        // Reset Photo
        setOpenPhoto({
            preview: null,
            photo: null
        });

        // Reset Signature
        setOpenSignature({
            preview: null,
            signature: null
        });

        // Clear file inputs
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }

        if (fileInputRefSignature.current) {
            fileInputRefSignature.current.value = null;
        }

        fetchStaff();
    };

    const currentDateTime = format(
        new Date(),
        "yyyy-MM-dd HH:mm:ss"
    );


    // Save Function
    const handleSave = async () => {
        try {

            if (!staffName) {
                setDialogMessage("Please Enter Name")
                setOpenDialog(true)
                return;
            }

            if (!userName) {
                setDialogMessage("Enter User Name");
                setOpenDialog(true)
                return;
            }

            if (!password) {
                setDialogMessage("Enter Password");
                setOpenDialog(true)
                return;
            }

            if (password !== confirmPassword) {
                setDialogMessage("Password and Confirm Password do not match");
                setOpenDialog(true)
                return;
            }

            const changedFields = editFlag ? getChangedFields() : [];

            const payload = {
                UsrName: userName,
                Usrpwd: password,
                Usrgrp: userCategory,
                UsrEmpKey: selectedStaffKey || "",
                SuperAdmin: superAdmin,
                PrintView: null,
                Status: null,
                EditFlag: editFlag,
                UsrSign: openSignature?.signature
                    ? openSignature.signature.split(",")[1]
                    : '',

                ...(editFlag === true && {
                    UsrEmpId: selectedStaffKey,
                    logReason: "User Details Change",
                    logDesc: changedFields.join(", "),
                    logForm: "Create Staff",
                    logUser: name, // logged in user
                    logUserId: empId
                }),

                bnchuser: selectedBranchKey.map((id) => ({
                    UblbrnchId: id
                })),

                acthdval: [
                    {
                        Name: staffName,
                        Gender: gender,
                        Designation: designation,
                        Address: address,
                        Phone: phone,
                        Mobile: mobile,
                        Dob: dobDate
                            ? format(new Date(DobDate), "yyyy-MM-dd'T'00:00:00")
                            : null,
                        WedAnn: weddate
                            ? format(new Date(WedDate), "yyyy-MM-dd'T'00:00:00")
                            : null,
                        Email: email,
                        IsActive: isActive ? 1 : 0,
                        Note: note,
                        ShortName: name,
                        DepartmentId: selectedDept,
                        Image: openPhoto?.photo
                            ? openPhoto.photo.split(",")[1]
                            : null,
                        Type: "Staff",
                        UserInfo: `${name} - ${currentDateTime}`
                    }
                ]
            };

            console.log("Payload :", payload);

            const response = await axiosInstance.post(
                "/CreateUserAPI/post",
                payload
            );

            console.log(response.data);

            if (response?.data?.Success) {
                toast.success(
                    editFlag
                        ? "User Updated Successfully"
                        : "User Saved Successfully"
                );
            }
            handleNew()

        } catch (error) {
            console.error(error);
            toast.error(
                error?.response?.data?.message ||
                "Failed to save user"
            );
        }
    };




    return (
        <>
            <Box
                sx={{
                    zoom: { xs: "0.9", sm: "0.9", md: "1", lg: "1", xl: "0.9" }
                }}>

                <Grid container spacing={1}>

                    <Grid item xs={12} >
                        <Typography
                            variant="h2"
                            component="div"
                            display={'flex'}
                            alignItems={'center'}
                            textAlign={'center'}
                            color={'#DC3545'}

                            sx={{
                                fontSize: '1.4rem',
                                fontWeight: 'bold',
                                // marginLeft: { xs: '20px', sm: '0px', md: "-10px", lg: "-140px", xl: "-180px" },
                                marginTop: { xs: '-20px', sm: '-20px', md: "-20px", lg: "-20px", xl: "-20px" }
                            }}>
                            Create Staff</Typography>

                    </Grid>

                    <Grid item xs={12} sm={8} lg={9.5}>
                        <Card1

                            branches={branches}
                            setBranches={setBranches}
                            selectedBranch={selectedBranch}
                            setSelectedBranch={setSelectedBranch}
                            selectedBranchKey={selectedBranchKey}
                            setSelectedBranchKey={setSelectedBranchKey}

                            DobDate={DobDate}
                            setDobDate={setDobDate}
                            WedDate={WedDate}
                            setWedDate={setWedDate}
                            allDept={allDept}
                            setAllDept={setAllDept}
                            selectedDept={selectedDept}
                            setSelectedDept={setSelectedDept}

                            allStaff={allStaff}
                            setAllStaff={setAllStaff}
                            selectedStaff={selectedStaff}
                            setSelectedStaff={setSelectedStaff}
                            selectedStaffKey={selectedStaffKey}
                            setSelectedStaffKey={setSelectedStaffKey}
                            SearchBy={SearchBy}
                            setSearchBy={setSearchBy}
                            filteredStaff={filteredStaff}
                            role={role}

                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            password={password}
                            setPassword={setPassword}

                            confirmPassword={confirmPassword}
                            setConfirmPassword={setConfirmPassword}
                            showConfirmPassword={showConfirmPassword}
                            setShowConfirmPassword={setShowConfirmPassword}

                            staffName={staffName}
                            setStaffName={setStaffName}
                            gender={gender}
                            setGender={setGender}
                            designation={designation}
                            setDesignation={setDesignation}
                            address={address}
                            setAddress={setAddress}
                            phone={phone}
                            setPhone={setPhone}
                            mobile={mobile}
                            setMobile={setMobile}
                            email={email}
                            setEmail={setEmail}
                            note={note}
                            setNote={setNote}
                            userName={userName}
                            setUserName={setUserName}
                            userCategory={userCategory}
                            setUserCategory={setUserCategory}
                            isActive={isActive}
                            setIsActive={setIsActive}

                            handleSave={handleSave}
                            nameInputRef={nameInputRef}
                            usernameInputRef={usernameInputRef}
                            pwdInputRef={pwdInputRef}
                            confirmInputRef={confirmInputRef}
                            fetchUserDetails={fetchUserDetails}

                            handleNew={handleNew}
                            userCategories={userCategories}

                        />
                    </Grid>

                    <Grid item xs={12} sm={4} lg={2.5} >
                        <Card2


                            openSignature={openSignature}
                            setOpenSignature={setOpenSignature}
                            fileInputRefSignature={fileInputRefSignature}
                            triggerFileInputSignature={triggerFileInputSignature}
                            handleSignatureChange={handleSignatureChange}
                            handleRemoveSignature={handleRemoveSignature}
                            openPhoto={openPhoto}
                            setOpenPhoto={setOpenPhoto}
                            fileInputRef={fileInputRef}
                            triggerFileInputPhoto={triggerFileInputPhoto}
                            handleFileChange={handleFileChange}
                            handleRemovePhoto={handleRemovePhoto}

                        />
                    </Grid>

                </Grid>

            </Box>



            <Dialog open={openDialog}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        px: 1,
                        py: 1,
                        // minWidth: 300
                    }
                }}>
                <DialogContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* //   <WarningAmberIcon sx={{ color: '#f59e0b', fontSize: 22 }} /> */}
                        <Typography variant="body1" sx={{ fontWeight: 500 }}
                        >                {dialogMessage}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 1, pb: 1 }}>
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        size="small"
                        sx={{
                            textTransform: 'none',
                            backgroundColor: '#DC3545',
                            borderRadius: 1.5,
                            px: 2,
                            '&:hover': { backgroundColor: '#DC3545' }
                        }}
                    >            OK
                    </Button>
                </DialogActions>
            </Dialog>


            <ToastContainer autoClose={1000} hideProgressBar={true} position='top-center' theme='colored' transition={Bounce} />


        </>
    )
}

export default CreateNewUser
