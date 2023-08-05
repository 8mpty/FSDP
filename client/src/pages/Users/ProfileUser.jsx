import React, { useContext, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Typography, TextField, Button } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { UserContext } from "../../contexts/AccountContext";
import * as yup from "yup";
import http from "../../http";
import '../../Profile.css';

function ProfileUser() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [prof, setProf] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  useEffect(() => {
    if (user != null) {
      http.get(`/user/${user.id}`).then((res) => {
        setProf(res.data);
        setProf((prevState) => ({ ...prevState, password: "", confirmPassword: "" }));
      });
    }
  }, [user]);

  const formik = useFormik({
    initialValues: prof,
    enableReinitialize: true,
    validationSchema: yup.object().shape({
      name: yup.string().required("Name is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      password: yup.lazy((value) =>
        value || formik.values.confirmPassword ? yup.string().required("Password is required") : yup.string()
      ),
      confirmPassword: yup.lazy((value) =>
        value || formik.values.password
          ? yup
            .string()
            .oneOf([yup.ref("password"), null], "Passwords must match")
            .required("Confirm Password is required")
          : yup.string()
      ),
    }),

    onSubmit: (values) => {
      try {
        if (!values.password || values.password === prof.password) {
          values.password = prof.password;
          values.confirmPassword = prof.confirmPassword;
        }

        http
          .put(`/user/updateUser/${user.id}`, values)
          .then((res) => {
            console.log("Form submitted!");
            toast.success("Profile updated successfully.");
          })
          .catch((error) => {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile. Please confirm your passwords aswell or try again later!");
          });
      } catch (error) {
        console.error("Error updating user:", error);
      }
    },
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const [openDriverDialog, setOpenDriverDialog] = useState(false);

  const handleOpenDriverDialog = () => {
    setOpenDriverDialog(true);
  };
  const handleCloseDriverDialog = () => {
    setOpenDriverDialog(false);
  };




  const requestAsDriver = () => {
    http.put(`/user/requestAsDriver/${user.id}`, { requestAsDriver: true })
      .then((res) => {
        console.log("Be a Driver requested!");
        toast.success("Be a Driver requested. An admin will review your request.");
        setProf((prevState) => ({ ...prevState, requestDelete: true }));
      })
      .catch((error) => {
        console.error("Error requesting account driver status:", error);
        toast.error("Failed to request driver status. Please try again later.");
      });
  };
  const requestDeletion = () => {
    http.put(`/user/updateUser/${user.id}`, { requestDelete: true })
      .then((res) => {
        console.log("Account deletion requested!");
        toast.success("Account deletion requested. An admin will review your request.");
        setProf((prevState) => ({ ...prevState, requestDelete: true }));
      })
      .catch((error) => {
        console.error("Error requesting account deletion:", error);
        toast.error("Failed to request account deletion. Please try again later.");
      });
  };

  const resendVerificationCode = () => {
    http
      .post("/user/resendVerificationCode", { email: prof.email })
      .then((res) => {
        console.log(res.data);
        toast.success("Verification code sent successfully.");
      })
      .catch((error) => {
        console.error("Error resending verification code:", error);
        toast.error("Failed to resend verification code. Please try again later.");
      });
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Edit Profile
      </Typography>
      <Box component="form" className="full-prof" onSubmit={formik.handleSubmit}>
        <Box>
          <Box className="input-fields">
            <TextField
              fullWidth
              margin="normal"
              autoComplete="off"
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
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
              label="Password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
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
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit" onClick={formik.handleSubmit}>
            Update
          </Button>

          {prof && prof.requestDelete ? (
            <Button variant="contained" sx={{ ml: 2 }} color="info" disabled>Deletion Requested</Button>
          ) : (
            <Button variant="contained" sx={{ ml: 2 }} color="error" onClick={handleOpenDeleteDialog}>Delete Account</Button>
          )}

          <Button variant="contained" sx={{ ml: 2 }} onClick={resendVerificationCode}>Resend New Verification Code</Button>

          {prof && prof.driverStatus ? (
            <Button variant="contained" sx={{ ml: 2 }} color="info" disabled>
              Already a Driver
            </Button>
          ) : prof && prof.requestAsDriver ? (
            <Button variant="contained" sx={{ ml: 2 }} color="info" disabled>
              Requested to be a Driver
            </Button>
          ) : (
            <Button variant="contained" sx={{ ml: 2 }} color="info"
              onClick={handleOpenDriverDialog}>
              Request to be a Driver
            </Button>
          )}

        </Box>

        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Request Account Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to request for deletion?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="inherit" onClick={handleCloseDeleteDialog}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={requestDeletion}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDriverDialog} onClose={handleCloseDriverDialog}>
          <DialogTitle>Request to be a Driver</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to request to be a driver?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="inherit" onClick={handleCloseDriverDialog}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={requestAsDriver}>
              Request
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
}

export default ProfileUser;
