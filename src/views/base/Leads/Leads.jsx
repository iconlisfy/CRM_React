import { format } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteIcon from "@mui/icons-material/Delete";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import closebtn from '../../../assets/images/Saki-NuoveXT-Actions-button-cancel.ico'
import useModal from '../../../components/UseModal';
import axiosInstance from '../../../axios';
import getReduxState from '../../../ReduxState';
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
// import PersonSwapIcon from "@mui/icons-material/PersonSwap";
import CloseIcon from "@mui/icons-material/Close";
import { useAsyncLock } from '../../../UseAsyncLock';
import ClearIcon from "@mui/icons-material/Clear";
import { Country, State } from "country-state-city";

function Leads({ openLeadModal, setOpenLeadModal, size = 'xl', isEdited = false,
  editLead = null, }) {

  const { modalClass } = useModal();

  const { role, deptid, name, empId, BrnchKey, dept, branch } = getReduxState()

  const isAdmin = role === "Administrator";

  const [isEditedState, setIsEditedState] = useState(isEdited);

  // State management
  const [topDateTime, setTopDateTime] = useState(new Date());
  const [leadId, setLeadId] = useState('');

  const [leadsFullData, setLeadsFullData] = useState([])

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const [allDept, setAllDept] = useState([]);
  const [listDept, setListDept] = useState(
    isAdmin ? "All" : deptid
  );

  const [withLock, isSaving] = useAsyncLock();
  const [focusField, setFocusField] = useState("");

  // Customer details
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [place, setPlace] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [leadSourceLocation, setLeadSourceLocation] = useState('');
  const [contactperson, setContactperson] = useState('')

  // Enquired for inputs & table
  const [product, setProduct] = useState('');
  const [note, setNote] = useState('');
  const [qty, setQty] = useState('');
  const [value, setValue] = useState('');
  const [enquiredItems, setEnquiredItems] = useState([]);

  // Remarks & Follow up
  const [remarks, setRemarks] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDateTime, setFollowUpDateTime] = useState(new Date());
  const [doubtfulLead, setDoubtfulLead] = useState(false)

  const [allProducts, setAllProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productSearch, setProductSearch] = useState('');

  const [selectedLeadType, setSelectedLeadType] = useState('')
  const [selectedLeadSource, setSelectedLeadSource] = useState('')
  const [selectedLeadQuality, setSelectedLeadQuality] = useState('')

  const [allStaff, setAllStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(empId);

  const [leadSourceList, setLeadSourceList] = useState([]);
  const [leadTypeList, setLeadTypeList] = useState([]);
  const [leadQualityList, setLeadQualityList] = useState([])

  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [openTransferModal, setOpenTransferModal] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);

  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const [transferDept, setTransferDept] = useState("");
  const [transferStaff, setTransferStaff] = useState("");
  const [transferRemarks, setTransferRemarks] = useState("");

  const [isSearchFetched, setIsSearchFetched] = useState(false);

  const [selectedLead, setSelectedLead] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [lead, setLead] = useState([])
  const [searchType, setSearchType] = useState("CustomerName");

  const [stateList, setStateList] = useState([]);

  const CustPhnInputRef = useRef(null)
  const ProductsInputRef = useRef(null)
  const TransDetInputRef = useRef(null)
  const TransDeptInputRef = useRef(null)
  const TransEmpInputRef = useRef(null)

  const transferStaffList = transferDept
    ? allStaff.filter(
      (staff) => Number(staff.Dept_id) === Number(transferDept)
      // Replace deptid with your actual property
    )
    : [];


  const countries = Country.getAllCountries().sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const handleCountryChange = (selectedCountry) => {
    setLeadSourceLocation(selectedCountry || "");
    setPlace("");

    const countryObj = countries.find(
      (country) => country.name === selectedCountry
    );

    if (countryObj) {
      const states = State.getStatesOfCountry(countryObj.isoCode)
        .sort((a, b) => a.name.localeCompare(b.name));

      setStateList(states);
    } else {
      setStateList([]);
    }
  };

  //===== Fetch All Leads Data =====
  const fetchAllData = async () => {
    try {
      const fetchResponse = await axiosInstance.get(`LeadSaveUpdateAPI/GetAllLeads`)

      if (fetchResponse.data && fetchResponse.data.data) {
        setLeadsFullData(fetchResponse.data.data)
      }

    } catch (error) {
      console.log("Error while fetching data", error)
    }
  }


  const handlePhoneChange = (e) => {
    const phone = e.target.value.replace(/[^\d+,]/g, "");

    setCustomerPhone(phone);

    if (phone.length >= 10) {
      const existingLead = leadsFullData.find(
        (lead) =>
          lead.CustomerPhone?.toString() === phone.toString()
      );

      if (existingLead) {
        setPhoneExists(true);
        toast.warning("Customer already has a lead");
      } else {
        setPhoneExists(false);
      }
    } else {
      setPhoneExists(false);
    }
  };

  const handleRowDoubleClick = (row) => {
    setSelectedRow(row);
    setUpdateDialogOpen(true);
  };

  const confirmUpdateItem = () => {
    if (!selectedRow) return;

    const productObj = allProducts.find(
      (p) => p.mstr_key === selectedRow.productKey
    );

    setSelectedProduct(productObj || null);
    setProductSearch(productObj?.desc || "");
    setNote(selectedRow.note);
    setQty(selectedRow.qty);
    setValue(selectedRow.value);

    setIsEditing(true);
    setEditingRowId(selectedRow.id);

    setUpdateDialogOpen(false);
    setSelectedRow(null);
  };

  const cancelUpdateItem = () => {
    setUpdateDialogOpen(false);
    setSelectedRow(null);
  };

  const canEditLead = !isEditedState || isAdmin ||
    (Number(selectedStaff) === Number(empId));


  useEffect(() => {
    if (!openLeadModal || !isEdited || !editLead) return;
    setIsEditedState(true);

    setLeadId(editLead.LeadKey);
    setTopDateTime(new Date(editLead.LeadDate));

    setCustomerPhone(editLead.CustomerPhone || "");
    setCustomerName(editLead.CustomerName || "");
    setPlace(editLead.Place || "");

    setSelectedStaff(editLead.AssignId || "");
    setContactperson(editLead.ContactedPerson || "");
    setSelectedLeadSource(editLead.LeadSourceId || "");
    setLeadSourceLocation(editLead.LeadLocation || "");

    setRemarks(editLead.Remarks || "");

    setFollowUpRequired(editLead.IsFollowUpReq);
    setFollowUpDateTime(
      editLead.FollowUpDate ? new Date(editLead.FollowUpDate) : new Date()
    );

    setSelectedLeadType(editLead.LeadTypeId || "");
    setSelectedLeadQuality(editLead.LeadQualityId || "");

    setDoubtfulLead(editLead.IsDoubtFull || false);

    setEnquiredItems(
      (editLead.Products || []).map((item, index) => ({
        id: index + 1,
        productKey: item.ProductId,
        enquiryId: item.EnquiryId,
        product: item.Product,
        note: item.Note,
        qty: item.Quantity,
        value: item.Rate,
      }))
    );
  }, [openLeadModal, isEdited, editLead]);


  //===== Fetch Department Data =====
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



  //===== Fetch latest Lead Id =====
  const fetchLatestId = async () => {
    try {
      const fetchResponse = await axiosInstance.get(`LeadSaveUpdateAPI/GetLeadNo?BrId=${BrnchKey}`)


      if (fetchResponse.data && fetchResponse.data.next_LeadNo)
        setLeadId(fetchResponse.data.next_LeadNo)
    } catch (error) {
      console.log("Error while fetching latestId", error)
    }
  }


  const getLead = async (selectedLeadCode) => {
    try {
      // setLoading(true);

      const res = await axiosInstance.get(
        `/LeadSaveUpdateAPI/LeadData?LeadCode=${selectedLeadCode}`
      );

      if (res.data.status) {
        const data = res.data.data;
        setIsSearchFetched(true);
        // Mark as edit mode
        setIsEditedState(true);

        setLead(data);

        setLeadId(data.LeadKey || "");
        setTopDateTime(
          data.LeadDate ? new Date(data.LeadDate) : new Date()
        );

        setCustomerPhone(data.CustomerPhone || "");
        setCustomerName(data.CustomerName || "");
        setPlace(data.Place || "");

        setSelectedStaff(data.AssignId || "");
        setContactperson(data.ContactedPerson || "");
        setSelectedStaff(data.AssignId || "");
        setSelectedLeadSource(data.LeadSourceId || "");
        setLeadSourceLocation(data.LeadLocation || "");

        setRemarks(data.Remarks || "");

        setFollowUpRequired(data.IsFollowUpReq || false);

        setFollowUpDateTime(
          data.FollowUpDate
            ? new Date(data.FollowUpDate)
            : new Date()
        );

        setSelectedLeadType(data.LeadTypeId || "");
        setSelectedLeadQuality(data.LeadQualityId || "");

        setDoubtfulLead(data.IsDoubtFull || false);
        setEnquiredItems(
          (data.Products || []).map((item, index) => ({
            id: index + 1,
            productKey: item.ProductId,
            enquiryId: item.EnquiryId,
            product: item.Product,
            note: item.Note,
            qty: item.Quantity,
            value: item.Rate,
          }))
        );
      }

    } catch (err) {
      console.log("Error fetching lead:", err);
      // } finally {
      //     setLoading(false);
    }
  };

  useEffect(() => {
    const countryObj = countries.find((c) => c.name === leadSourceLocation);

    if (countryObj) {
      const states = State.getStatesOfCountry(countryObj.isoCode)
        .sort((a, b) => a.name.localeCompare(b.name));
      setStateList(states);
    } else {
      setStateList([]);
    }
  }, [leadSourceLocation]);

  //===== Add Item to Enquired Table =====
  const handleAddItem = () => {
    if (!selectedProduct) {
      setValidationMessage("Please Add Products! ")
      setFocusField("products")
      setValidationDialogOpen(true)
      return
    };

    if (isEditing) {
      // Update existing row
      setEnquiredItems((prev) =>
        prev.map((item) =>
          item.id === editingRowId
            ? {
              ...item,
              productKey: selectedProduct.mstr_key,
              product: selectedProduct.desc,
              note,
              qty,
              value,
            }
            : item
        )
      );
      setIsEditing(false);
      setEditingRowId(null);
    } else {
      // Add new row
      setEnquiredItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          productKey: selectedProduct.mstr_key,
          product: selectedProduct.desc,
          note,
          qty,
          value,
        },
      ]);
    }

    // Clear inputs
    setSelectedProduct(null);
    setProductSearch("");
    setNote("");
    setQty("");
    setValue("");

    setIsEditing(false);
    setEditingRowId(null);
    setSelectedRow(null);
  };

  const handleDeleteItem = (id) => {
    setDeleteItemId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteItem = () => {

    setEnquiredItems((prev) =>
      prev.filter(item => item.id !== deleteItemId)
    );

    setDeleteDialogOpen(false);
    setDeleteItemId(null);
  };

  const cancelDeleteItem = () => {
    setDeleteDialogOpen(false);
    setDeleteItemId(null);
  };

  //===== Reset Function ======

  const handleNew = () => {
    // =========================
    // Header
    // =========================
    setLeadId("");
    setTopDateTime(new Date());

    // Get a fresh Lead ID
    fetchLatestId();

    // =========================
    // Search
    // =========================
    setSearchInput("");
    setSearchType("CustomerName");
    setSelectedLead(null);
    setLead([]);

    // =========================
    // Edit State
    // =========================
    setIsEditedState(false);
    setIsEditing(false);
    setEditingRowId(null);
    setSelectedRow(null);
    setUpdateDialogOpen(false);
    setIsSearchFetched(false);
    // =========================
    // Customer Details
    // =========================
    setCustomerPhone("");
    setCustomerName("");
    setContactperson("");
    setPlace("");

    // =========================
    // Assignment / Lead Source
    // =========================
    setSelectedStaff(empId);
    setSelectedLeadSource("");
    setLeadSourceLocation("");

    // =========================
    // Product Details
    // =========================
    setSelectedProduct(null);
    setProductSearch("");
    setNote("");
    setQty("");
    setValue("");
    setEnquiredItems([]);

    // =========================
    // Remarks / Follow Up
    // =========================
    setRemarks("");
    setFollowUpRequired(false);
    setFollowUpDateTime(new Date());
    setSelectedLeadType("");
    setSelectedLeadQuality("");
    setDoubtfulLead(false);

    // =========================
    // Phone validation
    // =========================
    setPhoneExists(false);

    // =========================
    // Transfer
    // =========================
    setTransferDept("");
    setTransferStaff("");
    setTransferRemarks("");
    setOpenTransferModal(false);

    // =========================
    // Delete / Validation dialogs
    // =========================
    setDeleteDialogOpen(false);
    setDeleteItemId(null);

    setValidationDialogOpen(false);
    setValidationMessage("");
    setFocusField("");
    setStateList([]);
  };


  //===== Fetch Products Data =====
  const fetchProducts = async () => {
    try {

      const fetchResponse = await axiosInstance.get(`/ProductsAPI/GetAll`);

      if (fetchResponse.data?.products) {
        // console.log("fetchResponse", fetchResponse)
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

  //===== Fetch Masters Data =====
  const fetchMasters = async () => {
    try {
      const fetchLeadSource = await axiosInstance.get(
        `MasterAPI/Search?Type=LeadSource`
      );

      if (fetchLeadSource.data?.MasterList) {
        setLeadSourceList(fetchLeadSource.data.MasterList);
      }


      const fetchLeadType = await axiosInstance.get(
        `MasterAPI/Search?Type=LeadType`
      );

      if (fetchLeadType.data?.MasterList) {
        setLeadTypeList(fetchLeadType.data.MasterList);
      }

      const fetchLeadQuality = await axiosInstance.get(
        `MasterAPI/Search?Type=LeadQlty`
      );

      if (fetchLeadQuality.data?.MasterList) {
        setLeadQualityList(fetchLeadQuality.data.MasterList);
      }

    } catch (error) {
      console.log("error while fetching all data", error);
    }
  };

  //===== Fetch Staff Data =====
  const fetchStaff = async () => {
    try {
      const res = await axiosInstance.get("/AcctMstStaffAPI/GetAll");

      const staffData = res?.data?.staff;

      if (Array.isArray(staffData)) {
        // Keep ALL staff here.
        // We will filter only when creating a new lead.
        setAllStaff(staffData);
      } else {
        setAllStaff([]);
      }
    } catch (err) {
      console.log("Error fetching staff", err);
      setAllStaff([]);
    }
  };


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

  useEffect(() => {
    if (openLeadModal) {
      fetchProducts()
      fetchMasters()
      fetchStaff()
      fetchLatestId()
      fetchDepartment()
      fetchAllData()
    }
  }, [openLeadModal])

  //====== Generate LeadId ==========
  const generateLeadId = (key, prefix = branch) => {
    if (!key) return "";

    const keyStr = String(key);

    const totalLength = 5; // required numeric length
    const zeroCount = Math.max(totalLength - keyStr.length, 0);

    const zeros = "0".repeat(zeroCount);

    return prefix + `L` + zeros + keyStr;
  };

  // ===== Log Description =====
  const getUpdateLogDescription = () => {
    if (!isEditedState) return "";

    // Original lead data can come from either editLead or getLead()
    const originalLead = lead?.LeadKey
      ? lead
      : editLead;

    if (!originalLead) {
      return "Lead updated";
    }

    const changes = [];

    // Helper to compare values safely
    const normalize = (value) => {
      if (value === null || value === undefined) return "";
      return String(value).trim();
    };

    // Helper to display empty values
    const displayValue = (value) => {
      const normalized = normalize(value);
      return normalized || "-";
    };

    // Customer Details
    if (
      normalize(originalLead.CustomerPhone) !==
      normalize(customerPhone)
    ) {
      changes.push(
        `Customer Phone: ${displayValue(originalLead.CustomerPhone)} → ${displayValue(customerPhone)}`
      );
    }

    if (
      normalize(originalLead.CustomerName) !==
      normalize(customerName)
    ) {
      changes.push(
        `Customer Name: ${displayValue(originalLead.CustomerName)} → ${displayValue(customerName)}`
      );
    }

    if (
      normalize(originalLead.Place) !==
      normalize(place)
    ) {
      changes.push(
        `Place: ${displayValue(originalLead.Place)} → ${displayValue(place)}`
      );
    }

    if (
      normalize(originalLead.ContactedPerson) !==
      normalize(contactperson)
    ) {
      changes.push(
        `Contacted Person: ${displayValue(originalLead.ContactedPerson)} → ${displayValue(contactperson)}`
      );
    }

    // Assign to
    if (
      Number(originalLead.AssignId || 0) !==
      Number(selectedStaff || 0)
    ) {
      changes.push(
        `Assigned Staff: ${displayValue(originalLead.AssignId)} → ${displayValue(selectedStaff)}`
      );
    }

    // Lead Source
    if (
      Number(originalLead.LeadSourceId || 0) !==
      Number(selectedLeadSource || 0)
    ) {
      changes.push(
        `Lead Source: ${displayValue(originalLead.LeadSourceId)} → ${displayValue(selectedLeadSource)}`
      );
    }

    if (
      normalize(originalLead.LeadLocation) !==
      normalize(leadSourceLocation)
    ) {
      changes.push(
        `Lead Source Location: ${displayValue(originalLead.LeadLocation)} → ${displayValue(leadSourceLocation)}`
      );
    }

    // =========================
    // Lead Type
    // =========================

    if (
      Number(originalLead.LeadTypeId || 0) !==
      Number(selectedLeadType || 0)
    ) {
      changes.push(
        `Lead Type: ${displayValue(originalLead.LeadTypeId)} → ${displayValue(selectedLeadType)}`
      );
    }

    // Lead Quality
    if (
      Number(
        originalLead.LeadQualityId ??
        originalLead.LeadQuality ??
        0
      ) !== Number(selectedLeadQuality || 0)
    ) {
      changes.push(
        `Lead Quality: ${displayValue(
          originalLead.LeadQualityId ?? originalLead.LeadQuality
        )} → ${displayValue(selectedLeadQuality)}`
      );
    }

    // Remarks
    if (
      normalize(originalLead.Remarks) !==
      normalize(remarks)
    ) {
      changes.push(
        `Remarks: ${displayValue(originalLead.Remarks)} → ${displayValue(remarks)}`
      );
    }

    // Follow Up Required
    if (
      Boolean(originalLead.IsFollowUpReq) !==
      Boolean(followUpRequired)
    ) {
      changes.push(
        `Follow Up Required: ${originalLead.IsFollowUpReq ? "Yes" : "No"
        } → ${followUpRequired ? "Yes" : "No"
        }`
      );
    }

    // Follow Up Date
    const originalFollowUpDate = originalLead.FollowUpDate
      ? new Date(originalLead.FollowUpDate).getTime()
      : null;

    const currentFollowUpDate =
      followUpRequired && followUpDateTime
        ? new Date(followUpDateTime).getTime()
        : null;

    if (originalFollowUpDate !== currentFollowUpDate) {
      changes.push(
        `Follow Up Date: ${originalLead.FollowUpDate
          ? format(
            new Date(originalLead.FollowUpDate),
            "dd-MMM-yyyy hh:mm aa"
          )
          : "-"
        } → ${currentFollowUpDate
          ? format(
            new Date(followUpDateTime),
            "dd-MMM-yyyy hh:mm aa"
          )
          : "-"
        }`
      );
    }

    // Doubtful Lead
    if (
      Boolean(originalLead.IsDoubtFull) !==
      Boolean(doubtfulLead)
    ) {
      changes.push(
        `Doubtful Lead: ${originalLead.IsDoubtFull ? "Yes" : "No"
        } → ${doubtfulLead ? "Yes" : "No"
        }`
      );
    }

    // Products
    const originalProducts = (originalLead.Products || [])
      .map((item) => ({
        productId: Number(item.ProductId || 0),
        product: normalize(item.Product),
        note: normalize(item.Note),
        quantity: Number(item.Quantity || 0),
        rate: Number(item.Rate || 0),
      }))
      .sort((a, b) => a.productId - b.productId);

    const currentProducts = (enquiredItems || [])
      .map((item) => ({
        productId: Number(item.productKey || 0),
        product: normalize(item.product),
        note: normalize(item.note),
        quantity: Number(item.qty || 0),
        rate: Number(item.value || 0),
      }))
      .sort((a, b) => a.productId - b.productId);

    if (
      JSON.stringify(originalProducts) !==
      JSON.stringify(currentProducts)
    ) {
      changes.push("Products updated");
    }

    // Final Result
    return changes.length
      ? changes.join(", ")
      : "No changes";
  };

  //===== Save / Update Function =====
  const handleSaveUpdate = () => {
    withLock(async () => {

      if (!customerPhone.trim()) {
        setValidationMessage("Please Enter Customer PhnNo");
        setValidationDialogOpen(true);
        setFocusField('CustPhn')
        return;
      }

      try {
        const requestData = {
          IsEdited: isEditedState,
          LeadKey: isEditedState ? (lead?.LeadKey ?? editLead?.LeadKey ?? "") : '',
          LeadCode: isEditedState ? (lead?.LeadCode ?? editLead?.LeadCode ?? "") : generateLeadId(leadId),
          LeadDate: format(topDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
          CustPhNo: customerPhone,
          CustName: customerName,
          Place: place,
          AssignTo: selectedStaff,
          LeadSourceId: selectedLeadSource,
          LeadLocation: leadSourceLocation,
          Remarks: remarks,
          IsFollowUpReq: followUpRequired,
          LeadTypeId: selectedLeadType,
          IsDoubtFull: doubtfulLead,
          FollowUpDate: followUpRequired
            ? format(followUpDateTime, "yyyy-MM-dd'T'HH:mm:ss")
            : null,
          DepartmentId: deptid,
          LeadQuality: selectedLeadQuality,
          UserInfo: name,
          ContactedPerson: contactperson,
          Products: enquiredItems.map((item) => ({
            EnquiryId: isEditedState ? item.enquiryId : '', // or null if your API expects null
            Product: item.product,
            ProductId: item.productKey,
            Note: item.note,
            Quantity: Number(item.qty || 0),
            Rate: Number(item.value || 0),
            UserInfo: name,
          })),


          // Pass only while editing
          ...(isEdited && {
            logReason: "Lead Updated",
            logDesc: getUpdateLogDescription(),
            logForm: "Lead Entry",
            logUser: name,
            logUserId: empId,
          }),
        };

        console.log("RequestData", requestData);

        const response = await axiosInstance.post(
          "/LeadSaveUpdateAPI/LeadSaveUpdate",
          requestData
        );


        if (response.data.status === true) {
          toast.success(isEditedState ? "Updated Successfully" : "Saved Successfully");
        } else {
          toast.error(response.data.message);
        }

        handleNew();
        setOpenLeadModal(false)
      } catch (error) {
        console.error(error);
        toast.error("Failed to save lead");
      }
    });
  };
  // ===== Lead Transfer ======
  // ===== Lead Transfer ======
  const handleTransfer = async () => {

    // Check Lead Available
    if (!leadId && !editLead?.LeadCode) {
      setValidationMessage("No Lead Available to Transfer!");
      setValidationDialogOpen(true);
      return;
    }

    // Department validation
    if (!transferDept) {
      setValidationMessage("Please Select Department");
      setFocusField("TransDept");
      setValidationDialogOpen(true);
      return;
    }

    // Staff validation
    if (!transferStaff) {
      setValidationMessage("Please Select a Staff");
      setFocusField("TransEmp");
      setValidationDialogOpen(true);
      return;
    }

    // Remarks validation
    if (!transferRemarks?.trim()) {
      setValidationMessage("Please Enter Details");
      setFocusField("TransDet");
      setValidationDialogOpen(true);
      return;
    }

    try {
      const requestData = {
        LeadCode: isEdited
          ? editLead?.LeadCode
          : generateLeadId(leadId),

        TransferEmpId: selectedStaff,
        TransfertoEmpId: transferStaff,
        TransferDeptId: transferDept,
        TransferDetails: transferRemarks,

        logReason: "Lead Transfer",
        logDesc: `Lead transferred from ${selectedStaff} to ${transferStaff}. Reason: ${transferRemarks}`,
        logForm: "Lead Entry",
        logUser: name,
        logUserId: empId,
      };

      const transresponse = await axiosInstance.post(
        "/SaveTransferDetailsAPI/SaveTransferDetails",
        requestData
      );

      if (transresponse.data?.status === true) {
        toast.success("Lead Transfer Successfully");

        setOpenTransferModal(false);
        setOpenLeadModal(false);

        // Reset
        setSelectedStaff("");
        setTransferStaff("");
        setTransferDept("");
        setTransferRemarks("");
      } else {
        toast.error(
          transresponse.data?.message || "Transfer failed"
        );
      }

    } catch (error) {
      console.error("Lead Transfer Error:", error);
      toast.error("Transfer failed");
    }
  };



  // Sales staff + Administrators
  const salesAndAdmins = allStaff.filter(
    (staff) =>
      staff.DeptName?.toLowerCase() === "sales" ||
      staff.UserGroup?.toLowerCase() === "administrator"
  );

  // Assigned staff of the fetched/edited lead
  const originalAssignId = lead?.AssignId ?? editLead?.AssignId ?? null;

  const staffOptions = (() => {
    // ===== ADMIN =====
    // New lead or fetched lead -> Sales + Admins only.
    // Also keep the lead's original / currently selected staff so the value
    // still shows even if that person is not Sales/Admin.
    if (isAdmin) {
      const extraIds = [originalAssignId, selectedStaff]
        .filter(Boolean)
        .map(Number);

      const extras = allStaff.filter(
        (staff) =>
          extraIds.includes(Number(staff.ahmst_key)) &&
          !salesAndAdmins.some(s => Number(s.ahmst_key) === Number(staff.ahmst_key))
      );

      return [...extras, ...salesAndAdmins];
    }

    // ===== STAFF: fetched / edited lead =====
    // Field is disabled, just show the assigned person
    if (isEditedState) {
      return allStaff.filter(
        (staff) => Number(staff.ahmst_key) === Number(selectedStaff)
      );
    }

    // ===== STAFF: new lead =====
    // Only the logged-in user
    return allStaff.filter(
      (staff) => Number(staff.ahmst_key) === Number(empId)
    );
  })();
  return (


    <>

      <CModal
        size={size}
        backdrop='static'
        classmstName={`${modalClass} modal custom-modal-close custom-modal-width custom-centered-modal`}  // Concatenate class mstNames correctly
        alignment="center"
        visible={openLeadModal}
        onClose={() => {
          setOpenLeadModal(false);
          handleNew();
        }}
        aria-labelledby="VerticallyCenteredExample">
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
            onClick={() => setOpenLeadModal(false)}
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

        <CModalBody classmstName='c-modal-body no-scroll '
          style={{
            zoom: "0.8",
            // maxHeight: "80vh",      overflowY: "auto",
            background:
              "linear-gradient(135deg, #f8fafc 0%, #eef4ff 50%, #dbeafe 100%)",
          }}>


          <Box>

            {/* Main Form Grid */}
            <Grid container spacing={1}>

              <Grid item xs={12} >

                <Card sx={{
                  backgroundColor: 'transparent !important',
                  boxShadow: 'none',

                  border: '1px solid #d1d5db', // light gray border   // darker, more visible gray
                  borderRadius: 2,
                  height: { xs: '160px', sm: '75px' }
                }}>
                  <CardContent>
                    <Grid container spacing={1}>

                      <Grid item xs={12} sm={5}>
                        <TextField
                          label="Search Item"
                          size="small"
                          fullWidth
                          select
                          value={searchType}
                          onChange={(e) => setSearchType(e.target.value)}

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
                              borderLeft: '5px solid  #3f5483',
                              paddingLeft: '12px',
                              backgroundColor: 'var(--input-bg-color)',
                              padding: '8px',
                              fontSize: '0.95rem',
                            },
                            //  focus background
                            '& .MuiOutlinedInput-root.Mui-focused': {
                              backgroundColor: 'var(--focus-bg-color)',
                            },
                          }}
                        >
                          <MenuItem value="CustomerName">Customer Name</MenuItem>
                          <MenuItem value="CustomerPhone">Customer Phone</MenuItem>                        </TextField>
                      </Grid>

                      {/* Row 2: Customer Phone & Name */}
                      <Grid item xs={12} sm={7}>

                        <Autocomplete
                          size="small"
                          fullWidth
                          options={leadsFullData || []}

                          // Controls the selected customer
                          value={selectedLead || null}

                          // Controls the text inside the search box
                          inputValue={searchInput}

                          getOptionLabel={(option) =>
                            option?.CustomerName || ""
                          }

                          onInputChange={(event, value, reason) => {
                            setSearchInput(value);

                            // Clear selected customer when search is cleared
                            if (reason === "clear") {
                              setSelectedLead(null);
                            }
                          }}

                          filterOptions={(options, { inputValue }) => {
                            const search = inputValue.toLowerCase().trim();

                            if (!search) return options;

                            if (searchType === "CustomerName") {
                              return options.filter((lead) =>
                                lead.CustomerName
                                  ?.toLowerCase()
                                  .includes(search)
                              );
                            }

                            if (searchType === "CustomerPhone") {
                              return options.filter((lead) =>
                                String(lead.CustomerPhone || "")
                                  .includes(search)
                              );
                            }

                            return options;
                          }}

                          onChange={(event, selectedCustomer) => {
                            setSelectedLead(selectedCustomer);

                            if (!selectedCustomer) return;

                            const leadCode = selectedCustomer.LeadCode;

                            getLead(leadCode);
                          }}

                          renderOption={(props, option) => (
                            <li {...props}>
                              <Box sx={{ width: "100%", py: 0.5 }}>

                                {/* Customer Name */}
                                <Typography
                                  fontWeight={600}
                                  fontSize={14}
                                >
                                  {highlightText(
                                    option.CustomerName || "",
                                    searchInput
                                  )}
                                </Typography>

                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mt: 0.5,
                                  }}
                                >

                                  {/* Phone */}
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Phone:{" "}
                                    {highlightText(
                                      String(option.CustomerPhone || ""),
                                      searchInput
                                    )}
                                  </Typography>

                                  {/* Lead ID */}
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 600,
                                      color: "#555",
                                    }}
                                  >
                                    ID: {option.LeadCode}
                                  </Typography>

                                </Box>
                              </Box>
                            </li>
                          )}

                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={`Search ${searchType}`}
                              size="small"
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
                                    width: '5px',
                                    backgroundColor: '#3f5483',
                                    borderTopLeftRadius: '6px',
                                    borderBottomLeftRadius: '6px',
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
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>


              {/* Customer & Lead Source Details Card */}
              <Grid item xs={12} >
                <Card
                  sx={{
                    backgroundColor: 'transparent !important',
                    boxShadow: 'none',

                    border: '1px solid #d1d5db', // light gray border   // darker, more visible gray
                    borderRadius: 2,
                    height: { xs: '460px', sm: '165px' }
                  }}
                >
                  <CardContent sx={{
                    backgroundColor: 'transparent',
                  }}>
                    <Grid container spacing={1.3}>
                      {/* Row 1: Date Time Picker (Left) & Lead Id (Right) */}
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ maxWidth: 300 }}>
                          <DatePicker
                            selected={topDateTime}
                            onChange={(date) => setTopDateTime(date)}
                            showTimeSelect
                            timeIntervals={15}
                            dateFormat="dd-MMM-yyyy hh:mm aa"
                            customInput={
                              <TextField
                                label="Date Time"
                                size="small"
                                fullWidth
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <CalendarTodayIcon sx={{ fontSize: 18, color: '#666' }} />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  backgroundColor: '#fff',
                                  '& .MuiInputBase-input': {
                                    padding: '8px',
                                    fontSize: '0.95rem',
                                  },
                                  '& .MuiOutlinedInput-root.Mui-focused': {
                                    backgroundColor: 'var(--focus-bg-color)',
                                  },
                                }}
                              />
                            }
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <TextField
                          label="Lead Id"
                          size="small"
                          value={
                            isEditedState
                              ? (lead?.LeadCode || editLead?.LeadCode || generateLeadId(leadId))
                              : generateLeadId(leadId)
                          }
                          // onChange={(e) => setLeadId(e.target.value)}
                          sx={{

                            width: { xs: '100%', sm: 220 },
                            backgroundColor: '#fff',
                            '& .MuiInputBase-input': {
                              padding: '8px',
                              fontSize: '0.95rem',
                              textAlign: 'right',
                            },
                            '& .MuiOutlinedInput-root.Mui-focused': {
                              backgroundColor: 'var(--focus-bg-color)',
                            },
                          }}
                        />
                      </Grid>

                      {/* Row 2: Customer Phone & Name */}
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Customer Phone Number"
                          type="text"
                          size="small"
                          fullWidth
                          value={customerPhone}
                          onChange={handlePhoneChange}
                          inputRef={CustPhnInputRef}
                          error={phoneExists}
                          helperText={phoneExists ? "Customer already has a lead" : ""}
                          sx={{
                            backgroundColor: '#fff',
                            '& input': {
                              padding: '8px',
                              fontSize: '0.95rem',
                              '&:focus': {
                                backgroundColor: 'var(--focus-bg-color)'
                              }
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Contacted Person"
                          type="text"
                          size="small"
                          fullWidth
                          value={contactperson}
                          onChange={(e) => setContactperson(e.target.value)}
                          sx={{
                            backgroundColor: '#fff',
                            '& input': {
                              padding: '8px',
                              fontSize: '0.95rem',
                              '&:focus': {
                                backgroundColor: 'var(--focus-bg-color)'
                              }
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Customer Name"
                          type="text"
                          size="small"
                          fullWidth
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          sx={{
                            backgroundColor: '#fff',
                            '& input': {
                              padding: '8px',
                              fontSize: '0.95rem',
                              '&:focus': {
                                backgroundColor: 'var(--focus-bg-color)'
                              }
                            }
                          }}
                        />
                      </Grid>




                      {/* Row 3: Place, Assign to, Lead Source, Lead Source location */}


                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          label="Assign to"
                          size="small"
                          fullWidth
                          select
                          value={selectedStaff}
                          disabled={isSearchFetched && !isAdmin}
                          onChange={(e) => setSelectedStaff(e.target.value)}
                          sx={{
                            backgroundColor: '#fff',
                            '& .MuiOutlinedInput-root.Mui-focused': {
                              backgroundColor: 'var(--focus-bg-color)',
                            },
                            '& .MuiSelect-select': {
                              padding: '8px',
                              fontSize: '0.95rem',
                            },
                          }}
                        >


                          {staffOptions.map((staff) => (
                            <MenuItem
                              key={staff.ahmst_key}
                              value={staff.ahmst_key}
                            >
                              {staff.ahmst_pname}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          label="Lead Source"
                          size="small"
                          fullWidth
                          select
                          value={selectedLeadSource}
                          onChange={(e) => setSelectedLeadSource(e.target.value)}
                          sx={{
                            backgroundColor: '#fff',
                            '& .MuiOutlinedInput-root.Mui-focused': {
                              backgroundColor: 'var(--focus-bg-color)',
                            },
                            '& .MuiSelect-select': {
                              padding: '8px',
                              fontSize: '0.95rem',
                            },
                          }}
                          InputProps={{
                            endAdornment: selectedLeadSource && (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent menu from opening
                                    setSelectedLeadSource("");
                                  }}
                                >
                                  <ClearIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        >
                          {leadSourceList
                            ?.filter(item => item?.desc?.trim()) // remove empty names
                            .map((item) => (
                              <MenuItem key={item.mstr_key} value={item.mstr_key}>
                                {item.desc.trim()}
                              </MenuItem>
                            ))
                          }
                        </TextField>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>

                        <Autocomplete
                          size="small"
                          fullWidth
                          options={countries || ''}
                          getOptionLabel={(option) => option.name || ""}
                          value={
                            countries.find(
                              (c) => c.name === leadSourceLocation
                            ) || null
                          }
                          onChange={(event, newValue) => {
                            handleCountryChange(newValue?.name || "");
                          }}
                          renderOption={(props, option, { inputValue }) => (
                            <li {...props} key={option.isoCode}>
                              {highlightText(option.name, inputValue)}
                            </li>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Lead Source Location"
                              sx={{
                                backgroundColor: '#fff',
                                '& .MuiOutlinedInput-root.Mui-focused': {
                                  backgroundColor: 'var(--focus-bg-color)',
                                },
                                '& .MuiSelect-select': {
                                  padding: '8px',
                                  fontSize: '0.95rem',
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>


                      <Grid item xs={12} sm={6} md={3}>
                        <Autocomplete
                          size="small"
                          fullWidth
                          options={stateList}
                          getOptionLabel={(option) => option.name || ""}
                          value={stateList.find((s) => s.name === place) || null}
                          onChange={(event, newValue) => {
                            setPlace(newValue?.name || "");
                          }}
                          disabled={!leadSourceLocation}
                          renderOption={(props, option, { inputValue }) => (
                            <li {...props} key={`${option.countryCode}-${option.isoCode}`}>
                              {highlightText(option.name, inputValue)}
                            </li>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="State"
                              sx={{
                                backgroundColor: '#fff',
                                '& .MuiOutlinedInput-root.Mui-focused': {
                                  backgroundColor: 'var(--focus-bg-color)',
                                },
                                '& .MuiSelect-select': {
                                  padding: '8px',
                                  fontSize: '0.95rem',
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Enquired For Card */}
              <Grid item xs={12}>
                <Card
                  sx={{
                    backgroundColor: 'transparent !important',
                    boxShadow: 'none',
                    border: '1px solid #d1d5db', // light gray border   // darker, more visible gray
                    borderRadius: 2,
                    height: { xs: '490px', sm: '265px' }
                  }}
                >
                  <CardContent>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ color: '#4F46E5', fontWeight: 600, marginTop: '-5px' }}>
                          Enquired for
                        </Typography>
                      </Grid>

                      {/* Input Controls for Enquired Table */}
                      <Grid item xs={12} sm={3}>
                        <Autocomplete
                          size="small"
                          fullWidth
                          options={allProducts || []}
                          value={selectedProduct || null}

                          inputValue={productSearch}
                          onInputChange={(e, value) => setProductSearch(value)}

                          onChange={(e, value) => {
                            setSelectedProduct(value);
                          }}

                          getOptionLabel={(option) => option?.desc || ""}

                          isOptionEqualToValue={(option, value) =>
                            option?.mstr_key === value?.mstr_key
                          }
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              boxShadow: 'inset 4px 0 0 0 var(--search-side-color)',
                              '& .MuiAutocomplete-input': {
                                paddingLeft: '16px',
                              }
                            }
                          }}
                          renderOption={(props, option) => (
                            <li {...props}>
                              {highlightText(option.desc, productSearch)}
                            </li>
                          )}

                          renderInput={(params) => (
                            <TextField {...params} label="Select Product"
                              inputRef={ProductsInputRef}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    <InputAdornment position="end">
                                      <SearchIcon />
                                    </InputAdornment>
                                    {params.InputProps.endAdornment} {/* keep dropdown arrow */}
                                  </>
                                ),
                              }}
                              sx={{
                                backgroundColor: '#fff',
                                fontSize: '1rem',
                                '& input': {
                                  padding: '8px',
                                  fontSize: '0.95rem',
                                  '&:focus': {
                                    backgroundColor: 'var(--focus-bg-color)',
                                  },
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Note"
                          type="text"
                          size="small"
                          fullWidth
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          sx={{
                            backgroundColor: '#fff',
                            '& input': {
                              padding: '8px',
                              fontSize: '0.95rem',
                              '&:focus': {
                                backgroundColor: 'var(--focus-bg-color)'
                              }
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={6} sm={2} md={1.5}>
                        <TextField
                          label="Qty"
                          type="text"
                          size="small"
                          fullWidth
                          value={qty}

                          onChange={(e) => {
                            const value = e.target.value;

                            // allow only numbers
                            if (/^\d*$/.test(value)) {
                              setQty(value);
                            }
                          }}
                          sx={{
                            backgroundColor: '#fff',
                            '& input': {
                              padding: '8px',
                              fontSize: '0.95rem',
                              '&:focus': {
                                backgroundColor: 'var(--focus-bg-color)'
                              }
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={6} sm={2} md={2.5}>
                        <TextField
                          label="Value"
                          type="text"
                          size="small"
                          fullWidth
                          value={value}

                          onChange={(e) => {
                            const value = e.target.value;

                            // allow only numbers
                            if (/^\d*$/.test(value)) {
                              setValue(value);
                            }
                          }}
                          sx={{
                            backgroundColor: '#fff',
                            '& input': {
                              padding: '8px',
                              fontSize: '0.95rem',
                              '&:focus': {
                                backgroundColor: 'var(--focus-bg-color)'
                              }
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={1} md={1} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                          onClick={handleAddItem}
                          variant="contained"
                          fullWidth
                          sx={{
                            textTransform: 'none',
                            height: '38px',
                            color: '#f5f7fa',
                            background:
                              "linear-gradient(135deg, #6d8ef5 0%, #4975db 50%, #3f5483 100%)",
                            boxShadow: "0 4px 10px rgba(73,117,219,0.35)",
                            '&:hover': {
                              background:
                                "linear-gradient(135deg, #7b99f8 0%, #5b84e9 50%, #4a618f 100%)",
                              boxShadow: "0 6px 14px rgba(73,117,219,0.45)",
                            },
                          }}
                        >
                          {isEditing ? "Update" : "Add"}
                        </Button>
                      </Grid>

                      {/* Table displaying Enquired Items */}
                      <Grid item xs={12}>
                        <TableContainer
                          component={Paper}
                          sx={{
                            height: {
                              xs: '240px',
                              sm: 'calc(100vh - 550px)',
                              md: '150px',
                              lg: '150px',
                              xl: '150px'
                            },
                            width: '100%',
                            overflowX: 'auto',
                            overflowY: 'auto',
                            border: '1px solid #e0e0e0',
                            boxShadow: 'none',
                            '&::-webkit-scrollbar': { width: '6px' },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '3px' },
                            '&::-webkit-scrollbar-track': { backgroundColor: '#f0f0f0' },
                          }}
                        >
                          <Table stickyHeader size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '60px' }}>SlNo</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '650px' }}>Product</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '880px' }}>Note</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '450px' }}>Qty</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '400px' }}>Value</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'var(--header-bg-color)', width: '260px', textAlign: 'center' }}></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {enquiredItems.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={6} align="center" sx={{ color: '#888', py: 2 }}>
                                    No items added to enquiry yet.
                                  </TableCell>
                                </TableRow>
                              ) : (
                                enquiredItems.map((item, index) => (
                                  <TableRow
                                    key={item.id}
                                    hover
                                    onDoubleClick={() => handleRowDoubleClick(item)}
                                    sx={{ cursor: "pointer" }}
                                  >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.product}</TableCell>
                                    <TableCell>{item.note}</TableCell>
                                    <TableCell>{item.qty}</TableCell>
                                    <TableCell>{item.value}</TableCell>
                                    <TableCell align="center">
                                      <IconButton size="small" onClick={() => handleDeleteItem(item.id)} color="error">
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Remarks & Options Section */}
              <Grid item xs={12}>
                <Card
                  sx={{
                    backgroundColor: 'transparent !important',
                    boxShadow: 'none',

                    border: '1px solid #d1d5db', // light gray border   // darker, more visible gray
                    borderRadius: 2,
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Grid container spacing={1.5}>
                      <Grid item xs={12}>
                        <TextField
                          label="Remarks"
                          type="text"
                          size="small"
                          fullWidth
                          multiline
                          rows={1}
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          sx={{
                            backgroundColor: '#fff',
                            '& .MuiOutlinedInput-root.Mui-focused textarea': {
                              backgroundColor: 'var(--focus-bg-color)',
                            },
                          }}
                        />
                      </Grid>

                      {/* Followup & Date picker row */}
                      <Grid item xs={12} sm={6} md={3} display="flex" alignItems="center">
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              checked={followUpRequired}
                              onChange={(e) => setFollowUpRequired(e.target.checked)}
                              sx={{
                                color: 'grey',
                                '&.Mui-checked': {
                                  color: '#6366F1!important',
                                },
                              }}
                            />
                          }
                          label="Follow Up Required"
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <DatePicker
                          selected={followUpDateTime}
                          onChange={(date) => setFollowUpDateTime(date)}
                          showTimeSelect
                          timeIntervals={15}
                          dateFormat="dd-MMM-yyyy hh:mm aa"
                          disabled={!followUpRequired}
                          customInput={
                            <TextField
                              label="Date Time"
                              size="small"
                              fullWidth
                              disabled={!followUpRequired}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <CalendarTodayIcon sx={{ fontSize: 18, color: followUpRequired ? '#666' : '#ccc' }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                backgroundColor: '#fff',
                                '& .MuiInputBase-input': {
                                  padding: '8px',
                                  fontSize: '0.95rem',
                                },
                                '& .MuiOutlinedInput-root.Mui-focused': {
                                  backgroundColor: 'var(--focus-bg-color)',
                                },
                              }}
                            />
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={5} />

                      {/* Row 2: Lead type & Doubt full Lead */}
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          label="Lead Type"
                          size="small"
                          fullWidth
                          select
                          value={selectedLeadType}
                          onChange={(e) => setSelectedLeadType(e.target.value)}
                          sx={{
                            backgroundColor: '#fff',
                            '& .MuiOutlinedInput-root.Mui-focused': {
                              backgroundColor: 'var(--focus-bg-color)',
                            },
                            '& .MuiSelect-select': {
                              padding: '8px',
                              fontSize: '0.95rem',
                            },
                          }}

                          InputProps={{
                            endAdornment: selectedLeadType && (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent menu from opening
                                    setSelectedLeadType("");
                                  }}
                                >
                                  <ClearIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        >
                          {leadTypeList
                            ?.filter(item => item?.desc?.trim()) // remove empty names
                            .map((item) => (
                              <MenuItem key={item.mstr_key} value={item.mstr_key}>
                                {item.desc.trim()}
                              </MenuItem>
                            ))
                          }
                        </TextField>
                      </Grid>


                      <Grid item xs={12} sm={6} md={2.5}>
                        <TextField
                          label="Lead Quality"
                          size="small"
                          fullWidth
                          select
                          value={selectedLeadQuality}
                          onChange={(e) => setSelectedLeadQuality(e.target.value)}
                          sx={{
                            backgroundColor: '#fff',
                            '& .MuiOutlinedInput-root.Mui-focused': {
                              backgroundColor: 'var(--focus-bg-color)',
                            },
                            '& .MuiSelect-select': {
                              padding: '8px',
                              fontSize: '0.95rem',
                            },
                          }}
                          InputProps={{
                            endAdornment: selectedLeadQuality && (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent menu from opening
                                    setSelectedLeadQuality("");
                                  }}
                                >
                                  <ClearIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        >
                          {leadQualityList
                            ?.filter(item => item?.desc?.trim()) // remove empty names
                            .map((item) => (
                              <MenuItem key={item.mstr_key} value={item.mstr_key}>
                                {item.desc.trim()}
                              </MenuItem>
                            ))
                          }
                        </TextField>
                      </Grid>


                      <Grid item xs={12} sm={6} md={4} display="flex" alignItems="center">
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              checked={doubtfulLead}
                              onChange={(e) => setDoubtfulLead(e.target.checked)}
                              sx={{
                                color: 'grey',
                                '&.Mui-checked': {
                                  color: '#6366F1!important',
                                },
                              }}
                            />
                          }
                          label="Doubt Full Lead"
                        />
                      </Grid>

                      {/* Bottom Right Buttons */}
                      <Grid item xs={12} sm={12} md={2.5} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, alignItems: 'center' }}>
                        <Button
                          onClick={() => setOpenTransferModal(true)}
                          disabled={!canEditLead}
                          variant="contained"
                          sx={{
                            textTransform: 'none',
                            height: '38px',
                            width: '180px',
                            color: '#f5f7fa',
                            background:
                              "linear-gradient(135deg, #6d8ef5 0%, #4975db 50%, #3f5483 100%)",
                            boxShadow: "0 4px 10px rgba(73,117,219,0.35)",
                            '&:hover': {
                              background:
                                "linear-gradient(135deg, #7b99f8 0%, #5b84e9 50%, #4a618f 100%)",
                              boxShadow: "0 6px 14px rgba(73,117,219,0.45)",
                            },
                            "&.Mui-disabled": {
                              cursor: 'not-allowed', // Change cursor style
                              pointerEvents: "auto"
                            },
                          }}
                        >
                          Transfer
                        </Button>

                        <Button
                          onClick={handleNew}
                          variant="contained"
                          sx={{
                            textTransform: 'none',
                            height: '38px',
                            width: '100px',
                            color: '#f5f7fa',
                            background:
                              "linear-gradient(135deg, #6d8ef5 0%, #4975db 50%, #3f5483 100%)",
                            boxShadow: "0 4px 10px rgba(73,117,219,0.35)",
                            '&:hover': {
                              background:
                                "linear-gradient(135deg, #7b99f8 0%, #5b84e9 50%, #4a618f 100%)",
                              boxShadow: "0 6px 14px rgba(73,117,219,0.45)",
                            },
                          }}
                        >
                          New
                        </Button>

                        <Button
                          onClick={handleSaveUpdate}
                          disabled={isSaving || !canEditLead}
                          variant="contained"

                          sx={{
                            textTransform: "none",
                            height: "38px",
                            width: "100px",
                            color: "#f5f7fa",
                            background:
                              "linear-gradient(135deg, #6d8ef5 0%, #4975db 50%, #3f5483 100%)",
                            boxShadow: "0 4px 10px rgba(73,117,219,0.35)",

                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #7b99f8 0%, #5b84e9 50%, #4a618f 100%)",
                              boxShadow: "0 6px 14px rgba(73,117,219,0.45)",
                            },

                            // Disabled button
                            "&.Mui-disabled": {
                              cursor: 'not-allowed', // Change cursor style
                              pointerEvents: "auto"
                            },
                          }}


                        >
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>


        </CModalBody>

      </CModal >




      {/* ======================================================================== */}


      < Dialog
        open={deleteDialogOpen}
        onClose={cancelDeleteItem}
      >


        <DialogContent>
          Are you sure you want to delete this item?
        </DialogContent>

        <DialogActions>
          <Button
            onClick={cancelDeleteItem}
            variant="outlined"
            sx={{
              textTransform: 'none'
            }}
          >
            No
          </Button>

          <Button
            onClick={confirmDeleteItem}
            variant="contained"
            color="error"
            sx={{
              textTransform: 'none'
            }}
          >
            Yes
          </Button>
        </DialogActions>

      </Dialog >

      {/* ============================================================= */}


      < Dialog
        open={updateDialogOpen}
        onClose={cancelUpdateItem}
      >
        <DialogContent>
          Are you sure you want to update this item?
        </DialogContent>

        <DialogActions>
          <Button
            onClick={cancelUpdateItem}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            No
          </Button>

          <Button
            onClick={confirmUpdateItem}
            variant="contained"
            color="primary"
            sx={{ textTransform: "none" }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog >

      {/* ======================================================================= */}

      < Dialog
        open={openTransferModal}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            setOpenTransferModal(false);
          }
        }
        }
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 12px 35px rgba(0,0,0,0.2)",
          },
        }}
      >
        {/* Header */}
        < DialogTitle
          sx={{
            background: "#243863",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "30px",
            padding: "0 8px",
            px: 1
          }}
        >
          <Box display="flex" alignItems="center">
            <Typography fontWeight={400} fontSize={12.5}>
              Transfer Details
            </Typography>
          </Box>

          <Button
            onClick={() => setOpenTransferModal(false)}
            sx={{
              minWidth: 0,
              padding: 0,
              marginLeft: "auto",
              background: "transparent",
              "&:hover": {
                background: "transparent",
              },
            }}
          >
            <img
              src={closebtn}
              alt="Close"
              width="22"
              height="22"
            />
          </Button>
        </DialogTitle >

        {/* Body */}
        < DialogContent
          sx={{
            bgcolor: "#e4ebf3",
            px: 1.5,
            py: 1.5
          }}
        >

          <Card className='mt-2'>
            <CardContent>
              <Grid container spacing={1} className='mt-1'>

                <Grid item xs={12}>
                  <TextField
                    label="Department"
                    size="small"
                    fullWidth
                    select
                    value={transferDept}
                    onChange={(e) => {
                      setTransferDept(e.target.value);
                      setTransferStaff(""); // Reset selected staff
                    }}
                    InputLabelProps={{
                      sx: {
                        fontSize: "0.8rem",
                      },
                    }}
                    inputRef={TransDeptInputRef}
                    sx={{
                      backgroundColor: '#fff',

                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '0.8rem',
                      },

                      '& .MuiSelect-select': {
                        padding: '6px 8px',
                        fontSize: '0.8rem',
                      },

                      '& .MuiInputLabel-root': {
                        fontSize: '0.8rem',
                      },

                      '& .MuiOutlinedInput-root.Mui-focused': {
                        backgroundColor: 'var(--focus-bg-color)',
                      },
                    }}
                  >
                    {allDept
                      .map((dept) => (
                        <MenuItem
                          key={dept.mstr_key}
                          value={dept.mstr_key}
                        >
                          {dept.desc}
                        </MenuItem>
                      ))}

                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Staff"
                    size="small"
                    fullWidth
                    select
                    value={transferStaff}
                    onChange={(e) => setTransferStaff(e.target.value)}
                    InputLabelProps={{
                      sx: {
                        fontSize: "0.8rem",
                      },
                    }}
                    inputRef={TransEmpInputRef}
                    sx={{
                      backgroundColor: '#fff',

                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '0.8rem',
                      },

                      '& .MuiSelect-select': {
                        padding: '6px 8px',
                        fontSize: '0.8rem',
                      },

                      '& .MuiInputLabel-root': {
                        fontSize: '0.8rem',
                      },

                      '& .MuiOutlinedInput-root.Mui-focused': {
                        backgroundColor: 'var(--focus-bg-color)',
                      },
                    }}
                  >
                    {transferStaffList.map((staff) => (
                      <MenuItem
                        key={staff.ahmst_key}
                        value={staff.ahmst_key}
                      >
                        {staff.ahmst_pname}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>


                <Grid item xs={12}>

                  <TextField
                    label="Details"
                    multiline
                    rows={3}
                    fullWidth
                    value={transferRemarks}
                    onChange={(e) => setTransferRemarks(e.target.value)}
                    inputRef={TransDetInputRef}
                    size="small"
                    placeholder="Enter Details..."
                    InputLabelProps={{
                      sx: {
                        fontSize: "0.85rem",
                      },
                    }}
                    sx={{
                      bgcolor: "#fff",

                      '& .MuiOutlinedInput-root': {
                        fontSize: '0.8rem',
                        padding: '4px',
                        borderRadius: 2,
                      },

                      '& .MuiInputBase-inputMultiline': {
                        padding: '4px',
                        fontSize: '0.8rem',
                      },

                      '& .MuiInputLabel-root': {
                        fontSize: '0.8rem',
                      },
                    }}
                  >


                  </TextField>
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>


                  <Button
                    variant="contained"
                    // startIcon={<PersonSwapIcon />}
                    onClick={handleTransfer}
                    color="primary"
                    sx={{
                      textTransform: 'none',
                      height: '30px',
                      width: '80pxpx',
                      color: '#f5f7fa',
                      fontSize: '0.8rem',
                      background:
                        "linear-gradient(135deg, #6d8ef5 0%, #4975db 50%, #3f5483 100%)",
                      boxShadow: "0 4px 10px rgba(73,117,219,0.35)",
                      '&:hover': {
                        background:
                          "linear-gradient(135deg, #7b99f8 0%, #5b84e9 50%, #4a618f 100%)",
                        boxShadow: "0 6px 14px rgba(73,117,219,0.45)",
                      },
                    }}

                  >
                    Transfer
                  </Button>

                </Grid>


              </Grid>
            </CardContent>
          </Card>

        </DialogContent >

      </Dialog >

      {/* =========================================== */}



      < Dialog
        open={validationDialogOpen}
        onClose={() => setValidationDialogOpen(false)}
        disableRestoreFocus
        TransitionProps={{
          onExited: () => {

            setValidationMessage("");

            if (focusField === "CustPhn") {
              CustPhnInputRef.current?.focus();
            } else if (focusField === "TransEmp") {
              TransEmpInputRef.current?.focus();
            } else if (focusField === "TransDept") {
              TransDeptInputRef.current?.focus();
            } else if (focusField === "TransDet") {
              TransDetInputRef.current?.focus();
            }
            setFocusField("");
          }
        }}
      >
        <DialogContent>
          {validationMessage}
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            onClick={() => setValidationDialogOpen(false)}
            sx={{ textTransform: "none" }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog >


    </>

  );
}

export default Leads;



