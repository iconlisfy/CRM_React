import { useEffect, useState } from 'react';
import { TextField, Button, Grid, Box, Typography, IconButton, InputAdornment, FormControl, InputLabel, MenuItem, Select, useMediaQuery } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material'; import './Login.css';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import logomain from '../../../assets/images/karunya diagnostics logo 2480x986 px white.png'
import { encryptAES } from '../../../utils/Encryption';
import axiosInstance from '../../../axios';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import mobimg from '../../../assets/images/lisfiwebsitemob.jpg';
import lisfiwebsite from '../../../assets/images/lisfi website login.jpeg';
import store from '../../../Store';
import iconlogo from '../../../assets/images/iconinfoware logo.png'

function LoginForm() {

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [Branch, setBranch] = useState('');
  const [Branches, setBranches] = useState([])
  const [branchkey, setBranchKey] = useState('')
  const [branchError, setBranchError] = useState('');
  const encryptionKey = "sblw-3hn8-sqoy19";
  //console.log('Branches', Branches);

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

          // auto select first branch
          if (apiBranches.length > 0) {

            setBranch(apiBranches[0].DisplayName);
            setBranchKey(apiBranches[0].BranchKey);
          }
        } else {
          console.error("Unexpected API response", data);
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    }
    fetchbraches();
  }, [])

  const handleLoginSuccess = (data) => {
    //console.log('data', data);

    if (data.Success) {
      dispatch({
        type: 'login',
        payload: {
          token: data.Token,
          user: {
            empId: data.Empid,
            name: data.Empname,
            dept: data.deptname,
            deptid: data.deptid,
            role: data.UsrGrp,
            branch: data.Brnch_Code,
            Brnch_Key: data.Brnch_Key,
            Image: data.Image,
            SuperAdmin: data.SuperAdmin
          }
        }
      });

      navigate('/dashboard');
    } else {
      console.error('Login failed:', data.message);

      // show error to user (example)
      alert(data.message);
    }
  };

  const handleLogin = async () => {
    const encryptedusername = encryptAES(username.toString(), encryptionKey);
    const encryptedpassword = encryptAES(password.toString(), encryptionKey);

    let isValid = true;
    setUsernameError('');
    setPasswordError('');
    setBranchError('');

    if (!Branch) {
      setBranchError('Branch is required');
      isValid = false;
    }

    if (!username || !password) {
      if (!username) setUsernameError('Username is required');
      if (!password) setPasswordError('Password is required');
      isValid = false;
    }

    if (!isValid) return;

    try {
      const response = await axiosInstance.post(`/UserLogin/LoginByUsername?username=${encryptedusername}&password=${encryptedpassword}&BrnchId=${branchkey}`)

      const data = response.data;
      //console.log('Login response:', data);

      if (data.Success) {
        //localStorage.setItem('user', JSON.stringify(data));
        handleLoginSuccess(data);
      } else {
        toast.error(data.message || 'Invalid Login Details');
      }

    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again later.');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError('');

  };


  const handleBranchChange = (e) => {
    const selectedBranch = e.target.value;

    if (Array.isArray(Branches)) {
      const selectedBranchDetail = Branches.find((br) => br.DisplayName === selectedBranch);
      //console.log('Selected Branch Detail:', selectedBranchDetail);

      const selectedBranchKey = selectedBranchDetail?.BranchKey;
      setBranchKey(selectedBranchKey)
      if (selectedBranch && selectedBranchDetail) {
        setBranchError('');
        setBranch(selectedBranch);
        // dispatch({
        //   type: 'UPDATE_YEAR_BRANCH',
        //   payload: {
        //     branch: selectedBranch,
        //     branchKey: selectedBranchKey,
        //     year: year,
        //     yearId: years.find(y => y.Yeardata === year)?.YearId || ''
        //   }
        // });

      }
    } else {
      console.error('error has occured');
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setUsernameError('');
    // if (event.target.value) {
    //   // Disable Emp Key field when username is entered
    //   setEmpKey('');
    //   setEmpKeyError('');
    // }
  };

  const handleusernamesubmit = () => {
    if (username) {
      setUsernameError('')
      document.getElementById('password-input').focus()
    } else {
      setUsernameError('Enter username')
    }
  }


  const handlekeypress = (event, field) => {
    const key = event.key || event.nativeEvent.key;
    if (key === 'Enter' || key === 'Tab' || key === 'Done') {
      if (field === 'username') {
        handleusernamesubmit();
      } else if (field === 'password') {
        handleLogin();
      } else {
        setPasswordError('password is required')
      }
    }
  }

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >

      <Box
        sx={{
          width: { xs: "100%", sm: "400px", md: "420px", lg: "400px" },
          padding: "20px",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* <Box display={'flex'}  gap={1} sx={{ marginLeft: { xs: '250px', sm: '180px', md: '100px', lg: '-50px', xl: '200px' }, marginTop: '-70px',width:"300px" }}>

        <img
          className='Logo2'
          src={iconlogo}
          alt="Logo"
          style={{
            maxWidth: '100%',
            
            width: '260px',
            height: '150px',
            marginRight: 'auto',
            marginTop: '60px',
            
          }}
        />
      </Box> */}

        <Box display={'flex'} gap={1} justifyContent={"center"} sx={{ marginTop: "78px" }} >
          <img
            className='Logo2'
            src={iconlogo}
            alt="Logo"

            style={{

              maxWidth: '100%',
              // width: '00px',
              height: '103px',
              // marginRight: 'auto',
              marginTop: '-5px',
              zoom: 1,
            }}
          />
        </Box>

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: {
              lg: '12px',
              xs: '20px',
              md: '12px',
              xl: '15px',
            },
            //   marginTop: "-22px"
          }}
          noValidate
          autoComplete="off"
        >


          <TextField
            select
            label={'Branch'}
            variant="outlined"
            value={Branch}
            onChange={handleBranchChange}
            size="small"
            fullWidth
            error={!!branchError}
            //helperText={branchError}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused': {
                  backgroundColor: 'var(--focus-bg-color)',
                },
              },
              '& .MuiSelect-select': {
                backgroundColor: 'var(--input-bg-color)',
              },
            }}
          >
            {Branches.length > 0 ? (
              Branches.map((branch) => (
                <MenuItem key={branch.BranchKey} value={branch.DisplayName} sx={{ fontSize: '0.75rem' }}>
                  {branch.DisplayName}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No branches available</MenuItem>
            )}
          </TextField>



          <TextField
            label={'Username'}
            size="small"
            variant="outlined"
            value={username}
            onChange={handleUsernameChange}
            error={!!usernameError}
            onKeyDown={(e) => handlekeypress(e, 'username')}
            sx={{ marginBottom: '0px' }}
            autoComplete="username"
          />

          <TextField
            id="password-input"
            label={'Password'}
            type={showPassword ? 'text' : 'password'}
            size="small"
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
            error={!!passwordError}
            onKeyDown={(e) => handlekeypress(e, 'password')}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="contained"
              fullWidth

              sx={{
                textTransform: 'none',
                backgroundColor: 'var(--primary-btn-color)',
                '&:hover': {
                  backgroundColor: 'var(--primary-btn-hoverColor)',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                },
              }}
              onClick={handleLogin}

            >
              Login
            </Button>
          </Box>
        </Box>



      </Box>
      <ToastContainer autoClose={3000} hideProgressBar />
    </div >
  );
}

