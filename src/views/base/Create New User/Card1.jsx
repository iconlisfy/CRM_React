import React, { useEffect, useState } from 'react'
import { Box, MenuItem, Autocomplete, Button, Checkbox, FormControlLabel, Card, CardContent, FormControl, FormGroup, Grid, TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import axiosInstance from '../../../axios';
import getReduxState from '../../../ReduxState';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Card1({ branches, setBranches, selectedBranch, setSelectedBranch, selectedBranchKey, setSelectedBranchKey,
    DobDate, setDobDate, WedDate, setWedDate, allDept, setAllDept, selectedDept, setSelectedDept, allStaff, setAllStaff, selectedStaff,
    setSelectedStaff, selectedStaffKey, setSelectedStaffKey, SearchBy, setSearchBy, filteredStaff, role,
    showPassword, setShowPassword, password, setPassword, confirmPassword, setConfirmPassword, showConfirmPassword,
    setShowConfirmPassword, staffName, setStaffName, gender, setGender, designation, setDesignation, address, setAddress,
    phone, setPhone, mobile, setMobile, email, setEmail, note, setNote, userName, setUserName, userCategory, setUserCategory,
    isActive, setIsActive, handleSave, nameInputRef, usernameInputRef, pwdInputRef, confirmInputRef, fetchUserDetails,
    handleNew, userCategories
}) {




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
    return (
        <>
            <Card
                sx={{
                    // border:"1px solid",
                    height: { lg: "74px", xl: "80px" },
                }}
            >
                <CardContent>

                    <Grid container spacing={2} >


                        <Grid item xs={12} sm={5} md={4} lg={3} >
                            <TextField
                                select
                                label="Search By"
                                variant="outlined"
                                size="small"
                                fullWidth

                                value={SearchBy}
                                onChange={(e) => setSearchBy(e.target.value)}



                                sx={{
                                    '& .MuiSelect-select': {
                                        borderLeft: '4px solid #DC3545', // ← inside border
                                        paddingLeft: '12px', // Optional: Add space after border
                                        backgroundColor: 'var(--input-bg-color)',
                                    },
                                }}


                            >
                                <MenuItem value="name">Name</MenuItem>
                                <MenuItem value="key">Key</MenuItem>


                            </TextField>
                        </Grid>


                        <Grid item xs={12} sm={7} md={8} lg={9}>


                            <Autocomplete
                                fullWidth
                                options={
                                    role === "Administrator"
                                        ? filteredStaff
                                        : allStaff
                                }
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        boxShadow: 'inset 4px 0 0 0 var(--search-side-color)',
                                        '& .MuiAutocomplete-input': {
                                            paddingLeft: '16px',
                                        }
                                    }
                                }}
                                value={selectedStaff}

                                getOptionLabel={(option) => {
                                    if (SearchBy === "name") {
                                        return option?.ahmst_pname || "";
                                    }

                                    return `${option?.ahmst_pname}` || "";
                                }}


                                renderOption={(props, option, { inputValue }) => (
                                    <li {...props}>
                                        {highlightText(
                                            option?.ahmst_pname || "",
                                            inputValue
                                        )}
                                    </li>
                                )}

                                filterOptions={(options, state) => {
                                    return options.filter((item) => {

                                        const searchValue =
                                            SearchBy === "name"
                                                ? item?.ahmst_pname
                                                : item?.ahmst_pname?.toString();

                                        return searchValue
                                            ?.toLowerCase()
                                            .includes(state.inputValue.toLowerCase());
                                    });
                                }}
                                onChange={(event, newValue) => {
                                    setSelectedStaff(newValue);
                                    setSelectedStaffKey(newValue?.ahmst_key || null);

                                    if (newValue?.ahmst_key) {
                                        fetchUserDetails(newValue.ahmst_key);
                                    }
                                }}
                                isOptionEqualToValue={(option, value) =>
                                    option?.ahmst_key === value?.ahmst_key
                                }

                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={
                                            SearchBy === "name"
                                                ? " Staff Name"
                                                : " Staff Key"
                                        }
                                        size="small"
                                        sx={{
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
                                                    backgroundColor: '#DC3545',
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
                                    />
                                )}
                            />

                        </Grid>


                    </Grid>

                </CardContent>
            </Card>



            {/* card 2 */}
            <Card className='mt-2'
                sx={{
                    // border:"1px solid",
                    height: {
                        xs: 'auto', sm: 'calc(100vh - 3px)', md: 'calc(100vh - 9px )', lg: 'calc(100vh - 99px)',
                        xl: 'calc(100vh - -10px - 8px)'
                    },
                }}
            >

                <CardContent>
                    <Grid container spacing={1} >


                        <Grid item xs={12} sm={12} md={12} lg={5} xl={5}>

                            <TextField label="Name" type="text" size="small" fullWidth
                                value={staffName}
                                onChange={(e) => { setStaffName(e.target.value) }}
                                inputRef={nameInputRef}
                                sx={{
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

                        <Grid item xs={12} sm={4} md={4} lg={2} xl={2} >
                            <TextField
                                select
                                label="Gender"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={gender}
                                onChange={(e) => { setGender(e.target.value) }}
                                sx={{
                                    '@media (max-width: 320px)': {
                                        width: '100%', // Ensure full width on small screens
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        backgroundColor: 'var(--focus-bg-color)', // Set background color on focus
                                    },
                                }}




                            >
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>


                            </TextField>
                        </Grid>


                        <Grid item xs={12} sm={4} md={4} lg={2.5} xl={2}>

                            <DatePicker
                                selected={DobDate ? new Date(DobDate) : null}
                                onChange={(date) => setDobDate(date)}
                                popperPlacement="top-start"
                                portalId="root-portal" // Ensures it's rendered at the end of the body
                                dateFormat="dd-MMM-yyyy"
                                customInput={
                                    <TextField
                                        label="Date of Birth"
                                        size="small"
                                        fullWidth
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

                                            '& input': {
                                                // borderLeft: '4px solid var(--primary-bg-color)',
                                                '&:focus': {
                                                    backgroundColor: 'var(--focus-bg-color)',
                                                }
                                            }
                                        }}
                                    />
                                }
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={4} lg={2.5} xl={3}>

                            <DatePicker
                                selected={WedDate ? new Date(WedDate) : null}
                                onChange={(date) => setWedDate(date)}
                                popperPlacement="top-start"
                                portalId="root-portal" // Ensures it's rendered at the end of the body
                                dateFormat="dd-MMM-yyyy"
                                customInput={
                                    <TextField
                                        label="Wed Ann"
                                        size="small"
                                        fullWidth
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

                                            '& input': {
                                                // borderLeft: '4px solid var(--primary-bg-color)',
                                                '&:focus': {
                                                    backgroundColor: 'var(--focus-bg-color)',
                                                }
                                            }
                                        }}
                                    />
                                }
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} >
                            <TextField label="Address"
                                id="reason"
                                variant="outlined"
                                multiline
                                rows={2.2}
                                size="small"
                                fullWidth
                                value={address}
                                onChange={(e) => { setAddress(e.target.value) }}

                                sx={{
                                    '@media (max-width: 320px)': {
                                        width: '100%', // Ensure full width on small screens
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        backgroundColor: 'var(--focus-bg-color)', // Set background color on focus
                                    },
                                }}

                            />

                        </Grid>



                        <Grid item xs={12} sm={4} md={6} lg={4} xl={4}>
                            <TextField label="Mobile" type="text" size="small" fullWidth
                                value={mobile}
                                onChange={(e) => { setMobile(e.target.value) }}
                                sx={{
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

                        <Grid item xs={12} sm={4} md={6} lg={4} xl={4}>
                            <TextField label="Phone" type="text" size="small" fullWidth
                                value={phone}
                                onChange={(e) => { setPhone(e.target.value) }}
                                sx={{
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

                        <Grid item xs={12} sm={4} md={6} lg={4} xl={4}>
                            <TextField label="Email" type="email" size="small" fullWidth
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                                sx={{
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




                        <Grid item xs={12} sm={4} md={6} lg={4} xl={4}>
                            <TextField label="Designation" type="text" size="small" fullWidth
                                value={designation}
                                onChange={(e) => { setDesignation(e.target.value) }}
                                sx={{
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



                        <Grid item xs={12} sm={4} md={6} lg={4} xl={4}>
                            <TextField
                                label="Department"
                                select
                                size="small"
                                fullWidth
                                value={selectedDept}

                                onChange={(e) => setSelectedDept(e.target.value)}

                                InputProps={{
                                    readOnly: role !== "Administrator"
                                }}

                                sx={{
                                    fontSize: '1rem',
                                    height: 40,
                                    '& input': {
                                        padding: '8px',
                                        fontSize: '0.95rem',
                                        '&:focus': {
                                            backgroundColor: 'var(--focus-bg-color)'
                                        }
                                    }
                                }}
                            >
                                {
                                    allDept.map((item) => (
                                        <MenuItem
                                            key={item.mstr_key}
                                            value={item.mstr_key}
                                        >
                                            {item.desc}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>


                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} >

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="Active"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        sx={{
                                            color: 'grey', // Unchecked color
                                            '&.Mui-checked': {
                                                color: 'var(--primary-bg-color)', // Checked color
                                            },
                                        }}

                                    />
                                }

                                label="Active"
                            />

                        </Grid>



                        <Grid item xs={12} sm={12} >

                            <TextField
                                id="Note"
                                label="Note"
                                variant="outlined"
                                multiline
                                rows={2}
                                size="small"
                                fullWidth
                                value={note}
                                onChange={(e) => { setNote(e.target.value) }}
                                sx={{
                                    '@media (max-width: 320px)': {
                                        width: '100%', // Ensure full width on small screens
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        backgroundColor: 'var(--focus-bg-color)', // Set background color on focus
                                    },
                                }}

                            />

                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Typography variant="subtitle1" sx={{ color: '#DC3545', fontWeight: 600 }}>
                                Create UserName
                            </Typography>


                        </Grid>




                        <Grid item xs={12} sm={4} md={6} lg={3} xl={3}>
                            <TextField label="User name" type="text" size="small" fullWidth
                                value={userName}
                                onChange={(e) => { setUserName(e.target.value) }}
                                inputRef={usernameInputRef}
                                sx={{
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

                        <Grid item xs={12} sm={4} md={6} lg={3} xl={3}>
                            <TextField
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                size="small"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                inputRef={pwdInputRef}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    fontSize: '1rem',
                                    height: 40,

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

                        <Grid item xs={12} sm={4} md={6} lg={3} xl={3}>
                            <TextField
                                label="Password"
                                type={showConfirmPassword ? "text" : "password"}
                                inputRef={confirmInputRef}
                                size="small"
                                fullWidth
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    fontSize: '1rem',
                                    height: 40,

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




                        <Grid item xs={12} sm={4} md={6} lg={3} xl={3}>
                            <Autocomplete
                                freeSolo
                                size="small"
                                fullWidth
                                options={userCategories}
                                value={userCategory}
                                onChange={(event, newValue) => {
                                    setUserCategory(newValue || "");
                                }}
                                onInputChange={(event, newInputValue) => {
                                    setUserCategory(newInputValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="User Category"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '&.Mui-focused': {
                                                    backgroundColor: 'var(--focus-bg-color)',
                                                },
                                            },
                                        }}
                                    />
                                )}
                            />

                        </Grid>


                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Autocomplete
                                multiple
                                limitTags={2}
                                size="small"
                                fullWidth
                                options={branches.filter(branch =>
                                    !selectedBranchKey.includes(branch.BranchKey)
                                )}

                                getOptionLabel={(option) => option.DisplayName || ""}

                                value={branches.filter(branch =>
                                    selectedBranchKey.includes(branch.BranchKey)
                                )}

                                onChange={(event, newValue) => {

                                    setSelectedBranch(
                                        newValue.map(branch => branch.DisplayName)
                                    );

                                    setSelectedBranchKey(
                                        newValue.map(branch => branch.BranchKey)
                                    );
                                }}

                                isOptionEqualToValue={(option, value) =>
                                    option.BranchKey === value.BranchKey
                                }

                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Branch"
                                        size="small"

                                        sx={{
                                            fontSize: '1rem',

                                            '& .MuiInputBase-root': {
                                                backgroundColor: 'white',
                                                padding: '4px',
                                                fontSize: '0.95rem',

                                                '&.Mui-focused': {
                                                    backgroundColor: 'var(--focus-bg-color)',
                                                },
                                            },

                                            '& input': {
                                                padding: '8px',
                                                fontSize: '0.95rem',
                                            },

                                            '& .MuiChip-root': {
                                                borderRadius: '16px',
                                                backgroundColor: '#f5f5f5',
                                                color: '#333',
                                                fontSize: '0.85rem',
                                            },
                                        }}
                                    />
                                )}

                                ListboxProps={{
                                    style: {
                                        maxHeight: '250px',
                                    },
                                }}
                            />

                        </Grid>



                    </Grid>

                    {/* buttons */}

                    <Grid container spacing={1} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: "40px" }}>

                        <Grid item xs={12} sm={8.4} md={8} lg={10} xl={10} >
                            <Button
                                sx={{
                                    width: { xs: "100%", sm: "auto" },
                                    textTransform: 'none',
                                    height: '38px',
                                    minWidth: '100px',
                                    display: 'none',
                                    color: '#f5f7fa',
                                    backgroundColor: '#DC3545',
                                    '&:hover': {
                                        backgroundColor: '#c82333',
                                        boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                                    },
                                }}
                                variant="contained"
                                color="success"
                            // onClick={handleDelete}
                            // disabled={isDeleteDisabled}
                            >
                                Delete
                            </Button>

                        </Grid>


                        <Grid item xs={12} sm={1.8} md={2} lg={1} xl={1} >
                            <Button
                                sx={{
                                    width: { xs: "100%", sm: "auto" },
                                    textTransform: 'none',
                                    height: '38px',
                                    minWidth: '100px',
                                    color: '#f5f7fa',
                                    backgroundColor: '#DC3545',
                                    '&:hover': {
                                        backgroundColor: '#c82333',
                                        boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                                    },
                                }}
                                variant="contained"
                                color="success"
                                onClick={handleNew}

                            >
                                New
                            </Button>
                        </Grid>


                        <Grid item xs={12} sm={1.8} md={2} lg={1} xl={1} >
                            <Button
                                sx={{
                                    width: { xs: "100%", sm: "auto" },
                                    textTransform: 'none',
                                    height: '38px',
                                    minWidth: '100px',
                                    color: '#f5f7fa',
                                    backgroundColor: '#DC3545',
                                    '&:hover': {
                                        backgroundColor: '#c82333',
                                        boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                                    },
                                }}
                                variant="contained"
                                color="success"
                                onClick={handleSave}
                            // disabled={isSaving}

                            >
                                Save
                            </Button>
                        </Grid>

                    </Grid>




                </CardContent>



            </Card>

        </>
    )
}

export default Card1
