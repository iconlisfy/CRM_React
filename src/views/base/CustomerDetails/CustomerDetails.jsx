import React, { useEffect, useRef, useState } from 'react'
import { CheckBox, CheckBoxOutlineBlank, HelpOutline } from '@mui/icons-material'
import { Card, Paper, CardContent, Checkbox, FormControlLabel, Box, Grid, Radio, Table, IconButton, InputAdornment, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, TableBody, Button, MenuItem, Autocomplete, FormGroup, Tooltip, Chip } from '@mui/material'
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { getNames } from 'country-list';
import { Country, State, City } from 'country-state-city';
import axiosInstance from '../../../axios';
import { FixedSizeList } from 'react-window';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

} from "@mui/material";
import getReduxState from '../../../ReduxState';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function CustomerDetails() {

    const { branch, empId, name } = getReduxState()

    const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]); // from date
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);// to date
    const [installDate, setInstallDate] = useState(new Date());// to date

    // Date
    const frmDate = fromDate ? format(fromDate, 'yyyy-MM-dd') : null
    const todate = toDate ? format(toDate, 'yyyy-MM-dd') : null
    const insDate = installDate ? format(installDate, 'yyyy-MM-dd') : null

    const inputRef = useRef();

    const [remarksDateTime, setRemarksDateTime] = useState(new Date());

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    const [displayName, setDisplayName] = useState('');
    const [regName, setRegName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerCntct, setOwnerCntct] = useState('')
    const [contactNo, setContactNo] = useState('');
    const [address, setAddress] = useState('');

    const [remarks, setRemarks] = useState('');
    const [custRelation, setCustRelation] = useState('')
    const [pointOfCntct, setPointOfCntct] = useState('')
    const [pointOfCntctNo, setPointOfCntctNo] = useState('')
    const [sponsoredBy, setSponsoredBy] = useState('')
    const [sponsorAddress, setSponsorAddress] = useState('')
    const [sponsorGST, setSponsorGST] = useState('')
    const [isActive, setIsActive] = useState(0)
    const [verified, setVerified] = useState(0)
    const [isHeadOffice, setIsHeadOffice] = useState(0)
    const [supportType, setSupportType] = useState('')

    const [productData, setPrdoductData] = useState([])
    const [multipleCntactData, setMultipleCntactData] = useState([])

    const [allCustomers, setAllCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [allProducts, setAllProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [productSearch, setProductSearch] = useState('');

    const [allStaff, setAllStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState('');

    const [selectedInstalledBY, setSelectedInstallBy] = useState('');

    const [allCustType, setCustType] = useState([]);
    const [selectedCustType, setSelectedCustType] = useState('');

    const [allAnalyzer, setAnalyzer] = useState([]);
    const [selectedAnalyzer, setSelectedAnalyzer] = useState('');

    const [searchValue, setSearchValue] = useState('');
    const [SearchBy, setSearchBy] = useState('RegName');

    const [editIndex, setEditIndex] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState('');
    const [description, setDescription] = useState('');
    const [noAmc, setNoAmc] = useState(false);
    const [productIsActive, setProductIsActive] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingRow, setPendingRow] = useState(null);
    const [pendingIndex, setPendingIndex] = useState(null);

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [pendingDeleteRow, setPendingDeleteRow] = useState(null);
    const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [editFlag, setEditFlag] = useState(false)

    const [originalData, setOriginalData] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);

    const [analyzerData, setAnalyzerData] = useState([]);

    const [descriptionDlts, setDescriptionDlts] = useState([])

    const [noOfComputers, setNoOfComputers] = useState('');
    const [serverName, setServerName] = useState('')
    const [installationType, setInstallationType] = useState('')

    const [email, setEmail] = useState('')

    const [newContact, setNewContact] = useState({
        MC_Name: '',
        MC_Desg: '',
        MC_Mobile: '',
        MC_IsActive: 1
    });

    const custNameInputRef = useRef(null)
    const custRegNameInputRef = useRef(null)


    // Close dialog box and focus field if needed
    const handleClose = () => {
        setOpenDialog(false);

        setTimeout(() => {
            if (dialogMessage === "Please Enter Customer Name") {
                custNameInputRef.current?.focus();
            } else if (dialogMessage === "Please Enter Customer Reg Name") {
                custRegNameInputRef.current?.focus();
            }
            // Clear dialog state after focusing
            setDialogMessage("");
        }, 100);
    };

    const LISTBOX_PADDING = 8;

    function renderRow(props) {
        const { data, index, style } = props;
        const option = data[index];

        return (
            <li {...option.props} style={style}>
                {option.label}
            </li>
        );
    }

    const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
        const { children, ...other } = props;

        const itemData = React.Children.toArray(children);

        return (
            <div ref={ref} {...other}>
                <FixedSizeList
                    height={400}
                    width="100%"
                    itemSize={36}
                    itemCount={itemData.length}
                    itemData={itemData}
                    overscanCount={5}
                    outerElementType={React.forwardRef((props, ref) => (
                        <div ref={ref} {...props} />
                    ))}
                >
                    {({ index, style, data }) => (
                        <div style={style}>
                            {data[index]}
                        </div>
                    )}
                </FixedSizeList>
            </div>
        );
    });

    const countries = Country.getAllCountries();
    const countryObj = countries.find(
        (c) => c.name === selectedCountry
    );

    const states = countryObj
        ? State.getStatesOfCountry(countryObj.isoCode)
        : [];

    const districtMap = {
        Kerala: [
            "Thiruvananthapuram",
            "Kollam",
            "Pathanamthitta",
            "Alappuzha",
            "Kottayam",
            "Idukki",
            "Ernakulam",
            "Thrissur",
            "Palakkad",
            "Malappuram",
            "Kozhikode",
            "Wayanad",
            "Kannur",
            "Kasaragod"
        ],
    };

    const districts = selectedState
        ? districtMap[selectedState] || []
        : [];


    const generateCustCode = (key, prefix = branch) => {
        if (!key) return "";

        const keyStr = String(key);

        const totalLength = 8; // required numeric length
        const zeroCount = Math.max(totalLength - keyStr.length, 0);

        const zeros = "0".repeat(zeroCount);

        return prefix + zeros + keyStr;
    };

    const formatDateTimeForAPI = (date) => {
        if (!date) return null;

        const d = new Date(date);

        if (isNaN(d)) return null; // invalid date safety

        const pad = (n) => n.toString().padStart(2, '0');

        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    // Fetch Customer Name
    const fetchAllDetails = async () => {
        try {
            const fetchResponse = await axiosInstance.get(`/AccountHeadsAPI/GetAll`)
            if (fetchResponse.data?.ahmst) {
                const cleanedCustomers = fetchResponse.data.ahmst.map((item) => ({
                    ...item,
                    AhMst_pName: item.AhMst_pName?.trim() || "",
                    AhMst_DisplayName: item.AhMst_DisplayName?.trim() || "",
                }));

                const sortedCustomers = cleanedCustomers.sort((a, b) => {
                    const valueA =
                        SearchBy === "DispName"
                            ? a.AhMst_DisplayName
                            : a.AhMst_pName;

                    const valueB =
                        SearchBy === "DispName"
                            ? b.AhMst_DisplayName
                            : b.AhMst_pName;

                    return valueA.localeCompare(valueB, undefined, {
                        sensitivity: "base",
                    });
                });

                setAllCustomers(sortedCustomers);
            }
        } catch (error) {
            console.log("error while fetching all data", error)
        }
    }


    const fetchDescription = async () => {
        try {
            const fetchResponse = await axiosInstance.get(`checklist`)
            console.log("fetchResponse", fetchResponse)

            if (fetchResponse.data && fetchResponse.data.data) {
                setDescriptionDlts(fetchResponse.data.data)
            }
        } catch (error) {
            console.log("error while fetching description", error)
        }
    }

    // Fetch Products
    const fetchProducts = async () => {
        try {

            const fetchResponse = await axiosInstance.get(`/ProductsAPI/GetAll`);

            if (fetchResponse.data?.products) {

                // FILTER ONLY PRODUCT TYPE
                const filteredProducts = fetchResponse.data.products.filter(
                    (item) => item?.mstr_type === "Product"
                );
                setAllProducts(filteredProducts);
            }

        } catch (error) {
            console.log("error while fetching all data", error);
        }
    };

    // Fetch latest customer key
    const fetchLatestCustKey = async () => {
        try {
            const fetchResponse = await axiosInstance.get(`/CustomerAPI/NewId`)

            if (fetchResponse.data && fetchResponse.data.CustMax) {
                setSelectedCustomer({ AhMst_Key: fetchResponse.data.CustMax });
            }
        } catch (error) {
            console.log("error while fetching all data", error)
        }
    }

    // Fetch Staff
    const fetchStaff = async () => {
        try {
            const fetchResponse = await axiosInstance.get(`/AcctMstStaffAPI/GetAll`)

            if (fetchResponse.data && fetchResponse.data.staff) {
                setAllStaff(fetchResponse.data.staff);
            }
        } catch (error) {
            console.log("error while fetching all data", error)
        }
    }

    // Fetch CustType
    const fetchCustType = async () => {
        try {
            const fetchResponse = await axiosInstance.get(`MasterAPI/Search?Type=CustType`)

            if (fetchResponse.data && fetchResponse.data.MasterList) {
                setCustType(fetchResponse.data.MasterList);
            }
        } catch (error) {
            console.log("error while fetching all data", error)
        }
    }

    useEffect(() => {
        fetchAllDetails()
        fetchProducts()
        fetchStaff()
        fetchCustType()
        fetchLatestCustKey()
        fetchDescription()
    }, [])

    // Fetch Customer Details Using AhmstKey
    const handleSelectCustomer = async (customer) => {
        if (!customer) return;
        setSelectedCustomer(customer);
        setSearchValue('');
        const key = customer.AhMst_Key;

        try {
            const res = await axiosInstance.get(
                `/CustomerAPI/GetData?AhmstKey=${key}`
            );
            console.log("res", res)
            const data = res?.data?.getUsrdet;
            setOriginalData(res.data); // store FULL response (important)

            const matchedType = allCustType.find(
                (item) => Number(item.mstr_key) === Number(data?.AhMst_CustType)
            );

            const matchedStaff = allStaff.find(
                (item) => Number(item.ahmst_key) === Number(data?.RemarksBy)
            );



            setEditFlag(true)
            setAnalyzerData(res.data?.Analyzerlist || []);
            setDisplayName(data?.AhMst_DisplayName || '');
            setRegName(data?.AhMst_pName || '');
            setOwnerName(data?.Customer_OwnerName || '');
            setContactNo(data?.AhMst_mobile || '');
            setAddress(data?.AhMst_Address || '');
            setSelectedCountry(data?.AhMst_Country || '');
            setSelectedState(data?.AhMst_State || '');
            setSelectedDistrict(data?.AhMst_District || '');
            setRemarks(data?.AhMst_Remarks || '');
            setSelectedStaff(matchedStaff?.ahmst_key || '')
            setOwnerCntct(data?.Customer_OwnerContact || '')
            setCustRelation(data?.AhMst_CustRelation || '')
            setSelectedCustType(matchedType?.mstr_key || '');
            setSponsoredBy(data?.SponsoredBy || '')
            setSponsorAddress(data?.SponsorAddress || '')
            setSupportType(data?.AhMst_SupportType || '')
            setSponsorGST(data?.SponsorGST || '')
            setIsActive(Number(data?.AhMst_IsActive) === 1);
            setVerified(Number(data?.AhMst_Verified) === 1)
            setIsHeadOffice(Number(data?.AhMst_IsHeadOffce) == 1)
            setPointOfCntct(data?.AhMst_ContPrsn || '')
            setPointOfCntctNo(data?.AhMst_ContPrsnMob || '')
            setServerName(data?.Customer_ServerName || '')
            setNoOfComputers(data?.Customer_NoComputers || '')
            setInstallationType(data?.Customer_InstallType || '')
            setSelectedInstallBy(data?.AhMst_InstBy || '')
            setEmail(data?.AhMst_Email || '')
            setRemarksDateTime(
                data?.RemarksDate
                    ? new Date(data.RemarksDate)
                    : new Date()
            );
            const rawDate = data?.AhMst_InstOn;

            if (rawDate) {
                const parsedDate = new Date(rawDate.replace(/([AP]M)$/i, " $1"));
                setInstallDate(parsedDate);
            }
            setPrdoductData(res.data?.Productlist || []);
            setMultipleCntactData(res.data?.MultiContactList || [])

            const savedChecklist = res.data?.checklist || []

            const updatedChecklist = descriptionDlts.map((item) => {

                const matched = savedChecklist.find(
                    (x) => Number(x.CustChk_DescId) === Number(item.Chk_Id)
                )

                return {
                    ...item,

                    // checkbox
                    ChkSelectS: matched?.CustChk_Done ? 1 : 0,

                    // narration
                    Narration: matched?.CustChk_Narration || "",

                    // saved key if needed
                    CustChk_Key: matched?.CustChk_Key || 0
                }
            })

            setDescriptionDlts(updatedChecklist)

        } catch (error) {
            console.log("Error fetching customer details", error);
        }
    };

    // Filter Data
    useEffect(() => {
        const input = searchValue?.toLowerCase().trim() || '';

        const filtered = allCustomers.filter((item) => {
            const value =
                SearchBy === 'RegName'
                    ? item.AhMst_pName
                    : item.AhMst_DisplayName;

            // remove empty / null / whitespace
            if (!value || !value.trim()) return false;

            // apply search
            return value.toLowerCase().includes(input);
        });

        setFilteredCustomers(filtered);
    }, [searchValue, SearchBy, allCustomers]);

    // Highlight Text
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function highlightText(text = "", query = "") {
        if (!query) return text;

        const safeQuery = escapeRegExp(query);

        const regex = new RegExp(`(${safeQuery})`, "gi");

        const parts = text.split(regex);

        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <span
                    key={i}
                    style={{ backgroundColor: "var(--focus-bg-color)", fontWeight: 600 }}
                >
                    {part}
                </span>
            ) : (
                part
            )
        );
    }

    // New button
    const handleNew = () => {
        // reset customer (IMPORTANT for flag)
        setSelectedCustomer(null);

        setSearchBy('RegName')

        // basic fields
        setDisplayName('');
        setRegName('');
        setOwnerName('');
        setOwnerCntct('');
        setContactNo('');
        setAddress('');
        setRemarks('');
        setSelectedCustType('')
        setEmail('')

        // location
        setSelectedCountry('');
        setSelectedState('');
        setSelectedDistrict('');

        // relation & contact
        setCustRelation('');
        setPointOfCntct('');
        setPointOfCntctNo('');
        setSupportType('')
        setRemarksDateTime(new Date())
        setEditFlag(false)
        setInstallDate(new Date())

        setSelectedStaff('')
        setSelectedInstallBy('')

        // sponsor
        setSponsoredBy('');
        setSponsorAddress('');
        setSponsorGST('');

        // checkboxes
        setIsActive(false);
        setVerified(false);
        setIsHeadOffice(false);

        //  tables
        setPrdoductData([]);
        setMultipleCntactData([]);

        //  product form reset (IMPORTANT)
        setSelectedProduct(null);       // Autocomplete fix
        setProductSearch('');           // search text clear
        setDescription('');
        setFromDate(new Date());        // Date reset
        setToDate(new Date());
        setProductIsActive(false);
        setNoAmc(false);

        // edit mode reset
        setEditIndex(null);
        setIsEditMode(false);

        // search reset
        setSearchValue('');
        fetchLatestCustKey()
        setAnalyzerData([])
        setDescriptionDlts([])
        fetchDescription()
        setServerName('')
        setNoOfComputers('')
        setInstallationType('')
    };

    // Reset Product Table
    const resetProductForm = () => {
        setSelectedProduct('');
        setDescription('');
        setFromDate(new Date());
        setToDate(new Date());

        setProductIsActive(false);
        setNoAmc(false);

        setEditIndex(null);
        setIsEditMode(false);
        setAnalyzerData([])
    };


    const combinedData = [
        ...(productData || []).map(item => ({
            ...item,
            rowType: "PRODUCT"
        })),

        ...(analyzerData || []).map(item => ({
            ...item,
            rowType: "ANALYZER"
        }))
    ];


    console.log("combinedData", combinedData)
    //------------ Save Function ---------

    const formatProductsForAPI = () => {
        return (productData || []).map(item => ({
            flag: false,
            Prcode: item.Prcode,
            Productname: item.Productname,
            ProductNarration: item.ProductNarration,
            PrdAMCFrom: item.PrdAMCFrom
                ? format(new Date(item.PrdAMCFrom), 'yyyy-MM-dd')
                : null,

            PrdAMCTo: item.PrdAMCTo
                ? format(new Date(item.PrdAMCTo), 'yyyy-MM-dd')
                : null,

            Prd_AMCIsActive: item.Prd_AMCIsActive === 1,
            PrdNoAMC: item.PrdNoAMC === 1,
        }));
    };

 

    const getAMCStatus = (row) => {

        const today = new Date();

        const isActive =
            row?.Prd_AMCIsActive === true ||
            Number(row?.Prd_AMCIsActive) === 1;

        const amcFrom = row?.PrdAMCFrom
            ? new Date(row.PrdAMCFrom)
            : row?.anlAMCFrom
                ? new Date(row.anlAMCFrom)
                : null;

        const amcTo = row?.PrdAMCTo
            ? new Date(row.PrdAMCTo)
            : row?.anlAMCTo
                ? new Date(row.anlAMCTo)
                : null;

        if (
            amcFrom &&
            amcTo &&
            today >= amcFrom &&
            today <= amcTo
        ) {
            return "ACTIVE";
        }

        if (isActive) {
            return "ACTIVE";
        }

        if (amcTo && today > amcTo) {
            return "EXPIRED";
        }

        return "NO_AMC";
    };

    const amcSummary = React.useMemo(() => {

        let activeCount = 0;
        let inactiveCount = 0;

        (combinedData || []).forEach((row) => {

            const today = new Date();

            const isActive =
                row?.Prd_AMCIsActive === true ||
                Number(row?.Prd_AMCIsActive) === 1;

            const amcFrom = row?.PrdAMCFrom
                ? new Date(row.PrdAMCFrom)
                : null;

            const amcTo = row?.PrdAMCTo
                ? new Date(row.PrdAMCTo)
                : null;

            const validAMC =
                amcFrom &&
                amcTo &&
                today >= amcFrom &&
                today <= amcTo;

            if (validAMC || isActive) {
                activeCount++;
            } else {
                inactiveCount++;
            }
        });

        return {
            activeCount,
            inactiveCount
        };

    }, [combinedData]);

    const hasData = (combinedData?.length || 0) > 0;

   
    
    const hasActive = (combinedData || []).some(
        (row) => getAMCStatus(row) === "ACTIVE"
    );

    const hasWarning =
        hasData &&
        !hasActive;


    const warningProducts = React.useMemo(() => {
        return (combinedData || [])
            .filter((row) => {
                const status = getAMCStatus(row);
                return status === "NO_AMC" || status === "EXPIRED";
            })
            .map((row) => ({
                name: row.Productname || row.AnlzName,
                status: getAMCStatus(row)
            }));
    }, [combinedData]);


    const alertProducts = React.useMemo(() => {

        return (combinedData || [])
            .filter((row) => {

                const isActive =
                    row?.Prd_AMCIsActive === true ||
                    Number(row?.Prd_AMCIsActive) === true;

                // Skip active products
                if (isActive) return false;

                const status = getAMCStatus(row);

                return status === "NO_AMC" || status === "EXPIRED";
            })
            .map((row) => ({
                name: row.Productname || row.AnlzName,
                status: getAMCStatus(row),
                isActive: row.Prd_AMCIsActive
            }));
    }, [combinedData]);


    const showInfoIcon = alertProducts.length > 0;

    return (
        <div>

            <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={7} lg={8}>
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
                            // marginLeft :{ xs:'20px' , sm:'0px' , md:"130px" , lg:"-160px" ,xl:"-470px"},            
                            marginTop: { xs: '-20px', sm: '-20px', md: "-20px", lg: "-20px", xl: "-20px" }
                        }}
                    >
                        Customer Details
                    </Typography>
                </Grid>

                <Grid item xs={9} sm={4} md={3} lg={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Typography
                        variant="h6"
                        component="div"
                        display={'flex'}
                        alignItems={'center'}
                        textAlign={'center'}
                        color={'#3f5483'}
                        sx={{
                            fontSize: '0.95rem',
                            fontWeight: 'bold',
                            marginTop: { xs: '-20px', sm: '-20px', md: "-20px", lg: "-20px", xl: "-20px" }
                        }}
                    >
                        Cust Code: {generateCustCode(selectedCustomer?.AhMst_Key)}
                    </Typography>
                </Grid>

                <Grid item xs={3} sm={1.9} md={1.8} lg={1.8} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Typography
                        variant="h6"
                        component="div"
                        display={'flex'}
                        alignItems={'center'}
                        textAlign={'center'}
                        color={'#3f5483'}
                        sx={{
                            fontSize: '0.95rem',
                            fontWeight: 'bold',
                            marginTop: { xs: '-20px', sm: '-20px', md: "-20px", lg: "-20px", xl: "-20px" }
                        }}
                    >
                        Cust ID: {selectedCustomer?.AhMst_Key || '-'}
                    </Typography>
                </Grid>

            </Grid>

            <Grid container spacing={1}>

                {/* ----------Card 1---------- */}

                <Grid item xs={12} lg={12}>

                    <Card sx={{
                        height: { xs: '150px', sm: '70px', lg: "70px" },
                       backgroundColor: 'transparent !important',
                        boxShadow: 'none',
                        border: '1px solid #d1d5db', // light gray border
                        borderRadius: 2,
                    }}>
                        <CardContent>

                            <Grid container spacing={1} >

                                <Grid item xs={12} sm={5} md={4} lg={3} >
                                    <TextField
                                        select
                                        label="Search By"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        value={SearchBy}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            setSearchBy(value);

                                            handleNew()
                                        }}
                                        sx={{
                                            backgroundColor: '#fff',
                                            fontSize: '1rem',
                                            height: 40,
                                            //  select text styling
                                            '& .MuiSelect-select': {
                                                padding: '8px',
                                                fontSize: '0.95rem',
                                            },

                                            '& .MuiInputBase-input': {
                                                borderLeft: '5px solid #3f5483',
                                                paddingLeft: '12px',
                                                backgroundColor: 'var(--input-bg-color)',
                                                padding: '8px',
                                                fontSize: '0.95rem',
                                            },
                                            //  focus background
                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                backgroundColor: 'var(--focus-bg-color)',
                                            },
                                        }}>
                                        <MenuItem value="RegName">Reg Name</MenuItem>
                                        <MenuItem value="DispName">Display Name</MenuItem>

                                    </TextField>
                                </Grid>

                                <Grid item xs={12} sm={7} md={8} lg={6}>

                                    <Autocomplete
                                        size="small"
                                        fullWidth
                                        options={filteredCustomers}
                                        value={selectedCustomer || null}
                                        inputValue={searchValue}
                                        onInputChange={(e, value, reason) => {
                                            setSearchValue(value);

                                        }}
                                        onChange={(e, value) => {
                                            if (!value) {
                                                handleNew();   // clear button case
                                                return;
                                            }

                                            //  selection case
                                            setSelectedCustomer(value);
                                            setSearchValue('');
                                            handleSelectCustomer(value);
                                        }}
                                        isOptionEqualToValue={(option, value) =>
                                            option?.AhMst_Key === value?.AhMst_Key
                                        }
                                        getOptionLabel={(option) =>
                                            SearchBy === "DispName"
                                                ? option.AhMst_DisplayName || ""
                                                : option.AhMst_pName || ""
                                        }
                                        renderOption={(props, option) => {
                                            const label = SearchBy === "DispName" ?
                                                option.AhMst_DisplayName || "" :
                                                option.AhMst_pName || "";
                                            return (<li {...props}>
                                                {highlightText(label, searchValue)} </li>
                                            );
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                sx={{
                                                    backgroundColor: '#fff',
                                                    '& .MuiOutlinedInput-root':
                                                    {
                                                        height: 39, paddingLeft: 0,
                                                        position: 'relative',
                                                        '& .MuiInputBase-input'
                                                            : {
                                                            fontSize: '0.95rem',
                                                            padding: '8px 8px 8px 12px',
                                                            position: 'relative',
                                                            zIndex: 1,
                                                        }, '&::before':
                                                        {
                                                            content: '""',
                                                            position: 'absolute',
                                                            left: 0,
                                                            top: 0,
                                                            bottom: 0,
                                                            width: '4px',
                                                            backgroundColor: '#3f5483',
                                                            borderTopLeftRadius: '4px',
                                                            borderBottomLeftRadius: '4px',
                                                            zIndex: 2,
                                                        },
                                                        '&.Mui-focused':
                                                        {
                                                            backgroundColor:
                                                                'var(--focus-bg-color) !important',
                                                        },
                                                        //     '&.Mui-focused fieldset':
                                                        //         { borderColor: '#DC3545', },
                                                    },
                                                }}
                                                label={SearchBy === "DispName" ? "Display Name" : "Reg Name"}
                                            />
                                        )}
                                    />
                                </Grid>



                                <Grid item xs={12} sm={3} lg={1} style={{ display: 'flex', justifyContent: 'center' }} sx={{
                                    marginTop: { lg: '0px' }
                                }}>

                                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>

                                        {/* {!hasData ? (
                                                    <Typography sx={{ color: "gray", fontWeight: 600 }}>

                                                    </Typography>
                                                ) : hasActive ? (
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            fontWeight: 700,
                                                            color: "green",
                                                            animation: "blink 1.5s linear infinite",
                                                            "@keyframes blink": {
                                                                "0%": { opacity: 1 },
                                                                "50%": { opacity: 0 },
                                                                "100%": { opacity: 1 }
                                                            }
                                                        }}
                                                    >
                                                        <img
                                                            src="https://cdn-icons-png.flaticon.com/128/14090/14090371.png"
                                                            alt="active"
                                                            style={{
                                                                width: 30,      // increase icon size
                                                                height: 30,
                                                                marginRight: 6
                                                            }}
                                                        />

                                                    </Box>
                                                ) : allBad ? (
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            fontWeight: 700,
                                                            color: "red",
                                                            animation: "blink 1s linear infinite",
                                                            "@keyframes blink": {
                                                                "0%": { opacity: 1 },
                                                                "50%": { opacity: 0 },
                                                                "100%": { opacity: 1 }
                                                            }
                                                        }}
                                                    >
                                                        <img
                                                            src="https://cdn-icons-png.flaticon.com/128/564/564619.png"
                                                            alt="warning"
                                                            style={{
                                                                width: 28,      // increase icon size
                                                                height: 28,
                                                                marginRight: 6
                                                            }}
                                                        />

                                                    </Box>
                                                ) : null} */}

                                        {!hasData ? (
                                            <Typography sx={{ color: "gray", fontWeight: 600 }}>

                                            </Typography>

                                        ) : hasActive ? (

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    fontWeight: 700,
                                                    color: "green",
                                                    animation: "blink 1.5s linear infinite",
                                                    "@keyframes blink": {
                                                        "0%": { opacity: 1 },
                                                        "50%": { opacity: 0 },
                                                        "100%": { opacity: 1 }
                                                    }
                                                }}
                                            >
                                                <img
                                                    src="https://cdn-icons-png.flaticon.com/128/14090/14090371.png"
                                                    alt="active"
                                                    style={{
                                                        width: 30,
                                                        height: 30,
                                                        marginRight: 6
                                                    }}
                                                />
                                            </Box>
                                        ) : hasWarning ? (



                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    fontWeight: 700,
                                                    color: "red",
                                                    animation: "blink 1s linear infinite",
                                                    "@keyframes blink": {
                                                        "0%": { opacity: 1 },
                                                        "50%": { opacity: 0.3 },
                                                        "100%": { opacity: 1 }
                                                    }
                                                }}
                                            >
                                                <img
                                                    src="https://cdn-icons-png.flaticon.com/128/564/564619.png"
                                                    alt="warning"
                                                    style={{
                                                        width: 28,
                                                        height: 28,
                                                        marginRight: 6
                                                    }}
                                                />
                                            </Box>

                                        ) : null}

                                    </Box>
                                </Grid>


                                <Grid
                                    item
                                    xs={12}
                                    sm={3}
                                    lg={1}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        mt: { lg: 0 }
                                    }}
                                >
                                    {warningProducts?.length > 0 && (
                                        <Tooltip
                                            arrow
                                            placement="bottom"
                                            componentsProps={{
                                                tooltip: {
                                                    sx: {
                                                        bgcolor: "#ffffff",
                                                        color: "#000",
                                                        border: "1px solid #ec6767",
                                                        borderRadius: "12px",
                                                        boxShadow: "0px 6px 20px rgba(220,53,69,0.15)",
                                                        p: 1,
                                                        maxWidth: 320,
                                                    }
                                                },
                                                arrow: {
                                                    sx: {
                                                        color: "#ffffff",

                                                        "&:before": {
                                                            border: "1px solid #ec6767",
                                                            boxSizing: "border-box"
                                                        }
                                                    }
                                                }
                                            }}
                                            title={
                                                <Box sx={{ width: 300 }}>
                                                    {/* Header */}
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 1,
                                                            mb: 1.5
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                width: 35,
                                                                height: 35,
                                                                borderRadius: "50%",
                                                                bgcolor: "#fff3cd",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                fontSize: "18px"
                                                            }}
                                                        >
                                                            ⚠️
                                                        </Box>

                                                        <Box>
                                                            <Typography
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    fontSize: "0.9rem",
                                                                    color: "#222"
                                                                }}
                                                            >
                                                                AMC Alert
                                                            </Typography>

                                                            <Typography
                                                                sx={{
                                                                    fontSize: "0.72rem",
                                                                    color: "#777"
                                                                }}
                                                            >
                                                                {alertProducts.length} Product(s)
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    {/* Product List */}
                                                    <Box
                                                        sx={{
                                                            maxHeight: 250,
                                                            overflowY: "auto",
                                                            pr: 0.5,

                                                            "&::-webkit-scrollbar": {
                                                                width: "6px",
                                                            },
                                                            "&::-webkit-scrollbar-thumb": {
                                                                backgroundColor: "#3f5483",
                                                                borderRadius: "10px",
                                                            },
                                                        }}
                                                    >
                                                        {alertProducts.map((item, index) => {
                                                            console.log("ITEM:", item);

                                                            return (
                                                                <Box
                                                                    key={index}
                                                                    sx={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "space-between",
                                                                        py: 0.8,
                                                                        px: 1,
                                                                        mb: 0.5,
                                                                        borderRadius: "10px",
                                                                        bgcolor: "#fafafa"
                                                                    }}
                                                                >
                                                                    <Box
                                                                        sx={{
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            gap: 0.5
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            sx={{
                                                                                fontSize: "0.78rem",
                                                                                fontWeight: 500,
                                                                                wordBreak: "break-word"
                                                                            }}
                                                                        >
                                                                            {item.name}
                                                                        </Typography>

                                                                        {(item.isActive) === true && (
                                                                            <CheckCircleIcon
                                                                                sx={{
                                                                                    color: "#2e7d32",
                                                                                    fontSize: 16
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Box>

                                                                    <Chip
                                                                        size="small"
                                                                        label={
                                                                            Number(item.Prd_AMCIsActive) === true
                                                                                ? "Active"
                                                                                : item.status === "NO_AMC"
                                                                                    ? "No AMC"
                                                                                    : "Expired"
                                                                        }
                                                                        sx={{
                                                                            height: 22,
                                                                            fontSize: "0.65rem",
                                                                            fontWeight: 700,
                                                                            bgcolor:
                                                                                Number(item.Prd_AMCIsActive) === true
                                                                                    ? "#e8f5e9"
                                                                                    : item.status === "NO_AMC"
                                                                                        ? "#ffe5e5"
                                                                                        : "#fff4d6",
                                                                            color:
                                                                                Number(item.Prd_AMCIsActive) === true
                                                                                    ? "#2e7d32"
                                                                                    : item.status === "NO_AMC"
                                                                                        ? "#DC3545"
                                                                                        : "#ff9800"
                                                                        }}
                                                                    />
                                                                </Box>
                                                            );
                                                        })}
                                                    </Box>
                                                </Box>
                                            }
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <InfoOutlinedIcon
                                                    sx={{
                                                        color: "#1976d2",
                                                        fontSize: 28
                                                    }}
                                                />
                                            </Box>
                                        </Tooltip>
                                    )}
                                </Grid>
                            </Grid>

                        </CardContent>
                    </Card>

                </Grid>

                {/* ----------Card 2---------- */}

                <Grid item lg={12}>

                    <Card sx={{
                        height: { xs: '1420px', sm: '405px', lg: "366px", xl: '364px' },
                       backgroundColor: 'transparent !important',
                        boxShadow: 'none',
                        border: '1px solid #d1d5db', // light gray border
                        borderRadius: 2,
                    }}>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <TextField label="Display Name" type="text" size="small" fullWidth
                                        value={displayName || ""}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        inputRef={custNameInputRef}
                                        sx={{
                                            backgroundColor: '#fff',
                                            fontSize: '1rem',
                                            height: 40,
                                            '& input': {
                                                padding: '8px', fontSize: '0.95rem',
                                                '&:focus': {
                                                    backgroundColor: 'var(--focus-bg-color)'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <TextField label="Reg Name" type="text" size="small" fullWidth
                                        value={regName || ''}
                                        onChange={(e) => setRegName(e.target.value)}
                                        inputRef={custRegNameInputRef}
                                        sx={{
                                            backgroundColor: '#fff',
                                            fontSize: '1rem',
                                            height: 40,
                                            '& input': {
                                                padding: '8px', fontSize: '0.95rem',
                                                '&:focus': {
                                                    backgroundColor: 'var(--focus-bg-color)'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={3} md={3} lg={3}>
                                    <TextField label="Owner Name" type="text" size="small" fullWidth
                                        value={ownerName || ''}
                                        onChange={(e) => setOwnerName(e.target.value)}

                                        sx={{
                                            backgroundColor: '#fff',
                                            fontSize: '1rem',
                                            height: 40,
                                            '& input': {
                                                padding: '8px', fontSize: '0.95rem',
                                                '&:focus': {
                                                    backgroundColor: 'var(--focus-bg-color)'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={3} md={3} lg={3}>
                                    <TextField label="Owner Contact" type="text" size="small" fullWidth
                                        value={ownerCntct || ''}
                                        onChange={(e) => setOwnerCntct(e.target.value)}
                                        sx={{
                                            backgroundColor: '#fff',
                                            fontSize: '1rem',
                                            height: 40,
                                            '& input': {
                                                padding: '8px', fontSize: '0.95rem',
                                                '&:focus': {
                                                    backgroundColor: 'var(--focus-bg-color)'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>



                                <Grid item xs={12} sm={3} md={3} lg={3}>
                                    <TextField label="Email" type="text" size="small" fullWidth
                                        value={email || ''}
                                        onChange={(e) => setEmail(e.target.value)}
                                        sx={{
                                            backgroundColor: '#fff',
                                            fontSize: '1rem',
                                            height: 40,
                                            '& input': {
                                                padding: '8px', fontSize: '0.95rem',
                                                '&:focus': {
                                                    backgroundColor: 'var(--focus-bg-color)'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>


                                <Grid item xs={12} sm={3} md={3} lg={3}>
                                    <TextField label="Customer Relation" type="text" size="small" fullWidth
                                        select
                                        value={custRelation || ''}
                                        onChange={(e) => setCustRelation(e.target.value)}
                                        sx={{
                                            backgroundColor: '#fff',
                                            fontSize: '1rem',
                                            height: 40,
                                            //  select text styling
                                            '& .MuiSelect-select': {
                                                padding: '8px',
                                                fontSize: '0.95rem',
                                            },

                                            //  focus background
                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                backgroundColor: 'var(--focus-bg-color)',
                                            },
                                        }}
                                    >
                                        <MenuItem value="Excellant">Excellant</MenuItem>
                                        <MenuItem value="Very Good">Very Good</MenuItem>
                                        <MenuItem value="Good">Good</MenuItem>
                                        <MenuItem value="Poor">Poor</MenuItem>
                                        <MenuItem value="Bad">Bad</MenuItem>
                                        <MenuItem value="Not Support">Not Support</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} sm={3} md={3} lg={3}>
                                    <Autocomplete
                                        size="small"
                                        fullWidth
                                        options={["Very High", "Medium", "Low", "No Support"]}
                                        value={supportType || null}
                                        onChange={(event, newValue) => {
                                            setSupportType(newValue || "");
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Support Type"
                                                sx={{
                                                    backgroundColor: '#fff',
                                                    fontSize: '1rem',
                                                    height: 40,

                                                    '& input': {
                                                        padding: '8px',
                                                        fontSize: '0.95rem',
                                                    },

                                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                                        backgroundColor: 'var(--focus-bg-color)',
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={3} md={3} lg={3}>
                                    <TextField label="Point of Contact" type="text" size="small" fullWidth
                                        value={pointOfCntct || ''}
                                        onChange={(e) => setPointOfCntct(e.target.value)}
                                        sx={{
                                            backgroundColor: '#fff',
                                            fontSize: '1rem',
                                            height: 40,
                                            '& input': {
                                                padding: '8px', fontSize: '0.95rem',
                                                '&:focus': {
                                                    backgroundColor: 'var(--focus-bg-color)'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={3} md={3} lg={3}>
                                    <TextField label="Point of Contact No" type="text" size="small" fullWidth
                                        value={pointOfCntctNo || ''}
                                        onChange={(e) => setPointOfCntctNo(e.target.value)}
                                        sx={{
                                            backgroundColor: '#fff',
                                            fontSize: '1rem',
                                            height: 40,
                                            '& input': {
                                                padding: '8px', fontSize: '0.95rem',
                                                '&:focus': {
                                                    backgroundColor: 'var(--focus-bg-color)'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>




                                <Grid item xs={12} sm={3} md={3} lg={3}>
                                    <TextField label="Customer Type" type="text" size="small" fullWidth
                                        select
                                        value={selectedCustType}
                                        onChange={(e) => setSelectedCustType(e.target.value)}
                                        sx={{
                                            backgroundColor: '#fff',
                                            fontSize: '1rem',
                                            height: 40,

                                            '& .MuiSelect-select': {
                                                padding: '8px',
                                                fontSize: '0.95rem',
                                            },

                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                backgroundColor: 'var(--focus-bg-color)',
                                            },
                                        }}
                                    >
                                        {allCustType
                                            ?.filter(item => item?.desc?.trim()) // remove empty names
                                            .map((item) => (
                                                <MenuItem key={item.mstr_key} value={item.mstr_key}>
                                                    {item.desc.trim()}
                                                </MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </Grid>


                                <Grid item xs={12} sm={3} md={3} lg={3} >

                                    <Grid container>
                                        <Grid item xs={12} sm={12} lg={12} >
                                            <TextField label="Address" type="text" size="small" fullWidth
                                                multiline
                                                rows={4}
                                                value={address || ''}
                                                onChange={(e) => setAddress(e.target.value)}
                                                sx={{
                                                    backgroundColor: '#fff',
                                                    '& .MuiInputBase-root': {
                                                        height: '136px',
                                                    },

                                                    '& textarea': {
                                                        height: '100% !important',
                                                        overflow: 'auto',
                                                    },

                                                    //  Background on focus (for multiline textarea)
                                                    '& .MuiOutlinedInput-root.Mui-focused textarea': {
                                                        backgroundColor: 'var(--focus-bg-color)',
                                                    },


                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>


                                <Grid item xs={12} sm={3} md={3} lg={3} sx={{
                                    // marginTop: { xs: '105px', sm: '0px' }
                                }}>

                                    <Grid container spacing={1}>
                                        <Grid item xs={12} sm={12} lg={12}>


                                            <TextField
                                                label="Country"
                                                select
                                                size="small"
                                                fullWidth
                                                value={selectedCountry || ''}
                                                onChange={(e) => {
                                                    setSelectedCountry(e.target.value);
                                                    setSelectedState('');
                                                    setSelectedDistrict('');
                                                }}
                                                sx={{
                                                    backgroundColor: '#fff',
                                                    fontSize: '1rem',
                                                    height: 40,

                                                    '& .MuiSelect-select': {
                                                        padding: '8px',
                                                        fontSize: '0.95rem',
                                                    },

                                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                                        backgroundColor: 'var(--focus-bg-color)',
                                                    },
                                                }}
                                            >
                                                <MenuItem value="">Select Country</MenuItem>
                                                {countries.map((c) => (
                                                    <MenuItem key={c.name} value={c.name}>
                                                        {c.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>

                                        </Grid>

                                        <Grid item xs={12} sm={12} lg={12}>
                                            <TextField
                                                label="State"
                                                select
                                                size="small"
                                                fullWidth
                                                value={selectedState || ''}
                                                onChange={(e) => {
                                                    setSelectedState(e.target.value);
                                                    setSelectedDistrict('');
                                                }}
                                                disabled={!selectedCountry}
                                                sx={{
                                                    backgroundColor: '#fff',
                                                    fontSize: '1rem',
                                                    height: 40,

                                                    '& .MuiSelect-select': {
                                                        padding: '8px',
                                                        fontSize: '0.95rem',
                                                    },

                                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                                        backgroundColor: 'var(--focus-bg-color)',
                                                    },
                                                }}
                                            >
                                                <MenuItem value="">Select State</MenuItem>

                                                {states.map((s) => (
                                                    <MenuItem key={s.name} value={s.name}>
                                                        {s.name}
                                                    </MenuItem>
                                                ))}

                                                {/*  fallback if API state not in list */}
                                                {selectedState &&
                                                    !states.some(s => s.name === selectedState) && (
                                                        <MenuItem value={selectedState}>
                                                            {selectedState}
                                                        </MenuItem>
                                                    )}
                                            </TextField>

                                        </Grid>

                                        <Grid item xs={12} sm={12} lg={12}>
                                            <TextField
                                                label="District"
                                                select
                                                size="small"
                                                fullWidth
                                                value={selectedDistrict || ''}
                                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                                disabled={!selectedState}
                                                sx={{
                                                    backgroundColor: '#fff',
                                                    fontSize: '1rem',
                                                    height: 40,

                                                    '& .MuiSelect-select': {
                                                        padding: '8px',
                                                        fontSize: '0.95rem',
                                                    },

                                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                                        backgroundColor: 'var(--focus-bg-color)',
                                                    },
                                                }}
                                            >
                                                <MenuItem value="">Select District</MenuItem>

                                                {districts.map((d) => (
                                                    <MenuItem key={d} value={d}>
                                                        {d}
                                                    </MenuItem>
                                                ))}

                                                {/*  fallback for API value not in list */}
                                                {selectedDistrict &&
                                                    !districts.includes(selectedDistrict) && (
                                                        <MenuItem value={selectedDistrict}>
                                                            {selectedDistrict}
                                                        </MenuItem>
                                                    )}
                                            </TextField>

                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12} sm={3} md={3} lg={3}>

                                    <Grid container>
                                        <Grid item xs={12} sm={12} lg={12} >
                                            <TextField label="Remarks" type="text" size="small" fullWidth
                                                multiline
                                                rows={5}
                                                value={remarks || ''}
                                                onChange={(e) => setRemarks(e.target.value)}
                                                sx={{
                                                    backgroundColor: '#fff',
                                                    '& .MuiInputBase-root': {
                                                        height: '136px',
                                                    },

                                                    '& textarea': {
                                                        height: '100% !important',
                                                        overflow: 'auto',
                                                    },

                                                    //  Background on focus (for multiline textarea)
                                                    '& .MuiOutlinedInput-root.Mui-focused textarea': {
                                                        backgroundColor: 'var(--focus-bg-color)',
                                                    },


                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12} sm={3} md={3} lg={3} sx={{
                                    // marginTop: { xs: '105px', sm: '0px' }
                                }}>

                                    <Grid container spacing={1}>
                                        <Grid item xs={12} sm={12} lg={12}>
                                            <TextField label="Remarks By" type="text" size="small" fullWidth
                                                select
                                                value={selectedStaff}
                                                onChange={(e) => setSelectedStaff(e.target.value)}
                                                sx={{
                                                    backgroundColor: '#fff',
                                                    fontSize: '1rem',
                                                    height: 40,
                                                    '& .MuiSelect-select': {
                                                        padding: '8px',
                                                        fontSize: '0.95rem',
                                                    },

                                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                                        backgroundColor: 'var(--focus-bg-color)',
                                                    },
                                                }}>
                                                {allStaff
                                                    ?.filter(item => item?.ahmst_pname?.trim()) // remove empty names
                                                    .map((item) => (
                                                        <MenuItem key={item.ahmst_key} value={item.ahmst_key}>
                                                            {item.ahmst_pname.trim()}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </Grid>

                                        <Grid item xs={12} sm={12} lg={12}>
                                            <DatePicker
                                                selected={remarksDateTime}
                                                onChange={(date) => setRemarksDateTime(date)}
                                                showTimeSelect
                                                timeIntervals={15}
                                                dateFormat="dd-MMM-yyyy hh:mm aa"
                                                popperPlacement="top-start"
                                                portalId="root-portal"
                                                customInput={
                                                    <TextField
                                                        label="Remarks Date Time"
                                                        size="small"
                                                        fullWidth
                                                        // inputRef={inputRef}
                                                        InputLabelProps={{ shrink: true }}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton onClick={() => inputRef.current?.focus()}>
                                                                        <CalendarTodayIcon />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        sx={{
                                                            backgroundColor: '#fff',
                                                            fontSize: '1rem',
                                                            height: 40,

                                                            '& .MuiInputBase-input': {
                                                                padding: '8px',
                                                                fontSize: '0.95rem',
                                                            },

                                                            //  focus background
                                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                                backgroundColor: 'var(--focus-bg-color)',
                                                            },
                                                        }}
                                                    />
                                                }
                                            />
                                        </Grid>


                                        <Grid item xs={12} sm={12} lg={12}>
                                            <DatePicker
                                                selected={installDate instanceof Date ? installDate : null}
                                                onChange={(date) => setInstallDate(date)}

                                                dateFormat="dd-MMM-yyyy"
                                                popperPlacement="top-start"
                                                portalId="root-portal"
                                                customInput={
                                                    <TextField
                                                        label="Installled On"
                                                        size="small"
                                                        fullWidth
                                                        // inputRef={inputRef}
                                                        InputLabelProps={{ shrink: true }}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton onClick={() => inputRef.current?.focus()}>
                                                                        <CalendarTodayIcon />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        sx={{
                                                            backgroundColor: '#fff',
                                                            fontSize: '1rem',
                                                            height: 40,

                                                            '& .MuiInputBase-input': {
                                                                padding: '8px',
                                                                fontSize: '0.95rem',
                                                            },

                                                            //  focus background
                                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                                backgroundColor: 'var(--focus-bg-color)',
                                                            },
                                                        }}
                                                    />
                                                }
                                            />
                                        </Grid>

                                    </Grid>
                                </Grid>

                                <Grid item xs={12} sm={4} lg={1.5}>

                                    <TextField
                                        label="No.of Computers"
                                        size="small"
                                        fullWidth
                                        value={noOfComputers || ''}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                                setNoOfComputers(value);
                                            }
                                        }}
                                        sx={{
                                            backgroundColor: '#fff',
                                            fontSize: '1rem',
                                            height: 40,

                                            '& .MuiSelect-select': {
                                                padding: '8px',
                                                fontSize: '0.95rem',
                                            },

                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                backgroundColor: 'var(--focus-bg-color)',
                                            },
                                        }}
                                    >

                                    </TextField>
                                </Grid>

                                <Grid item xs={12} sm={4} lg={1.5}>

                                    <TextField
                                        label="Server Name"
                                        size="small"
                                        fullWidth
                                        value={serverName || ''}
                                        onChange={(e) => {
                                            setServerName(e.target.value);

                                        }}
                                        sx={{
                                            backgroundColor: '#fff',
                                            fontSize: '1rem',
                                            height: 40,

                                            '& .MuiSelect-select': {
                                                padding: '8px',
                                                fontSize: '0.95rem',
                                            },

                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                backgroundColor: 'var(--focus-bg-color)',
                                            },
                                        }}
                                    >

                                    </TextField>
                                </Grid>


                                <Grid item xs={12} sm={4} lg={3}>

                                    <TextField
                                        label="Installation Type"
                                        size="small"
                                        fullWidth
                                        value={installationType || ''}
                                        onChange={(e) => {
                                            setInstallationType(e.target.value);
                                        }}
                                        sx={{
                                            backgroundColor: '#fff',
                                            fontSize: '1rem',
                                            height: 40,

                                            '& .MuiSelect-select': {
                                                padding: '8px',
                                                fontSize: '0.95rem',
                                            },

                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                backgroundColor: 'var(--focus-bg-color)',
                                            },
                                        }}
                                    >

                                    </TextField>
                                </Grid>

                                <Grid item xs={12} sm={4} lg={3}>

                                    <TextField
                                        label="Installed By"
                                        size="small"

                                        fullWidth
                                        value={selectedInstalledBY}
                                        onChange={(e) => setSelectedInstallBy(e.target.value)}
                                        sx={{
                                            backgroundColor: '#fff',
                                            fontSize: '1rem',
                                            height: 40,

                                            '& .MuiSelect-select': {
                                                padding: '8px',
                                                fontSize: '0.95rem',
                                            },

                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                backgroundColor: 'var(--focus-bg-color)',
                                            },
                                        }}
                                    >


                                    </TextField>
                                </Grid>



                                <Grid item xs={12} sm={4.5} md={6} lg={3}>

                                    <Grid container spacing={1}>
                                        <Grid item xs={12} sm={3.3} md={3.3} lg={3.3}>

                                            <FormControlLabel
                                                control={<Checkbox size="small"
                                                    checked={isActive === true}
                                                    onChange={(e) => setIsActive(e.target.checked)}
                                                    sx={{
                                                        color: 'grey',
                                                        '&.Mui-checked': {
                                                            color: '#3f5483!important',
                                                        },
                                                    }} />}
                                                label="IsActive" />

                                        </Grid>

                                        <Grid item xs={12} sm={3.3} md={3.3} lg={3.3}>

                                            <FormControlLabel
                                                control={<Checkbox size="small"
                                                    checked={verified === true}
                                                    onChange={(e) => setVerified(e.target.checked)}
                                                    sx={{
                                                        color: 'grey',
                                                        '&.Mui-checked': {
                                                            color: '#3f5483!important',
                                                        },
                                                    }} />}
                                                label="Verified"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={3.3} md={3} lg={3.3}>

                                            <FormControlLabel
                                                control={<Checkbox size="small"
                                                    checked={isHeadOffice === true}
                                                    onChange={(e) => setIsHeadOffice(e.target.checked)}
                                                    sx={{
                                                        color: 'grey',
                                                        '&.Mui-checked': {
                                                            color: '#3f5483!important',
                                                        },
                                                    }} />}
                                                label="IsHeadOffice"
                                            />

                                        </Grid>

                                    </Grid>

                                </Grid>



                            </Grid>
                        </CardContent>
                    </Card>

                </Grid>

                {/* ----------Card 3---------- */}

                <Grid item xs={12} sm={12} lg={12}>

                    <Card sx={{
                       backgroundColor: 'transparent !important',
                        boxShadow: 'none',
                        border: '1px solid #d1d5db', // light gray border
                        borderRadius: 2,
                    }}>
                        <CardContent>
                            <Grid container spacing={1}>


                                <Grid item xs={12} sx={{ marginBottom: "10px" }}>

                                    <TableContainer
                                        component={Paper}
                                        sx={{
                                            height: {
                                                xs: 'calc(100vh - 400px)',
                                                sm: 'calc(100vh - 480px)',
                                                md: 'calc(100vh - 480px)',
                                                lg: 'calc(100vh - 470px)',
                                                xl: 'calc(100vh - 490px)'
                                            },
                                            marginTop: 1,
                                            width: '100%',
                                            overflowX: 'auto',
                                            overflowY: 'auto', // shows scrollbar only if needed
                                            '&::-webkit-scrollbar': {
                                                width: '6px',          // thin scrollbar width
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                backgroundColor: '#888', // thumb color
                                                borderRadius: '3px',
                                            },
                                            '&::-webkit-scrollbar-track': {
                                                backgroundColor: '#f0f0f0', // track color
                                            },
                                            scrollbarWidth: 'thin',       // Firefox: thin scrollbar
                                            scrollbarColor: '#888 #f0f0f0', // Firefox: thumb and track colors
                                        }}

                                    >
                                        <Table striped sx={{ minWidth: 500, tableLayout: 'fixed' }}>
                                            {/* Table Head */}
                                            <TableHead sx={{ position: 'sticky', zIndex: 1, top: 0, backgroundColor: 'var(--header-bg-color)' }}>

                                                <TableRow sx={{ height: '32px' }}>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%', fontWeight: 'bold' }}>SlNo</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '13%', fontWeight: 'bold' }}>Product</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '12%', fontWeight: 'bold' }}>Description</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '7%', fontWeight: 'bold' }}>AMCFrom</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '7%', fontWeight: 'bold' }}>AMCTo</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>IsActive</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>Nc AMC</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}></TableCell>

                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {combinedData && combinedData.length > 0 ? (
                                                    combinedData.map((row, index) => {

                                                        const isProduct = row.rowType === "PRODUCT";
                                                        const isAnalyzer = row.rowType === "ANALYZER";

                                                        return (

                                                            <TableRow key={row.id || index}
                                                                onDoubleClick={() => {
                                                                    setPendingRow(row);
                                                                    setPendingIndex(index);
                                                                    setConfirmOpen(true);
                                                                }}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell
                                                                    sx={{
                                                                        whiteSpace: 'nowrap',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                    }}
                                                                >
                                                                    <Tooltip arrow placement="bottom">
                                                                        <span
                                                                            style={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'space-between',
                                                                                width: '100%',
                                                                                gap: '10px',
                                                                            }}
                                                                        >
                                                                            {/* PRODUCT NAME */}
                                                                            <Box
                                                                                sx={{
                                                                                    flex: 1,
                                                                                    overflow: 'hidden',
                                                                                    textOverflow: 'ellipsis',
                                                                                    whiteSpace: 'nowrap',
                                                                                }}
                                                                            >
                                                                                {isProduct ? row.Productname : "INTERFACE"}
                                                                            </Box>

                                                                            {/* AMC STATUS */}
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 'fit-content' }}>
                                                                                {(() => {

                                                                                    const today = new Date();

                                                                                    const fromDate = isProduct
                                                                                        ? row.PrdAMCFrom
                                                                                        : row.anlAMCFrom;

                                                                                    const toDate = isProduct
                                                                                        ? row.PrdAMCTo
                                                                                        : row.anlAMCTo;

                                                                                    const amcFrom = fromDate
                                                                                        ? new Date(fromDate)
                                                                                        : null;

                                                                                    const amcTo = toDate
                                                                                        ? new Date(toDate)
                                                                                        : null;
                                                                                    const isAMCActive =
                                                                                        amcFrom &&
                                                                                        amcTo &&
                                                                                        today >= amcFrom &&
                                                                                        today <= amcTo;

                                                                                    const isAMCExpired =
                                                                                        amcTo && today > amcTo;

                                                                                    const isAMCNotAvailable =
                                                                                        !amcFrom && !amcTo;

                                                                                    return (
                                                                                        <>
                                                                                            {/* ACTIVE AMC */}
                                                                                            {isAMCActive && (row.Productname || row.AnlzName) && (
                                                                                                <Tooltip
                                                                                                    arrow
                                                                                                    placement="top"
                                                                                                    title={`AMC Active Till ${amcTo.toLocaleDateString(
                                                                                                        'en-GB',
                                                                                                        {
                                                                                                            day: '2-digit',
                                                                                                            month: 'short',
                                                                                                            year: 'numeric',
                                                                                                        }
                                                                                                    )}`}
                                                                                                >
                                                                                                    <Typography
                                                                                                        variant="caption"
                                                                                                        sx={{
                                                                                                            fontWeight: 700,
                                                                                                            color: 'green',
                                                                                                            fontSize: '0.82rem',
                                                                                                        }}
                                                                                                    >
                                                                                                        AMC ACTIVE
                                                                                                    </Typography>
                                                                                                </Tooltip>
                                                                                            )}

                                                                                            {/* EXPIRED AMC */}
                                                                                            {isAMCExpired && (row.Productname || row.AnlzName) && (
                                                                                                <Tooltip
                                                                                                    arrow
                                                                                                    placement="top"
                                                                                                    title={`AMC Expired On ${amcTo.toLocaleDateString(
                                                                                                        'en-GB',
                                                                                                        {
                                                                                                            day: '2-digit',
                                                                                                            month: 'short',
                                                                                                            year: 'numeric',
                                                                                                        }
                                                                                                    )}`}
                                                                                                >
                                                                                                    <Typography
                                                                                                        variant="caption"
                                                                                                        sx={{
                                                                                                            fontWeight: 700,
                                                                                                            color: 'red',
                                                                                                            fontSize: '0.82rem',
                                                                                                        }}
                                                                                                    >
                                                                                                        AMC EXPIRED
                                                                                                    </Typography>
                                                                                                </Tooltip>
                                                                                            )}

                                                                                            {/* NO AMC */}
                                                                                            {isAMCNotAvailable && (row.Productname || row.AnlzName) && (
                                                                                                <Tooltip
                                                                                                    arrow
                                                                                                    placement="top"
                                                                                                    title="No AMC Available"
                                                                                                >
                                                                                                    <Typography
                                                                                                        variant="caption"
                                                                                                        sx={{
                                                                                                            fontWeight: 700,
                                                                                                            color: 'red',
                                                                                                            fontSize: '0.82rem',
                                                                                                        }}
                                                                                                    >
                                                                                                        NO AMC
                                                                                                    </Typography>
                                                                                                </Tooltip>
                                                                                            )}
                                                                                        </>
                                                                                    );
                                                                                })()}
                                                                            </Box>
                                                                        </span>
                                                                    </Tooltip>
                                                                </TableCell>
                                                                <TableCell>   {
                                                                    isProduct
                                                                        ? row.ProductNarration
                                                                        : `${row.AnlzName} -  ${row.AnlzQty || 0}`
                                                                }</TableCell>
                                                                <TableCell>
                                                                    {row.PrdAMCFrom
                                                                        ? format(new Date(row.PrdAMCFrom), 'dd-MMM-yyyy')
                                                                        : row.anlAMCFrom
                                                                            ? format(new Date(row.anlAMCFrom), 'dd-MMM-yyyy')
                                                                            : ''}</TableCell>
                                                                <TableCell>
                                                                    {row.PrdAMCTo
                                                                        ? format(new Date(row.PrdAMCTo), 'dd-MMM-yyyy')
                                                                        : row.anlAMCTo
                                                                            ? format(new Date(row.anlAMCTo), 'dd-MMM-yyyy')
                                                                            : ''}</TableCell>

                                                                <TableCell>
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                checked={
                                                                                    row.Prd_AMCIsActive === true ||
                                                                                    row.Prd_AMCIsActive === 1 ||
                                                                                    (() => {

                                                                                        const today = new Date();

                                                                                        const fromDate = isProduct
                                                                                            ? row.PrdAMCFrom
                                                                                            : row.anlAMCFrom;

                                                                                        const toDate = isProduct
                                                                                            ? row.PrdAMCTo
                                                                                            : row.anlAMCTo;

                                                                                        const amcFrom = fromDate ? new Date(fromDate) : null;
                                                                                        const amcTo = toDate ? new Date(toDate) : null;

                                                                                        return (
                                                                                            amcFrom &&
                                                                                            amcTo &&
                                                                                            today >= amcFrom &&
                                                                                            today <= amcTo
                                                                                        );
                                                                                    })()
                                                                                }
                                                                                onChange={(e) => {
                                                                                    const updated = [...productData];

                                                                                    updated[index].Prd_AMCIsActive = e.target.checked ? 1 : 0;

                                                                                    setPrdoductData(updated);
                                                                                }}
                                                                                sx={{
                                                                                    padding: 0,
                                                                                    ml: 2,
                                                                                    color: 'grey',
                                                                                    '& .MuiSvgIcon-root': {
                                                                                        fontSize: 19,
                                                                                    },
                                                                                    '&.Mui-checked': {
                                                                                        color: '#3f5483 !important',
                                                                                    },
                                                                                }}
                                                                            />
                                                                        }

                                                                    />
                                                                </TableCell>
                                                                <TableCell >

                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                checked={row.PrdNoAMC === true}
                                                                                onChange={(e) => {
                                                                                    const updated = [...productData];

                                                                                    updated[index].PrdNoAMC = e.target.checked ? 1 : 0;

                                                                                    setPrdoductData(updated);
                                                                                }}
                                                                                sx={{
                                                                                    ml: 2,
                                                                                    padding: 0,
                                                                                    color: 'grey',
                                                                                    '& .MuiSvgIcon-root': {
                                                                                        fontSize: 19,
                                                                                    },
                                                                                    '&.Mui-checked': {
                                                                                        color: '#3f5483 !important',
                                                                                    },
                                                                                }}
                                                                            />
                                                                        }

                                                                    />
                                                                </TableCell>
                                                                <TableCell>

                                                                    <DeleteIcon fontSize="small"
                                                                        style={{ cursor: 'pointer', color: 'black', marginLeft: -2 }}

                                                                        onClick={() => {
                                                                            setDeleteIndex(index);
                                                                            setDeleteOpen(true);
                                                                        }} />
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={8} align="center">
                                                            No Data Available
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>

                                    </TableContainer>
                                </Grid>


                            </Grid>
                        </CardContent>
                    </Card>

                </Grid>

                {/* ----------Card 4---------- */}

                <Grid item sm={12} lg={12} >
                    <Card sx={{
                       backgroundColor: 'transparent !important',
                        boxShadow: 'none',
                        border: '1px solid #d1d5db', // light gray border
                        borderRadius: 2,
                    }}>
                        <CardContent>

                            <Typography
                                variant="h2"
                                component="div"
                                display={'flex'}
                                alignItems={'center'}
                                textAlign={'center'}
                                color={'#3f5483'}

                                sx={{
                                    fontSize: '1rem',
                                    fontWeight: 'bold'
                                }}



                            >
                                Description Details

                            </Typography>


                            <Grid container spacing={1}>
                                <Grid item xs={12} lg={12} xl={12} sx={{ marginBottom: "10px" }}>

                                    <TableContainer
                                        component={Paper}
                                        sx={{
                                            height: {
                                                xs: 'calc(100vh - 400px)',
                                                sm: 'calc(100vh - 480px)',
                                                md: 'calc(100vh - 480px)',
                                                lg: 'calc(100vh - 470px)',
                                                xl: 'calc(100vh - 490px)'
                                            },
                                            marginTop: 1,
                                            width: '100%',
                                            overflowX: 'auto',
                                            overflowY: 'auto', // shows scrollbar only if needed
                                            '&::-webkit-scrollbar': {
                                                width: '6px',          // thin scrollbar width
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                backgroundColor: '#888', // thumb color
                                                borderRadius: '3px',
                                            },
                                            '&::-webkit-scrollbar-track': {
                                                backgroundColor: '#f0f0f0', // track color
                                            },
                                            scrollbarWidth: 'thin',       // Firefox: thin scrollbar
                                            scrollbarColor: '#888 #f0f0f0', // Firefox: thumb and track colors
                                        }}>
                                        <Table striped sx={{ minWidth: 400, tableLayout: 'fixed' }}>
                                            {/* Table Head */}
                                            <TableHead sx={{ position: 'sticky', zIndex: 1, top: 0, backgroundColor: 'var(--header-bg-color)' }}>

                                                <TableRow sx={{ height: '32px' }}>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', fontWeight: 'bold' }}>SlNo</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '20%', fontWeight: 'bold' }}>Description</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '5%', fontWeight: 'bold' }}>Yes/No</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '15%', fontWeight: 'bold' }}>Narration</TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {descriptionDlts.length > 0 ? (
                                                    descriptionDlts.map((row, index) => (
                                                        <TableRow key={row.Chk_Id || index}>

                                                            <TableCell>
                                                                {index + 1}
                                                            </TableCell>

                                                            <TableCell>
                                                                {row.Chklst_Desc}
                                                            </TableCell>

                                                            {/* CHECKBOX */}
                                                            <TableCell>
                                                                <Checkbox
                                                                    checked={row.ChkSelectS === 1}
                                                                    onChange={(e) => {

                                                                        const updatedData = [...descriptionDlts]

                                                                        updatedData[index].ChkSelectS =
                                                                            e.target.checked ? 1 : 0

                                                                        setDescriptionDlts(updatedData)
                                                                    }}
                                                                    sx={{
                                                                        padding: 0,
                                                                        color: 'grey',

                                                                        '& .MuiSvgIcon-root': {
                                                                            fontSize: 19,
                                                                        },

                                                                        '&.Mui-checked': {
                                                                            color: '#3f5483 !important',
                                                                        },
                                                                    }}
                                                                />
                                                            </TableCell>

                                                            {/* NARRATION */}
                                                            <TableCell>{row.Narration}
                                                                {/* <TextField
                                                                    size="small"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    // value={row.Narration || ""}
                                                                    // onChange={(e) => {
                                                                    //     const updatedData = [...descriptionDlts]
                                                                    //     updatedData[index].Narration =
                                                                    //         e.target.value
                                                                    //     setDescriptionDlts(updatedData)
                                                                    // }}

                                                                    // sx={{
                                                                    //     width: 450,

                                                                    //     "& .MuiOutlinedInput-root": {
                                                                    //         minHeight: "28px",
                                                                    //         padding: 0,
                                                                    //         border: "none",

                                                                    //         // Fixed background color
                                                                    //         backgroundColor: "#8a9dc7",
                                                                    //         fontSize: "0.90rem",

                                                                    //         "& input": {
                                                                    //             padding: "2px 4px",
                                                                    //             height: "20px",
                                                                    //             backgroundColor: "transparent",
                                                                    //         },

                                                                    //         "&.Mui-focused": {
                                                                    //             backgroundColor:  "#8a9dc7",
                                                                    //         },

                                                                    //         "&:hover": {
                                                                    //             backgroundColor:  "#8a9dc7",
                                                                    //         },
                                                                    //     },

                                                                    //     "& fieldset": {
                                                                    //         border: "none",
                                                                    //     },
                                                                    // }}
                                                                /> */}
                                                            </TableCell>

                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={4}>
                                                            No Data Available
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>


                                        </Table>

                                    </TableContainer>
                                </Grid>




                            </Grid>

                        </CardContent>
                    </Card>

                </Grid>



                {/* ----------Card 5---------- */}

                <Grid item sm={12} lg={12}>
                    <Card sx={{
                       backgroundColor: 'transparent !important',
                        boxShadow: 'none',
                        border: '1px solid #d1d5db', // light gray border
                        borderRadius: 2,
                    }}>
                        <CardContent>

                            <Typography
                                variant="h2"
                                component="div"
                                display={'flex'}
                                alignItems={'center'}
                                textAlign={'center'}
                                color={'#3f5483'}

                                sx={{
                                    fontSize: '1rem',
                                    fontWeight: 'bold'
                                }}



                            >
                                Multiple Contact Details

                            </Typography>


                            <Grid container spacing={1}>
                                <Grid item xs={12} lg={9} xl={8.5} sx={{ marginBottom: "10px" }}>

                                    <TableContainer
                                        component={Paper}
                                        sx={{
                                            height: {
                                                xs: 'calc(100vh - 400px)',
                                                sm: 'calc(100vh - 480px)',
                                                md: 'calc(100vh - 480px)',
                                                lg: 'calc(100vh - 470px)',
                                                xl: 'calc(100vh - 490px)'
                                            },
                                            marginTop: 1,
                                            width: '100%',
                                            overflowX: 'auto',
                                            overflowY: 'auto', // shows scrollbar only if needed
                                            '&::-webkit-scrollbar': {
                                                width: '6px',          // thin scrollbar width
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                backgroundColor: '#888', // thumb color
                                                borderRadius: '3px',
                                            },
                                            '&::-webkit-scrollbar-track': {
                                                backgroundColor: '#f0f0f0', // track color
                                            },
                                            scrollbarWidth: 'thin',       // Firefox: thin scrollbar
                                            scrollbarColor: '#888 #f0f0f0', // Firefox: thumb and track colors
                                        }}

                                    >
                                        <Table striped sx={{ minWidth: 400, tableLayout: 'fixed' }}>
                                            {/* Table Head */}
                                            <TableHead sx={{ position: 'sticky', zIndex: 1, top: 0, backgroundColor: 'var(--header-bg-color)' }}>

                                                <TableRow sx={{ height: '32px' }}>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '10%', }}>Person</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '10%', }}>Designation</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '10%', }}>Mobile</TableCell>
                                                    <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '4%', }}>Active</TableCell>
                                                    {/* <TableCell sx={{ fontSize: '0.85rem', padding: '4px 8px', width: '3%',  }}> <AddIcon onClick={handleAddContactRow} /></TableCell> */}


                                                </TableRow>
                                            </TableHead>
                                            <TableBody>


                                                {/*  DATA ROWS */}
                                                {multipleCntactData && multipleCntactData.length > 0 ? (
                                                    multipleCntactData.map((row, index) => (
                                                        <TableRow key={row.id || index}>

                                                            {/* NAME */}
                                                            <TableCell>
                                                                <TextField
                                                                    value={row.MC_Name || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...multipleCntactData];
                                                                        updated[index].MC_Name = e.target.value;
                                                                        setMultipleCntactData(updated);
                                                                    }}
                                                                    sx={{
                                                                        width: 250,

                                                                        "& .MuiOutlinedInput-root": {
                                                                            minHeight: "28px",
                                                                            padding: 0,
                                                                            border: "none",

                                                                            //  ONLY for new rows
                                                                            backgroundColor: row.isNew ? "#f3b9c0" : "transparent",

                                                                            fontSize: "0.90rem",

                                                                            "& input": {
                                                                                padding: "2px 4px",
                                                                                height: "20px",
                                                                                //     textAlign: "center",
                                                                            },

                                                                            "&.Mui-focused": {
                                                                                backgroundColor: "#f3b9c0",
                                                                            },
                                                                        },

                                                                        "& fieldset": {
                                                                            border: "none",
                                                                        },
                                                                    }}
                                                                    size="small"
                                                                    fullWidth
                                                                />
                                                            </TableCell>

                                                            {/* DESIGNATION */}
                                                            <TableCell>
                                                                <TextField
                                                                    value={row.MC_Desg || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...multipleCntactData];
                                                                        updated[index].MC_Desg = e.target.value;
                                                                        setMultipleCntactData(updated);
                                                                    }}
                                                                    sx={{
                                                                        width: 250,

                                                                        "& .MuiOutlinedInput-root": {
                                                                            minHeight: "28px",
                                                                            padding: 0,
                                                                            border: "none",

                                                                            //  ONLY for new rows
                                                                            backgroundColor: row.isNew ? "#f3b9c0" : "transparent",

                                                                            fontSize: "0.90rem",

                                                                            "& input": {
                                                                                padding: "2px 4px",
                                                                                height: "20px",
                                                                                //     textAlign: "center",
                                                                            },

                                                                            "&.Mui-focused": {
                                                                                backgroundColor: "#f3b9c0"

                                                                            },
                                                                        },

                                                                        "& fieldset": {
                                                                            border: "none",
                                                                        },
                                                                    }}
                                                                    size="small"
                                                                    fullWidth
                                                                />
                                                            </TableCell>

                                                            {/* MOBILE */}
                                                            <TableCell>
                                                                <TextField
                                                                    value={row.MC_Mobile || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...multipleCntactData];
                                                                        updated[index].MC_Mobile = e.target.value;
                                                                        setMultipleCntactData(updated);
                                                                    }}
                                                                    sx={{
                                                                        width: 250,

                                                                        "& .MuiOutlinedInput-root": {
                                                                            minHeight: "28px",
                                                                            padding: 0,
                                                                            border: "none",

                                                                            //  ONLY for new rows
                                                                            backgroundColor: row.isNew ? "#f3b9c0" : "transparent",

                                                                            fontSize: "0.90rem",

                                                                            "& input": {
                                                                                padding: "2px 4px",
                                                                                height: "20px",
                                                                                //  textAlign: "center",
                                                                            },

                                                                            "&.Mui-focused": {
                                                                                backgroundColor: "#f3b9c0",
                                                                            },
                                                                        },

                                                                        "& fieldset": {
                                                                            border: "none",
                                                                        },
                                                                    }}
                                                                    size="small"
                                                                    fullWidth
                                                                />
                                                            </TableCell>

                                                            {/* ACTIVE */}
                                                            <TableCell>
                                                                <Checkbox
                                                                    checked={row.MC_IsActive === 1 || row.MC_IsActive === true}
                                                                    onChange={(e) => {
                                                                        const updated = [...multipleCntactData];
                                                                        updated[index].MC_IsActive = e.target.checked ? 1 : 0;
                                                                        setMultipleCntactData(updated);
                                                                    }}
                                                                    sx={{
                                                                        padding: 0,
                                                                        color: 'grey',
                                                                        '& .MuiSvgIcon-root': { fontSize: 19 },
                                                                        '&.Mui-checked': { color: '#3f5483 !important' },
                                                                    }}
                                                                />
                                                            </TableCell>

                                                            {/* DELETE */}
                                                            <TableCell>
                                                                <DeleteIcon
                                                                    style={{ cursor: 'pointer', color: 'black', marginLeft: -2 }}
                                                                    onClick={() => {
                                                                        setPendingDeleteRow(row);
                                                                        setPendingDeleteIndex(index);
                                                                        setConfirmDeleteOpen(true);
                                                                    }}
                                                                />
                                                            </TableCell>

                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={4} align="center">
                                                            No Contacts Available
                                                        </TableCell>
                                                    </TableRow>
                                                )}

                                            </TableBody>

                                        </Table>

                                    </TableContainer>
                                </Grid>

                                <Grid item xs={12} md={12} lg={3} xl={3.5} className='mt-2'>

                                    <Grid container spacing={1}>
                                        <Grid item xs={12} sm={4} lg={12}>
                                            <TextField label="Sponsored By" type="text" size="small" fullWidth
                                                value={sponsoredBy || ''}
                                                onChange={(e) => setSponsoredBy(e.target.value)}
                                                sx={{
                                                    backgroundColor: '#fff',
                                                    fontSize: '1rem',
                                                    height: 40,
                                                    '& input': {
                                                        padding: '8px', fontSize: '0.95rem',
                                                        '&:focus': {
                                                            backgroundColor: 'var(--focus-bg-color)'
                                                        }
                                                    }
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={4} lg={12}>
                                            <TextField label="Sponsor GST" type="text" size="small" fullWidth
                                                value={sponsorGST || ''}
                                                onChange={(e) => setSponsorGST(e.target.value)}
                                                sx={{
                                                    backgroundColor: '#fff',
                                                    fontSize: '1rem',
                                                    height: 40,
                                                    '& input': {
                                                        padding: '8px', fontSize: '0.95rem',
                                                        '&:focus': {
                                                            backgroundColor: 'var(--focus-bg-color)'
                                                        }
                                                    }
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={4} lg={12}>
                                            <TextField label="Sponsor Address" type="text" size="small" fullWidth
                                                value={sponsorAddress || ''}
                                                onChange={(e) => setSponsorAddress(e.target.value)}
                                                sx={{
                                                    backgroundColor: '#fff',
                                                    fontSize: '1rem',
                                                    height: 40,
                                                    '& input': {
                                                        padding: '8px', fontSize: '0.95rem',
                                                        '&:focus': {
                                                            backgroundColor: 'var(--focus-bg-color)'
                                                        }
                                                    }
                                                }}
                                            />
                                        </Grid>



                                    </Grid>
                                </Grid>



                            </Grid>

                        </CardContent>
                    </Card>

                </Grid>

            </Grid>

            <ToastContainer autoClose={1000} hideProgressBar={true} position='top-center' theme='colored' transition={Bounce} />

        </div >
    )
}

export default CustomerDetails