export default LoginForm;

// {
//   <Box
//     component="form"
//     sx={{
//       display: "flex",
//       flexDirection: "column",
//       gap: {
//         lg: '12px',
//         xs: '20px',
//         md: '12px',
//         xl: '15px',
//       },
//       marginTop: "20px"
//     }}
//     noValidate
//     autoComplete="off"
//   >


//     <TextField
//       select
//       label={'Branch'}
//       variant="outlined"
//       // value={Branch}
//       // onChange={handleBranchChange}
//       size="small"
//       fullWidth
//       // error={!!branchError}
//       sx={{
//         '& .MuiOutlinedInput-root': {
//           '&.Mui-focused': {
//             backgroundColor: 'var(--focus-bg-color)',
//           },
//         },
//         '& .MuiSelect-select': {
//           backgroundColor: 'var(--input-bg-color)',
//         },
//       }}
//     >
//     </TextField>



//     <TextField
//       label={'Username'}
//       size="small"
//       variant="outlined"
//       // value={username}
//       // onChange={handleUsernameChange}
//       // error={!!usernameError}
//       // onKeyDown={(e) => handleKeyPress(e, 'username')}
//       sx={{ marginBottom: '0px' }}
//       autoComplete="username"
//     />

//     <TextField
//       id="password-input"
//       label={'Password'}
//       // type={showPassword ? 'text' : 'password'}
//       size="small"
//       variant="outlined"
//       // value={password}
//       // onChange={handlePasswordChange}
//       // error={!!passwordError}
//       // onKeyDown={(e) => handleKeyPress(e, 'password')}
//       autoComplete="current-password"
//       InputProps={{
//         endAdornment: (
//           <InputAdornment position="end">
//             <IconButton
//               aria-label="toggle password visibility"
//               // onClick={handleClickShowPassword}
//               // onMouseDown={handleMouseDownPassword}
//               edge="end"
//             >
//               {/* {showPassword ? <Visibility /> : <VisibilityOff />} */}
//             </IconButton>
//           </InputAdornment>
//         ),
//       }}
//     />

//     <Box sx={{ display: "flex", justifyContent: 'flex-end', gap: 1 }}>
//       <Button
//         variant="contained"
//         fullWidth
//         sx={{
//           textTransform: 'none',
//           backgroundColor: 'var(--primary-btn-color)',
//           '&:hover': {
//             backgroundColor: 'var(--primary-btn-hoverColor)',
//             boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
//           },
//         }}
//       // onClick={handleLogin}
//       >
//         Login
//       </Button>
//     </Box>
//   </Box>
// }