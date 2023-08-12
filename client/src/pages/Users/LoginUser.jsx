import React, { useContext } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { UserContext } from '../../contexts/AccountContext';
import * as yup from 'yup';
import http from '../../http';
import '../../Profile.css';

function LoginUser() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().trim()
        .email('Enter a valid email')
        .max(50, 'Email must be at most 50 characters')
        .required('Email is required'),
      password: yup.string().trim()
        .min(8, 'Password must be at least 8 characters')
        .max(50, 'Password must be at most 50 characters')
        .required('Password is required'),
    }),
    onSubmit: (data) => {
      data.email = data.email.trim().toLowerCase();
      data.password = data.password.trim();
      http.post("/user/login", data)
        .then((res) => {
          localStorage.setItem("accessToken", res.data.accessToken);
          toast.success(`User Login successfull!`);
          setUser(res.data.user);
          navigate("/");
        })
        .catch(function (err) {
          toast.error(`${err.response.data.message}`);
        });
    }
  });
  return (
    <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ToastContainer />
      <Typography variant="h5" sx={{ my: 2 }}>
        Login
      </Typography>
      <Box component="form" className="login-con" sx={{ maxWidth: '500px' }} onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth margin="normal" autoComplete="off"
          label="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          fullWidth margin="normal" autoComplete="off"
          label="Password"
          name="password" type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Box className='hyper-links'>
          <Link to="/register">Create Account</Link>
          <Link to="/accountRecoveryUser" className='for-pass'>Forgot Password</Link>
        </Box>

        <Button style={{ width: "100px" }} variant="contained" sx={{ mt: 2 }} type="submit">
          Login
        </Button>

        <Box className='hyper-links admins'>
          <Link to="/loginAdmin" className='admin-link'><IconButton><SupervisorAccountIcon /></IconButton></Link>
        </Box>
      </Box>
    </Box>
  )
}

export default LoginUser;