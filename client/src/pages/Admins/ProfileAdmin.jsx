import React, { useContext, useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Input } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { AdminContext } from '../../contexts/AccountContext';
import * as yup from 'yup';
import http from '../../http';
import '../../Profile.css';

function ProfileAdmin() {
    const { admin } = useContext(AdminContext);
    const navigate = useNavigate();
    const [confirmationInput, setConfirmationInput] = useState('');
    const [confirmButtonEnabled, setConfirmButtonEnabled] = useState(false);

    const [prof, setProf] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    useEffect(() => {
        if (admin != null) {
            http.get(`/admin/${admin.id}`)
                .then((res) => {
                    setProf(res.data);
                    setProf(prevState => ({ ...prevState, password: "", confirmPassword: "" }));
                });
        }
    }, [admin]);

    const formik = useFormik({
        initialValues: prof,
        enableReinitialize: true,
        validationSchema: yup.object().shape({
            name: yup.string().required('Name is required'),
            email: yup.string().email('Invalid email').required('Email is required'),
            password: yup.lazy((value) =>
                value || formik.values.confirmPassword
                    ? yup.string().required('Password is required')
                    : yup.string()
            ),
            confirmPassword: yup.lazy((value) =>
                value || formik.values.password
                    ? yup
                        .string()
                        .oneOf([yup.ref('password'), null], 'Passwords must match')
                        .required('Confirm Password is required')
                    : yup.string()
            ),
        }),

        onSubmit: (values) => {
            try {
                if (!values.password || values.password === prof.password) {
                    values.password = prof.password;
                    values.confirmPassword = prof.confirmPassword;
                }
                http.put(`/admin/updateAdmin/${admin.id}`, values)
                    .then((res) => {
                        console.log('Form submitted!');
                        toast.success('Profile updated successfully.');
                        setTimeout(() => {
                            window.location.reload();
                        }, 2200);
                    })
                    .catch((error) => {
                        console.error('Error updating profile:', error);
                        toast.error("Failed to update profile. Name must not contain numbers and please confirm your passwords aswell or try again later!");
                    });
            } catch (error) {
                console.error('Error updating admin:', error);
                toast.error("Failed to update profile. Name must not contain numbers and please confirm your passwords aswell or try again later!", error);
            }
        },
    });

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
        setConfirmationInput('');
        setConfirmButtonEnabled(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const softDeleteAdmin = (id) => {
        http.put(`/admin/softDeleteAdmin/${id}`)
            .then(response => {
                handleClose();
                toast.success(`Account Deleted Successfully.`);
                setTimeout(() => {
                    logout();
                }, 2200);
            })
            .catch(error => {
                toast.error(`Error when deleting ${admin.id} `, error);
                console.error(`Error deleting admin with ID ${id}:`, error);
            });
    };

    const resendVerificationCode = () => {
        http.post("/admin/resendVerificationCode", { email: prof.email })
            .then((res) => {
                toast.success("Verification code sent successfully.");
                console.log(res.data);
            })
            .catch((error) => {
                toast.error("Failed to resend verification code. Please try again later.");
                console.error("Error resending verification code:", error);
            });
    };

    const handleConfirmationInputChange = (e) => {
        const inputValue = e.target.value.toLowerCase();
        setConfirmationInput(inputValue);
        if (inputValue === 'confirm') {
            setConfirmButtonEnabled(true);
        } else if (inputValue === '') {
            setConfirmButtonEnabled(false);
        } else {
            setConfirmButtonEnabled(false);
        }
    };

    const isConfirmationValid = () => {
        return confirmButtonEnabled;
    };

    const logout = () => {
        localStorage.clear();
        window.location = "/";
        toast.success("Logout Successfull!!");
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Admin Profile
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
                    {admin.id !== 1 && (
                        <Button variant="contained" sx={{ ml: 2 }} color="error" onClick={handleOpen}>
                            Delete Account
                        </Button>
                    )}
                    <Button variant="contained" sx={{ ml: 2 }} onClick={resendVerificationCode}>
                        Resend New Verification Code
                    </Button>
                </Box>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>
                        Delete Account
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>Are you sure you want to delete your account?</DialogContentText>
                        <Box sx={{ m: 2 }}></Box>
                        <DialogContentText>
                            <Input
                                placeholder="Type 'confirm' to delete"
                                value={confirmationInput}
                                onChange={handleConfirmationInputChange} />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="inherit"
                            onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="error"
                            onClick={() => softDeleteAdmin(admin.id)}
                            disabled={!confirmButtonEnabled}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box >
    )
}

export default ProfileAdmin;