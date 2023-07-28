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
// import '../../Profile.css';

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
        console.log(res.data.password);
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
        // If the password field is not modified, use the previous password values
        if (!values.password || values.password === prof.password) {
          values.password = prof.password;
          values.confirmPassword = prof.confirmPassword;
        }

        // Send the updated data to the server
        http
          .put(`/user/updateUser/${user.id}`, values)
          .then((res) => {
            console.log("Form submitted!");
            toast.success("Profile updated successfully.");
            // You may choose to update the "user" state with the updated data here if needed
          })
          .catch((error) => {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile. Please try again later.");
          });
      } catch (error) {
        console.error("Error updating user:", error);
      }
    },
  });

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteUser = () => {
    http.delete(`/user/${user.id}`).then((res) => {
      // Temp solution to delete user, logging out and going back to homepage
      localStorage.clear();
      window.location = "/";
      navigate("/");
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
          <Button variant="contained" sx={{ ml: 2 }} color="error" onClick={handleOpen}>
            Delete Account
          </Button>
          <Button variant="contained" sx={{ ml: 2 }} onClick={resendVerificationCode}>
            Resend New Verification Code
          </Button>
        </Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Delete Main</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete your account?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="inherit" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={deleteUser}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default ProfileUser;
