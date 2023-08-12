import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../../http";

function AccountRecovery() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      newPassword: "",
      confirmPassword: "",
      verificationCode: "",
    },
    validationSchema: yup.object({
      email: yup.string().trim().email().max(50).required("Email is required"),
      newPassword: yup
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password must be at most 50 characters")
        .required("Password is required"),
      confirmPassword: yup
        .string()
        .trim()
        .required("Confirm password is required")
        .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
      verificationCode: yup.string().trim().required("Verification code is required"),
    }),
    onSubmit: (data) => {
      data.email = data.email.trim().toLowerCase();
      http.post("/admin/accountRecoveryAdmin", data)
        .then((res) => {
          toast.success("New Password Updated!! You may attempt to log in now.");
          console.log(res.data);
          navigate("/loginAdmin");
        })
        .catch((err) => {
          toast.error("Error when resetting password!! Please Try Again Later!");
          console.error(err.response.data);
        });
    },
  });

  return (
    <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h5" sx={{ my: 2 }}>
        Admin Account Recovery
      </Typography>
      <ToastContainer />
      <Box className="forget-con-admin" component="form" sx={{ maxWidth: "500px" }} onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          label="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          label="New Password"
          name="newPassword"
          type="password"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
          helperText={formik.touched.newPassword && formik.errors.newPassword}
        />
        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
        />
        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          label="Verification Code"
          name="verificationCode"
          value={formik.values.verificationCode}
          onChange={formik.handleChange}
          error={formik.touched.verificationCode && Boolean(formik.errors.verificationCode)}
          helperText={formik.touched.verificationCode && formik.errors.verificationCode}
        />
        <Box>
          <Link to="/contactus">Contact Us</Link>
        </Box>
        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
          Recover
        </Button>
      </Box>
    </Box>
  );
}

export default AccountRecovery;
